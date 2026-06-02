import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import sql from '@/lib/db'
import type { Site, Reading } from '@/lib/types'

type Props = { params: Promise<{ siteId: string }> }

async function getSite(id: string): Promise<Site | null> {
  const rows = await sql`SELECT * FROM sites WHERE id = ${id} AND active = true LIMIT 1`
  return (rows[0] as Site) ?? null
}

async function getRecentReadings(siteId: string): Promise<Reading[]> {
  const rows = await sql`
    SELECT id, site_id, speed_mph, direction, recorded_at, created_at
    FROM readings
    WHERE site_id = ${siteId}
    ORDER BY recorded_at DESC
    LIMIT 500
  `
  return rows as Reading[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params
  const site = await getSite(siteId)
  return { title: site?.name ?? 'Site Data' }
}

export const revalidate = 30

export default async function SitePage({ params }: Props) {
  const { siteId } = await params
  const [site, readings] = await Promise.all([getSite(siteId), getRecentReadings(siteId)])

  if (!site) notFound()

  const avg = readings.length
    ? Math.round(readings.reduce((s, r) => s + r.speed_mph, 0) / readings.length)
    : null
  const over = readings.filter(r => r.speed_mph > site.speed_limit_mph).length
  const overPct = readings.length ? Math.round((over / readings.length) * 100) : null

  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      <a href="/data" className="t-label" style={{ color: 'var(--steel-300)', textDecoration: 'none', display: 'block', marginBottom: 'var(--sp-6)' }}>
        &larr; All Sites
      </a>

      <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-2)' }}>{site.address}</p>
      <h1 className="t-h1" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-8)' }}>
        {site.name}
      </h1>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-10)' }}>
        {[
          { label: 'Speed Limit', value: `${site.speed_limit_mph}`, unit: 'MPH' },
          { label: 'Avg Speed', value: avg != null ? `${avg}` : '--', unit: 'MPH' },
          { label: 'Over Limit', value: overPct != null ? `${overPct}%` : '--', unit: 'OF PASSES' },
          { label: 'Readings', value: readings.length.toLocaleString(), unit: 'RECORDED' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderTop: 'var(--bd-accent)', borderRadius: 'var(--r-md)', padding: 'var(--sp-5)' }}>
            <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-2)' }}>{stat.label}</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 36, color: 'var(--led-amber)', lineHeight: 1 }}>{stat.value}</p>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginTop: 'var(--sp-1)' }}>{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Recent readings table */}
      {readings.length > 0 && (
        <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: 'var(--bd-dark)' }}>
                {['Speed', 'vs Limit', 'Time'].map(h => (
                  <th key={h} className="t-label" style={{ color: 'var(--steel-300)', padding: 'var(--sp-4) var(--sp-5)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {readings.slice(0, 50).map(r => {
                const over = r.speed_mph > site.speed_limit_mph
                const warn = r.speed_mph > site.speed_limit_mph * 0.9
                const color = over ? 'var(--over-500)' : warn ? 'var(--warn-500)' : 'var(--ok-500)'
                return (
                  <tr key={r.id} style={{ borderBottom: 'var(--bd-hair-dark)' }}>
                    <td className="t-data" style={{ padding: 'var(--sp-3) var(--sp-5)', color, fontFamily: 'var(--font-led)' }}>
                      {r.speed_mph} MPH
                    </td>
                    <td className="t-data" style={{ padding: 'var(--sp-3) var(--sp-5)', color }}>
                      {r.speed_mph > site.speed_limit_mph ? `+${r.speed_mph - site.speed_limit_mph}` : `-${site.speed_limit_mph - r.speed_mph}`}
                    </td>
                    <td className="t-data" style={{ padding: 'var(--sp-3) var(--sp-5)', color: 'var(--steel-200)' }}>
                      {new Date(r.recorded_at).toLocaleString('en-GB')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
