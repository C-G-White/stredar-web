import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site_id')

  if (siteId) {
    const rows = await sql`
      SELECT speed_mph, direction, entry_speed_mph, exit_speed_mph, recorded_at
      FROM readings
      WHERE site_id = ${siteId}
      ORDER BY recorded_at DESC
      LIMIT 1000
    `
    return NextResponse.json(rows, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const rows = await sql`
    SELECT
      s.id, s.name, s.address, s.lat, s.lng, s.speed_limit_mph,
      COUNT(r.id)::int          AS reading_count,
      MAX(r.speed_mph)::int        AS max_speed_mph,
      MAX(r.recorded_at)        AS last_reading_at
    FROM sites s
    LEFT JOIN readings r ON r.site_id = s.id
    WHERE s.active = true
    GROUP BY s.id
    ORDER BY s.name
  `
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
  })
}
