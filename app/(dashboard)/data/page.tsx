import type { Metadata } from 'next'
import { Suspense } from 'react'
import SiteGrid from '@/components/dashboard/SiteGrid'
import AutoRefresh from '@/components/AutoRefresh'
import sql from '@/lib/db'

export const metadata: Metadata = { title: 'Live Data' }
export const dynamic = 'force-dynamic'

async function hasLiveSites(): Promise<boolean> {
  const [row] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM telemetry
      WHERE recorded_at > now() - interval '90 seconds'
    ) AS live
  `
  return row.live as boolean
}

export default async function DataPage() {
  const live = await hasLiveSites()

  return (
    <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      <AutoRefresh />
      {live ? (
        <div style={{ background: 'var(--ok-tint)', border: '1px solid var(--ok-500)', borderRadius: 'var(--r-sm)', padding: 'var(--sp-3) var(--sp-5)', marginBottom: 'var(--sp-8)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <span className="t-label" style={{ color: 'var(--ok-500)', whiteSpace: 'nowrap' }}>Norfolk Pilot</span>
          <span className="t-body-sm" style={{ color: 'var(--steel-200)' }}>
            Live data from deployed units. Remaining sites show illustrative data ahead of wider rollout.
          </span>
        </div>
      ) : (
        <div style={{ background: 'var(--warn-tint)', border: '1px solid var(--warn-500)', borderRadius: 'var(--r-sm)', padding: 'var(--sp-3) var(--sp-5)', marginBottom: 'var(--sp-8)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <span className="t-label" style={{ color: 'var(--warn-500)', whiteSpace: 'nowrap' }}>Demo Data</span>
          <span className="t-body-sm" style={{ color: 'var(--steel-200)' }}>
            No units are online yet. This page shows illustrative data ahead of the Norfolk pilot launch.
          </span>
        </div>
      )}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-2)' }}>Live</p>
        <h1 className="t-h1" style={{ color: 'var(--white)', textTransform: 'uppercase' }}>
          National Speed Data
        </h1>
      </div>
      <Suspense fallback={<p className="t-body" style={{ color: 'var(--steel-300)' }}>Loading sites…</p>}>
        <SiteGrid />
      </Suspense>
    </div>
  )
}
