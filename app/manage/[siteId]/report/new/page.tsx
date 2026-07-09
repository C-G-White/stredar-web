'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type AffectedDirection = 'inbound' | 'outbound' | 'both' | null

type Scenario = {
  id: string
  site_id: string
  name: string
  description: string | null
  starts_at: string
  ends_at: string | null
  affected_direction: AffectedDirection
}

function toAffectedDirection(inbound: boolean, outbound: boolean): AffectedDirection {
  if (inbound && outbound) return 'both'
  if (inbound) return 'inbound'
  if (outbound) return 'outbound'
  return null
}

function directionLabel(d: AffectedDirection): string {
  if (d === 'inbound') return 'Affects inbound only'
  if (d === 'outbound') return 'Affects outbound only'
  if (d === 'both') return 'Affects both directions'
  return 'No directional intervention'
}

function fieldStyle(): React.CSSProperties {
  return {
    background: 'var(--asphalt-600)', border: 'var(--bd-dark)', borderRadius: 'var(--r-sm)',
    color: 'var(--white)', fontFamily: 'var(--font-mono)', fontSize: 14,
    padding: '10px var(--sp-3)', outline: 'none', width: '100%',
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--asphalt-700)', border: 'var(--bd-dark)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <p className="t-label" style={{ color: 'var(--steel-300)' }}>{title}</p>
      {children}
    </div>
  )
}

export default function NewReportPage() {
  const { siteId } = useParams<{ siteId: string }>()
  const router = useRouter()

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [ongoing, setOngoing] = useState(false)
  const [affectsInbound, setAffectsInbound] = useState(false)
  const [affectsOutbound, setAffectsOutbound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [context, setContext] = useState('')

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/sites/${siteId}/scenarios`)
    if (r.ok) setScenarios(await r.json())
    setLoading(false)
  }, [siteId])

  useEffect(() => { load() }, [load])

  function toggleSelect(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  async function addScenario() {
    if (!name.trim() || !startsAt) return
    setSaving(true)
    setError('')
    const r = await fetch(`/api/admin/sites/${siteId}/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || null,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: ongoing || !endsAt ? null : new Date(endsAt).toISOString(),
        affected_direction: toAffectedDirection(affectsInbound, affectsOutbound),
      }),
    })
    if (r.ok) {
      setName(''); setDescription(''); setStartsAt(''); setEndsAt(''); setOngoing(false)
      setAffectsInbound(false); setAffectsOutbound(false)
      await load()
    } else {
      setError((await r.json()).error ?? 'Failed to save scenario')
    }
    setSaving(false)
  }

  async function deleteScenario(id: string) {
    await fetch(`/api/admin/sites/${siteId}/scenarios/${id}`, { method: 'DELETE' })
    setSelected(prev => prev.filter(x => x !== id))
    await load()
  }

  async function generate() {
    if (selected.length < 2) return
    setGenerating(true)
    setError('')
    const r = await fetch(`/api/admin/sites/${siteId}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_ids: selected, user_context: context.trim() || undefined }),
    })
    if (r.ok) {
      const report = await r.json()
      router.push(`/manage/${siteId}/report/${report.id}`)
    } else {
      setError((await r.json()).error ?? 'Failed to generate report')
      setGenerating(false)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--sp-8) var(--sp-6)' }}>
      <Link href={`/manage/${siteId}`} className="t-label" style={{ color: 'var(--steel-400)', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--sp-4)' }}>
        ← Back to unit
      </Link>

      <h1 className="t-h2" style={{ color: 'var(--white)', marginBottom: 'var(--sp-2)' }}>New Comparison Report</h1>
      <p className="t-body-sm" style={{ color: 'var(--steel-400)', marginBottom: 'var(--sp-6)' }}>
        Define scenario periods (e.g. baseline, sign active, chicane trial), then select 2 or 3 to compare.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

        <Section title="Add a scenario">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="t-label" style={{ color: 'var(--steel-200)' }}>Name</label>
              <input style={fieldStyle()} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lidar sign active" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="t-label" style={{ color: 'var(--steel-200)' }}>Description (optional)</label>
              <input style={fieldStyle()} value={description} onChange={e => setDescription(e.target.value)} placeholder="Notes for the record" />
            </div>
            <div>
              <label className="t-label" style={{ color: 'var(--steel-200)' }}>Starts</label>
              <input type="datetime-local" style={fieldStyle()} value={startsAt} onChange={e => setStartsAt(e.target.value)} />
            </div>
            <div>
              <label className="t-label" style={{ color: 'var(--steel-200)' }}>Ends</label>
              <input type="datetime-local" style={fieldStyle()} value={endsAt} disabled={ongoing}
                onChange={e => setEndsAt(e.target.value)} />
              <label className="t-body-sm" style={{ color: 'var(--steel-400)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <input type="checkbox" checked={ongoing} onChange={e => setOngoing(e.target.checked)} />
                Ongoing (no end date yet)
              </label>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="t-label" style={{ color: 'var(--steel-200)' }}>Which direction does this scenario affect?</label>
              <div style={{ display: 'flex', gap: 'var(--sp-5)', marginTop: 6 }}>
                <label className="t-body-sm" style={{ color: 'var(--steel-200)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={affectsInbound} onChange={e => setAffectsInbound(e.target.checked)} />
                  Inbound
                </label>
                <label className="t-body-sm" style={{ color: 'var(--steel-200)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={affectsOutbound} onChange={e => setAffectsOutbound(e.target.checked)} />
                  Outbound
                </label>
              </div>
              <p className="t-body-sm" style={{ color: 'var(--steel-400)', marginTop: 6 }}>
                Leave both unchecked for a baseline period with no directional intervention. Check one (e.g. a sign facing inbound traffic only) to have the report treat that direction as primary evidence and the other as an unaffected control. Check both for a whole-site measure, e.g. a physical chicane that affects traffic both ways.
              </p>
            </div>
          </div>
          <button
            onClick={addScenario}
            disabled={saving || !name.trim() || !startsAt}
            style={{
              alignSelf: 'flex-start', background: 'var(--asphalt-600)', border: 'var(--bd-dark)',
              borderRadius: 'var(--r-sm)', color: 'var(--steel-100)', fontFamily: 'var(--font-display)',
              fontWeight: 600, fontSize: 13, padding: '10px var(--sp-4)',
              cursor: saving || !name.trim() || !startsAt ? 'not-allowed' : 'pointer',
              opacity: saving || !name.trim() || !startsAt ? 0.5 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Add scenario'}
          </button>
        </Section>

        <Section title={`Select scenarios to compare (${selected.length}/3)`}>
          {loading && <p className="t-body-sm" style={{ color: 'var(--steel-300)' }}>Loading…</p>}
          {!loading && scenarios.length === 0 && (
            <p className="t-body-sm" style={{ color: 'var(--steel-400)' }}>No scenarios defined yet — add one above.</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {scenarios.map(s => {
              const isSelected = selected.includes(s.id)
              const orderIndex = selected.indexOf(s.id)
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3)',
                  background: isSelected ? 'rgba(255,107,26,0.08)' : 'var(--asphalt-600)',
                  border: isSelected ? 'var(--bd-accent)' : 'var(--bd-dark)',
                  borderRadius: 'var(--r-sm)', cursor: 'pointer',
                }} onClick={() => toggleSelect(s.id)}>
                  <span className="t-data" style={{
                    color: isSelected ? 'var(--hivis-500)' : 'var(--steel-500)', width: 20, textAlign: 'center',
                  }}>
                    {isSelected ? orderIndex + 1 : '—'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p className="t-body-sm" style={{ color: 'var(--white)', fontWeight: 600 }}>{s.name}</p>
                    <p className="t-label" style={{ color: 'var(--steel-400)' }}>
                      {new Date(s.starts_at).toLocaleDateString()} – {s.ends_at ? new Date(s.ends_at).toLocaleDateString() : 'ongoing'}
                      {' · '}{directionLabel(s.affected_direction)}
                      {s.description ? ` · ${s.description}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteScenario(s.id) }}
                    style={{ background: 'none', border: 'none', color: 'var(--steel-400)', fontSize: 12, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        </Section>

        <Section title="Context for the AI (optional)">
          <div>
            <label className="t-label" style={{ color: 'var(--steel-200)' }}>
              Anything the council should know when reading this report
            </label>
            <textarea
              style={{ ...fieldStyle(), minHeight: 90, resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. school on this road, resident complaints about speeding, recent collision history, nearby roadworks…"
            />
            <p className="t-body-sm" style={{ color: 'var(--steel-400)', marginTop: 6 }}>
              Used to frame the write-up — not treated as measured data.
            </p>
          </div>
        </Section>

        {error && <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>{error}</p>}

        <button
          onClick={generate}
          disabled={selected.length < 2 || generating}
          style={{
            background: selected.length >= 2 ? 'var(--hivis-500)' : 'var(--steel-500)',
            color: 'var(--white)', border: 'none', borderRadius: 'var(--r-sm)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            padding: '12px var(--sp-6)', alignSelf: 'flex-start',
            cursor: selected.length >= 2 && !generating ? 'pointer' : 'not-allowed',
            opacity: selected.length >= 2 && !generating ? 1 : 0.55,
          }}
        >
          {generating ? 'Generating report…' : 'Generate report'}
        </button>
      </div>
    </div>
  )
}
