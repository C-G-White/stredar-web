'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

type Reading = {
  speed_mph: number
  direction: number | null
  recorded_at: string
  entry_speed_mph?: number | null
  exit_speed_mph?: number | null
}

type DirectionStats = {
  count: number
  max: number | null
  p85: number | null
  overPct: number | null
}

type DisplayEffect = {
  count: number
  avgEntry: number | null
  avgExit: number | null
  avgDelta: number | null
  alreadyCompliantCount: number
  alreadyCompliantPct: number
  respondedCount: number
  respondedPct: number
  stillOverCount: number
  stillOverPct: number
}

type Stats = {
  total: number
  maxSpeed: number | null
  p85: number | null
  overCount: number
  overPct: number | null
  histogram: HistBin[]
  trend: TrendPoint[]
  recent: Reading[]
  approaching: DirectionStats
  receding: DirectionStats
  hasDirectionData: boolean
  displayEffect: DisplayEffect | null
}

type HistBin = {
  label: string
  count: number
  pct: number
  isOver: boolean
  isWarn: boolean
}

type TrendPoint = {
  speed: number
  recorded_at: string
  isOver: boolean
  isWarn: boolean
}

const POLL_INTERVAL = 10_000

function avg(ns: number[]): number | null {
  return ns.length ? Math.round(ns.reduce((a, b) => a + b, 0) / ns.length) : null
}

function dirStats(subset: Reading[], limit: number): DirectionStats {
  if (!subset.length) return { count: 0, max: null, p85: null, overPct: null }
  const speeds = subset.map(r => r.speed_mph)
  const sorted = [...speeds].sort((a, b) => a - b)
  return {
    count:   subset.length,
    max:     Math.max(...speeds),
    p85:     sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.85))],
    overPct: Math.round((speeds.filter(s => s > limit).length / speeds.length) * 100),
  }
}

function compute(readings: Reading[], limit: number): Stats {
  const empty: Stats = {
    total: 0, maxSpeed: null, p85: null, overCount: 0, overPct: null,
    histogram: [], trend: [], recent: [],
    approaching: { count: 0, max: null, p85: null, overPct: null },
    receding:    { count: 0, max: null, p85: null, overPct: null },
    hasDirectionData: false, displayEffect: null,
  }
  if (!readings.length) return empty

  const speeds = readings.map(r => r.speed_mph)
  const sorted = [...speeds].sort((a, b) => a - b)
  const total = readings.length
  const maxSpeed = Math.max(...speeds)
  const p85 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.85))]
  const overCount = speeds.filter(s => s > limit).length
  const overPct = Math.round((overCount / total) * 100)

  const minBin = Math.floor(Math.min(...speeds) / 5) * 5
  const maxBin = Math.ceil(Math.max(...speeds) / 5) * 5
  const rawBins: HistBin[] = []
  for (let b = minBin; b < maxBin; b += 5) {
    const count = speeds.filter(s => s >= b && s < b + 5).length
    rawBins.push({ label: String(b), count, pct: 0, isOver: b >= limit, isWarn: b >= limit * 0.9 && b < limit })
  }
  const maxCount = Math.max(...rawBins.map(b => b.count), 1)
  const histogram = rawBins.map(b => ({ ...b, pct: Math.round((b.count / maxCount) * 100) }))

  const trend = [...readings]
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .slice(-60)
    .map(r => ({
      speed: r.speed_mph,
      recorded_at: r.recorded_at,
      isOver: r.speed_mph > limit,
      isWarn: r.speed_mph > limit * 0.9 && r.speed_mph <= limit,
    }))

  const recent = [...readings]
    .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
    .slice(0, 25)

  const hasDirectionData = readings.some(r => r.direction !== null)
  const approaching = dirStats(readings.filter(r => r.direction === 1),  limit)
  const receding    = dirStats(readings.filter(r => r.direction === -1), limit)

  // Display effectiveness — inbound passes with entry/exit speed data
  const displayInbound = readings.filter(r => r.entry_speed_mph != null && r.direction === 1)
  let displayEffect: DisplayEffect | null = null
  if (displayInbound.length > 0) {
    const withExit = displayInbound.filter(r => r.exit_speed_mph != null)
    const avgEntry = avg(displayInbound.map(r => r.entry_speed_mph!))
    const avgExit  = avg(withExit.map(r => r.exit_speed_mph!))
    const avgDelta = avgEntry != null && avgExit != null ? avgEntry - avgExit : null

    const n            = displayInbound.length
    const alreadyOk    = displayInbound.filter(r => r.entry_speed_mph! <= limit)
    const responded    = displayInbound.filter(r => r.entry_speed_mph! > limit && r.exit_speed_mph != null && r.exit_speed_mph <= limit)
    const stillOver    = displayInbound.filter(r => r.entry_speed_mph! > limit && (r.exit_speed_mph == null || r.exit_speed_mph > limit))

    displayEffect = {
      count: n,
      avgEntry,
      avgExit,
      avgDelta,
      alreadyCompliantCount: alreadyOk.length,
      alreadyCompliantPct:   Math.round(alreadyOk.length / n * 100),
      respondedCount:        responded.length,
      respondedPct:          Math.round(responded.length / n * 100),
      stillOverCount:        stillOver.length,
      stillOverPct:          Math.round(stillOver.length / n * 100),
    }
  }

  return { total, maxSpeed, p85, overCount, overPct, histogram, trend, recent,
           approaching, receding, hasDirectionData, displayEffect }
}

function DisplayEffectPanel({ effect, limit }: { effect: DisplayEffect; limit: number }) {
  const cols = [
    { label: 'Already Compliant', sub: `Under ${limit} MPH on approach`, count: effect.alreadyCompliantCount, pct: effect.alreadyCompliantPct, color: 'var(--ok-500)', border: 'var(--ok-500)' },
    { label: 'Slowed to Comply',  sub: 'Display caused speed reduction', count: effect.respondedCount,        pct: effect.respondedPct,        color: 'var(--hivis-500)', border: 'none' },
    { label: 'Still Over Limit',  sub: 'Did not respond to display',     count: effect.stillOverCount,        pct: effect.stillOverPct,        color: 'var(--over-500)', border: 'none' },
  ]

  return (
    <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--bd-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)' }}>Display Effectiveness</p>
        <p className="t-label" style={{ color: 'var(--steel-400)' }}>{effect.count} inbound passes · display mode</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        {cols.map((col, i) => (
          <div key={col.label} style={{
            padding: 'var(--sp-5)',
            borderLeft: i === 0 ? `3px solid ${col.border !== 'none' ? col.border : 'transparent'}` : 'none',
            borderRight: i < 2 ? 'var(--bd-hair-dark)' : 'none',
          }}>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 6 }}>{col.label}</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 32, color: col.color, lineHeight: 1 }}>{col.count}</p>
            <p className="t-label" style={{ color: col.color, marginTop: 4 }}>{col.pct}%</p>
            <p className="t-label" style={{ color: 'var(--steel-500)', fontSize: 10, marginTop: 8 }}>{col.sub}</p>
          </div>
        ))}
      </div>

      {effect.avgEntry != null && (
        <div style={{ padding: 'var(--sp-3) var(--sp-5)', borderTop: 'var(--bd-dark)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <span className="t-label" style={{ color: 'var(--steel-400)' }}>Avg approach speed:</span>
          <span style={{ fontFamily: 'var(--font-led)', fontSize: 18, color: 'var(--steel-200)' }}>{effect.avgEntry} MPH</span>
          {effect.avgExit != null && (
            <>
              <span className="t-label" style={{ color: 'var(--steel-500)' }}>›</span>
              <span style={{ fontFamily: 'var(--font-led)', fontSize: 18, color: 'var(--steel-200)' }}>{effect.avgExit} MPH on exit</span>
              {effect.avgDelta != null && effect.avgDelta !== 0 && (
                <span className="t-label" style={{ color: effect.avgDelta > 0 ? 'var(--ok-500)' : 'var(--over-500)' }}>
                  ({effect.avgDelta > 0 ? `−${effect.avgDelta}` : `+${Math.abs(effect.avgDelta)}`} MPH avg)
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function DirectionBreakdown({ approaching, receding, limit }: {
  approaching: DirectionStats; receding: DirectionStats; limit: number
}) {
  const cols: { key: keyof DirectionStats; label: string; unit: string }[] = [
    { key: 'count',   label: 'Vehicles',   unit: ''    },
    { key: 'max',     label: 'Max Speed',  unit: 'MPH' },
    { key: 'p85',     label: '85th Pct.',  unit: 'MPH' },
    { key: 'overPct', label: 'Over Limit', unit: '%'   },
  ]

  function statColor(key: keyof DirectionStats, val: number | null) {
    if (val == null || key === 'count') return 'var(--steel-200)'
    if (key === 'max' || key === 'p85') return val > limit ? 'var(--over-500)' : 'var(--ok-500)'
    if (key === 'overPct') return val > 15 ? 'var(--over-500)' : val > 5 ? 'var(--warn-500)' : 'var(--ok-500)'
    return 'var(--steel-200)'
  }

  const side = (stats: DirectionStats, label: string) => (
    <div style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-1)' }}>{label}</p>
      {cols.map(col => {
        const val = stats[col.key] as number | null
        return (
          <div key={col.key}>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>{col.label}</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 28, color: statColor(col.key, val), lineHeight: 1 }}>
              {val ?? '—'}{col.unit ? <span style={{ fontSize: 11, marginLeft: 3 }}>{col.unit}</span> : null}
            </p>
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--bd-dark)' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)' }}>By Direction</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderRight: 'var(--bd-hair-dark)' }}>
          {side(approaching, 'Inbound ›')}
        </div>
        {side(receding, '‹ Outbound')}
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
      {limitY > PAD.top && limitY < H - PAD.bottom && (
        <>
          <line x1={0} y1={limitY} x2={W} y2={limitY} stroke="rgba(240,70,60,.4)" strokeWidth={1} strokeDasharray="6 4" />
          <text x={W - PAD.right} y={limitY - 3} fill="rgba(240,70,60,.6)" fontSize={10} textAnchor="end"
            style={{ fontFamily: 'var(--font-mono)' }}>{limit} MPH LIMIT</text>
        </>
      )}
      <polyline points={points} fill="none" stroke="rgba(255,134,66,.7)" strokeWidth={1.5} />
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
    { label: 'Max Speed',     value: stats.maxSpeed != null ? `${stats.maxSpeed}` : '—', sub: 'MPH', color: stats.maxSpeed != null && stats.maxSpeed > speedLimitMph ? 'var(--over-500)' : 'var(--white)' },
    { label: '85th Pct.',     value: stats.p85 != null ? `${stats.p85}` : '—', sub: 'MPH · compliance indicator', color: stats.p85 != null && stats.p85 > speedLimitMph ? 'var(--over-500)' : 'var(--white)' },
    { label: 'Over Limit',    value: stats.overPct != null ? `${stats.overPct}%` : '—', sub: `${stats.overCount.toLocaleString()} passes`, color: (stats.overPct ?? 0) > 15 ? 'var(--over-500)' : (stats.overPct ?? 0) > 5 ? 'var(--warn-500)' : 'var(--ok-500)' },
  ]

  // For the recent passes table, show display readings when available
  const displayReads = stats.recent.filter(r => r.entry_speed_mph != null)
  const tableReadings = displayReads.length > 0 ? displayReads : stats.recent
  const isDisplayTable = displayReads.length > 0

  // Compliance rows differ by mode
  const complianceRows = stats.displayEffect ? [
    { label: 'Already compliant', count: stats.displayEffect.alreadyCompliantCount, total: stats.displayEffect.count, color: 'var(--ok-500)' },
    { label: 'Slowed to comply',  count: stats.displayEffect.respondedCount,        total: stats.displayEffect.count, color: 'var(--hivis-500)' },
    { label: 'Still over limit',  count: stats.displayEffect.stillOverCount,        total: stats.displayEffect.count, color: 'var(--over-500)' },
  ] : [
    { label: 'Within limit', count: stats.total - stats.overCount, total: stats.total, color: 'var(--ok-500)' },
    { label: 'Over limit',   count: stats.overCount,               total: stats.total, color: 'var(--over-500)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ok-500)', boxShadow: '0 0 6px rgba(25,195,125,.7)', display: 'inline-block', flexShrink: 0 }} />
        <span className="t-label" style={{ color: 'var(--steel-300)' }}>
          Updated {secondsAgo < 5 ? 'just now' : `${secondsAgo}s ago`} · refreshes every 10s
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

      {/* Display effectiveness panel (display mode) — or direction comparison (old data fallback) */}
      {stats.displayEffect ? (
        <DisplayEffectPanel effect={stats.displayEffect} limit={speedLimitMph} />
      ) : stats.hasDirectionData ? (
        <DirectionBreakdown approaching={stats.approaching} receding={stats.receding} limit={speedLimitMph} />
      ) : null}

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
          {complianceRows.map(row => {
            const pct = row.total ? Math.round((row.count / row.total) * 100) : 0
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
          <p className="t-label" style={{ color: 'var(--steel-400)' }}>
            {isDisplayTable ? `Latest ${tableReadings.length} · inbound display` : `Latest ${tableReadings.length}`}
          </p>
        </div>
        {tableReadings.length === 0 ? (
          <p className="t-label" style={{ color: 'var(--steel-400)', padding: 'var(--sp-8)', textAlign: 'center' }}>No readings recorded yet</p>
        ) : (
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: 'var(--bd-hair-dark)' }}>
                  {(isDisplayTable
                    ? ['Time', 'Approach', 'On Exit', 'Change']
                    : ['Time', 'Speed', 'vs Limit', 'Direction']
                  ).map(h => (
                    <th key={h} style={{ padding: 'var(--sp-3) var(--sp-4)', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--steel-400)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableReadings.map((r, i) => {
                  const time = new Date(r.recorded_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

                  if (isDisplayTable && r.entry_speed_mph != null) {
                    const entry = r.entry_speed_mph
                    const exit  = r.exit_speed_mph ?? null
                    const delta = exit != null ? entry - exit : null
                    const entryOver = entry > speedLimitMph
                    const exitOver  = exit != null && exit > speedLimitMph
                    const entryColor = entryOver ? 'var(--over-500)' : 'var(--ok-500)'
                    const exitColor  = exit == null ? 'var(--steel-400)' : exitOver ? 'var(--over-500)' : 'var(--ok-500)'
                    const deltaColor = delta == null ? 'var(--steel-400)' : delta > 0 ? 'var(--ok-500)' : 'var(--over-500)'

                    return (
                      <tr key={i} style={{ borderBottom: 'var(--bd-hair-dark)' }}>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--steel-300)' }}>{time}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: entryColor, fontFamily: 'var(--font-led)', fontSize: 16 }}>{entry} MPH</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: exitColor, fontFamily: 'var(--font-led)', fontSize: 16 }}>{exit != null ? `${exit} MPH` : '—'}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: deltaColor }}>
                          {delta == null ? '—' : delta > 0 ? `−${delta}` : delta === 0 ? '0' : `+${Math.abs(delta)}`}
                        </td>
                      </tr>
                    )
                  }

                  // Monitor mode / outbound
                  const over  = r.speed_mph > speedLimitMph
                  const warn  = r.speed_mph > speedLimitMph * 0.9
                  const color = over ? 'var(--over-500)' : warn ? 'var(--warn-500)' : 'var(--ok-500)'
                  const diff  = r.speed_mph - speedLimitMph
                  return (
                    <tr key={i} style={{ borderBottom: 'var(--bd-hair-dark)' }}>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--steel-300)' }}>{time}</td>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color, fontFamily: 'var(--font-led)', fontSize: 16 }}>{r.speed_mph} MPH</td>
                      <td style={{ padding: 'var(--sp-3) var(--sp-4)', color }}>{diff > 0 ? `+${diff}` : diff === 0 ? '0' : diff}</td>
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
