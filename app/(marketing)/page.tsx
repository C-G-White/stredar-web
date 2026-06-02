import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Stredar — Community Speed Data' }

const stats = [
  { value: '~£300', label: 'Unit cost', note: 'vs. £3,000–£8,000 for commercial SIDs' },
  { value: '100%', label: 'Anonymised', note: 'No registration plates. No personal data.' },
  { value: '0', label: 'Enforcement', note: 'Driver education only — no Home Office Type Approval required.' },
]

const steps = [
  {
    number: '01',
    heading: 'Speed is measured',
    body: 'A Doppler radar module detects approaching and receding vehicles and calculates speed in real time.',
  },
  {
    number: '02',
    heading: 'Drivers see their speed',
    body: 'The LED display shows the vehicle speed as it passes — immediate, visible feedback. No cameras. No prosecution.',
  },
  {
    number: '03',
    heading: 'Data feeds the national picture',
    body: 'Anonymised readings are uploaded automatically and appear on this platform, building a transparent record of road safety conditions across the UK.',
  },
]

const audiences = [
  {
    tag: 'Communities',
    heading: 'Put data behind your road safety concerns',
    body: 'A Stredar unit gives your community the evidence to back what residents already know. Affordable to deploy, simple to operate, and the data is yours.',
    cta: { label: 'Join the Scheme', href: '/join' },
  },
  {
    tag: 'Local Authorities',
    heading: 'Evidence-led road safety without the procurement burden',
    body: 'Stredar units generate the same anonymised speed data as expensive commercial SIDs — at a fraction of the cost. Designed to complement, not replace, your existing road safety toolkit.',
    cta: { label: 'For Councils', href: '/councils' },
  },
  {
    tag: 'General Public',
    heading: 'See the data from roads near you',
    body: 'Every active Stredar unit contributes to an open, public record. Browse the national map to see average speeds, compliance rates, and trends in your area.',
    cta: { label: 'View Live Data', href: '/data' },
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6) var(--sp-16)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>
            Community Speed Initiative
          </p>
          <h1 className="t-display-1" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-8)', textTransform: 'uppercase', maxWidth: 720 }}>
            Your Road.<br />Your Data.<br />Your Community.
          </h1>
          <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 560, marginBottom: 'var(--sp-10)' }}>
            Stredar is a low-cost, community-owned Speed Indicator Device. It measures vehicle speeds,
            gives drivers real-time feedback, and feeds anonymised data into a national picture of road
            safety across the UK.
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <Link
              href="/join"
              style={{ display: 'inline-block', background: 'var(--hivis-500)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 32px', borderRadius: 'var(--r-sm)', textDecoration: 'none' }}
            >
              Join the Scheme
            </Link>
            <Link
              href="/how-it-works"
              style={{ display: 'inline-block', border: 'var(--bd-dark)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 32px', borderRadius: 'var(--r-sm)', textDecoration: 'none' }}
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-12) var(--sp-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-8)' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ borderLeft: 'var(--bd-accent)', paddingLeft: 'var(--sp-5)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: 'var(--white)', lineHeight: 1, marginBottom: 'var(--sp-1)' }}>
                {stat.value}
              </p>
              <p className="t-label" style={{ color: 'var(--hivis-400)', marginBottom: 'var(--sp-2)' }}>
                {stat.label}
              </p>
              <p className="t-body-sm" style={{ color: 'var(--steel-200)' }}>
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Device</p>
          <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-12)' }}>
            How Stredar Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-6)' }}>
            {steps.map(step => (
              <div key={step.number} style={{ background: 'var(--white)', border: 'var(--bd-light)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)', boxShadow: 'var(--sh-1)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--hivis-500)', letterSpacing: '0.1em', marginBottom: 'var(--sp-4)' }}>
                  {step.number}
                </p>
                <h3 className="t-h3" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>
                  {step.heading}
                </h3>
                <p className="t-body" style={{ color: 'var(--ink-2)' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--sp-8)' }}>
            <Link
              href="/how-it-works"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--hivis-600)', textDecoration: 'none' }}
            >
              Full technical overview &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pilot status ─────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-800)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-16)', alignItems: 'center' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>
              Current Status
            </p>
            <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
              Pilot in Progress — Norfolk
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--steel-100)', marginBottom: 'var(--sp-6)' }}>
              The first Stredar unit is in development. We are seeking formal approval in principle
              from Norfolk County Council to site the pilot on Station Road, Holme Hale — a rural
              road where community concern about vehicle speeds is well documented.
            </p>
            <p className="t-body" style={{ color: 'var(--steel-200)' }}>
              Norfolk County Council has been briefed at leader level. Field testing is expected
              to begin later this year. The data from this pilot will inform the national rollout.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[
              { label: 'Pilot Site', value: 'Station Road, Holme Hale' },
              { label: 'County', value: 'Norfolk, England' },
              { label: 'Council Status', value: 'Briefed at leader level' },
              { label: 'Device Stage', value: 'Prototype / Development' },
              { label: 'Field Testing', value: 'Later this year' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: 'var(--bd-hair-dark)', paddingBottom: 'var(--sp-3)' }}>
                <span className="t-label" style={{ color: 'var(--steel-300)' }}>{item.label}</span>
                <span className="t-data" style={{ color: 'var(--white)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three audiences ──────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Get Involved</p>
          <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-12)' }}>
            Who Is Stredar For?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-6)' }}>
            {audiences.map(audience => (
              <div key={audience.tag} style={{ background: 'var(--white)', border: 'var(--bd-light)', borderTop: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)', boxShadow: 'var(--sh-1)', display: 'flex', flexDirection: 'column' }}>
                <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>
                  {audience.tag}
                </p>
                <h3 className="t-h3" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
                  {audience.heading}
                </h3>
                <p className="t-body" style={{ color: 'var(--ink-2)', flex: 1, marginBottom: 'var(--sp-6)' }}>
                  {audience.body}
                </p>
                <Link
                  href={audience.cta.href}
                  style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--hivis-600)', textDecoration: 'none' }}
                >
                  {audience.cta.label} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-8)' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>
              Ready to Deploy?
            </p>
            <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', maxWidth: 480 }}>
              Bring Stredar to Your Community
            </h2>
          </div>
          <Link
            href="/join"
            style={{ display: 'inline-block', background: 'var(--hivis-500)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '18px 40px', borderRadius: 'var(--r-sm)', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Join the Scheme
          </Link>
        </div>
      </section>
    </>
  )
}
