'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { bulkTicketUpdateSchema } from '@/features/tickets/schemas'
import type { ActionResult } from '@/shared/types/actionResult'
import type { BulkTicketUpdateInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  updatedCount: number
}>

export async function bulkUpdateStatus(input: BulkTicketUpdateInput): Promise<ReturnType> {
  try {
    const parsed = bulkTicketUpdateSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const result = await db.ticket.updateMany({
      where: { id: { in: parsed.data.ticketIds } },
      data: { status: parsed.data.status }
    })

    revalidatePath('/tickets')

    return {
      success: true,
      data: { updatedCount: result.count }
    }
  } catch (error) {
    console.error('Failed to bulk update:', error)
    return {
      success: false,
      error: 'Could not update tickets.'
    }
  }
}
