import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

type Params = { params: Promise<{ siteId: string; reportId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId, reportId } = await params
  const [report] = await sql`
    SELECT * FROM reports WHERE id = ${reportId} AND site_id = ${siteId} LIMIT 1
  `
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(report)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId, reportId } = await params
  const [deleted] = await sql`
    DELETE FROM reports WHERE id = ${reportId} AND site_id = ${siteId} RETURNING id
  `
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
