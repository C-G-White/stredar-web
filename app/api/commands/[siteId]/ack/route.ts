import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

// POST — Pi acknowledges a command by ID
export async function POST(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id FROM sites WHERE id = ${siteId} AND api_key = ${apiKey} AND active = true LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, failed } = body as { id: string; failed?: boolean }
  if (typeof id !== 'string') return NextResponse.json({ error: 'id required' }, { status: 400 })

  await sql`
    UPDATE commands
    SET status = ${failed ? 'failed' : 'acked'}, acked_at = now()
    WHERE id = ${id} AND site_id = ${siteId}
  `

  return NextResponse.json({ ok: true })
}
