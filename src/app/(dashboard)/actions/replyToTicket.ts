'use server'

import { addReplyToStore } from '@/lib/placeholderData'
import { ActionResult } from '@/shared/types/actionResult'
import { ReplyToTicketInput, replyToTicketSchema } from '@/shared/types/ticket'
import { revalidatePath } from 'next/cache'
import z from 'zod'

type ReturnType = ActionResult<{
  replyId: string
}>

export const replyToTicketAction = async (_prevState: ReturnType | null, formData: FormData): Promise<ReturnType> => {
  const input: ReplyToTicketInput = {
    ticketId: formData.get('ticketId') as string,
    content: formData.get('content') as string
  }

  return replyToTicket(input)
}

const replyToTicket = async (input: ReplyToTicketInput): Promise<ReturnType> => {
  try {
    const parsed = replyToTicketSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    // TODO: Auth + scope check — Chapter 12
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
