'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────
type Config = {
  site_id: string
  mode: 'auto' | 'monitor' | 'display'
  speed_limit_mph: number
  under_speed_mph: number
  auto_monitor_mins: number
  auto_display_mins: number
  text_slow_down: string
  text_thank_you: string
}

type Telemetry = {
  cpu_temp_c: number | null
  ambient_temp_c: number | null
  battery_mv: number | null
  uptime_s: number | null
  mem_used_pct: number | null
  radar_connected: boolean | null
  mode: string | null
  firmware_version: string | null
  signal_rssi: number | null
  recorded_at: string | null
}

type SiteInfo = {
  id: string; name: string; address: string; speed_limit_mph: number
  status: string; cpu_temp_c: number | null; uptime_s: number | null
  firmware_version: string | null; last_telemetry_at: string | null
  readings_today: number; violations_today: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatUptime(s: number | null) {
  if (s == null) return '—'
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60)
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`
}

function statusColor(s: string) {
  return s === 'online' ? 'var(--ok-500)' : s === 'stale' ? 'var(--warn-500)' : 'var(--steel-400)'
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <p className="t-label" style={{ color: 'var(--steel-300)' }}>{title}</p>
      {children}
    </div>
  )
}

function TelemetryCell({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>{label}</p>
      <p className="t-data" style={{ color: warn ? 'var(--over-500)' : 'var(--steel-100)', fontSize: 16 }}>{value}</p>
    </div>
  )
}

function ModeButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 8px',
        background: active ? 'var(--hivis-500)' : 'var(--asphalt-600)',
        border: active ? 'var(--bd-accent)' : 'var(--bd-dark)',
        borderRadius: 'var(--r-sm)',
        color: active ? 'var(--white)' : 'var(--steel-200)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        transition: `background var(--dur) var(--ease-out)`,
      }}
    >
      {label}
    </button>
  )
}

function RangeInput({ label, value, min, max, step = 1, onChange, unit = 'mph' }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void; unit?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label className="t-label" style={{ color: 'var(--steel-200)' }}>{label}</label>
        <span className="t-data" style={{ color: 'var(--hivis-500)', fontSize: 14 }}>{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--hivis-500)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="t-label" style={{ color: 'var(--steel-400)', fontSize: 10 }}>{min} {unit}</span>
        <span className="t-label" style={{ color: 'var(--steel-400)', fontSize: 10 }}>{max} {unit}</span>
      </div>
    </div>
  )
}

function TextInput({ label, value, onChange, maxLen = 16 }: {
  label: string; value: string; onChange: (v: string) => void; maxLen?: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label className="t-label" style={{ color: 'var(--steel-200)' }}>{label}</label>
        <span className="t-label" style={{ color: 'var(--steel-400)', fontSize: 10 }}>{value.length}/{maxLen}</span>
      </div>
      <input
        type="text"
        value={value}
        maxLength={maxLen}
        onChange={e => onChange(e.target.value.toUpperCase())}
        style={{
          background: 'var(--asphalt-600)',
          border: 'var(--bd-dark)',
          borderRadius: 'var(--r-sm)',
          color: 'var(--white)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '0.08em',
          padding: '10px var(--sp-3)',
          outline: 'none',
          width: '100%',
        }}
      />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function UnitPage() {
  const { siteId } = useParams<{ siteId: string }>()
  const router = useRouter()

  const [site, setSite]           = useState<SiteInfo | null>(null)
  const [config, setConfig]       = useState<Config | null>(null)
  const [draft, setDraft]         = useState<Config | null>(null)
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')
  const [showReboot, setShowReboot] = useState(false)

  const load = useCallback(async () => {
    const [sitesRes, cfgRes] = await Promise.all([
      fetch('/api/admin/sites'),
      fetch(`/api/admin/sites/${siteId}/config`),
    ])
    if (sitesRes.ok) {
      const all: SiteInfo[] = await sitesRes.json()
      const found = all.find(s => s.id === siteId)
      if (found) setSite(found)
    }
    if (cfgRes.ok) {
      const c: Config = await cfgRes.json()
      setConfig(c)
      setDraft(prev => prev ?? c)  // only set draft on first load
    }
    setLoading(false)
  }, [siteId])

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [load])

  async function save() {
    if (!draft) return
    setSaving(true)
    setSaveMsg('')
    const r = await fetch(`/api/admin/sites/${siteId}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    if (r.ok) {
      const updated: Config = await r.json()
      setConfig(updated)
      setDraft(updated)
      setSaveMsg('Saved — commands queued for device')
    } else {
      setSaveMsg('Save failed')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 4000)
  }

  async function reboot() {
    await fetch(`/api/admin/sites/${siteId}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: 'REBOOT' }),
    })
    setShowReboot(false)
    setSaveMsg('Reboot command queued')
    setTimeout(() => setSaveMsg(''), 4000)
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(config)

  if (loading) return (
    <div style={{ padding: 'var(--sp-8) var(--sp-6)' }}>
      <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>Loading…</p>
    </div>
  )

  if (!site || !draft) return (
    <div style={{ padding: 'var(--sp-8) var(--sp-6)' }}>
      <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>Unit not found.</p>
      <Link href="/manage" style={{ color: 'var(--hivis-500)' }}>Back to units</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      {/* Breadcrumb */}
      <Link href="/manage" className="t-label" style={{ color: 'var(--steel-400)', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--sp-4)' }}>
        ← All units
      </Link>

      {/* Status bar */}
      <div style={{
        background: 'var(--asphalt-700)',
        border: 'var(--bd-dark)',
        borderLeft: `3px solid ${statusColor(site.status)}`,
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-4) var(--sp-5)',
        marginBottom: 'var(--sp-6)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--sp-6)',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="t-h2" style={{ color: 'var(--white)', marginBottom: 2 }}>{site.name}</h1>
          <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>{site.address}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-6)', flexWrap: 'wrap' }}>
          <TelemetryCell label="Status" value={site.status.toUpperCase()} warn={site.status === 'offline'} />
          <TelemetryCell label="Uptime" value={formatUptime(site.uptime_s)} />
          <TelemetryCell label="CPU" value={site.cpu_temp_c != null ? `${site.cpu_temp_c}°C` : '—'} warn={(site.cpu_temp_c ?? 0) > 70} />
          <TelemetryCell label="Firmware" value={site.firmware_version ?? '—'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>

        {/* Mode control */}
        <Section title="Mode">
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            {(['display', 'monitor', 'auto'] as const).map(m => (
              <ModeButton key={m} label={m.toUpperCase()} active={draft.mode === m}
                onClick={() => setDraft(d => d ? { ...d, mode: m } : d)} />
            ))}
          </div>
          {draft.mode === 'auto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', paddingTop: 'var(--sp-2)', borderTop: 'var(--bd-dark)' }}>
              <RangeInput label="Monitor for" value={draft.auto_monitor_mins} min={1} max={60} unit="min"
                onChange={v => setDraft(d => d ? { ...d, auto_monitor_mins: v } : d)} />
              <RangeInput label="Then display for" value={draft.auto_display_mins} min={1} max={60} unit="min"
                onChange={v => setDraft(d => d ? { ...d, auto_display_mins: v } : d)} />
            </div>
          )}
          <p className="t-body-sm" style={{ color: 'var(--steel-400)' }}>
            {draft.mode === 'display' && 'Radar active, display showing speeds.'}
            {draft.mode === 'monitor' && 'Radar active, display blank. Readings still collected.'}
            {draft.mode === 'auto' && 'Alternates between monitor and display on a timer.'}
          </p>
        </Section>

        {/* Telemetry */}
        <Section title="Telemetry">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <TelemetryCell label="CPU Temp" value={site.cpu_temp_c != null ? `${site.cpu_temp_c} °C` : '—'} warn={(site.cpu_temp_c ?? 0) > 70} />
            <TelemetryCell label="Ambient Temp" value="— (sensor TBD)" />
            <TelemetryCell label="Battery" value="— (sensor TBD)" />
            <TelemetryCell label="4G Signal" value="— (modem TBD)" />
            <TelemetryCell label="Radar" value={site.status === 'offline' ? 'Disconnected' : 'Connected'} warn={site.status === 'offline'} />
            <TelemetryCell label="Memory" value="—" />
          </div>
          {site.last_telemetry_at && (
            <p className="t-label" style={{ color: 'var(--steel-400)', marginTop: 'var(--sp-1)' }}>
              Last seen {new Date(site.last_telemetry_at).toLocaleTimeString()}
            </p>
          )}
        </Section>

        {/* Thresholds */}
        <Section title="Speed Thresholds">
          <RangeInput label="Noise floor (ignore below)" value={draft.under_speed_mph} min={2} max={15} unit="mph"
            onChange={v => setDraft(d => d ? { ...d, under_speed_mph: v } : d)} />
          <RangeInput label="Speed limit" value={draft.speed_limit_mph} min={10} max={70} unit="mph"
            onChange={v => setDraft(d => d ? { ...d, speed_limit_mph: v } : d)} />
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            <div style={{ flex: 1, padding: 'var(--sp-2) var(--sp-3)', background: 'var(--led-amber-dim)', borderRadius: 'var(--r-sm)', textAlign: 'center' }}>
              <p className="t-label" style={{ color: 'var(--led-amber)', marginBottom: 2 }}>Amber</p>
              <p className="t-data" style={{ color: 'var(--led-amber)' }}>{draft.under_speed_mph}–{draft.speed_limit_mph} mph</p>
            </div>
            <div style={{ flex: 1, padding: 'var(--sp-2) var(--sp-3)', background: 'var(--over-tint)', borderRadius: 'var(--r-sm)', textAlign: 'center' }}>
              <p className="t-label" style={{ color: 'var(--over-500)', marginBottom: 2 }}>Red</p>
              <p className="t-data" style={{ color: 'var(--over-500)' }}>&gt; {draft.speed_limit_mph} mph</p>
            </div>
          </div>
        </Section>

        {/* Display texts */}
        <Section title="Display Messages">
          <TextInput label="Over limit message" value={draft.text_slow_down}
            onChange={v => setDraft(d => d ? { ...d, text_slow_down: v } : d)} />
          <TextInput label="Thank-you message" value={draft.text_thank_you}
            onChange={v => setDraft(d => d ? { ...d, text_thank_you: v } : d)} />
          <p className="t-body-sm" style={{ color: 'var(--steel-400)' }}>
            Max 16 chars, uppercase. Sent to I75 W display firmware.
          </p>
        </Section>

      </div>

      {/* Today's activity */}
      <div style={{ marginTop: 'var(--sp-4)', background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)' }}>
        <p className="t-label" style={{ color: 'var(--steel-300)', marginBottom: 'var(--sp-4)' }}>Today's Activity</p>
        <div style={{ display: 'flex', gap: 'var(--sp-8)', flexWrap: 'wrap' }}>
          <div>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4 }}>Total passes</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 32, color: 'var(--led-amber)' }}>
              {site.readings_today}
            </p>
          </div>
          <div>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4 }}>Over limit</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 32, color: site.violations_today > 0 ? 'var(--led-red)' : 'var(--led-amber)' }}>
              {site.violations_today}
            </p>
          </div>
          <div>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4 }}>Compliance</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 32, color: 'var(--led-green)' }}>
              {site.readings_today > 0
                ? `${Math.round((1 - site.violations_today / site.readings_today) * 100)}%`
                : '—'}
            </p>
          </div>
          <div>
            <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 4 }}>Speed limit</p>
            <p style={{ fontFamily: 'var(--font-led)', fontSize: 32, color: 'var(--steel-200)' }}>
              {site.speed_limit_mph}
            </p>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{
        marginTop: 'var(--sp-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--sp-4)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          <button
            onClick={save}
            disabled={!dirty || saving}
            style={{
              background: dirty ? 'var(--hivis-500)' : 'var(--steel-500)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 15,
              padding: '11px var(--sp-6)',
              cursor: dirty && !saving ? 'pointer' : 'not-allowed',
              opacity: dirty && !saving ? 1 : 0.55,
              transition: `background var(--dur) var(--ease-out)`,
            }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {dirty && (
            <button
              onClick={() => setDraft(config)}
              style={{ background: 'none', border: 'none', color: 'var(--steel-300)', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer' }}
            >
              Discard
            </button>
          )}
          {saveMsg && (
            <p className="t-body-sm" style={{ color: saveMsg.includes('fail') ? 'var(--over-500)' : 'var(--ok-500)' }}>{saveMsg}</p>
          )}
        </div>

        {/* Reboot */}
        {!showReboot ? (
          <button
            onClick={() => setShowReboot(true)}
            style={{ background: 'none', border: 'var(--bd-dark)', borderRadius: 'var(--r-sm)', color: 'var(--over-500)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, padding: '8px var(--sp-4)', cursor: 'pointer' }}
          >
            Reboot unit
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
            <span className="t-body-sm" style={{ color: 'var(--steel-200)' }}>Confirm reboot?</span>
            <button onClick={reboot} style={{ background: 'var(--over-500)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '8px 14px', cursor: 'pointer' }}>Yes, reboot</button>
            <button onClick={() => setShowReboot(false)} style={{ background: 'none', border: 'none', color: 'var(--steel-300)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}
