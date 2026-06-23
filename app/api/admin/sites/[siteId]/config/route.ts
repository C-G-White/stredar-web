import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

type Params = { params: Promise<{ siteId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [config] = await sql`SELECT * FROM device_config WHERE site_id = ${siteId} LIMIT 1`
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(config)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id, device_type FROM sites WHERE id = ${siteId} LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    mode, speed_limit_mph, under_speed_mph,
    auto_monitor_mins, auto_display_mins,
    text_slow_down, text_thank_you,
  } = body as Record<string, unknown>

  // Upsert config
  const [updated] = await sql`
    INSERT INTO device_config (
      site_id, mode, speed_limit_mph, under_speed_mph,
      auto_monitor_mins, auto_display_mins, text_slow_down, text_thank_you, updated_at
    ) VALUES (
      ${siteId},
      ${typeof mode === 'string' ? mode : 'display'},
      ${typeof speed_limit_mph === 'number' ? speed_limit_mph : 30},
      ${typeof under_speed_mph === 'number' ? under_speed_mph : 5},
      ${typeof auto_monitor_mins === 'number' ? auto_monitor_mins : 10},
      ${typeof auto_display_mins === 'number' ? auto_display_mins : 5},
      ${typeof text_slow_down === 'string' ? text_slow_down.toUpperCase().slice(0, 16) : 'SLOW DOWN'},
      ${typeof text_thank_you === 'string' ? text_thank_you.toUpperCase().slice(0, 16) : 'THANK YOU'},
      now()
    )
    ON CONFLICT (site_id) DO UPDATE SET
      mode              = EXCLUDED.mode,
      speed_limit_mph   = EXCLUDED.speed_limit_mph,
      under_speed_mph   = EXCLUDED.under_speed_mph,
      auto_monitor_mins = EXCLUDED.auto_monitor_mins,
      auto_display_mins = EXCLUDED.auto_display_mins,
      text_slow_down    = EXCLUDED.text_slow_down,
      text_thank_you    = EXCLUDED.text_thank_you,
      updated_at        = now()
    RETURNING *
  `

  // Queue commands so the Pi picks up the changes
  await _queueConfigCommands(siteId, updated, site.device_type as string)

  return NextResponse.json(updated)
}

async function _queueConfigCommands(siteId: string, cfg: Record<string, unknown>, deviceType: string) {
  if (deviceType === 'SC-2') {
    // SC-2 has no display — only thresholds are relevant
    await sql`
      INSERT INTO commands (site_id, command, params) VALUES
        (${siteId}, 'SET_THRESHOLDS', ${JSON.stringify({ under_speed: cfg.under_speed_mph, speed_limit: cfg.speed_limit_mph })})
    `
  } else {
    await sql`
      INSERT INTO commands (site_id, command, params) VALUES
        (${siteId}, 'SET_MODE',       ${JSON.stringify({ mode: cfg.mode })}),
        (${siteId}, 'SET_THRESHOLDS', ${JSON.stringify({ under_speed: cfg.under_speed_mph, speed_limit: cfg.speed_limit_mph })}),
        (${siteId}, 'SET_AUTO_TIMER', ${JSON.stringify({ monitor_minutes: cfg.auto_monitor_mins, display_minutes: cfg.auto_display_mins })}),
        (${siteId}, 'SET_TEXTS',      ${JSON.stringify({ slow_down: cfg.text_slow_down, thank_you: cfg.text_thank_you })})
    `
  }
}
