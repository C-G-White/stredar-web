import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { auth } from '@/lib/auth'
import { computeScenarioStats, type ReadingRow } from '@/lib/reportStats'
import { generateOverviewNarrative } from '@/lib/reportNarrative'
import type { ReportStatsPayload, Scenario, Site } from '@/lib/types'

type Params = { params: Promise<{ siteId: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId } = await params
  const [site] = await sql`SELECT id, name, address, speed_limit_mph FROM sites WHERE id = ${siteId} LIMIT 1` as [
    Pick<Site, 'id' | 'name' | 'address' | 'speed_limit_mph'>,
  ]
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 })

  const readings = await sql`
    SELECT speed_mph, direction, entry_speed_mph, exit_speed_mph, recorded_at
    FROM readings
    WHERE site_id = ${siteId}
    ORDER BY recorded_at ASC
  ` as unknown as ReadingRow[]

  if (readings.length === 0) {
    return NextResponse.json({ error: 'No readings recorded for this site yet' }, { status: 400 })
  }

  const coverage: Scenario = {
    id: 'overview',
    site_id: siteId,
    name: 'All recorded data',
    description: null,
    starts_at: readings[0].recorded_at,
    ends_at: readings[readings.length - 1].recorded_at,
    affected_direction: null,
    created_at: new Date().toISOString(),
  }

  const overviewStats = computeScenarioStats(readings, site.speed_limit_mph, coverage)

  const stats: ReportStatsPayload = {
    speed_limit_mph: site.speed_limit_mph,
    scenarios: [overviewStats],
    comparisons: [],
    focus_direction: 'overall',
  }

  const title = `${site.name} — Site Overview Report`

  const { narrative, generatedBy } = await generateOverviewNarrative({ site, coverage, stats })

  const [report] = await sql`
    INSERT INTO reports (site_id, title, report_type, scenario_ids, scenarios_snapshot, stats, narrative, generated_by)
    VALUES (
      ${siteId},
      ${title},
      'overview',
      ${[]},
      ${JSON.stringify([coverage])},
      ${JSON.stringify(stats)},
      ${narrative},
      ${generatedBy}
    )
    RETURNING *
  `
  return NextResponse.json(report, { status: 201 })
}
