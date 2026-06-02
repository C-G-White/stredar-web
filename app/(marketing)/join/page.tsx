import type { Metadata } from 'next'
import JoinForm from './JoinForm'

export const metadata: Metadata = { title: 'Join the Scheme' }

const steps = [
  {
    n: '01',
    heading: 'Submit an enquiry',
    body: "Tell us about your community and the road safety concern you want to address. We'll review your submission and get back to you.",
  },
  {
    n: '02',
    heading: 'We assess your site',
    body: "We'll discuss your location, the road type, and local authority context. Some sites are more straightforward to deploy than others.",
  },
  {
    n: '03',
    heading: 'Deploy and collect data',
    body: "We'll guide you through siting the unit and getting it connected. Your anonymised speed data feeds the national platform from day one.",
  },
]

export default function JoinPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6) var(--sp-16)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>Get Involved</p>
          <h1 className="t-display-2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
            Join the Scheme
          </h1>
          <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 560 }}>
            Stredar is at the pilot stage. We're looking for community groups, parish councils,
            and residents' associations who want to be among the first to deploy a unit.
            Start with an enquiry — no commitment required.
          </p>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-12) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-6)' }}>What Happens Next</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {steps.map((step, i) => (
              <div key={step.n} style={{ borderLeft: i === 0 ? 'var(--bd-accent)' : 'var(--bd-dark)', padding: 'var(--sp-5) var(--sp-5) var(--sp-5) var(--sp-5)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--hivis-500)', letterSpacing: '0.1em', marginBottom: 'var(--sp-3)' }}>
                  {step.n}
                </p>
                <h3 className="t-h4" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>
                  {step.heading}
                </h3>
                <p className="t-body-sm" style={{ color: 'var(--steel-200)' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-16)', alignItems: 'start' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>Initial Enquiry</p>
            <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-8)' }}>
              Tell Us About Your Road
            </h2>
            <JoinForm />
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)', position: 'sticky', top: 80 }}>
            <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderTop: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)', boxShadow: 'var(--sh-1)' }}>
              <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>What You Need</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {[
                  "A specific road you're concerned about",
                  'A community group or responsible body to receive the unit',
                  'A suitable siting location (existing post or verge)',
                  'Basic willingness to engage with your local authority',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 'var(--sp-3)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--hivis-500)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)', boxShadow: 'var(--sh-1)' }}>
              <p className="t-label" style={{ color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>No commitment</p>
              <p className="t-body-sm" style={{ color: 'var(--ink-2)' }}>
                This is an initial enquiry only. There's no obligation and no cost at this stage.
                We'll discuss fit and feasibility before anything moves forward.
              </p>
            </div>

            <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)', boxShadow: 'var(--sh-1)' }}>
              <p className="t-label" style={{ color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>Prefer email?</p>
              <p className="t-body-sm" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-2)' }}>
                Write to us directly at:
              </p>
              <a href="mailto:join@stredar.uk" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--hivis-600)', textDecoration: 'none', fontWeight: 600 }}>
                join@stredar.uk
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
