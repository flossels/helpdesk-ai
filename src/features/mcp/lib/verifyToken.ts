import 'server-only'

import { db } from '@/shared/lib/db'
import { hashApiKey } from '@/features/mcp/lib/hashApiKey'
import type { AuthInfo } from '@modelcontextprotocol/server'

export async function verifyMcpToken(_request: Request, bearerToken?: string): Promise<AuthInfo | undefined> {
  if (!bearerToken) return undefined

  const keyHash = hashApiKey(bearerToken)
  const key = await db.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, organizationId: true, isActive: true }
  })
  if (!key?.isActive) return undefined

  await db.apiKey.update({
    where: { keyHash },
    data: { lastUsedAt: new Date() }
  })

  return {
    token: bearerToken,
    clientId: key.id,
    scopes: [],
    extra: { organizationId: key.organizationId }
  }
}
