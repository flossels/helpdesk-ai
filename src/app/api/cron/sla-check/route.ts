import { db } from '@/shared/lib/db'
import { warnSlaBreach } from '@/features/tickets/lib/warnSlaBreach'

// Vercel Cron calls this route on the schedule defined in vercel.ts and
// authenticates with `Bearer ${CRON_SECRET}`. Anyone else gets a 401.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Tickets whose SLA deadline falls within the next 25 hours and that are
  // still open, an hour wider than the daily schedule. The scan crosses
  // organizations, so each ticket carries its own tenant into the call.
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
