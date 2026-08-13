'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { createApiKeySchema } from '@/features/mcp/schemas'
import { generateApiKey } from '@/features/mcp/lib/hashApiKey'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateApiKeyInput } from '@/features/mcp/schemas'

export async function createApiKey(input: CreateApiKeyInput): Promise<ActionResult<{ plaintext: string }>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'settings:manage')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = createApiKeySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'Invalid input.', fieldErrors: z.flattenError(parsed.error).fieldErrors }
    }

    const { plaintext, keyHash } = generateApiKey()
    await db.apiKey.create({
      data: {
        name: parsed.data.name,
        keyHash,
        organizationId: user.organizationId
      }
    })

    revalidatePath('/settings/api-keys')
    return { success: true, data: { plaintext } }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to create API key:', error)
    return { success: false, error: 'Could not create the key.' }
  }
}

export async function revokeApiKey(apiKeyId: string): Promise<ActionResult<null>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'settings:manage')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    await db.apiKey.updateMany({
      where: { id: apiKeyId, organizationId: user.organizationId },
      data: { isActive: false }
    })

    revalidatePath('/settings/api-keys')
    return { success: true, data: null }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to revoke API key:', error)
    return { success: false, error: 'Could not revoke the key.' }
  }
}
