import sql from '@/lib/db'
import type { SiteSummary } from '@/lib/types'
import Link from 'next/link'

async function getSites(): Promise<SiteSummary[]> {
  const rows = await sql`
    SELECT
      s.id, s.name, s.description, s.address, s.lat, s.lng,
      s.speed_limit_mph, s.active, s.created_at,
      COUNT(r.id)::int          AS reading_count,
      ROUND(AVG(r.speed_mph))::int AS avg_speed_mph,
      MAX(r.recorded_at)        AS last_reading_at
    FROM sites s
    LEFT JOIN readings r ON r.site_id = s.id
    WHERE s.active = true
    GROUP BY s.id
    ORDER BY s.name
  `
  return rows as SiteSummary[]
}

function speedColor(avg: number | null, limit: number) {
  if (avg == null) return 'var(--steel-300)'
  if (avg > limit) return 'var(--over-500)'
  if (avg > limit * 0.9) return 'var(--warn-500)'
  return 'var(--ok-500)'
}

export default async function SiteGrid() {
  const sites = await getSites()

  if (sites.length === 0) {
    return (
      <p className="t-body" style={{ color: 'var(--steel-300)', padding: 'var(--sp-10) 0' }}>
        No active sites yet. Sites appear here once a unit has been deployed and connected.
      </p>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
      {sites.map(site => {
        const color = speedColor(site.avg_speed_mph, site.speed_limit_mph)
        return (
          <Link
            key={site.id}
            href={`/data/${site.id}`}
            style={{ display: 'block', background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderLeft: `var(--bd-accent)`, borderRadius: 'var(--r-md)', padding: 'var(--sp-6)', textDecoration: 'none', transition: 'background var(--dur) var(--ease-out)' }}
          >
            <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-2)' }}>
              {site.address}
            </p>
            <p className="t-h3" style={{ color: 'var(--white)', marginBottom: 'var(--sp-4)', textTransform: 'uppercase' }}>
              {site.name}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-led)', fontSize: 48, color, lineHeight: 1 }}>
                  {site.avg_speed_mph ?? '--'}
                </span>
                <span className="t-label" style={{ color: 'var(--steel-300)', marginLeft: 'var(--sp-2)' }}>
                  MPH AVG
                </span>
              </div>
              <span className="t-data" style={{ color: 'var(--steel-300)', fontSize: 13 }}>
                {site.speed_limit_mph} limit
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
