import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

// GET — all sites with their latest telemetry (for the manage grid)
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT
      s.id, s.name, s.address, s.speed_limit_mph, s.active, s.lat, s.lng, s.device_type,
      dc.mode,
      t.cpu_temp_c, t.uptime_s, t.radar_connected, t.display_connected, t.mode AS current_mode,
      t.firmware_version, t.signal_rssi, t.mem_used_pct, t.wifi_networks, t.wifi_ssid, t.connection_type, t.recorded_at AS last_telemetry_at,
      CASE WHEN t.recorded_at > now() - interval '3 minutes' THEN 'online'
           WHEN t.recorded_at IS NOT NULL THEN 'stale'
           ELSE 'offline' END AS status,
      (SELECT COUNT(*)::int FROM readings r WHERE r.site_id = s.id AND r.recorded_at > now() - interval '24 hours') AS readings_today,
      (SELECT COUNT(*)::int FROM readings r WHERE r.site_id = s.id AND r.recorded_at > now() - interval '24 hours' AND r.speed_mph > COALESCE(dc.speed_limit_mph, s.speed_limit_mph)) AS violations_today
    FROM sites s
    LEFT JOIN device_config dc ON dc.site_id = s.id
    LEFT JOIN LATERAL (
      SELECT * FROM telemetry WHERE site_id = s.id ORDER BY recorded_at DESC LIMIT 1
    ) t ON true
    ORDER BY s.name
  `

  return NextResponse.json(rows)
}
