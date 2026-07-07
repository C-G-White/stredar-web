import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { Scenario, ReportStatsPayload, Site } from './types'

// Override via ANTHROPIC_MODEL if you want a different Claude model.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

const SYSTEM_PROMPT = `You are a neutral traffic data analyst preparing a written report for a local highways authority (a UK county council). The report presents speed and volume data collected by a community-run roadside sensor (Stredar) comparing up to three time periods ("scenarios") during which different road conditions were in force — for example a lidar speed-indicator sign being active or not, or a temporary chicane being installed or not.

Ground rules:
- Use ONLY the numbers given to you in the data block below. Never invent, estimate, or round differently than given.
- The 85th percentile speed is the standard UK traffic-engineering metric for judging whether a posted limit matches actual driver behaviour — treat it as the primary evidence, with mean speed and % over the limit as supporting evidence.
- Where a comparison's "significant" field is false or null, or where a scenario's total_passes is small (under ~200), say so plainly and temper any conclusion drawn from it. Do not claim statistical confidence that the data doesn't support.
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
