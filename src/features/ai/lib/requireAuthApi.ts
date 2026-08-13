import 'server-only'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { Scope } from '@/shared/types/scopes'

type AuthedApiUser = {
  id: string
  organizationId: string
  scopes: Scope[]
}

type AuthResult = { user: AuthedApiUser } | { response: Response }

export async function requireAuthApi(scope: Scope): Promise<AuthResult> {
  const user = await getCurrentUser()
  if (!user?.organizationId) return { response: new Response('Unauthorized', { status: 401 }) }
  if (!hasScope(user.scopes, scope)) return { response: new Response('Forbidden', { status: 403 }) }

  return {
    user: { id: user.id, organizationId: user.organizationId, scopes: user.scopes }
  }
}
