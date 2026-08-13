import type { DefaultSession } from 'next-auth'
import type { Scope, UserRole } from '@/shared/types/scopes'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      organizationId?: string
      scopes: Scope[]
    } & DefaultSession['user']
  }
}
