import { db } from '@/shared/lib/db'
import { warnSlaBreach } from '@/features/tickets/lib/warnSlaBreach'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const cutoff = new Date(now.getTime() + 25 * 60 * 60_000)

  const tickets = await db.ticket.findMany({
    where: {
      isDeleted: false,
      status: { in: ['OPEN', 'IN_PROGRESS'] },
      slaDeadline: { gte: now, lte: cutoff }
    },
    select: { id: true, organizationId: true }
  })

  for (const ticket of tickets) {
    await warnSlaBreach(ticket.id, ticket.organizationId)
  }

  return Response.json({ checked: tickets.length })
}
