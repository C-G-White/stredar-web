import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

// GET — Pi polls for pending commands and its current config
export async function GET(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id FROM sites WHERE id = ${siteId} AND api_key = ${apiKey} AND active = true LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch pending commands in creation order
  const pending = await sql`
    SELECT id, command, params FROM commands
    WHERE site_id = ${siteId} AND status = 'pending'
    ORDER BY created_at ASC
  `

  // Mark them as sent
  if (pending.length > 0) {
    const ids = pending.map((r: Record<string, unknown>) => r.id as string)
    await sql`UPDATE commands SET status = 'sent', sent_at = now() WHERE id = ANY(${ids})`
  }

  // Fetch current config
  const [config] = await sql`SELECT * FROM device_config WHERE site_id = ${siteId} LIMIT 1`

  return NextResponse.json({ commands: pending, config: config ?? null })
}

// POST — admin queues a command (session auth)
export async function POST(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id FROM sites WHERE id = ${siteId} LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { command, params: cmdParams } = body as { command: string; params?: Record<string, unknown> }
  const validCommands = ['SET_MODE', 'SET_THRESHOLDS', 'SET_AUTO_TIMER', 'SET_TEXTS', 'REBOOT', 'SHUTDOWN', 'SET_WIFI']
  if (!validCommands.includes(command)) {
    return NextResponse.json({ error: 'Unknown command' }, { status: 400 })
  }

  const [row] = await sql`
    INSERT INTO commands (site_id, command, params)
    VALUES (${siteId}, ${command}, ${JSON.stringify(cmdParams ?? {})})
    RETURNING id
  `

  return NextResponse.json({ ok: true, id: row.id })
}
