import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import { ticketListSelect } from '@/features/tickets/queries/getTickets'
import type { TicketListItem } from '@/features/tickets/types'

export const searchTickets = cache(async (query: string): Promise<TicketListItem[]> => {
  const matches = await db.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Ticket"
        WHERE "isDeleted" = false
          AND to_tsvector('english', subject || ' ' || description)
              @@ websearch_to_tsquery('english', ${query})
        ORDER BY ts_rank(
          to_tsvector('english', subject || ' ' || description),
          websearch_to_tsquery('english', ${query})
        ) DESC
        LIMIT 50
      `

  const ids = matches.map((row) => row.id)
  const tickets = await db.ticket.findMany({
    where: { id: { in: ids } },
    select: ticketListSelect
  })

  // Preserve the relevance order from the ranked search
  const byId = new Map(tickets.map((t) => [t.id, t]))
  return ids.map((id) => byId.get(id)).filter((t): t is TicketListItem => t !== undefined)
})
