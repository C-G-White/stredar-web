import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'

export default async function ManageLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--asphalt-800)', color: 'var(--steel-100)' }}>
      <header style={{
        borderBottom: 'var(--bd-dark)',
        padding: '0 var(--sp-6)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/manage" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          <span style={{ color: 'var(--hivis-500)' }}>S</span>TREDAR{' '}
          <span style={{ color: 'var(--steel-300)', fontWeight: 500, fontSize: 14 }}>Control</span>
        </Link>
        {session && (
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/manage/login' }) }}>
            <button type="submit" className="t-label" style={{ background: 'none', border: 'none', color: 'var(--steel-300)', cursor: 'pointer', padding: 0 }}>
              Sign out
            </button>
          </form>
        )}
      </header>
      <main>{children}</main>
    </div>
  )
}
