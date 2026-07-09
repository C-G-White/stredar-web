import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'
import { computeScenarioStats, compareAllPairs, deriveFocusDirection, type ReadingRow, type SpeedsByDirection } from '@/lib/reportStats'
import { generateNarrative } from '@/lib/reportNarrative'
import type { Scenario, ScenarioStats, ReportStatsPayload, Site } from '@/lib/types'

type Params = { params: Promise<{ siteId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const rows = await sql`
    SELECT id, title, report_type, scenario_ids, scenarios_snapshot, created_at
    FROM reports
    WHERE site_id = ${siteId}
    ORDER BY created_at DESC
  `
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id, name, address, speed_limit_mph FROM sites WHERE id = ${siteId} LIMIT 1` as [
    Pick<Site, 'id' | 'name' | 'address' | 'speed_limit_mph'>,
  ]
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { scenario_ids, title: titleInput, user_context: userContextInput } = body as Record<string, unknown>

  if (!Array.isArray(scenario_ids) || scenario_ids.length < 2 || scenario_ids.length > 3) {
    return NextResponse.json({ error: 'scenario_ids must contain 2 or 3 scenario ids' }, { status: 400 })
  }
  if (!scenario_ids.every(id => typeof id === 'string')) {
    return NextResponse.json({ error: 'scenario_ids must be strings' }, { status: 400 })
  }
  const userContext = typeof userContextInput === 'string' && userContextInput.trim() ? userContextInput.trim() : null

  const scenarioRows = await sql`
    SELECT * FROM scenarios WHERE site_id = ${siteId} AND id = ANY(${scenario_ids as string[]})
  ` as Scenario[]
  if (scenarioRows.length !== scenario_ids.length) {
    return NextResponse.json({ error: 'One or more scenarios not found for this site' }, { status: 404 })
  }
  // Preserve the order the caller selected them in.
  const scenarios = (scenario_ids as string[]).map(id => scenarioRows.find(s => s.id === id)!)

  const speedsById: SpeedsByDirection = {}
  const scenarioStats: ScenarioStats[] = []

  for (const scenario of scenarios) {
    const readings = await sql`
      SELECT speed_mph, direction, entry_speed_mph, exit_speed_mph, recorded_at
      FROM readings
      WHERE site_id = ${siteId}
        AND recorded_at >= ${scenario.starts_at}::timestamptz
        AND recorded_at < ${scenario.ends_at ?? new Date().toISOString()}::timestamptz
      ORDER BY recorded_at ASC
    ` as unknown as ReadingRow[]

    speedsById[scenario.id] = {
      overall: readings.map(r => r.speed_mph),
      inbound: readings.filter(r => r.direction === 1).map(r => r.speed_mph),
      outbound: readings.filter(r => r.direction === -1).map(r => r.speed_mph),
    }
    scenarioStats.push(computeScenarioStats(readings, site.speed_limit_mph, scenario))
  }

  const comparisons = compareAllPairs(scenarioStats, speedsById)

  const stats: ReportStatsPayload = {
    speed_limit_mph: site.speed_limit_mph,
    scenarios: scenarioStats,
    comparisons,
    focus_direction: deriveFocusDirection(scenarios),
  }

  const title =
    typeof titleInput === 'string' && titleInput.trim()
      ? titleInput.trim()
      : `${site.name} — ${scenarios.map(s => s.name).join(' vs ')}`

  const { narrative, generatedBy } = await generateNarrative({ site, scenarios, stats, userContext })

  const [report] = await sql`
    INSERT INTO reports (site_id, title, scenario_ids, scenarios_snapshot, stats, narrative, generated_by, user_context)
    VALUES (
      ${siteId},
      ${title},
      ${scenario_ids as string[]},
      ${JSON.stringify(scenarios)},
      ${JSON.stringify(stats)},
      ${narrative},
      ${generatedBy},
      ${userContext}
    )
    RETURNING *
  `
  return NextResponse.json(report, { status: 201 })
}
