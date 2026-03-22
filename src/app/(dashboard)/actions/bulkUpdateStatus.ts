'use server'

import { updateTicketsInStore } from '@/lib/placeholderData'
import { ActionResult } from '@/shared/types/ActionResult'
import { BulkTicketUpdateInput, bulkTicketUpdateSchema } from '@/shared/types/ticket'
import { revalidatePath } from 'next/cache'
import z from 'zod'

type ReturnType = ActionResult<{
  updatedCount: number
}>

export const bulkUpdateStatus = async (input: BulkTicketUpdateInput): Promise<ReturnType> => {
  try {
    const parsed = bulkTicketUpdateSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    // TODO: Auth + scope check — Chapter 12
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
