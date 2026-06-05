import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'

// POST — issue an ad-hoc command (e.g. REBOOT)
export async function POST(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id FROM sites WHERE id = ${siteId} LIMIT 1`
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { command, params: cmdParams } = body as { command: string; params?: Record<string, unknown> }
  const validCommands = ['SET_MODE', 'SET_THRESHOLDS', 'SET_AUTO_TIMER', 'SET_TEXTS', 'REBOOT']
  if (!validCommands.includes(command)) {
    return NextResponse.json({ error: 'Unknown command' }, { status: 400 })
  }

  const [row] = await sql`
    INSERT INTO commands (site_id, command, params)
    VALUES (${siteId}, ${command}, ${JSON.stringify(cmdParams ?? {})})
    RETURNING id
  `

  return NextResponse.json({ ok: true, id: row.id })
}
