'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { createSavedViewSchema, deleteSavedViewSchema } from '@/features/saved-views/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateSavedViewInput, DeleteSavedViewInput } from '@/features/saved-views/schemas'

export async function createSavedView(input: CreateSavedViewInput): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'tickets:read')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = createSavedViewSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'Invalid input.', fieldErrors: z.flattenError(parsed.error).fieldErrors }
    }

    const view = await db.savedView.create({
      data: {
        name: parsed.data.name,
        status: parsed.data.status ?? null,
        search: parsed.data.search ?? null,
        organizationId: user.organizationId,
        createdById: user.id
      },
      select: { id: true }
    })

    revalidatePath('/tickets')
    return { success: true, data: view }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to create saved view:', error)
    return { success: false, error: 'Could not save the view.' }
  }
}

export async function deleteSavedView(input: DeleteSavedViewInput): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'tickets:read')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = deleteSavedViewSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'Invalid input.', fieldErrors: z.flattenError(parsed.error).fieldErrors }
    }

    const deleted = await db.savedView.deleteMany({
      where: { id: parsed.data.id, organizationId: user.organizationId }
    })
    if (deleted.count === 0) return { success: false, error: 'View not found.' }

    revalidatePath('/tickets')
    return { success: true, data: { id: parsed.data.id } }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to delete saved view:', error)
    return { success: false, error: 'Could not delete the view.' }
  }
}
