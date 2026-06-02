'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/join', label: 'Join the Scheme' },
  { href: '/councils', label: 'For Councils' },
  { href: '/data', label: 'Live Data' },
  { href: '/simulator.html', label: 'Simulator', external: true },
]

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="5" x2="20" y2="5" />
      <line x1="2" y1="11" x2="20" y2="11" />
      <line x1="2" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  )
}

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close menu whenever the route changes
  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: open ? 'none' : 'var(--bd-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* ── Main bar ──────────────────────────────────────── */}
      <div style={{
        maxWidth: 'var(--container)',
        margin: '0 auto',
        padding: '0 var(--sp-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 64,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 20,
          color: 'var(--ink)',
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          flexShrink: 0,
        }}>
          <span style={{ color: 'var(--hivis-500)' }}>S</span>TREDAR
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {links.map(link =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--hivis-500)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(link.href) ? 'var(--hivis-500)' : 'var(--ink-2)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Hamburger / close button — mobile only */}
        <button
          className="nav-mobile-btn"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            padding: 'var(--sp-2)',
            borderRadius: 'var(--r-sm)',
            lineHeight: 0,
          }}
        >
          {open ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* ── Mobile menu panel — display driven by open state ── */}
      <div
        style={{
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          background: 'var(--asphalt-900)',
          borderBottom: '3px solid var(--hivis-500)',
        }}
      >
        {links.map((link, i) => {
          const active = !link.external && isActive(link.href)
          const isLast = i === links.length - 1
          return link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: 'var(--sp-5) var(--sp-6)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--hivis-500)',
                textDecoration: 'none',
                borderTop: '1px solid var(--steel-500)',
              }}
            >
              {link.label} ↗
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: 'var(--sp-5) var(--sp-6)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: active ? 'var(--hivis-500)' : 'var(--steel-100)',
                textDecoration: 'none',
                borderTop: i === 0 ? '1px solid var(--steel-500)' : '1px solid var(--steel-500)',
                borderLeft: active ? 'var(--bd-accent)' : '3px solid transparent',
                paddingLeft: 'var(--sp-5)',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
