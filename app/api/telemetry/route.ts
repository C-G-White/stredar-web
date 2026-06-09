import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  // Authenticate via per-device api_key
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [site] = await sql`SELECT id FROM sites WHERE api_key = ${apiKey} AND active = true LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    cpu_temp_c, ambient_temp_c, battery_mv, uptime_s,
    mem_used_pct, radar_connected, display_connected, mode, firmware_version, signal_rssi,
    wifi_networks, wifi_ssid, connection_type, lat, lon, alt_m,
  } = body as Record<string, unknown>

  const networks = Array.isArray(wifi_networks)
    ? (wifi_networks as unknown[]).filter(s => typeof s === 'string') as string[]
    : null

  await sql`
    INSERT INTO telemetry (
      site_id, cpu_temp_c, ambient_temp_c, battery_mv, uptime_s,
      mem_used_pct, radar_connected, display_connected, mode, firmware_version, signal_rssi,
      wifi_networks, wifi_ssid, connection_type
    ) VALUES (
      ${site.id},
      ${typeof cpu_temp_c === 'number' ? cpu_temp_c : null},
      ${typeof ambient_temp_c === 'number' ? ambient_temp_c : null},
      ${typeof battery_mv === 'number' ? battery_mv : null},
      ${typeof uptime_s === 'number' ? uptime_s : null},
      ${typeof mem_used_pct === 'number' ? mem_used_pct : null},
      ${typeof radar_connected === 'boolean' ? radar_connected : null},
      ${typeof display_connected === 'boolean' ? display_connected : null},
      ${typeof mode === 'string' ? mode : null},
      ${typeof firmware_version === 'string' ? firmware_version : null},
      ${typeof signal_rssi === 'number' ? signal_rssi : null},
      ${networks},
      ${typeof wifi_ssid === 'string' ? wifi_ssid : null},
      ${typeof connection_type === 'string' ? connection_type : null}
    )
  `

  if (typeof lat === 'number' && typeof lon === 'number' && lat !== 0 && lon !== 0) {
    await sql`UPDATE sites SET lat = ${lat}, lng = ${lon} WHERE id = ${site.id}`
  }

  return NextResponse.json({ ok: true })
}
