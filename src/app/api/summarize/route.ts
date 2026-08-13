import { createUIMessageStreamResponse, toUIMessageStream } from 'ai'
import { z } from 'zod'
import { db } from '@/shared/lib/db'
import { requireAuthApi } from '@/features/ai/lib/requireAuthApi'
import { isWithinBudget } from '@/features/ai/lib/checkBudget'
import { formatTicketThread } from '@/features/ai/lib/formatTicketThread'
import { streamTicketSummary } from '@/features/ai/lib/summarizeTicket'
import { getTicketThread } from '@/features/tickets/queries/getTicketThread'

// Runs on the default Node.js runtime (Fluid Compute on Vercel), needed
// for Prisma and well-suited to long-lived streaming connections.

const bodySchema = z.object({ ticketId: z.string().min(1) })

export async function POST(request: Request) {
  const auth = await requireAuthApi('ai:use')
  if ('response' in auth) return auth.response
  const { user } = auth

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new Response('Bad request', { status: 400 })
  const { ticketId } = parsed.data

  const ticket = await getTicketThread(ticketId, user.organizationId)
  if (!ticket) return new Response('Not found', { status: 404 })

  if (!(await isWithinBudget(user.organizationId))) {
    return new Response('Token budget exceeded', { status: 403 })
  }

  const org = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: { aiModel: true }
  })
  if (!org) return new Response('Not found', { status: 404 })

  const result = streamTicketSummary({
    model: org.aiModel,
    organizationId: user.organizationId,
    userId: user.id,
    thread: formatTicketThread(ticket)
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error('Summary stream failed:', error)
        return 'The summary could not be completed.'
      }
    })
  })
}
