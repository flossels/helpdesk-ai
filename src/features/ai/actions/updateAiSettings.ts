'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { aiSettingsSchema } from '@/features/ai/schemas/aiSettings'
import type { ActionResult } from '@/shared/types/actionResult'
import type { AiSettingsInput } from '@/features/ai/schemas/aiSettings'

export async function updateAiSettings(input: AiSettingsInput): Promise<ActionResult<null>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'ai:configure')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = aiSettingsSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid settings.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    await db.organization.update({ where: { id: user.organizationId }, data: parsed.data })

    revalidatePath('/settings/ai')
    return { success: true, data: null }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to update AI settings:', error)
    return { success: false, error: 'Could not save settings.' }
  }
}
