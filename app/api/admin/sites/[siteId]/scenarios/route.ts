import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

type Params = { params: Promise<{ siteId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const rows = await sql`
    SELECT * FROM scenarios WHERE site_id = ${siteId} ORDER BY starts_at ASC
  `
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id FROM sites WHERE id = ${siteId} LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, description, starts_at, ends_at } = body as Record<string, unknown>
  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (typeof starts_at !== 'string' || Number.isNaN(Date.parse(starts_at))) {
    return NextResponse.json({ error: 'starts_at must be a valid date' }, { status: 400 })
  }
  if (ends_at != null && (typeof ends_at !== 'string' || Number.isNaN(Date.parse(ends_at)))) {
    return NextResponse.json({ error: 'ends_at must be a valid date or null' }, { status: 400 })
  }

  const endsAtValue = typeof ends_at === 'string' ? ends_at : null

  const [created] = await sql`
    INSERT INTO scenarios (site_id, name, description, starts_at, ends_at)
    VALUES (
      ${siteId},
      ${name.trim()},
      ${typeof description === 'string' ? description.trim() || null : null},
      ${starts_at}::timestamptz,
      ${endsAtValue}::timestamptz
    )
    RETURNING *
  `
  return NextResponse.json(created, { status: 201 })
}
