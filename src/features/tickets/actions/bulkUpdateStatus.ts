'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { bulkTicketUpdateSchema } from '@/features/tickets/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { BulkTicketUpdateInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  updatedCount: number
}>

export async function bulkUpdateStatus(input: BulkTicketUpdateInput): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'tickets:bulk') || !user.organizationId) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = bulkTicketUpdateSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const result = await db.ticket.updateMany({
      where: { id: { in: parsed.data.ticketIds }, organizationId: user.organizationId },
      data: { status: parsed.data.status }
    })

    revalidatePath('/tickets')

    return {
      success: true,
      data: { updatedCount: result.count }
    }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to bulk update:', error)
    return {
      success: false,
      error: 'Could not update tickets.'
    }
  }
}
