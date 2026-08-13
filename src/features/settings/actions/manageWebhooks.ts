'use server'

import { randomBytes } from 'node:crypto'
import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { createWebhookSchema } from '@/features/settings/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateWebhookInput } from '@/features/settings/schemas'

export async function createWebhook(input: CreateWebhookInput): Promise<ActionResult<{ secret: string }>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'settings:manage')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = createWebhookSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'Invalid input.', fieldErrors: z.flattenError(parsed.error).fieldErrors }
    }

    const secret = `whsec_${randomBytes(24).toString('hex')}`

    await db.webhook.create({
      data: {
        organizationId: user.organizationId,
        url: parsed.data.url,
        events: parsed.data.events,
        secret
      }
    })

    revalidatePath('/settings/webhooks')

    return { success: true, data: { secret } }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to create webhook:', error)
    return { success: false, error: 'Could not register the webhook.' }
  }
}

export async function deleteWebhook(webhookId: string): Promise<ActionResult<null>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'settings:manage')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    await db.webhook.deleteMany({ where: { id: webhookId, organizationId: user.organizationId } })
    revalidatePath('/settings/webhooks')

    return { success: true, data: null }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to delete webhook:', error)
    return { success: false, error: 'Could not delete the webhook.' }
  }
}
