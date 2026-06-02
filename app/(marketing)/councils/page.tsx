import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'For Councils' }

export default function CouncilsPage() {
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6)' }}>
      <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>Local Authorities</p>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-8)', textTransform: 'uppercase' }}>For Councils</h1>
      <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 640 }}>Content coming soon.</p>
    </section>
  )
}
