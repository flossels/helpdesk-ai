import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ReactNode } from 'react'
import type { Scope } from '@/shared/types/scopes'

type Props = {
  scope: Scope
  children: ReactNode
}

export async function ScopeGate({ scope, children }: Props) {
  const user = await getCurrentUser()
  if (!user || !hasScope(user.scopes, scope)) return null

  return <>{children}</>
}
