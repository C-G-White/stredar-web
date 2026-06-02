import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--asphalt-800)', color: 'var(--steel-100)' }}>
      <header style={{ borderBottom: 'var(--bd-dark)', padding: '0 var(--sp-6)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          <span style={{ color: 'var(--hivis-500)' }}>S</span>TREDAR
        </Link>
        <span className="t-label" style={{ color: 'var(--hivis-500)' }}>
          National Speed Data
        </span>
      </header>
      <main>{children}</main>
    </div>
  )
}
