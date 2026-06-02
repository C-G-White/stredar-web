import SiteNav from '@/components/marketing/SiteNav'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--concrete-50)', display: 'flex', flexDirection: 'column' }}>
      <SiteNav />
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ borderTop: 'var(--bd-light)', padding: 'var(--sp-10) 0' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <span className="t-label" style={{ color: 'var(--ink-3)' }}>
            Stredar Community Initiative
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--caption-size, 13px)', color: 'var(--ink-3)' }}>
            Not an enforcement device &mdash; no Home Office Type Approval required.
          </span>
        </div>
      </footer>
    </div>
  )
}
