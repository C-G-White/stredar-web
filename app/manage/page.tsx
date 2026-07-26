'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type SiteStatus = {
  id: string
  name: string
  address: string
  speed_limit_mph: number
  device_type: 'SC-1' | 'SC-2'
  mode: string | null
  current_mode: string | null
  status: 'online' | 'stale' | 'offline'
  cpu_temp_c: number | null
  uptime_s: number | null
  firmware_version: string | null
  last_telemetry_at: string | null
  readings_today: number
  violations_today: number
}

function statusColor(s: string) {
  if (s === 'online') return 'var(--ok-500)'
  if (s === 'stale')  return 'var(--warn-500)'
  return 'var(--steel-400)'
}

function formatUptime(s: number | null) {
  if (s == null) return '—'
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function ManagePage() {
  const [sites, setSites] = useState<SiteStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      const r = await fetch('/api/admin/sites')
      if (!r.ok) throw new Error(await r.text())
      setSites(await r.json())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-2)' }}>Control Panel</p>
        <h1 className="t-h1" style={{ color: 'var(--white)', textTransform: 'uppercase' }}>Units</h1>
      </div>

      {loading && (
        <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>Loading…</p>
      )}
      {error && (
        <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>{error}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--sp-4)' }}>
        {sites.map(site => (
          <Link key={site.id} href={`/manage/${site.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--asphalt-700)',
              border: 'var(--bd-dark)',
              borderLeft: `3px solid ${statusColor(site.status)}`,
              borderRadius: 'var(--r-lg)',
              padding: 'var(--sp-5)',
              cursor: 'pointer',
              transition: `background var(--dur) var(--ease-out)`,
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--asphalt-600)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--asphalt-700)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 2 }}>
                    <h2 className="t-h3" style={{ color: 'var(--white)' }}>{site.name}</h2>
                    <span className="t-label" style={{
                      color: site.device_type === 'SC-2' ? 'var(--hivis-500)' : 'var(--steel-400)',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '1px 6px',
                      borderRadius: 'var(--r-xs)',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                    }}>{site.device_type}</span>
                  </div>
                  <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>{site.address}</p>
                </div>
                <span className="t-label" style={{
                  color: statusColor(site.status),
                  background: site.status === 'online' ? 'var(--ok-tint)' : site.status === 'stale' ? 'var(--warn-tint)' : 'rgba(255,255,255,0.05)',
                  padding: '2px 8px',
                  borderRadius: 'var(--r-pill)',
                  whiteSpace: 'nowrap',
                }}>
                  {site.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>Mode</p>
                  <p className="t-data" style={{ color: 'var(--steel-100)' }}>{site.mode ?? '—'}</p>
                </div>
                <div>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>Last 24h</p>
                  <p className="t-data" style={{ color: 'var(--steel-100)' }}>{site.readings_today} <span style={{ color: 'var(--steel-400)', fontSize: 11 }}>passes</span></p>
                </div>
                <div>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>Violations</p>
                  <p className="t-data" style={{ color: site.violations_today > 0 ? 'var(--warn-500)' : 'var(--steel-100)' }}>
                    {site.violations_today}
                  </p>
                </div>
                <div>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>CPU Temp</p>
                  <p className="t-data" style={{ color: site.cpu_temp_c != null && site.cpu_temp_c > 70 ? 'var(--over-500)' : 'var(--steel-100)' }}>
                    {site.cpu_temp_c != null ? `${site.cpu_temp_c}°C` : '—'}
                  </p>
                </div>
                <div>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>Uptime</p>
                  <p className="t-data" style={{ color: 'var(--steel-100)' }}>{formatUptime(site.uptime_s)}</p>
                </div>
                <div>
                  <p className="t-label" style={{ color: 'var(--steel-400)', marginBottom: 2 }}>Firmware</p>
                  <p className="t-data" style={{ color: 'var(--steel-100)', fontSize: 12 }}>{site.firmware_version ?? '—'}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
