import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { encode } from 'next-auth/jwt'
import { db } from '@/shared/lib/db'
import { getEffectiveScopes } from '@/shared/lib/authorization'
import type { OrgMemberRole, Scope } from '@/shared/types/scopes'

// Test-only auth bypass for Playwright. It mints an Auth.js session
// cookie directly, skipping the Google OAuth flow that can't be
// automated. It is gated behind ENABLE_TEST_LOGIN, which is set only in
// the E2E environment, never in production. Chapter 22 hardens this
// further.
const SESSION_COOKIE = 'authjs.session-token'

export async function POST(request: Request) {
  if (process.env.ENABLE_TEST_LOGIN !== 'true') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const { email } = (await request.json()) as { email: string }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, role: true }
  })
  if (!user) {
    return NextResponse.json({ error: 'No such user' }, { status: 404 })
  }
  const userId = user.id

  // A customer belongs to no organization, so the membership is optional
  // here for the same reason it is optional in the session callback: a
  // route that required one could only ever sign in agents.
  const membership = await db.orgMember.findFirst({
    where: { userId },
    select: { organizationId: true, role: true, customScopes: true }
  })

  const scopes = membership
    ? getEffectiveScopes(membership.role as OrgMemberRole, membership.customScopes as { add?: Scope[]; remove?: Scope[] })
    : []

  // The session callback in auth.ts reads role, organizationId and scopes
  // straight from the token, so we encode all three. Leaving out `role`
  // produces a session the proxy treats as a customer.
  const token = await encode({
    salt: SESSION_COOKIE,
    secret: process.env.AUTH_SECRET!,
    token: {
      sub: userId,
      role: user.role,
      organizationId: membership?.organizationId,
      scopes
    }
  })

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  })

  return NextResponse.json({ ok: true })
}
