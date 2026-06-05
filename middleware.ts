import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isManage = req.nextUrl.pathname.startsWith('/manage')
  const isLogin = req.nextUrl.pathname === '/manage/login'

  if (isManage && !isLogin && !isLoggedIn) {
    const loginUrl = new URL('/manage/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLogin && isLoggedIn) {
    return NextResponse.redirect(new URL('/manage', req.nextUrl.origin))
  }
})

export const config = {
  matcher: ['/manage/:path*'],
}
