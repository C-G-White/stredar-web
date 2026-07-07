import type { Scenario, ScenarioStats, ScenarioComparison, DirectionStats } from './types'

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

function directionStats(speeds: number[]): DirectionStats | null {
  if (speeds.length === 0) return null
  const sorted = [...speeds].sort((a, b) => a - b)
  return {
    count: speeds.length,
    mean_speed_mph: round(mean(speeds)),
    p85_speed_mph: round(percentile(sorted, 85)),
  }
}

/**
 * Computes traffic-engineering-standard statistics for one scenario window.
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

  const speeds = readings.map(r => r.speed_mph)
  const sorted = [...speeds].sort((a, b) => a - b)
  const n = speeds.length

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
    total_passes: n,
    passes_per_day: round(n / durationDays),
    mean_speed_mph: n > 0 ? round(mean(speeds)) : null,
    median_speed_mph: n > 0 ? round(percentile(sorted, 50)) : null,
    p85_speed_mph: n > 0 ? round(percentile(sorted, 85)) : null,
    max_speed_mph: n > 0 ? Math.max(...speeds) : null,
    pct_over_limit: n > 0 ? round((speeds.filter(s => s > speedLimitMph).length / n) * 100) : null,
    by_direction: hasDirectionData
      ? { inbound: directionStats(inboundSpeeds), outbound: directionStats(outboundSpeeds) }
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

/**
 * Compares two scenarios: speed/compliance/volume deltas, plus a two-sample
 * (Welch) z-test on mean speed so the report can honestly state whether an
 * observed difference is statistically meaningful or could just be noise.
 */
export function compareScenarios(
  a: ScenarioStats,
  b: ScenarioStats,
  speedsA: number[],
  speedsB: number[],
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
    a_scenario_id: a.scenario_id,
    b_scenario_id: b.scenario_id,
    delta_mean_speed_mph:
      a.mean_speed_mph != null && b.mean_speed_mph != null
        ? round(a.mean_speed_mph - b.mean_speed_mph)
        : null,
    delta_p85_speed_mph:
      a.p85_speed_mph != null && b.p85_speed_mph != null
        ? round(a.p85_speed_mph - b.p85_speed_mph)
        : null,
    delta_pct_over_limit:
      a.pct_over_limit != null && b.pct_over_limit != null
        ? round(a.pct_over_limit - b.pct_over_limit)
        : null,
    delta_passes_per_day: round(a.passes_per_day - b.passes_per_day),
    significant,
    p_value: pValue,
  }
}

/** All pairwise comparisons for 2 or 3 scenarios, in the order they were selected. */
export function compareAllPairs(
  scenarioStats: ScenarioStats[],
  speedsByScenarioId: Record<string, number[]>,
): ScenarioComparison[] {
  const comparisons: ScenarioComparison[] = []
  for (let i = 0; i < scenarioStats.length; i++) {
    for (let j = i + 1; j < scenarioStats.length; j++) {
      const a = scenarioStats[i]
      const b = scenarioStats[j]
      comparisons.push(
        compareScenarios(a, b, speedsByScenarioId[a.scenario_id] ?? [], speedsByScenarioId[b.scenario_id] ?? []),
      )
    }
  }
  return comparisons
}
