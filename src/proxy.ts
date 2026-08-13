import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { rateLimit } from '@/shared/lib/rateLimit'
import { auth } from '@/auth'
import { routing } from '@/i18n/routing'
import type { NextRequest } from 'next/server'

const handleI18n = createMiddleware(routing)

const apiLimits: { prefix: string; maxRequests: number }[] = [
  { prefix: '/api/auth/callback', maxRequests: 10 },
  { prefix: '/api/preview', maxRequests: 10 }
]
const DEFAULT_API_LIMIT = 100

const dashboardPrefixes = ['/tickets', '/dashboard', '/activity', '/knowledge', '/settings']

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const pathname = request.nextUrl.pathname
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const policy = apiLimits.find((entry) => pathname.startsWith(entry.prefix))
    const limit = await rateLimit(`api:${policy?.prefix ?? 'all'}:${ip}`, {
      maxRequests: policy?.maxRequests ?? DEFAULT_API_LIMIT,
      windowMs: 60_000
    })

    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429, headers: { 'Retry-After': '60' } })
    }

    return NextResponse.next()
  }

  const response = handleI18n(request)
  if (response.headers.has('location')) return response

  const pathname = request.nextUrl.pathname.replace(/^\/(de|fr)(?=\/|$)/, '') || '/'

  const session = await auth()
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

  return response
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
    '/onboarding',
    '/api/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}
