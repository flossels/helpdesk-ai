import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import type { NextRequest } from 'next/server'

const dashboardPrefixes = ['/tickets', '/dashboard', '/activity', '/knowledge', '/settings']

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl
  const isLoggedIn = Boolean(session?.user)
  const isAgent = session?.user?.role === 'AGENT'
  const hasOrg = Boolean(session?.user?.organizationId)

  const isDashboard = dashboardPrefixes.some((prefix) => pathname.startsWith(prefix))
  const isPortal = pathname.startsWith('/portal')
  const isProtected = isDashboard || isPortal
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(isAgent ? '/tickets' : '/portal', request.url))
  }

  if (pathname.startsWith('/onboarding')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (hasOrg) return NextResponse.redirect(new URL('/tickets', request.url))
    return NextResponse.next()
  }

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isDashboard && isLoggedIn && !isAgent) {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  if (isDashboard && isLoggedIn && isAgent && !hasOrg) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  if (isPortal && isLoggedIn && isAgent) {
    return NextResponse.redirect(new URL(hasOrg ? '/tickets' : '/onboarding', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/tickets/:path*',
    '/dashboard/:path*',
    '/activity/:path*',
    '/knowledge/:path*',
    '/settings/:path*',
    '/portal/:path*',
    '/login',
    '/signup',
    '/onboarding'
  ]
}
