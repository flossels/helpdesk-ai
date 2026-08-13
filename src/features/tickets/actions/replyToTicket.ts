'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { addReplyToStore } from '@/shared/lib/placeholderData'
import { replyToTicketSchema } from '@/features/tickets/schemas'
import type { ActionResult } from '@/shared/types/actionResult'
import type { ReplyToTicketInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  replyId: string
}>

async function replyToTicket(input: ReplyToTicketInput): Promise<ReturnType> {
  try {
    const parsed = replyToTicketSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const reply = addReplyToStore({
      ticketId: parsed.data.ticketId,
      author: 'Agent',
      body: parsed.data.content
    })

    revalidatePath(`/tickets/${parsed.data.ticketId}`)

    return {
      success: true,
      data: { replyId: reply.id }
    }
  } catch (error) {
    console.error('Failed to add reply:', error)
    return {
      success: false,
      error: 'Could not post reply.'
    }
  }
}

export async function replyToTicketAction(_prevState: ReturnType | null, formData: FormData): Promise<ReturnType> {
  const input: ReplyToTicketInput = {
    ticketId: formData.get('ticketId') as string,
    content: formData.get('content') as string
  }

  return replyToTicket(input)
}
