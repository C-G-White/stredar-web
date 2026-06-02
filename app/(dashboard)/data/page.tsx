import type { Metadata } from 'next'
import { Suspense } from 'react'
import SiteGrid from '@/components/dashboard/SiteGrid'

export const metadata: Metadata = { title: 'Live Data' }
export const dynamic = 'force-dynamic'

export default function DataPage() {
  return (
    <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
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
