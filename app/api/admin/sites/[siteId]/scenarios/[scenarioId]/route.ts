import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

type Params = { params: Promise<{ siteId: string; scenarioId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId, scenarioId } = await params
  const [existing] = await sql`
    SELECT * FROM scenarios WHERE id = ${scenarioId} AND site_id = ${siteId} LIMIT 1
  `
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { name, description, starts_at, ends_at, affected_direction } = body as Record<string, unknown>

  if (starts_at != null && (typeof starts_at !== 'string' || Number.isNaN(Date.parse(starts_at)))) {
    return NextResponse.json({ error: 'starts_at must be a valid date' }, { status: 400 })
  }
  if (ends_at !== undefined && ends_at !== null && (typeof ends_at !== 'string' || Number.isNaN(Date.parse(ends_at)))) {
    return NextResponse.json({ error: 'ends_at must be a valid date or null' }, { status: 400 })
  }
  if (affected_direction !== undefined && affected_direction !== null && !['inbound', 'outbound', 'both'].includes(affected_direction as string)) {
    return NextResponse.json({ error: 'affected_direction must be inbound, outbound, both, or null' }, { status: 400 })
  }

  const nextName = typeof name === 'string' && name.trim() ? name.trim() : existing.name
  const nextDescription = typeof description === 'string' ? (description.trim() || null) : existing.description
  const nextStartsAt = typeof starts_at === 'string' ? starts_at : existing.starts_at
  const nextEndsAt = ends_at === undefined ? existing.ends_at : ends_at
  const nextAffectedDirection = affected_direction === undefined ? existing.affected_direction : affected_direction

  const [updated] = await sql`
    UPDATE scenarios SET
      name = ${nextName},
      description = ${nextDescription},
      starts_at = ${nextStartsAt}::timestamptz,
      ends_at = ${nextEndsAt}::timestamptz,
      affected_direction = ${nextAffectedDirection}
    WHERE id = ${scenarioId} AND site_id = ${siteId}
    RETURNING *
  `
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId, scenarioId } = await params
  const [deleted] = await sql`
    DELETE FROM scenarios WHERE id = ${scenarioId} AND site_id = ${siteId} RETURNING id
  `
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
