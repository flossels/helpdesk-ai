import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { db } from '@/shared/lib/db'
import { getEffectiveScopes } from '@/shared/lib/authorization'
import type { OrgMemberRole, Scope, UserRole } from '@/shared/types/scopes'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Google,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user?.password) return null

        const valid = await compare(credentials.password as string, user.password)
        return valid ? user : null
      }
    })
  ],
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user || trigger === 'update') {
        const userId = user?.id ?? token.sub
        const account = userId
          ? await db.user.findUnique({
              where: { id: userId },
              select: {
                role: true,
                memberships: {
                  select: { organizationId: true, role: true, customScopes: true },
                  take: 1
                }
              }
            })
          : null

        token.role = (account?.role as UserRole | undefined) ?? 'CUSTOMER'
        const membership = account?.memberships[0]
        token.organizationId = membership?.organizationId
        token.scopes = membership
          ? getEffectiveScopes(membership.role as OrgMemberRole, membership.customScopes as { add?: Scope[]; remove?: Scope[] })
          : []
      }
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      session.user.role = (token.role as UserRole | undefined) ?? 'CUSTOMER'
      session.user.organizationId = token.organizationId as string | undefined
      session.user.scopes = (token.scopes as Scope[] | undefined) ?? []
      return session
    }
  }
})
