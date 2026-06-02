import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'How It Works' }

const components = [
  { sub: 'Brain',         part: 'Raspberry Pi 4 Model B (4 GB)',           cost: '~£55'  },
  { sub: 'Radar',         part: 'OmniPreSense OPS243-A · 24 GHz Doppler',  cost: '~£180' },
  { sub: 'Display',       part: 'P10 amber LED matrix panel (320×160)',     cost: '~£80'  },
  { sub: 'LED Driver',    part: 'HUB75 RGB-Matrix HAT for Pi',              cost: '~£20'  },
  { sub: 'GPS',           part: 'u-blox NEO-M8N GNSS (USB)',                cost: '~£18'  },
  { sub: 'Power',         part: '30 W solar panel + MPPT controller',       cost: '~£60'  },
  { sub: 'Battery',       part: '12 V 7 Ah LiFePO4 + holder',              cost: '~£45'  },
  { sub: 'Enclosure',     part: 'IP66 ABS box + anti-glare lens',           cost: '~£30'  },
  { sub: 'Connectivity',  part: '4G LTE USB modem + SIM (optional)',        cost: '~£35'  },
  { sub: 'Mounting',      part: 'Pole banding straps or tripod',            cost: '~£25'  },
]

const specs = [
  { label: 'Radar module',       value: 'OmniPreSense OPS243-A' },
  { label: 'Frequency',          value: '24 GHz' },
  { label: 'Detection range',    value: 'Up to 100 m' },
  { label: 'Speed range',        value: '1 – 150 MPH' },
  { label: 'Logging',            value: 'Per-vehicle · GPS-tagged · timestamped' },
  { label: 'Enclosure',          value: 'IP66 (weatherproof)' },
  { label: 'Power',              value: 'Solar · 30 W panel + LiFePO4 battery' },
  { label: 'Connectivity',       value: 'microSD · USB-C · 4G sync (optional)' },
  { label: 'Anti-theft',         value: 'GPS locate + tamper alert' },
  { label: 'Indicative parts cost', value: '≈ £510 per unit' },
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
            The Stredar SC-1 is a driver-feedback speed radar built from off-the-shelf parts.
            A residents' association can buy two or three units, fit them with a screwdriver, and
            rotate them between streets. No contractor. No groundworks. No enforcement camera.
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
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
          <div style={{ marginTop: 'var(--sp-8)', background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderLeft: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-8)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-10)', alignItems: 'center' }}>
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
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-16)', alignItems: 'start' }}>
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
              { n: '02', heading: 'Reading is logged', body: 'Speed, direction, and a GPS-tagged timestamp are written to microSD. No vehicle data is retained.' },
              { n: '03', heading: 'Upload to platform', body: 'Via 4G (optional) or manual microSD retrieval, readings are uploaded to the Stredar platform.' },
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

      {/* ── Bill of materials ─────────────────────────────────── */}
      <section style={{ background: 'var(--concrete-50)', borderBottom: 'var(--bd-light)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>The Hardware</p>
          <h2 className="t-h2" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
            Off-the-Shelf Parts
          </h2>
          <p className="t-body" style={{ color: 'var(--ink-2)', maxWidth: 580, marginBottom: 'var(--sp-8)' }}>
            Every component is a standard, replaceable part available from UK suppliers.
            No proprietary hardware, no vendor lock-in.
          </p>
          <div style={{ background: 'var(--white)', border: 'var(--bd-light)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: 'var(--bd-light)' }}>
                  {['Subsystem', 'Component', 'Indicative cost'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Indicative cost' ? 'right' : 'left', padding: 'var(--sp-4) var(--sp-5)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {components.map((row, i) => (
                  <tr key={row.sub} style={{ borderBottom: i < components.length - 1 ? 'var(--bd-light)' : 'none' }}>
                    <td style={{ padding: 'var(--sp-3) var(--sp-5)', color: 'var(--hivis-600)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', width: '18%', whiteSpace: 'nowrap' }}>
                      {row.sub}
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-5)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                      {row.part}
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-5)', color: 'var(--ink-2)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {row.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: 'var(--bd-light)', background: 'var(--concrete-50)' }}>
                  <td colSpan={2} style={{ padding: 'var(--sp-4) var(--sp-5)', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink)' }}>
                    Indicative parts cost per unit
                  </td>
                  <td style={{ padding: 'var(--sp-4) var(--sp-5)', textAlign: 'right', color: 'var(--hivis-600)', fontSize: 16, fontWeight: 600 }}>
                    ≈ £510
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p style={{ marginTop: 'var(--sp-4)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.7 }}>
            Prices are indicative. A community typically buys two or three units and rotates them between streets,
            reducing the effective per-street cost. The 4G modem and SIM are optional — data can be retrieved manually via microSD.
          </p>
        </div>
      </section>

      {/* ── Technical spec ────────────────────────────────────── */}
      <section style={{ background: 'var(--asphalt-800)', borderBottom: '1px solid var(--steel-500)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-16) var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-3)' }}>SC-1</p>
          <h2 className="t-h2" style={{ color: 'var(--white)', textTransform: 'uppercase', marginBottom: 'var(--sp-8)' }}>
            Technical Specification
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-10)' }}>
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
