import type { Scenario, ScenarioStats, ScenarioComparison, DirectionStats, ReportStatsPayload } from './types'

// Minimal shape reportStats needs from a reading row — matches the
// `readings` columns returned by the existing /api/data query.
export type ReadingRow = {
  speed_mph: number
  direction: 1 | -1 | null
  entry_speed_mph: number | null
  exit_speed_mph: number | null
  recorded_at: string
}

function round(n: number, dp = 1) {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

function mean(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length
}

// Sample variance (n-1 denominator) — used for the significance test.
function variance(xs: number[], m = mean(xs)): number {
  if (xs.length < 2) return 0
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1)
}

function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0
  const idx = (p / 100) * (sortedAsc.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sortedAsc[lo]
  return sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * (idx - lo)
}

function computeDirectionStats(speeds: number[], speedLimitMph: number, durationDays: number): DirectionStats {
  const n = speeds.length
  if (n === 0) {
    return {
      count: 0, passes_per_day: 0, mean_speed_mph: null, median_speed_mph: null,
      p85_speed_mph: null, max_speed_mph: null, pct_over_limit: null,
    }
  }
  const sorted = [...speeds].sort((a, b) => a - b)
  return {
    count: n,
    passes_per_day: round(n / durationDays),
    mean_speed_mph: round(mean(speeds)),
    median_speed_mph: round(percentile(sorted, 50)),
    p85_speed_mph: round(percentile(sorted, 85)),
    max_speed_mph: Math.max(...speeds),
    pct_over_limit: round((speeds.filter(s => s > speedLimitMph).length / n) * 100),
  }
}

/**
 * Computes traffic-engineering-standard statistics for one scenario window,
 * both overall and split by direction of travel.
 * `readings` must already be filtered to the scenario's [starts_at, ends_at) range.
 */
export function computeScenarioStats(
  readings: ReadingRow[],
  speedLimitMph: number,
  scenario: Pick<Scenario, 'id' | 'name' | 'starts_at' | 'ends_at'>,
): ScenarioStats {
  const endsAt = scenario.ends_at ? new Date(scenario.ends_at) : new Date()
  const startsAt = new Date(scenario.starts_at)
  const durationDays = Math.max((endsAt.getTime() - startsAt.getTime()) / 86_400_000, 1 / 24)

  const overall = computeDirectionStats(readings.map(r => r.speed_mph), speedLimitMph, durationDays)

  const inboundSpeeds = readings.filter(r => r.direction === 1).map(r => r.speed_mph)
  const outboundSpeeds = readings.filter(r => r.direction === -1).map(r => r.speed_mph)
  const hasDirectionData = inboundSpeeds.length + outboundSpeeds.length > 0

  const entryExitPairs = readings.filter(
    (r): r is ReadingRow & { entry_speed_mph: number; exit_speed_mph: number } =>
      r.entry_speed_mph != null && r.exit_speed_mph != null,
  )

  return {
    scenario_id: scenario.id,
    name: scenario.name,
    starts_at: scenario.starts_at,
    ends_at: scenario.ends_at,
    duration_days: round(durationDays, 2),
    overall,
    by_direction: hasDirectionData
      ? {
          inbound: inboundSpeeds.length ? computeDirectionStats(inboundSpeeds, speedLimitMph, durationDays) : null,
          outbound: outboundSpeeds.length ? computeDirectionStats(outboundSpeeds, speedLimitMph, durationDays) : null,
        }
      : null,
    display_effectiveness:
      entryExitPairs.length > 0
        ? {
            count: entryExitPairs.length,
            mean_entry_mph: round(mean(entryExitPairs.map(r => r.entry_speed_mph))),
            mean_exit_mph: round(mean(entryExitPairs.map(r => r.exit_speed_mph))),
            mean_delta_mph: round(
              mean(entryExitPairs.map(r => r.exit_speed_mph - r.entry_speed_mph)),
            ),
          }
        : null,
  }
}

// Standard normal CDF via the Abramowitz-Stegun erf approximation (accurate to ~1e-7).
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

function compareDirection(
  direction: ScenarioComparison['direction'],
  aId: string, bId: string,
  a: DirectionStats, b: DirectionStats,
  speedsA: number[], speedsB: number[],
): ScenarioComparison {
  let significant: boolean | null = null
  let pValue: number | null = null

  if (speedsA.length >= 2 && speedsB.length >= 2) {
    const meanA = mean(speedsA)
    const meanB = mean(speedsB)
    const se = Math.sqrt(variance(speedsA, meanA) / speedsA.length + variance(speedsB, meanB) / speedsB.length)
    if (se > 0) {
      const z = (meanA - meanB) / se
      pValue = round(2 * (1 - normalCdf(Math.abs(z))), 4)
      significant = pValue < 0.05
    }
  }

  return {
    a_scenario_id: aId,
    b_scenario_id: bId,
    direction,
    n_a: a.count,
    n_b: b.count,
    delta_mean_speed_mph:
      a.mean_speed_mph != null && b.mean_speed_mph != null ? round(a.mean_speed_mph - b.mean_speed_mph) : null,
    delta_p85_speed_mph:
      a.p85_speed_mph != null && b.p85_speed_mph != null ? round(a.p85_speed_mph - b.p85_speed_mph) : null,
    delta_pct_over_limit:
      a.pct_over_limit != null && b.pct_over_limit != null ? round(a.pct_over_limit - b.pct_over_limit) : null,
    delta_passes_per_day: round(a.passes_per_day - b.passes_per_day),
    significant,
    p_value: pValue,
  }
}

/** Per-scenario speed arrays split by direction, keyed by scenario_id — supplied by the caller from raw readings. */
export type SpeedsByDirection = Record<string, { overall: number[]; inbound: number[]; outbound: number[] }>

/**
 * All pairwise comparisons for 2 or 3 scenarios, computed overall and — where
 * both scenarios in a pair have direction data — separately for inbound and
 * outbound, so a directional intervention (e.g. a sign facing inbound traffic
 * only) can be checked against the other, unaffected direction as a control.
 */
export function compareAllPairs(
  scenarioStats: ScenarioStats[],
  speedsById: SpeedsByDirection,
): ScenarioComparison[] {
  const comparisons: ScenarioComparison[] = []
  for (let i = 0; i < scenarioStats.length; i++) {
    for (let j = i + 1; j < scenarioStats.length; j++) {
      const a = scenarioStats[i]
      const b = scenarioStats[j]
      const speedsA = speedsById[a.scenario_id]
      const speedsB = speedsById[b.scenario_id]

      comparisons.push(compareDirection('overall', a.scenario_id, b.scenario_id, a.overall, b.overall, speedsA.overall, speedsB.overall))

      const aInbound = a.by_direction?.inbound
      const bInbound = b.by_direction?.inbound
      if (aInbound && bInbound) {
        comparisons.push(compareDirection('inbound', a.scenario_id, b.scenario_id, aInbound, bInbound, speedsA.inbound, speedsB.inbound))
      }

      const aOutbound = a.by_direction?.outbound
      const bOutbound = b.by_direction?.outbound
      if (aOutbound && bOutbound) {
        comparisons.push(compareDirection('outbound', a.scenario_id, b.scenario_id, aOutbound, bOutbound, speedsA.outbound, speedsB.outbound))
      }
    }
  }
  return comparisons
}

/** Derives which direction the report should treat as primary evidence from the selected scenarios' affected_direction. */
export function deriveFocusDirection(scenarios: Pick<Scenario, 'affected_direction'>[]): 'overall' | 'inbound' | 'outbound' {
  const directional = new Set(
    scenarios.map(s => s.affected_direction).filter((d): d is 'inbound' | 'outbound' => d === 'inbound' || d === 'outbound'),
  )
  return directional.size === 1 ? [...directional][0] : 'overall'
}

/**
 * Reports store an immutable snapshot of the stats shape at generation time.
 * Reports generated before directional comparisons existed have a flatter
 * shape (no `overall` wrapper, no `direction`/`n_a`/`n_b` on comparisons, no
 * `focus_direction`, no `affected_direction` on scenarios). This adapts old
 * snapshots to the current shape purely for display — it never rewrites the
 * stored row.
 */
export function normalizeReportStats(stats: unknown): ReportStatsPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = stats as any
  return {
    speed_limit_mph: s.speed_limit_mph,
    focus_direction: s.focus_direction ?? 'overall',
    scenarios: (s.scenarios ?? []).map((sc: Record<string, unknown>): ScenarioStats => {
      if (sc.overall) return sc as unknown as ScenarioStats
      const normalizeDirection = (d: Record<string, unknown> | null | undefined): DirectionStats | null =>
        d
          ? {
              count: (d.count as number) ?? 0,
              passes_per_day: (d.passes_per_day as number) ?? 0,
              mean_speed_mph: (d.mean_speed_mph as number | null) ?? null,
              median_speed_mph: (d.median_speed_mph as number | null) ?? null,
              p85_speed_mph: (d.p85_speed_mph as number | null) ?? null,
              max_speed_mph: (d.max_speed_mph as number | null) ?? null,
              pct_over_limit: (d.pct_over_limit as number | null) ?? null,
            }
          : null
      const byDirection = sc.by_direction as Record<string, unknown> | null
      return {
        scenario_id: sc.scenario_id as string,
        name: sc.name as string,
        starts_at: sc.starts_at as string,
        ends_at: sc.ends_at as string | null,
        duration_days: sc.duration_days as number,
        overall: {
          count: (sc.total_passes as number) ?? 0,
          passes_per_day: (sc.passes_per_day as number) ?? 0,
          mean_speed_mph: (sc.mean_speed_mph as number | null) ?? null,
          median_speed_mph: (sc.median_speed_mph as number | null) ?? null,
          p85_speed_mph: (sc.p85_speed_mph as number | null) ?? null,
          max_speed_mph: (sc.max_speed_mph as number | null) ?? null,
          pct_over_limit: (sc.pct_over_limit as number | null) ?? null,
        },
        by_direction: byDirection
          ? {
              inbound: normalizeDirection(byDirection.inbound as Record<string, unknown> | null),
              outbound: normalizeDirection(byDirection.outbound as Record<string, unknown> | null),
            }
          : null,
        display_effectiveness: (sc.display_effectiveness as ScenarioStats['display_effectiveness']) ?? null,
      }
    }),
    comparisons: (s.comparisons ?? []).map((c: Record<string, unknown>): ScenarioComparison => ({
      a_scenario_id: c.a_scenario_id as string,
      b_scenario_id: c.b_scenario_id as string,
      direction: (c.direction as ScenarioComparison['direction']) ?? 'overall',
      n_a: (c.n_a as number) ?? 0,
      n_b: (c.n_b as number) ?? 0,
      delta_mean_speed_mph: (c.delta_mean_speed_mph as number | null) ?? null,
      delta_p85_speed_mph: (c.delta_p85_speed_mph as number | null) ?? null,
      delta_pct_over_limit: (c.delta_pct_over_limit as number | null) ?? null,
      delta_passes_per_day: (c.delta_passes_per_day as number | null) ?? null,
      significant: (c.significant as boolean | null) ?? null,
      p_value: (c.p_value as number | null) ?? null,
    })),
  }
}

/** Adapts an older scenarios_snapshot entry (pre-affected_direction) for display. */
export function normalizeScenarioSnapshot(s: Omit<Scenario, 'affected_direction'> & { affected_direction?: Scenario['affected_direction'] }): Scenario {
  return { ...s, affected_direction: s.affected_direction ?? null }
}
