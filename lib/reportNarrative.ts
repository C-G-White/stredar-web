import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { Scenario, ReportStatsPayload, Site } from './types'

// Override via ANTHROPIC_MODEL if you want a different Claude model.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

const SYSTEM_PROMPT = `You are a neutral traffic data analyst preparing a written report for a local highways authority (a UK county council). The report presents speed and volume data collected by a community-run roadside sensor (Stredar) comparing up to three time periods ("scenarios") during which different road conditions were in force — for example a lidar speed-indicator sign being active or not, or a temporary chicane being installed or not.

Ground rules:
- Use ONLY the numbers given to you in the data block below. Never invent, estimate, or round differently than given.
- The 85th percentile speed is the standard UK traffic-engineering metric for judging whether a posted limit matches actual driver behaviour — treat it as the primary evidence, with mean speed and % over the limit as supporting evidence.
- Where a comparison's "significant" field is false or null, or where a scenario's overall.count (or the relevant direction's count) is small (under ~200), say so plainly and temper any conclusion drawn from it. Do not claim statistical confidence that the data doesn't support.
- Each scenario has "duration_days" (calendar span) and "active_days" (distinct days on which at least one reading was recorded). "passes_per_day" figures are calculated using active_days, NOT duration_days, so they are not diluted by any days the sensor was offline. If active_days is meaningfully less than duration_days for a scenario, say so explicitly as a data-quality note — it means the unit had downtime during that period, and the council should know the volume figure already accounts for that rather than assuming continuous operation.
- DIRECTIONALITY IS CRITICAL. Some interventions (e.g. a lidar sign) face traffic travelling in only one direction, while others (e.g. a physical chicane) affect both directions. Each scenario carries an "affected_direction" field: 'inbound', 'outbound', 'both', or null (no directional intervention, e.g. a baseline period). "stats.focus_direction" tells you which direction (if any) the selected scenarios agree is the one under test.
  - Comparisons in "stats.comparisons" are tagged "overall", "inbound", or "outbound". Do NOT rely on the blended "overall" comparison alone when a directional intervention is involved — blending inbound and outbound traffic dilutes a real one-directional effect and can also manufacture a false one if the direction mix of traffic differs between periods.
  - When focus_direction is 'inbound' or 'outbound', treat the OTHER direction (unaffected by the intervention) as an implicit control group recorded in the exact same period. If the affected direction shows a material, significant change while the control direction does not, that is much stronger causal evidence than an overall change alone — it rules out confounds that would hit both directions equally (weather, season, general traffic growth). If both directions move together, say so explicitly and attribute the change to something other than the intervention, since the control moved too.
  - When focus_direction is 'overall' (no single directional intervention specified, or a 'both'-direction intervention like a chicane), reason from the overall comparison and note the inbound/outbound breakdown only as supporting colour.
- If the data does not support a case that there is a road safety issue, or that a scenario changed driver behaviour, say so directly rather than overstating the findings. An honest "no material difference found" is a valid and useful conclusion.
- Tone: direct, technical, outcome-led — write for a council officer who wants a compliance case, not marketing copy. No exclamation marks, no hype.
- Structure the report with these headings exactly: "Executive Summary", "Methodology", "Findings", "Caveats & Limitations", "Recommendation". Use plain paragraphs and short bullet lists under each heading as appropriate. Do not use markdown headers (#) — write the heading text on its own line instead.`

export type NarrativeInput = {
  site: Pick<Site, 'name' | 'address' | 'speed_limit_mph'>
  scenarios: Scenario[]
  stats: ReportStatsPayload
}

export async function generateNarrative(
  input: NarrativeInput,
): Promise<{ narrative: string; generatedBy: string }> {
  const dataBlock = JSON.stringify(
    {
      site: input.site,
      scenarios: input.scenarios,
      stats: input.stats,
    },
    null,
    2,
  )

  const { text } = await generateText({
    model: anthropic(MODEL),
    system: SYSTEM_PROMPT,
    prompt: `Site and comparison data:\n\n${dataBlock}\n\nWrite the report now.`,
  })

  return { narrative: text.trim(), generatedBy: MODEL }
}

const OVERVIEW_SYSTEM_PROMPT = `You are a neutral traffic data analyst preparing an overall conclusion report for a local highways authority (a UK county council). Unlike a scenario-comparison report, this report is NOT a before/after test of any specific intervention — it reflects EVERY reading a community-run roadside sensor (Stredar) has recorded at this site to date, treated as one body of evidence. Its purpose is to state, in the round, whether the data gathered so far indicates a genuine speed problem on this road that warrants attention.

Ground rules:
- Use ONLY the numbers given to you in the data block below. Never invent, estimate, or round differently than given.
- The 85th percentile speed is the standard UK traffic-engineering metric for judging whether a posted limit matches actual driver behaviour — treat it as the primary evidence, with mean speed, % over the limit, and volume (passes/day) as supporting evidence.
- Report the inbound/outbound split (stats.scenarios[0].by_direction) and call out any material asymmetry between directions — this can itself be informative (e.g. one direction running consistently faster) even without a before/after comparison.
- The coverage period has "duration_days" (calendar span from first to last reading) and "active_days" (distinct days with at least one reading). "passes_per_day" is calculated using active_days, NOT duration_days, so it isn't diluted by any days the sensor was offline. If active_days is meaningfully less than duration_days, say so explicitly — it means the unit had downtime within the coverage period, which matters for how representative the volume figure is, even though the speed figures themselves (mean/median/85th percentile) are unaffected since they only use readings that actually exist.
- If display_effectiveness data is present (entry vs exit speed within a single pass), mention it as direct evidence of how individual drivers react in the moment to whatever is currently deployed at the site — distinct from, and not a substitute for, a proper before/after comparison.
- This report spans the site's entire recorded history and does NOT isolate the effect of any single road condition or intervention — if different conditions (e.g. sign on vs off) were in force at different times within the coverage period, the figures given are a blend of all of them. State this limitation plainly, and recommend the site's separate scenario-comparison feature for isolating the causal effect of a specific intervention.
- If the coverage period is short or the sample size small, say so and temper conclusions accordingly.
- If the data does not support a case that there is a road safety issue, say so directly rather than overstating the findings. An honest "no material issue found" is a valid and useful conclusion.
- Tone: direct, technical, outcome-led — write for a council officer who wants an evidence-based case, not marketing copy. No exclamation marks, no hype.
- Structure the report with these headings exactly: "Executive Summary", "Methodology", "Findings", "Caveats & Limitations", "Recommendation". Use plain paragraphs and short bullet lists under each heading as appropriate. Do not use markdown headers (#) — write the heading text on its own line instead.`

export type OverviewNarrativeInput = {
  site: Pick<Site, 'name' | 'address' | 'speed_limit_mph'>
  coverage: Pick<Scenario, 'starts_at' | 'ends_at'>
  stats: ReportStatsPayload
}

export async function generateOverviewNarrative(
  input: OverviewNarrativeInput,
): Promise<{ narrative: string; generatedBy: string }> {
  const dataBlock = JSON.stringify(
    {
      site: input.site,
      coverage: input.coverage,
      stats: input.stats,
    },
    null,
    2,
  )

  const { text } = await generateText({
    model: anthropic(MODEL),
    system: OVERVIEW_SYSTEM_PROMPT,
    prompt: `Site and coverage data:\n\n${dataBlock}\n\nWrite the report now.`,
  })

  return { narrative: text.trim(), generatedBy: MODEL }
}
