import type { Metadata } from 'next'
import Link from 'next/link'
import CouncilsForm from './CouncilsForm'

export const metadata: Metadata = { title: 'For Councils' }

const proposition = [
  {
    heading: 'No capital cost',
    body: 'The community funds, installs, and maintains the unit. The council bears no capital expenditure, no maintenance liability, and no procurement obligation.',
  },
  {
    heading: 'Granular speed data',
    body: 'Every active Stredar unit generates site-specific, timestamped speed data. That data is available to the local authority — free, openly published, and immediately usable as evidence.',
  },
  {
    heading: 'Complements existing tools',
    body: 'Stredar sits alongside your existing road safety toolkit. It does not replace Traffic Regulation Orders, VAS programmes, or engineering interventions — it builds the evidence base that justifies them.',
  },
]

const legal = [
  {
    label: 'Enforcement status',
    value: 'Not an enforcement device. No Home Office Type Approval required or held.',
  },
  {
    label: 'Personal data',
    value: 'No images captured. No vehicle identifiers stored. Speed, direction, and timestamp only.',
  },
  {
    label: 'GDPR position',
    value: 'No personal data collected. No data subject rights implications.',
  },
  {
    label: 'Liability',
    value: 'Unit is community-owned. The council\'s role is siting approval only, not operational responsibility.',
  },
  {
    label: 'Data ownership',
    value: 'All speed data is publicly published. Local authorities may use it freely for road safety purposes.',
  },
  {
    label: 'Planning',
    value: 'Comparable to existing SID deployments. Sited on existing highway furniture where possible.',
  },
]

const asks = [
  {
    tier: 'Minimum',
    heading: 'Siting Approval',
    body: 'Approval to site the unit on an identified length of highway. No ongoing commitment. No cost to the authority. This is the only ask required to get a unit deployed.',
    accent: 'var(--steel-500)',
  },
  {
    tier: 'Recommended',
    heading: 'Data Sharing Agreement',
    body: 'A simple agreement for the local authority to receive regular speed data reports from the site. Provides the council with usable evidence for road safety planning and consultation responses.',
    accent: 'var(--hivis-500)',
  },
  {
    tier: 'Partnership',
    heading: 'Formal Endorsement',
    body: 'For councils wishing to actively promote Stredar to community groups in their area, or to reference the scheme in road safety strategies and Local Transport Plans.',
    accent: 'var(--info-500)',
  },
]

export default function CouncilsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6) var(--sp-16)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>Local Authorities</p>
          <h1 className="t-display-2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)', maxWidth: 680 }}>
            Evidence-Led Road Safety at Community Cost
          </h1>
          <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 600 }}>
            Stredar gives local authorities access to granular, site-specific speed data —
            generated and funded entirely by the community. No procurement process.
            No capital commitment. No enforcement liability.
          </p>
        </div>
      </section>

      {/* ── Proposition ───────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Offer</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-10)' }}>
            What the Council Gets
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)' }}>
            {proposition.map((item, i) => (
              <div key={item.heading} style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderTop: i === 1 ? 'var(--bd-accent)' : 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)' }}>
                <h3 className="t-h3" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
                  {item.heading}
                </h3>
                <p className="t-body" style={{ color: 'var(--steel-200)' }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we ask ───────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Levels of Engagement</p>
          <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
            What We Ask of the Council
          </h2>
          <p className="t-body" style={{ color: 'var(--ink-2)', maxWidth: 560, marginBottom: 'var(--sp-10)' }}>
            Councils can engage at whatever level suits their current position. The minimum ask
            is siting approval only — everything else is optional.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)' }}>
            {asks.map(ask => (
              <div key={ask.tier} style={{ background: 'var(--white)', border: 'var(--bd-light)', borderTop: `3px solid ${ask.accent}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)', boxShadow: 'var(--sh-1)', display: 'flex', flexDirection: 'column' }}>
                <p className="t-label" style={{ color: ask.accent === 'var(--steel-500)' ? 'var(--ink-3)' : ask.accent === 'var(--hivis-500)' ? 'var(--hivis-500)' : 'var(--info-500)', marginBottom: 'var(--sp-3)' }}>
                  {ask.tier}
                </p>
                <h3 className="t-h3" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
                  {ask.heading}
                </h3>
                <p className="t-body" style={{ color: 'var(--ink-2)', flex: 1 }}>
                  {ask.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legal & regulatory ────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-800)', borderBottom: '1px solid var(--steel-500)' }}>
        <div className="cols-2" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', gap: 'var(--sp-16)', alignItems: 'start' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Legal & Regulatory</p>
            <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
              Common Questions Answered
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--steel-100)', marginBottom: 'var(--sp-5)' }}>
              Stredar is a Speed Indicator Device — a driver education tool, not an enforcement camera.
              The legal position is straightforward and well-established.
            </p>
            <p className="t-body" style={{ color: 'var(--steel-200)' }}>
              No images are captured, no vehicle identifiers are stored, and the system has no
              connection to police enforcement or the DVLA. The data collected is anonymised
              speed statistics — the same category of data generated by existing council-approved SID deployments.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
            {legal.map((row, i) => (
              <div key={row.label} style={{ borderBottom: 'var(--bd-hair-dark)', padding: 'var(--sp-4) 0' }}>
                <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 'var(--sp-2)' }}>{row.label}</p>
                <p className="t-body-sm" style={{ color: 'var(--steel-100)' }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The pilot ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <div className="cols-2" style={{ gap: 'var(--sp-16)', alignItems: 'start' }}>
            <div>
              <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Pilot</p>
              <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
                Norfolk County Council
              </h2>
              <p className="t-body-lg" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-5)' }}>
                The first Stredar pilot unit is planned for Station Road, Holme Hale, Norfolk —
                a rural road where community concern about vehicle speeds is well documented.
              </p>
              <p className="t-body" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-5)' }}>
                Norfolk County Council has been briefed at leader level. We are seeking formal
                approval in principle to site the unit, with field testing expected to begin
                later this year.
              </p>
              <p className="t-body" style={{ color: 'var(--ink-2)' }}>
                Data from the pilot will be published openly on this platform and made available
                to the county council for road safety analysis and evidence purposes.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                { label: 'Pilot authority',  value: 'Norfolk County Council' },
                { label: 'Pilot site',       value: 'Station Road, Holme Hale' },
                { label: 'Road type',        value: 'Rural classified road' },
                { label: 'Council status',   value: 'Briefed at leader level' },
                { label: 'Approval sought',  value: 'Formal approval in principle' },
                { label: 'Data handling',    value: 'Openly published · available to authority' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: 'var(--bd-light)', paddingBottom: 'var(--sp-3)' }}>
                  <span className="t-label" style={{ color: 'var(--ink-3)' }}>{row.label}</span>
                  <span className="t-data" style={{ color: 'var(--ink)', textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How data supports the council ─────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Practical Value</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-10)' }}>
            How the Data Supports Road Safety Work
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0 }}>
            {[
              { n: '01', heading: 'Prioritise interventions', body: 'Site-specific speed percentiles and compliance rates help officers triage which locations genuinely warrant engineering or enforcement intervention.' },
              { n: '02', heading: 'Respond to community concerns', body: 'When residents raise road safety concerns, the council can point to publicly available data rather than commissioning expensive one-off surveys.' },
              { n: '03', heading: 'Evidence for TROs and schemes', body: 'Speed data from Stredar units is directly usable as supporting evidence in Traffic Regulation Order consultations and road safety scheme applications.' },
              { n: '04', heading: 'Monitor behaviour change', body: 'Alternating Monitor and Display modes generate before/after data showing whether driver feedback is changing behaviour at a specific location.' },
            ].map((item, i) => (
              <div key={item.n} style={{ borderLeft: i === 0 ? 'var(--bd-accent)' : 'var(--bd-dark)', padding: 'var(--sp-6) var(--sp-6) var(--sp-6) var(--sp-5)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--hivis-500)', letterSpacing: '0.1em', marginBottom: 'var(--sp-3)' }}>{item.n}</p>
                <h3 className="t-h4" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>{item.heading}</h3>
                <p className="t-body-sm" style={{ color: 'var(--steel-200)' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)' }}>
        <div className="cols-2-1" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', gap: 'var(--sp-16)', alignItems: 'start' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Get in Touch</p>
            <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-5)' }}>
              Speak to Us About Your Area
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-8)' }}>
              Whether you want to understand the scheme, discuss a specific site, or explore
              a more formal partnership, we are happy to have a conversation at officer or
              member level.
            </p>
            <CouncilsForm />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', position: 'sticky', top: 80 }}>
            <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderTop: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)', boxShadow: 'var(--sh-1)' }}>
              <p className="t-label" style={{ color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>Prefer email?</p>
              <p className="t-body-sm" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-2)' }}>
                Write to us directly at:
              </p>
              <a href="mailto:councils@stredar.uk" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--hivis-600)', textDecoration: 'none', fontWeight: 600 }}>
                councils@stredar.uk
              </a>
            </div>
            <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)', boxShadow: 'var(--sh-1)' }}>
              <p className="t-label" style={{ color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>Community groups in your area</p>
              <p className="t-body-sm" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-3)' }}>
                If a community group wants to deploy a unit, they can enquire directly.
              </p>
              <Link href="/join" style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--hivis-600)', textDecoration: 'none' }}>
                Community enquiry form &rarr;
              </Link>
            </div>
            <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)', boxShadow: 'var(--sh-1)' }}>
              <p className="t-label" style={{ color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>National speed data</p>
              <p className="t-body-sm" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-3)' }}>
                All data from deployed units is publicly available.
              </p>
              <Link href="/data" style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--hivis-600)', textDecoration: 'none' }}>
                View live data &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
