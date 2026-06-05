import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import sql from '@/lib/db'
import type { Site } from '@/lib/types'
import LiveAnalytics from '@/components/dashboard/LiveAnalytics'

type Props = { params: Promise<{ siteId: string }> }

async function getSite(id: string): Promise<(Site & { is_live: boolean; configured_limit: number }) | null> {
  const rows = await sql`
    SELECT s.*,
      COALESCE(dc.speed_limit_mph, s.speed_limit_mph) AS configured_limit,
      (t.recorded_at > now() - interval '90 seconds') AS is_live
    FROM sites s
    LEFT JOIN device_config dc ON dc.site_id = s.id
    LEFT JOIN LATERAL (
      SELECT recorded_at FROM telemetry WHERE site_id = s.id ORDER BY recorded_at DESC LIMIT 1
    ) t ON true
    WHERE s.id = ${id} AND s.active = true
    LIMIT 1
  `
  return (rows[0] as (Site & { is_live: boolean; configured_limit: number })) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteId } = await params
  const site = await getSite(siteId)
  return { title: site?.name ?? 'Site Data' }
}

export const dynamic = 'force-dynamic'

export default async function SitePage({ params }: Props) {
  const { siteId } = await params
  const site = await getSite(siteId)
  if (!site) notFound()

  return (
    <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      {!site.is_live && (
        <div style={{ background: 'var(--warn-tint)', border: '1px solid var(--warn-500)', borderRadius: 'var(--r-sm)', padding: 'var(--sp-3) var(--sp-5)', marginBottom: 'var(--sp-6)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <span className="t-label" style={{ color: 'var(--warn-500)', whiteSpace: 'nowrap' }}>Demo Data</span>
          <span className="t-body-sm" style={{ color: 'var(--steel-200)' }}>Illustrative data — not from a live deployment.</span>
        </div>
      )}

      <a href="/data" className="t-label" style={{ color: 'var(--steel-300)', textDecoration: 'none', display: 'block', marginBottom: 'var(--sp-6)' }}>
        &larr; All Sites
      </a>

      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-2)' }}>{site.address}</p>
        <h1 className="t-h1" style={{ color: 'var(--white)', textTransform: 'uppercase' }}>{site.name}</h1>
      </div>

      <LiveAnalytics siteId={siteId} speedLimitMph={site.configured_limit} />
    </div>
  )
}
