import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Stredar — Community Speed Data' }

export default function HomePage() {
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6)' }}>
      <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>
        Community Speed Initiative
      </p>
      <h1 className="t-display-1" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-8)', textTransform: 'uppercase' }}>
        Your Road.<br />Your Data.<br />Your Community.
      </h1>
      <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 600, marginBottom: 'var(--sp-10)' }}>
        Stredar is a low-cost, community-owned Speed Indicator Device that measures vehicle speeds,
        educates drivers in real time, and feeds anonymised data into a national picture of road
        safety across the UK.
      </p>
      <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
        <Link
          href="/join"
          style={{ display: 'inline-block', background: 'var(--hivis-500)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 28px', borderRadius: 'var(--r-sm)', textDecoration: 'none' }}
        >
          Join the Scheme
        </Link>
        <Link
          href="/data"
          style={{ display: 'inline-block', border: 'var(--bd-dark)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 28px', borderRadius: 'var(--r-sm)', textDecoration: 'none' }}
        >
          View Live Data
        </Link>
      </div>
    </section>
  )
}
