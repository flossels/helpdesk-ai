'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { customerReplySchema } from '@/features/tickets/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CustomerReplyInput } from '@/features/tickets/schemas'

export async function customerReply(input: CustomerReplyInput): Promise<ActionResult<{ replyId: string }>> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }

    const parsed = customerReplySchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const ticket = await db.ticket.findUnique({
      where: { id: parsed.data.ticketId },
      select: { customerId: true }
    })
    if (ticket?.customerId !== user.id) {
      return { success: false, error: 'Ticket not found.' }
    }

    const reply = await db.ticketReply.create({
      data: {
        ticketId: parsed.data.ticketId,
        authorId: user.id,
        content: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: parsed.data.body }] }]
        },
        contentText: parsed.data.body
      },
      select: { id: true }
    })

    revalidatePath(`/portal/${parsed.data.ticketId}`)
    return { success: true, data: { replyId: reply.id } }
  } catch (error) {
    console.error('Customer reply failed:', error)
    return { success: false, error: 'Could not post the reply.' }
  }
}
