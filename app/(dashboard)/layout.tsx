import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--asphalt-800)', color: 'var(--steel-100)' }}>
      <header style={{ borderBottom: 'var(--bd-dark)', padding: '0 var(--sp-6)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          <span style={{ color: 'var(--hivis-500)' }}>S</span>TREDAR
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <span className="t-label" style={{ color: 'var(--hivis-500)' }}>National Speed Data</span>
          <ThemeToggle />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
