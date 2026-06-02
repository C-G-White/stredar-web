'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/join', label: 'Join the Scheme' },
  { href: '/councils', label: 'For Councils' },
  { href: '/data', label: 'Live Data' },
]

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <header style={{ borderBottom: 'var(--bd-light)', background: 'var(--white)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--sp-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          <span style={{ color: 'var(--hivis-500)' }}>S</span>TREDAR
        </Link>
        <nav style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center' }}>
          {links.map(link => (
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
          ))}
        </nav>
      </div>
    </header>
  )
}
