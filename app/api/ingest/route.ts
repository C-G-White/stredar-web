import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { site_id, speed_mph, direction, recorded_at } = body as Record<string, unknown>

  if (
    typeof site_id !== 'string' ||
    typeof speed_mph !== 'number' ||
    speed_mph < 0 || speed_mph > 200 ||
    typeof recorded_at !== 'string'
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const dir = direction === 1 || direction === -1 ? direction : null

  await sql`
    INSERT INTO readings (site_id, speed_mph, direction, recorded_at)
    VALUES (${site_id}, ${speed_mph}, ${dir}, ${recorded_at})
  `

  return NextResponse.json({ ok: true })
}
