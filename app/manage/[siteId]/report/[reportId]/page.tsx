'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Report, ScenarioStats, ScenarioComparison } from '@/lib/types'

type SiteInfo = { id: string; name: string; address: string }

const NARRATIVE_HEADINGS = [
  'Executive Summary',
  'Methodology',
  'Findings',
  'Caveats & Limitations',
  'Recommendation',
]

function fmt(n: number | null, unit = ''): string {
  return n == null ? '—' : `${n}${unit}`
}

function metricRow(label: string, scenarios: ScenarioStats[], get: (s: ScenarioStats) => string) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', color: 'var(--steel-300)', whiteSpace: 'nowrap' }}>{label}</td>
      {scenarios.map(s => (
        <td key={s.scenario_id} style={{ padding: '8px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--white)' }}>
          {get(s)}
        </td>
      ))}
    </tr>
  )
}

function NarrativeBlock({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {paragraphs.map((p, i) => {
        const isHeading = NARRATIVE_HEADINGS.some(h => p.replace(/^#+\s*/, '') === h)
        if (isHeading) {
          return (
            <h2 key={i} className="t-h3" style={{ color: 'var(--hivis-500)', marginTop: 'var(--sp-3)' }}>
              {p.replace(/^#+\s*/, '')}
            </h2>
          )
        }
        return (
          <p key={i} className="t-body" style={{ color: 'var(--steel-100)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {p}
          </p>
        )
      })}
    </div>
  )
}

function comparisonLabel(c: ScenarioComparison, scenarios: ScenarioStats[]): string {
  const a = scenarios.find(s => s.scenario_id === c.a_scenario_id)?.name ?? '?'
  const b = scenarios.find(s => s.scenario_id === c.b_scenario_id)?.name ?? '?'
  return `${a} vs ${b}`
}

export default function ReportViewPage() {
  const { siteId, reportId } = useParams<{ siteId: string; reportId: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [site, setSite] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [reportRes, sitesRes] = await Promise.all([
        fetch(`/api/admin/sites/${siteId}/reports/${reportId}`),
        fetch('/api/admin/sites'),
      ])
      if (reportRes.ok) {
        setReport(await reportRes.json())
      } else {
        setError('Report not found')
      }
      if (sitesRes.ok) {
        const all: SiteInfo[] = await sitesRes.json()
        setSite(all.find(s => s.id === siteId) ?? null)
      }
      setLoading(false)
    }
    load()
  }, [siteId, reportId])

  if (loading) return <div style={{ padding: 'var(--sp-8) var(--sp-6)' }}><p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>Loading…</p></div>
  if (error || !report) return (
    <div style={{ padding: 'var(--sp-8) var(--sp-6)' }}>
      <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>{error || 'Report not found'}</p>
      <Link href={`/manage/${siteId}`} style={{ color: 'var(--hivis-500)' }}>Back to unit</Link>
    </div>
  )

  const { stats, scenarios_snapshot, narrative } = report
  const scenarios = stats.scenarios

  return (
    <div className="report-body" style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      <style>{`
        @media print {
          nav, header, .no-print { display: none !important; }
          .report-body, .report-body * {
            background: #fff !important;
            color: #000 !important;
            border-color: #ccc !important;
            box-shadow: none !important;
          }
          .report-body a { color: #000 !important; text-decoration: underline; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
        <Link href={`/manage/${siteId}`} className="t-label" style={{ color: 'var(--steel-400)', textDecoration: 'none' }}>
          ← Back to unit
        </Link>
        <button
          onClick={() => window.print()}
          style={{ background: 'var(--hivis-500)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, padding: '10px 20px', cursor: 'pointer' }}
        >
          Print report
        </button>
      </div>

      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-2)' }}>Stredar Comparison Report</p>
        <h1 className="t-h1" style={{ color: 'var(--white)' }}>{report.title}</h1>
        {site && <p className="t-body-sm" style={{ color: 'var(--steel-300)', marginTop: 4 }}>{site.name} · {site.address}</p>}
        <p className="t-label" style={{ color: 'var(--steel-400)', marginTop: 4 }}>
          Generated {new Date(report.created_at).toLocaleString()} · Speed limit {stats.speed_limit_mph} mph
        </p>
      </div>

      {/* Scenario definitions */}
      <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-3)' }}>Scenarios Compared</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {scenarios_snapshot.map(s => (
            <div key={s.id}>
              <p className="t-body-sm" style={{ color: 'var(--white)', fontWeight: 600 }}>{s.name}</p>
              <p className="t-label" style={{ color: 'var(--steel-400)' }}>
                {new Date(s.starts_at).toLocaleDateString()} – {s.ends_at ? new Date(s.ends_at).toLocaleDateString() : 'ongoing'}
                {s.description ? ` · ${s.description}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats table */}
      <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)', overflowX: 'auto' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-3)' }}>Measured Statistics</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td />
              {scenarios.map(s => (
                <td key={s.scenario_id} style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--hivis-500)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>
                  {s.name}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricRow('Duration (days)', scenarios, s => fmt(s.duration_days))}
            {metricRow('Total passes', scenarios, s => fmt(s.total_passes))}
            {metricRow('Passes / day', scenarios, s => fmt(s.passes_per_day))}
            {metricRow('Mean speed', scenarios, s => fmt(s.mean_speed_mph, ' mph'))}
            {metricRow('Median speed', scenarios, s => fmt(s.median_speed_mph, ' mph'))}
            {metricRow('85th percentile speed', scenarios, s => fmt(s.p85_speed_mph, ' mph'))}
            {metricRow('Max speed', scenarios, s => fmt(s.max_speed_mph, ' mph'))}
            {metricRow('% over limit', scenarios, s => fmt(s.pct_over_limit, '%'))}
            {metricRow('Inbound mean / 85th', scenarios, s =>
              s.by_direction?.inbound ? `${s.by_direction.inbound.mean_speed_mph} / ${s.by_direction.inbound.p85_speed_mph} mph` : '—')}
            {metricRow('Outbound mean / 85th', scenarios, s =>
              s.by_direction?.outbound ? `${s.by_direction.outbound.mean_speed_mph} / ${s.by_direction.outbound.p85_speed_mph} mph` : '—')}
            {metricRow('Display effect (entry → exit)', scenarios, s =>
              s.display_effectiveness
                ? `${s.display_effectiveness.mean_entry_mph} → ${s.display_effectiveness.mean_exit_mph} mph (${s.display_effectiveness.mean_delta_mph >= 0 ? '+' : ''}${s.display_effectiveness.mean_delta_mph})`
                : '—')}
          </tbody>
        </table>
      </div>

      {/* Comparisons */}
      <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-3)' }}>Pairwise Comparison</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {stats.comparisons.map((c, i) => (
            <div key={i} style={{ padding: 'var(--sp-3)', background: 'var(--asphalt-600)', borderRadius: 'var(--r-sm)' }}>
              <p className="t-body-sm" style={{ color: 'var(--white)', fontWeight: 600, marginBottom: 4 }}>{comparisonLabel(c, scenarios)}</p>
              <p className="t-body-sm" style={{ color: 'var(--steel-200)' }}>
                Δ mean speed: {fmt(c.delta_mean_speed_mph, ' mph')} · Δ 85th percentile: {fmt(c.delta_p85_speed_mph, ' mph')} · Δ % over limit: {fmt(c.delta_pct_over_limit, ' pts')} · Δ volume: {fmt(c.delta_passes_per_day, '/day')}
              </p>
              <p className="t-label" style={{ color: c.significant ? 'var(--ok-500)' : 'var(--steel-400)', marginTop: 4 }}>
                {c.p_value == null
                  ? 'Not enough data for a significance test'
                  : c.significant
                  ? `Statistically significant difference in mean speed (p = ${c.p_value})`
                  : `Not statistically significant (p = ${c.p_value}) — could be due to chance`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-3)' }}>Report</p>
        <NarrativeBlock text={narrative} />
      </div>
    </div>
  )
}
