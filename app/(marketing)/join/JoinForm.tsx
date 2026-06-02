'use client'

import { useActionState } from 'react'
import { submitJoinEnquiry, type JoinFormState } from '@/app/actions/join'

const initial: JoinFormState = { status: 'idle' }

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--body-size, 16px)',
  color: 'var(--ink)',
  background: 'var(--white)',
  border: 'var(--bd-light)',
  borderRadius: 'var(--r-sm)',
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--over-500)',
  marginTop: 6,
  letterSpacing: '0.02em',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--ink-2)',
  marginBottom: 8,
}

function Field({ label, error, required, children }: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: 'var(--hivis-500)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}

export default function JoinForm() {
  const [state, action, pending] = useActionState(submitJoinEnquiry, initial)

  if (state.status === 'success') {
    return (
      <div style={{ background: 'var(--ok-tint)', border: '1px solid var(--ok-500)', borderLeft: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-10)' }}>
        <p className="t-label" style={{ color: 'var(--ok-500)', marginBottom: 'var(--sp-3)' }}>Enquiry Received</p>
        <h2 className="t-h3" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
          Thanks — We'll Be in Touch
        </h2>
        <p className="t-body" style={{ color: 'var(--ink-2)' }}>
          We've received your enquiry and sent a confirmation to your email address.
          We'll review your submission and follow up shortly.
        </p>
      </div>
    )
  }

  const errors = state.status === 'validation' ? state.errors : {}

  return (
    <form action={action} noValidate>
      {/* Honeypot — hidden from real users */}
      <input name="_gotcha" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        <div className="cols-form-2" style={{ gap: 'var(--sp-5)' }}>
          <Field label="Full name" error={errors.name} required>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              style={{ ...inputStyle, borderColor: errors.name ? 'var(--over-500)' : undefined }}
            />
          </Field>
          <Field label="Email address" error={errors.email} required>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              style={{ ...inputStyle, borderColor: errors.email ? 'var(--over-500)' : undefined }}
            />
          </Field>
        </div>

        <Field label="Community group or organisation" error={errors.group} required>
          <input
            name="group"
            type="text"
            placeholder="e.g. Holme Hale Parish Council, Great Dunmow Residents Association"
            style={{ ...inputStyle, borderColor: errors.group ? 'var(--over-500)' : undefined }}
          />
        </Field>

        <Field label="Village / town and county" error={errors.location} required>
          <input
            name="location"
            type="text"
            placeholder="e.g. Holme Hale, Norfolk"
            style={{ ...inputStyle, borderColor: errors.location ? 'var(--over-500)' : undefined }}
          />
        </Field>

        <Field label="Describe your road safety concern" error={errors.concern} required>
          <textarea
            name="concern"
            rows={5}
            placeholder="Which road is the concern? What speeds are vehicles typically doing? Has there been any incidents? What have you tried so far?"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, borderColor: errors.concern ? 'var(--over-500)' : undefined }}
          />
        </Field>

        <Field label="Have you engaged with your local council about this?" error={errors.council} required>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginTop: 4 }}>
            {[
              { value: 'Yes — they are supportive',     label: 'Yes — they are supportive' },
              { value: 'Yes — but no action taken yet', label: 'Yes — but no action taken yet' },
              { value: 'Not yet',                       label: 'Not yet' },
            ].map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink-2)' }}>
                <input type="radio" name="council" value={opt.value} style={{ accentColor: 'var(--hivis-500)', width: 16, height: 16, flexShrink: 0 }} />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.council && <p style={errorStyle}>{errors.council}</p>}
        </Field>

        <Field label="How did you hear about Stredar?">
          <input
            name="source"
            type="text"
            placeholder="Optional — word of mouth, press, council officer, etc."
            style={inputStyle}
          />
        </Field>

        {state.status === 'error' && (
          <div style={{ background: 'var(--over-tint)', border: '1px solid var(--over-500)', borderRadius: 'var(--r-sm)', padding: 'var(--sp-4)' }}>
            <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>{state.message}</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)' }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              background: pending ? 'var(--steel-400)' : 'var(--hivis-500)',
              color: 'var(--white)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '14px 36px',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              cursor: pending ? 'not-allowed' : 'pointer',
              transition: 'background var(--dur) var(--ease-out)',
            }}
          >
            {pending ? 'Sending…' : 'Send Enquiry'}
          </button>
          <p className="t-body-sm" style={{ color: 'var(--ink-3)' }}>
            We'll respond within a few working days.
          </p>
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.02em' }}>
          * Required fields. Your details are used only to respond to your enquiry and will not be shared with third parties.
        </p>
      </div>
    </form>
  )
}
