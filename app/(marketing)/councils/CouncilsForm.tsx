'use client'

import { useActionState } from 'react'
import { submitCouncilEnquiry, type CouncilFormState } from '@/app/actions/councils'

const initial: CouncilFormState = { status: 'idle' }

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

export default function CouncilsForm() {
  const [state, action, pending] = useActionState(submitCouncilEnquiry, initial)

  if (state.status === 'success') {
    return (
      <div style={{ background: 'var(--ok-tint)', border: '1px solid var(--ok-500)', borderLeft: 'var(--bd-accent)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-10)' }}>
        <p className="t-label" style={{ color: 'var(--ok-500)', marginBottom: 'var(--sp-3)' }}>Enquiry Received</p>
        <h2 className="t-h3" style={{ color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>
          Thanks — We Will Be in Touch
        </h2>
        <p className="t-body" style={{ color: 'var(--ink-2)' }}>
          We have received your enquiry and sent a confirmation to your email address.
          A member of the team will respond shortly.
        </p>
      </div>
    )
  }

  const errors = state.status === 'validation' ? state.errors : {}

  return (
    <form action={action} noValidate>
      <input name="_gotcha" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
          <Field label="Full name" error={errors.name} required>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              style={{ ...inputStyle, borderColor: errors.name ? 'var(--over-500)' : undefined }}
            />
          </Field>
          <Field label="Job title / role" error={errors.role} required>
            <input
              name="role"
              type="text"
              placeholder="e.g. Road Safety Officer, Councillor"
              style={{ ...inputStyle, borderColor: errors.role ? 'var(--over-500)' : undefined }}
            />
          </Field>
        </div>

        <Field label="Local authority" error={errors.authority} required>
          <input
            name="authority"
            type="text"
            placeholder="e.g. Norfolk County Council, South Norfolk District Council"
            style={{ ...inputStyle, borderColor: errors.authority ? 'var(--over-500)' : undefined }}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
          <Field label="Email address" error={errors.email} required>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane.smith@norfolk.gov.uk"
              style={{ ...inputStyle, borderColor: errors.email ? 'var(--over-500)' : undefined }}
            />
          </Field>
          <Field label="Phone number">
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Optional"
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="I would like to discuss" error={errors.interest} required>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginTop: 4 }}>
            {[
              'Siting approval for a community unit',
              'Data sharing and reporting',
              'Formal partnership or endorsement',
              'General information about the scheme',
            ].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink-2)' }}>
                <input type="radio" name="interest" value={opt} style={{ accentColor: 'var(--hivis-500)', width: 16, height: 16, flexShrink: 0 }} />
                {opt}
              </label>
            ))}
          </div>
          {errors.interest && <p style={errorStyle}>{errors.interest}</p>}
        </Field>

        <Field label="Message" error={errors.message} required>
          <textarea
            name="message"
            rows={5}
            placeholder="Tell us about your interest in Stredar, any specific sites or roads you have in mind, or questions you would like answered."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, borderColor: errors.message ? 'var(--over-500)' : undefined }}
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
            We respond within two working days.
          </p>
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.02em' }}>
          * Required fields. Your details are used only to respond to your enquiry and will not be shared with third parties.
        </p>
      </div>
    </form>
  )
}
