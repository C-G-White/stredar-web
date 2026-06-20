import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ siteId: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params

  const [{ count: readingCount }] = await sql`
    SELECT COUNT(*)::int AS count FROM readings WHERE site_id = ${siteId}
  `
  await sql`DELETE FROM readings  WHERE site_id = ${siteId}`
  await sql`DELETE FROM telemetry WHERE site_id = ${siteId}`

  return NextResponse.json({ deleted_readings: readingCount })
}
