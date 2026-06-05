import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Accept either per-device api_key (new) or shared INGEST_SECRET (legacy)
  let site_id_from_key: string | null = null
  if (apiKey !== process.env.INGEST_SECRET) {
    const [site] = await sql`SELECT id FROM sites WHERE api_key = ${apiKey} AND active = true LIMIT 1`
    if (!site) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    site_id_from_key = site.id
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { site_id, speed_mph, direction, recorded_at } = body as Record<string, unknown>

  // Per-device key: site_id must match the key's site; legacy key: trust the payload
  const resolved_site_id = site_id_from_key ?? site_id

  if (
    typeof resolved_site_id !== 'string' ||
    typeof speed_mph !== 'number' ||
    speed_mph < 0 || speed_mph > 200 ||
    typeof recorded_at !== 'string'
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const dir = direction === 1 || direction === -1 ? direction : null

  await sql`
    INSERT INTO readings (site_id, speed_mph, direction, recorded_at)
    VALUES (${resolved_site_id}, ${speed_mph}, ${dir}, ${recorded_at})
  `

  return NextResponse.json({ ok: true })
}
