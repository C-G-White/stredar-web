import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'How It Works' }

const specs = [
  { label: 'Radar module',       value: 'OmniPreSense OPS243-A' },
  { label: 'Frequency',          value: '24 GHz' },
  { label: 'Detection range',    value: 'Up to 100 m' },
  { label: 'Speed range',        value: '1 – 150 MPH' },
  { label: 'Logging',            value: 'Per-vehicle · GPS-tagged · timestamped' },
  { label: 'Enclosure',          value: 'IP66 (weatherproof)' },
  { label: 'Power',              value: 'Solar · 30 W panel + LiFePO4 battery' },
  { label: 'Connectivity',       value: '4G LTE · automatic sync' },
  { label: 'Anti-theft',         value: 'GPS locate + tamper alert' },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-20) var(--sp-6) var(--sp-16)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-4)' }}>The SC-1</p>
          <h1 className="t-display-2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-6)' }}>
            How Stredar Works
          </h1>
          <p className="t-body-lg" style={{ color: 'var(--ink-2)', maxWidth: 620 }}>
            The Stredar SC-1 is a fully assembled, connected speed indicator unit. No contractor,
            no groundworks, and no enforcement camera — just real-time driver feedback and
            anonymised speed data feeding directly into the national platform.
          </p>
        </div>
      </section>

      {/* ── Two modes ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Operating Modes</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
            Two Modes, One Unit
          </h2>
          <p className="t-body" style={{ color: 'var(--steel-200)', maxWidth: 580, marginBottom: 'var(--sp-10)' }}>
            Alternate between a silent baseline week and an active feedback week.
            The difference between the two is hard evidence you can put in front of a council.
          </p>
          <div className="cols-2" style={{ gap: 'var(--sp-4)' }}>
            {/* Monitor mode */}
            <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)' }}>
              <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-4)' }}>Mode 01</p>
              <h3 className="t-h3" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
                Monitor
              </h3>
              <div style={{ background: 'var(--led-bg)', borderRadius: 'var(--r-md)', padding: 'var(--sp-8)', marginBottom: 'var(--sp-6)', textAlign: 'center', border: '1px solid var(--steel-500)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', color: '#2d343b', textTransform: 'uppercase' }}>
                  DISPLAY OFF
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--steel-400)', marginTop: 8 }}>
                  Silent · Recording
                </p>
              </div>
              <p className="t-body" style={{ color: 'var(--steel-200)' }}>
                The LED panel stays dark. The radar measures and logs every vehicle pass —
                speed, direction, and timestamp — without alerting drivers that data is being
                collected. This gives you an honest, uninfluenced baseline.
              </p>
            </div>
            {/* Display mode */}
            <div style={{ background: 'var(--asphalt-700)', border: '1px solid var(--hivis-600)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)' }}>
              <p className="t-label" style={{ color: 'var(--hivis-400)', marginBottom: 'var(--sp-4)' }}>Mode 02</p>
              <h3 className="t-h3" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
                Display
              </h3>
              <div style={{ background: 'var(--led-bg)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4) var(--sp-8)', marginBottom: 'var(--sp-6)', textAlign: 'center', border: '1px solid var(--steel-500)' }}>
                <p style={{ fontFamily: 'var(--font-led)', fontWeight: 900, fontSize: 72, color: 'var(--led-amber)', lineHeight: 1, textShadow: 'var(--led-glow-amber)' }}>
                  28
                </p>
                <p style={{ fontFamily: 'var(--font-led)', fontSize: 14, letterSpacing: '0.16em', color: 'var(--led-amber)', textTransform: 'uppercase', marginTop: 4 }}>
                  MPH
                </p>
              </div>
              <p className="t-body" style={{ color: 'var(--steel-200)' }}>
                The sign lights up with the measured speed. Amber for normal speeds,
                a red SLOW DOWN flash for drivers over the limit, and a green Thank You
                for anyone who eases off. Data logging continues throughout.
              </p>
            </div>
          </div>

          {/* Evidence bar */}
          <div className="cols-2" style={{ marginTop: 'var(--sp-8)', background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderLeft: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)', gap: 'var(--sp-10)', alignItems: 'center' }}>
            <div>
              <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Indicative Evidence</p>
              <h3 className="t-h3" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>
                19% Reduction in 85th-Percentile Speed
              </h3>
              <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>
                Based on comparable driver-feedback deployments. Monitor week establishes
                the real baseline; Display week measures the behavioural change.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                { label: 'Monitor week (baseline)', value: '36 mph', pct: 100, color: 'var(--over-500)' },
                { label: 'Display week (feedback active)', value: '29 mph', pct: 81, color: 'var(--ok-500)' },
              ].map(bar => (
                <div key={bar.label}>
                  <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-2)' }}>{bar.label}</p>
                  <div style={{ background: 'var(--asphalt-900)', borderRadius: 'var(--r-xs)', height: 36, position: 'relative', overflow: 'hidden', border: 'var(--bd-hair-dark)' }}>
                    <div style={{ width: `${bar.pct}%`, height: '100%', background: bar.color, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12 }}>
                      <span className="t-data" style={{ color: 'var(--white)', fontWeight: 600 }}>{bar.value}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="t-label" style={{ color: 'var(--ok-500)' }}>▼ 19% · 85th-percentile speed</p>
            </div>
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
              Detection range is up to 100 metres, giving the display enough time to show drivers
              their speed as they approach the sign rather than as they pass it.
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
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>SC-1</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-8)' }}>
            Technical Specification
          </h2>
          <div className="cols-2" style={{ gap: 'var(--sp-10)' }}>
            {[specs.slice(0, 5), specs.slice(5)].map((half, i) => (
              <div key={i}>
                {half.map((row, j) => (
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

      {/* ── Hardware mockup ──────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-900)', borderBottom: '1px solid var(--steel-500)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6) 0' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Unit</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>
            SR-1 on the Tripod
          </h2>
          <p className="t-body" style={{ color: 'var(--steel-200)', marginBottom: 'var(--sp-6)' }}>
            The free-standing deployment: sign head at eye line, tilt-adjustable solar panel below it, battery and charge controller on the weighted folding tripod.
          </p>
        </div>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <iframe
            src="/tripod-mockup.html"
            title="SR-1 Tripod Hardware Mockup"
            style={{ display: 'block', width: 1240, minWidth: 1240, height: 1380, border: 'none' }}
            scrolling="no"
          />
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
              Stredar is a Speed Indicator Device — a driver education tool. It captures no
              images, stores no vehicle identifiers, and has no connection to police enforcement
              systems or the DVLA.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>
              Because Stredar does not produce evidence for enforcement purposes, it does not
              require Home Office Type Approval. Communities can deploy it without the legal
              and regulatory burden associated with speed cameras.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)' }}>
              The data it collects — anonymised speed statistics — can however be used as
              community-gathered evidence when making representations to local authorities
              about road safety improvements.
            </p>
          </div>
        </div>
      </section>

      {/* ── Simulator callout ────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div className="cols-2" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', gap: 'var(--sp-16)', alignItems: 'center' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>Interactive Demo</p>
            <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-5)' }}>
              Try the SC-1 Simulator
            </h2>
            <p className="t-body-lg" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-5)' }}>
              See the unit working in real time. The simulator runs a live LED display, radar sweep,
              and traffic detection — switch between Monitor and Display modes, adjust the speed
              threshold, and watch the analytics build as vehicles pass.
            </p>
            <p className="t-body" style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-8)' }}>
              No install required. Runs entirely in your browser.
            </p>
            <a
              href="/simulator.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', background: 'var(--hivis-500)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '14px 32px', borderRadius: 'var(--r-sm)', textDecoration: 'none' }}
            >
              Launch Simulator
            </a>
          </div>
          <div style={{ background: 'var(--asphalt-900)', border: '1px solid var(--steel-500)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[
              { label: 'LED Display',       desc: 'Live speed feedback — amber, red SLOW DOWN, green Thank You' },
              { label: 'Radar Sweep',       desc: 'Animated 24 GHz Doppler visualisation with vehicle blips' },
              { label: 'Monitor Mode',      desc: 'Silent logging — no display, unbiased baseline data' },
              { label: 'Traffic Profiles',  desc: 'Normal, heavy, speeding, and quiet traffic scenarios' },
              { label: 'Live Analytics',    desc: 'Speed histogram, trend chart, 85th percentile, % over limit' },
              { label: 'Unit Status',       desc: 'Battery, solar input, GPS, 4G signal, temperature' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--hivis-500)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                <div>
                  <span className="t-label" style={{ color: 'var(--steel-100)', display: 'block', marginBottom: 2 }}>{item.label}</span>
                  <span className="t-body-sm" style={{ color: 'var(--steel-300)' }}>{item.desc}</span>
                </div>
              </div>
            ))}
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
