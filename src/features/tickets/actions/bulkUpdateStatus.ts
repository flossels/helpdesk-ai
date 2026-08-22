'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { updateTicketsInStore } from '@/shared/lib/placeholderData'
import { bulkTicketUpdateSchema } from '@/features/tickets/schemas'
import type { ActionResult } from '@/shared/types/actionResult'
import type { BulkTicketUpdateInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  updatedCount: number
}>

export async function bulkUpdateStatus(input: BulkTicketUpdateInput): Promise<ReturnType> {
  try {
    // 1. Validate input
    const parsed = bulkTicketUpdateSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    // 2. Auth: placeholder
    // Auth + scope check arrives in Chapter 12

    // 3. Bulk update the tickets
    const count = updateTicketsInStore(parsed.data.ticketIds, { status: parsed.data.status })

    revalidatePath('/tickets')

    return {
      success: true,
      data: { updatedCount: count }
    }
  } catch (error) {
    console.error('Failed to bulk update:', error)

    return {
      success: false,
      error: 'Could not update tickets.'
    }
  }
}
