'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

type Reading = {
  speed_mph: number
  direction: number | null
  recorded_at: string
}

type DirectionStats = {
  count: number
  avg: number | null
  p85: number | null
  overPct: number | null
}

type Stats = {
  total: number
  avg: number | null
  p85: number | null
  overCount: number
  overPct: number | null
  histogram: HistBin[]
  trend: TrendPoint[]
  recent: Reading[]
  approaching: DirectionStats
  receding: DirectionStats
  hasDirectionData: boolean
}

type HistBin = {
  label: string
  count: number
  pct: number  // 0–100 of max bin
  isOver: boolean
  isWarn: boolean
}

type TrendPoint = {
  speed: number
  recorded_at: string
  isOver: boolean
  isWarn: boolean
}

const POLL_INTERVAL = 30_000

function dirStats(subset: Reading[], limit: number): DirectionStats {
  if (!subset.length) return { count: 0, avg: null, p85: null, overPct: null }
  const speeds = subset.map(r => r.speed_mph)
  const sorted = [...speeds].sort((a, b) => a - b)
  return {
    count:   subset.length,
    avg:     Math.round(sorted.reduce((s, v) => s + v, 0) / sorted.length),
    p85:     sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.85))],
    overPct: Math.round((speeds.filter(s => s > limit).length / speeds.length) * 100),
  }
}

function compute(readings: Reading[], limit: number): Stats {
  if (!readings.length) {
    return { total: 0, avg: null, p85: null, overCount: 0, overPct: null, histogram: [], trend: [], recent: [],
             approaching: { count: 0, avg: null, p85: null, overPct: null },
             receding:    { count: 0, avg: null, p85: null, overPct: null },
             hasDirectionData: false }
  }

  const speeds = readings.map(r => r.speed_mph)
  const sorted = [...speeds].sort((a, b) => a - b)
  const total = readings.length
  const avg = Math.round(sorted.reduce((s, v) => s + v, 0) / total)
  const p85 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.85))]
  const overCount = speeds.filter(s => s > limit).length
  const overPct = Math.round((overCount / total) * 100)

  // 5 mph histogram bins
  const minBin = Math.floor(Math.min(...speeds) / 5) * 5
  const maxBin = Math.ceil(Math.max(...speeds) / 5) * 5
  const rawBins: HistBin[] = []
  for (let b = minBin; b < maxBin; b += 5) {
    const count = speeds.filter(s => s >= b && s < b + 5).length
    rawBins.push({ label: String(b), count, pct: 0, isOver: b >= limit, isWarn: b >= limit * 0.9 && b < limit })
  }
  const maxCount = Math.max(...rawBins.map(b => b.count), 1)
  const histogram = rawBins.map(b => ({ ...b, pct: Math.round((b.count / maxCount) * 100) }))

  // Trend — last 60 readings in chronological order
  const trend = [...readings]
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .slice(-60)
    .map(r => ({
      speed: r.speed_mph,
      recorded_at: r.recorded_at,
      isOver: r.speed_mph > limit,
      isWarn: r.speed_mph > limit * 0.9 && r.speed_mph <= limit,
    }))

  // Recent passes — latest 25
  const recent = [...readings]
    .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
    .slice(0, 25)

  const hasDirectionData = readings.some(r => r.direction !== null)
  const approaching = dirStats(readings.filter(r => r.direction === 1),  limit)
  const receding    = dirStats(readings.filter(r => r.direction === -1), limit)

  return { total, avg, p85, overCount, overPct, histogram, trend, recent, approaching, receding, hasDirectionData }
}

function DirectionComparison({ approaching, receding, limit }: {
  approaching: DirectionStats; receding: DirectionStats; limit: number
}) {
  const cols: { key: keyof DirectionStats; label: string; unit: string; lowerIsBetter: boolean }[] = [
    { key: 'avg',     label: 'Avg Speed',   unit: 'MPH', lowerIsBetter: true },
    { key: 'p85',     label: '85th Pct.',   unit: 'MPH', lowerIsBetter: true },
    { key: 'overPct', label: 'Over Limit',  unit: '%',   lowerIsBetter: true },
    { key: 'count',   label: 'Vehicles',    unit: '',    lowerIsBetter: false },
  ]

  function diffColor(a: number | null, b: number | null, lowerIsBetter: boolean) {
    if (a == null || b == null || a === b) return 'var(--steel-400)'
    const approachingIsBetter = lowerIsBetter ? a < b : a > b
    return approachingIsBetter ? 'var(--ok-500)' : 'var(--over-500)'
  }

  function diffLabel(a: number | null, b: number | null, unit: string) {
    if (a == null || b == null) return '—'
    const d = a - b
    return (d > 0 ? '+' : '') + d + (unit ? ' ' + unit : '')
  }

  return (
    <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--bd-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)' }}>Direction Comparison</p>
        <p className="t-label" style={{ color: 'var(--steel-400)' }}>Approaching saw the sign · Receding did not</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'stretch' }}>
        {/* Approaching */}
        <div style={{ padding: 'var(--sp-5)', borderLeft: '3px solid var(--hivis-500)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>Approaching ›</p>
          <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4, fontSize: 10 }}>Saw the display</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {cols.map(col => {
              const val = approaching[col.key]
              const other = receding[col.key]
              return (
                <div key={col.key}>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>{col.label}</p>
                  <p style={{ fontFamily: 'var(--font-led)', fontSize: 28, color: diffColor(val as number | null, other as number | null, col.lowerIsBetter), lineHeight: 1 }}>
                    {val ?? '—'}{col.unit ? <span style={{ fontSize: 11, marginLeft: 3 }}>{col.unit}</span> : null}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Diff column */}
        <div style={{ padding: 'var(--sp-5) var(--sp-4)', borderLeft: 'var(--bd-hair-dark)', borderRight: 'var(--bd-hair-dark)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', justifyContent: 'flex-end', paddingTop: 'calc(var(--sp-5) + 12px + var(--sp-4) + 10px)' }}>
          {cols.map(col => {
            const a = approaching[col.key] as number | null
            const b = receding[col.key] as number | null
            const color = diffColor(a, b, col.lowerIsBetter)
            return (
              <div key={col.key} style={{ textAlign: 'center', height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="t-label" style={{ color, fontSize: 11 }}>{diffLabel(a, b, col.unit)}</span>
              </div>
            )
          })}
        </div>

        {/* Receding */}
        <div style={{ padding: 'var(--sp-5)', borderRight: '3px solid var(--steel-400)' }}>
          <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-4)' }}>‹ Receding</p>
          <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4, fontSize: 10 }}>Did not see the display</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {cols.map(col => {
              const val = receding[col.key]
              return (
                <div key={col.key}>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>{col.label}</p>
                  <p style={{ fontFamily: 'var(--font-led)', fontSize: 28, color: 'var(--steel-200)', lineHeight: 1 }}>
                    {val ?? '—'}{col.unit ? <span style={{ fontSize: 11, marginLeft: 3 }}>{col.unit}</span> : null}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-3) var(--sp-5)', borderTop: 'var(--bd-dark)' }}>
        <p className="t-label" style={{ color: 'var(--steel-400)', fontSize: 10 }}>
          Diff column shows approaching minus receding. Green = approaching drivers are slower / more compliant.
        </p>
      </div>
    </div>
  )
}

function TrendChart({ trend, limit }: { trend: TrendPoint[]; limit: number }) {
  if (trend.length < 2) return (
    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p className="t-label" style={{ color: 'var(--steel-400)' }}>Not enough data yet</p>
    </div>
  )

  const W = 800
  const H = 100
  const PAD = { top: 12, bottom: 12, left: 4, right: 4 }

  const speeds = trend.map(t => t.speed)
  const minS = Math.max(0, Math.min(...speeds) - 5)
  const maxS = Math.max(...speeds) + 5

  const x = (i: number) => PAD.left + (i / (trend.length - 1)) * (W - PAD.left - PAD.right)
  const y = (s: number) => PAD.top + (1 - (s - minS) / (maxS - minS)) * (H - PAD.top - PAD.bottom)

  const limitY = y(limit)
  const points = trend.map((t, i) => `${x(i)},${y(t.speed)}`).join(' ')

  const dotColor = (t: TrendPoint) =>
    t.isOver ? 'var(--over-500)' : t.isWarn ? 'var(--warn-500)' : 'var(--ok-500)'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120, display: 'block' }} preserveAspectRatio="none">
      {/* Limit line */}
      {limitY > PAD.top && limitY < H - PAD.bottom && (
        <>
          <line x1={0} y1={limitY} x2={W} y2={limitY} stroke="rgba(240,70,60,.4)" strokeWidth={1} strokeDasharray="6 4" />
          <text x={W - PAD.right} y={limitY - 3} fill="rgba(240,70,60,.6)" fontSize={10} textAnchor="end"
            style={{ fontFamily: 'var(--font-mono)' }}>{limit} MPH LIMIT</text>
        </>
      )}
      {/* Speed line */}
      <polyline points={points} fill="none" stroke="rgba(255,134,66,.7)" strokeWidth={1.5} />
      {/* Dots */}
      {trend.map((t, i) => (
        <circle key={i} cx={x(i)} cy={y(t.speed)} r={3} fill={dotColor(t)} />
      ))}
    </svg>
  )
}

export default function LiveAnalytics({ siteId, speedLimitMph }: { siteId: string; speedLimitMph: number }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [secondsAgo, setSecondsAgo] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/data?site_id=${siteId}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('fetch failed')
      const readings: Reading[] = await res.json()
      setStats(compute(readings, speedLimitMph))
      setLastUpdated(new Date())
      setSecondsAgo(0)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [siteId, speedLimitMph])

  useEffect(() => {
    fetchData()
    const poll = setInterval(fetchData, POLL_INTERVAL)
    return () => clearInterval(poll)
  }, [fetchData])

  // Tick "X seconds ago"
  useEffect(() => {
    const tick = setInterval(() => {
      if (lastUpdated) setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(tick)
  }, [lastUpdated])

  if (loading) return (
    <div style={{ padding: 'var(--sp-12) 0', textAlign: 'center' }}>
      <p className="t-label" style={{ color: 'var(--steel-400)' }}>Loading analytics…</p>
    </div>
  )

  if (error || !stats) return (
    <div style={{ padding: 'var(--sp-8)', background: 'var(--over-tint)', border: '1px solid var(--over-500)', borderRadius: 'var(--r-md)' }}>
      <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>Could not load data. Retrying in {POLL_INTERVAL / 1000}s.</p>
    </div>
  )

  const statCards = [
    { label: 'Total Passes',  value: stats.total.toLocaleString(), sub: 'all recorded', color: 'var(--white)' },
    { label: 'Average Speed', value: stats.avg != null ? `${stats.avg}` : '—', sub: 'MPH', color: stats.avg != null && stats.avg > speedLimitMph ? 'var(--over-500)' : 'var(--white)' },
    { label: '85th Pct.',     value: stats.p85 != null ? `${stats.p85}` : '—', sub: 'MPH · compliance indicator', color: stats.p85 != null && stats.p85 > speedLimitMph ? 'var(--over-500)' : 'var(--white)' },
    { label: 'Over Limit',    value: stats.overPct != null ? `${stats.overPct}%` : '—', sub: `${stats.overCount.toLocaleString()} passes`, color: (stats.overPct ?? 0) > 15 ? 'var(--over-500)' : (stats.overPct ?? 0) > 5 ? 'var(--warn-500)' : 'var(--ok-500)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

      {/* Updated timestamp */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ok-500)', boxShadow: '0 0 6px rgba(25,195,125,.7)', display: 'inline-block', flexShrink: 0 }} />
        <span className="t-label" style={{ color: 'var(--steel-300)' }}>
          Updated {secondsAgo < 5 ? 'just now' : `${secondsAgo}s ago`} · refreshes every 30s
        </span>
      </div>

      {/* Stat cards */}
      <div className="cols-4" style={{ gap: 'var(--sp-3)' }}>
        {statCards.map((card, i) => (
          <div key={card.label} style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderLeft: i === 0 ? 'var(--bd-accent)' : 'var(--bd-dark)', borderRadius: 'var(--r-md)', padding: 'var(--sp-5)' }}>
            <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-2)' }}>{card.label}</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 36, color: card.color, lineHeight: 1, marginBottom: 'var(--sp-1)' }}>{card.value}</p>
            <p className="t-label" style={{ color: 'var(--steel-400)' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Direction comparison — only shown when direction data exists */}
      {stats.hasDirectionData && (
        <DirectionComparison approaching={stats.approaching} receding={stats.receding} limit={speedLimitMph} />
      )}

      {/* Histogram + compliance */}
      <div className="cols-hist" style={{ gap: 'var(--sp-4)' }}>
        <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', padding: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
            <p className="t-label" style={{ color: 'var(--steel-300)' }}>Speed Distribution</p>
            <p className="t-label" style={{ color: 'var(--steel-400)' }}>
              {stats.histogram.length ? `${stats.histogram[0].label}–${parseInt(stats.histogram[stats.histogram.length-1].label)+5} MPH range` : ''}
            </p>
          </div>
          {stats.histogram.length === 0 ? (
            <p className="t-label" style={{ color: 'var(--steel-400)', textAlign: 'center', padding: 'var(--sp-8) 0' }}>No data</p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
                {stats.histogram.map(bin => {
                  const color = bin.isOver ? 'var(--over-500)' : bin.isWarn ? 'var(--warn-500)' : 'var(--hivis-500)'
                  return (
                    <div key={bin.label} title={`${bin.label}–${parseInt(bin.label)+5} MPH: ${bin.count}`}
                      style={{ flex: 1, height: `${Math.max(2, bin.pct)}%`, background: color, borderRadius: '3px 3px 0 0', opacity: bin.count ? 1 : 0.2, minWidth: 4, cursor: 'default', transition: 'height 0.3s ease' }} />
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                {stats.histogram.map(bin => (
                  <div key={bin.label} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--steel-400)', minWidth: 4 }}>{bin.label}</div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <p className="t-label" style={{ color: 'var(--steel-300)' }}>Compliance</p>
          {[
            { label: 'Within limit', count: stats.total - stats.overCount, color: 'var(--ok-500)' },
            { label: 'Over limit',   count: stats.overCount,               color: 'var(--over-500)' },
          ].map(row => {
            const pct = stats.total ? Math.round((row.count / stats.total) * 100) : 0
            return (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="t-label" style={{ color: 'var(--steel-300)' }}>{row.label}</span>
                  <span className="t-data" style={{ color: row.color, fontSize: 13 }}>{pct}%</span>
                </div>
                <div style={{ background: 'var(--asphalt-900)', borderRadius: 'var(--r-xs)', height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: row.color, borderRadius: 'var(--r-xs)', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-3)', borderTop: 'var(--bd-hair-dark)' }}>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4 }}>Speed limit</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 28, color: 'var(--led-amber)', lineHeight: 1 }}>
              {speedLimitMph}
              <span style={{ fontSize: 12, marginLeft: 4 }}>MPH</span>
            </p>
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', padding: 'var(--sp-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
          <p className="t-label" style={{ color: 'var(--steel-300)' }}>Speed Over Time</p>
          <p className="t-label" style={{ color: 'var(--steel-400)' }}>Last {stats.trend.length} readings</p>
        </div>
        <TrendChart trend={stats.trend} limit={speedLimitMph} />
        <div style={{ display: 'flex', gap: 'var(--sp-6)', marginTop: 'var(--sp-3)' }}>
          {[
            { color: 'var(--ok-500)',   label: 'Within limit' },
            { color: 'var(--warn-500)', label: 'Approaching limit' },
            { color: 'var(--over-500)', label: 'Over limit' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span className="t-label" style={{ color: 'var(--steel-400)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent passes */}
      <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--bd-dark)' }}>
          <p className="t-label" style={{ color: 'var(--steel-300)' }}>Recent Passes</p>
          <p className="t-label" style={{ color: 'var(--steel-400)' }}>Latest {stats.recent.length}</p>
        </div>
        {stats.recent.length === 0 ? (
          <p className="t-label" style={{ color: 'var(--steel-400)', padding: 'var(--sp-8)', textAlign: 'center' }}>No readings recorded yet</p>
        ) : (
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: 'var(--bd-hair-dark)' }}>
                  {['Time', 'Speed', 'vs Limit', 'Direction'].map(h => (
                    <th key={h} style={{ padding: 'var(--sp-3) var(--sp-4)', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--steel-400)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r, i) => {
                  const over = r.speed_mph > speedLimitMph
                  const warn = r.speed_mph > speedLimitMph * 0.9
                  const color = over ? 'var(--over-500)' : warn ? 'var(--warn-500)' : 'var(--ok-500)'
                  const diff = r.speed_mph - speedLimitMph
                  return (
                    <tr key={i} style={{ borderBottom: 'var(--bd-hair-dark)' }}>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--steel-300)' }}>
                        {new Date(r.recorded_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color, fontFamily: 'var(--font-led)', fontSize: 16 }}>
                        {r.speed_mph} MPH
                      </td>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color }}>
                        {diff > 0 ? `+${diff}` : diff === 0 ? '0' : diff}
                      </td>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--steel-400)' }}>
                        {r.direction === 1 ? 'Inbound' : r.direction === -1 ? 'Outbound' : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
