import 'server-only'

import { cache } from 'react'
import { auth } from '@/auth'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user) return null

  return {
    id: session.user.id,
    name: session.user.name,
    role: session.user.role,
    organizationId: session.user.organizationId,
    scopes: session.user.scopes
  }
})
