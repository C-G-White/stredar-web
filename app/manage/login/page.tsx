'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push(searchParams.get('callbackUrl') ?? '/manage')
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'var(--asphalt-700)',
        border: 'var(--bd-dark)',
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-8)',
      }}>
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <p className="t-label" style={{ color: 'var(--hivis-500)', marginBottom: 'var(--sp-2)' }}>STREDAR CONTROL</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--white)', margin: 0 }}>Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <label className="t-label" style={{ color: 'var(--steel-200)' }} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              style={{
                background: 'var(--asphalt-600)',
                border: 'var(--bd-dark)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--white)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                padding: '10px var(--sp-3)',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <label className="t-label" style={{ color: 'var(--steel-200)' }} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              style={{
                background: 'var(--asphalt-600)',
                border: 'var(--bd-dark)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--white)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                padding: '10px var(--sp-3)',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--over-500)', fontFamily: 'var(--font-sans)', fontSize: 13, margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--hivis-500)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 15,
              padding: '11px var(--sp-4)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              letterSpacing: '0.02em',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
