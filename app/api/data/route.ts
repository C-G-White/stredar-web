import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const siteId = searchParams.get('site_id')

  if (siteId) {
    const rows = await sql`
      SELECT speed_mph, direction, recorded_at
      FROM readings
      WHERE site_id = ${siteId}
      ORDER BY recorded_at DESC
      LIMIT 1000
    `
    return NextResponse.json(rows, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    })
  }

  const rows = await sql`
    SELECT
      s.id, s.name, s.address, s.lat, s.lng, s.speed_limit_mph,
      COUNT(r.id)::int          AS reading_count,
      ROUND(AVG(r.speed_mph))::int AS avg_speed_mph,
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
