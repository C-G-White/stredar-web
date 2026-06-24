import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const body = await req.json()

  if (typeof body.active === 'boolean') {
    await sql`UPDATE sites SET active = ${body.active} WHERE id = ${siteId}`
    return NextResponse.json({ ok: true, active: body.active })
  }

  return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
}
