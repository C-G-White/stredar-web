'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/join', label: 'Join the Scheme' },
  { href: '/councils', label: 'For Councils' },
  { href: '/data', label: 'Live Data' },
  { href: '/simulator.html', label: 'Simulator', external: true },
]

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <header style={{ borderBottom: 'var(--bd-light)', background: 'var(--white)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--sp-6)', display: 'flex', alignItems: 'center', gap: 'var(--sp-6)', minHeight: 64 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em', flexShrink: 0 }}>
          <span style={{ color: 'var(--hivis-500)' }}>S</span>TREDAR
        </Link>
        <nav className="nav-scroll" style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          {links.map(link => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--body-sm-size, 14px)',
                  fontWeight: 500,
                  color: 'var(--hivis-500)',
                  textDecoration: 'none',
                  transition: 'color var(--dur) var(--ease-out)',
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
                  fontSize: 'var(--body-sm-size, 14px)',
                  fontWeight: 500,
                  color: pathname.startsWith(link.href) ? 'var(--hivis-500)' : 'var(--ink-2)',
                  textDecoration: 'none',
                  transition: 'color var(--dur) var(--ease-out)',
                }}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </header>
  )
}
