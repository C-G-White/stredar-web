import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'How It Works' }

const specs = [
  { label: 'Radar module',       value: 'OmniPreSense OPS243-A' },
  { label: 'Frequency',          value: '24 GHz' },
  { label: 'Detection range',    value: 'Up to 100 m' },
  { label: 'Speed range',        value: '1 – 150 MPH' },
  { label: 'Logging',            value: 'Per-vehicle · GPS-tagged · timestamped' },
  { label: 'Enclosure',          value: 'IP66 · compact pole-mounted box' },
  { label: 'Power',              value: 'Solar · hidden LiFePO4 battery' },
  { label: 'Connectivity',       value: '4G LTE · automatic sync' },
  { label: 'Anti-theft',         value: 'GPS locate + tamper alert' },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6) var(--sp-16)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>The SC-2</p>
          <h1 className="t-display-2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
            How Stredar Works
          </h1>
          <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 620 }}>
            The Stredar SC-2 is a compact, covert speed monitoring unit. It mounts on a single
            pole, blends into the roadside, and silently logs every vehicle that passes —
            uploading anonymised speed data to the national platform automatically via 4G.
          </p>
        </div>
      </section>

      {/* ── What it does ──────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Silent Monitoring</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
            Continuous Data. Zero Intrusion.
          </h2>
          <p className="t-body" style={{ color: 'var(--steel-200)', maxWidth: 580, marginBottom: 'var(--sp-10)' }}>
            There is no sign, no display, and nothing to signal to drivers that data is being
            collected. The SC-2 records an uninfluenced baseline — the kind of honest evidence
            that councils and highway authorities actually act on.
          </p>
          <div className="cols-2" style={{ gap: 'var(--sp-4)' }}>
            <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)' }}>
              <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-4)' }}>What drivers see</p>
              <div style={{ background: 'var(--led-bg)', borderRadius: 'var(--r-md)', padding: 'var(--sp-8)', marginBottom: 'var(--sp-6)', textAlign: 'center', border: '1px solid var(--steel-600)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', color: '#2d343b', textTransform: 'uppercase' }}>
                  NOTHING
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--steel-500)', marginTop: 8 }}>
                  Small box · single pole · no markings
                </p>
              </div>
              <p className="t-body" style={{ color: 'var(--steel-200)' }}>
                The unit is a small weatherproof enclosure on an existing pole. No signs,
                no lights, no warning that speeds are being recorded. Drivers behave naturally.
              </p>
            </div>
            <div style={{ background: 'var(--asphalt-700)', border: '1px solid var(--hivis-600)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)' }}>
              <p className="t-label" style={{ color: 'var(--hivis-400)', marginBottom: 'var(--sp-4)' }}>What the platform records</p>
              <div style={{ background: 'var(--asphalt-900)', borderRadius: 'var(--r-md)', padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)', border: '1px solid var(--steel-500)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {[
                  { k: 'Speed',     v: '34 mph' },
                  { k: 'Timestamp', v: '08:42:17' },
                  { k: 'Site',      v: 'SC-2 / Station Rd' },
                ].map(r => (
                  <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--steel-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{r.k}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--hivis-400)' }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <p className="t-body" style={{ color: 'var(--steel-200)' }}>
                Every vehicle pass is logged with its speed, direction, and a GPS-tagged
                timestamp. No vehicle data — no images, no plates, no identity.
              </p>
            </div>
          </div>

          {/* Evidence bar */}
          <div style={{ marginTop: 'var(--sp-8)', background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderLeft: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)' }}>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Why this matters</p>
            <h3 className="t-h3" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>
              Real data beats resident petitions
            </h3>
            <p className="t-body-sm" style={{ color: 'var(--steel-300)', maxWidth: 680 }}>
              Local authorities regularly reject speed concerns as anecdotal. Months of continuous,
              GPS-tagged speed data from an independent device gives parish councils and residents
              associations the hard evidence needed to trigger a formal speed survey, a Traffic
              Regulation Order, or roadside engineering.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it measures speed ─────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div className="cols-2" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', gap: 'var(--sp-16)', alignItems: 'start' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Radar</p>
            <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
              How Speed is Measured
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-5)' }}>
              An OmniPreSense OPS243-A Doppler radar module transmits a continuous 24 GHz signal.
              When a vehicle passes, the reflected signal shifts in frequency — the Doppler effect.
              The module calculates speed directly from that frequency shift.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-5)' }}>
              There is no camera. No image is captured. The radar returns only a speed value and
              a direction — approaching or receding. Nothing in the data can identify a vehicle,
              a driver, or a registration plate.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)' }}>
              Detection range is up to 100 metres, allowing the unit to capture speeds accurately
              before vehicles reach the monitoring point.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {[
              { label: 'Technology',       value: 'Continuous Wave Doppler' },
              { label: 'Frequency',        value: '24 GHz' },
              { label: 'Detection range',  value: 'Up to 100 m' },
              { label: 'Speed range',      value: '1 – 150 MPH' },
              { label: 'Output',           value: 'Speed + direction only' },
              { label: 'Vehicle identity', value: 'None — no camera, no ANPR' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: 'var(--bd-light)', paddingBottom: 'var(--sp-3)' }}>
                <span className="t-label" style={{ color: 'var(--ink-3)' }}>{row.label}</span>
                <span className="t-data" style={{ color: 'var(--ink)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data journey ──────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-800)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Data</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-10)' }}>
            From Radar to National Platform
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, position: 'relative' }}>
            {[
              { n: '01', heading: 'Vehicle passes',    body: 'The radar detects the vehicle and calculates its speed and direction of travel.' },
              { n: '02', heading: 'Reading is logged', body: 'Speed, direction, and a GPS-tagged timestamp are recorded. No vehicle data is retained.' },
              { n: '03', heading: 'Upload to platform', body: 'Readings are automatically uploaded via 4G to the Stredar platform.' },
              { n: '04', heading: 'Publicly visible',   body: 'Anonymised data appears on the national map. Anyone can see speed trends for any active site.' },
            ].map((step, i) => (
              <div key={step.n} style={{ borderLeft: i === 0 ? 'var(--bd-accent)' : 'var(--bd-dark)', padding: 'var(--sp-6) var(--sp-6) var(--sp-6) var(--sp-5)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--hivis-500)', letterSpacing: '0.1em', marginBottom: 'var(--sp-3)' }}>
                  {step.n}
                </p>
                <h3 className="t-h4" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>
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

      {/* ── Technical spec ────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-800)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>SC-2</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-8)' }}>
            Technical Specification
          </h2>
          <div className="cols-2" style={{ gap: 'var(--sp-10)' }}>
            {[specs.slice(0, 5), specs.slice(5)].map((half, i) => (
              <div key={i}>
                {half.map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: 'var(--bd-hair-dark)', padding: 'var(--sp-3) 0' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--steel-300)' }}>
                      {row.label}
                    </span>
                    <span className="t-data" style={{ color: 'var(--steel-100)', textAlign: 'right', maxWidth: '55%' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hardware illustration ─────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Unit</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>
            SC-2 on a Pole
          </h2>
          <p className="t-body" style={{ color: 'var(--steel-200)', marginBottom: 'var(--sp-10)' }}>
            A compact weatherproof enclosure mounts directly to any standard street furniture pole.
            The power supply is separate and out of sight. The unit itself contains only the radar
            module, 4G modem, and GPS receiver — no tripod, no visible cabling.
          </p>
          <div className="cols-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
            {/* SVG illustration */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 240 420" width="240" height="420" aria-label="SC-2 pole-mounted unit diagram">
                {/* Pole */}
                <rect x="113" y="0" width="14" height="420" fill="#3a4450" rx="3"/>

                {/* Main enclosure */}
                <rect x="86" y="60" width="68" height="100" fill="#2a3340" rx="6" stroke="#3d4f62" strokeWidth="1.5"/>
                {/* Hi-vis accent stripe */}
                <rect x="86" y="60" width="3" height="100" fill="var(--hivis-500)" rx="1"/>
                {/* Top ventilation slots */}
                <rect x="96" y="74" width="48" height="3" fill="#1a2430" rx="1"/>
                <rect x="96" y="81" width="48" height="3" fill="#1a2430" rx="1"/>
                {/* Plain front face — no camera aperture */}
                <rect x="96" y="94" width="48" height="36" fill="#1a2430" rx="2" stroke="#283040" strokeWidth="1"/>
                {/* Bottom ventilation slot */}
                <rect x="96" y="148" width="48" height="3" fill="#1a2430" rx="1"/>
                {/* SC-2 label */}
                <text x="120" y="158" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#4a6070" letterSpacing="2">SC-2</text>

                {/* Clamps to pole */}
                <rect x="108" y="68" width="24" height="10" fill="#3d4f62" rx="2"/>
                <rect x="108" y="138" width="24" height="10" fill="#3d4f62" rx="2"/>

                {/* Small 4G antenna nub */}
                <rect x="148" y="70" width="5" height="16" fill="#3d4f62" rx="2"/>
                <circle cx="150.5" cy="68" r="3" fill="#4a5a6a"/>

                {/* Ground indicator */}
                <line x1="60" y1="410" x2="180" y2="410" stroke="#2a3440" strokeWidth="2"/>

                {/* Enclosure label */}
                <line x1="158" y1="112" x2="172" y2="112" stroke="#4a5a6a" strokeWidth="1" strokeDasharray="3,2"/>
                <text x="174" y="107" fontFamily="monospace" fontSize="9" fill="#6a8090">Radar</text>
                <text x="174" y="119" fontFamily="monospace" fontSize="9" fill="#6a8090">4G · GPS</text>

                {/* Pole label */}
                <line x1="64" y1="300" x2="112" y2="300" stroke="#4a5a6a" strokeWidth="1" strokeDasharray="3,2"/>
                <text x="20" y="296" fontFamily="monospace" fontSize="9" fill="#6a8090">Existing</text>
                <text x="28" y="308" fontFamily="monospace" fontSize="9" fill="#6a8090">pole</text>
              </svg>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              {[
                { heading: 'Pole-mounted',      body: 'Attaches to any standard street furniture — lamp post, sign post, or dedicated stake. No groundworks.' },
                { heading: 'Compact',           body: 'Radar module, 4G modem, and GPS receiver in a single weatherproof enclosure. Power is supplied separately and out of sight — the unit itself is small and unobtrusive.' },
                { heading: 'Discreet by design',body: 'No warning signs, no illuminated panels. The unit is intentionally unobtrusive so collected data reflects normal behaviour.' },
                { heading: 'IP66 weatherproof', body: 'Sealed to IP66 — rain, dust, and road spray proof. No maintenance visits required between deployments.' },
              ].map(item => (
                <div key={item.heading} style={{ borderLeft: 'var(--bd-accent)', paddingLeft: 'var(--sp-5)' }}>
                  <p className="t-label" style={{ color: 'var(--steel-100)', marginBottom: 'var(--sp-2)' }}>{item.heading}</p>
                  <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Not enforcement ───────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <div style={{ maxWidth: 720, borderLeft: 'var(--bd-accent)', paddingLeft: 'var(--sp-6)' }}>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>
              Important
            </p>
            <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-5)' }}>
              Not an Enforcement Camera
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>
              Stredar is a speed monitoring device — a community data tool. It captures no
              images, stores no vehicle identifiers, and has no connection to police enforcement
              systems or the DVLA.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>
              Because Stredar does not produce evidence for enforcement purposes, it does not
              require Home Office Type Approval. Communities can deploy it without the legal
              and regulatory burden associated with speed cameras.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)' }}>
              The anonymised speed statistics it collects can be used as community-gathered
              evidence when making representations to local authorities about road safety
              improvements.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-8)' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Ready?</p>
            <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase' }}>
              Deploy Stredar in Your Community
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <Link
              href="/join"
              style={{ display: 'inline-block', background: 'var(--hivis-500)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 32px', borderRadius: 'var(--r-sm)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Join the Scheme
            </Link>
            <Link
              href="/data"
              style={{ display: 'inline-block', border: '1px solid var(--steel-400)', color: 'var(--steel-100)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 32px', borderRadius: 'var(--r-sm)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              View Live Data
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
