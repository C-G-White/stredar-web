import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'How It Works' }

export default function HowItWorksPage() {
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6)' }}>
      <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>The Device</p>
      <h1 className="t-h1" style={{ marginBottom: 'var(--sp-8)', textTransform: 'uppercase' }}>How It Works</h1>
      <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 640 }}>Content coming soon.</p>
    </section>
  )
}
