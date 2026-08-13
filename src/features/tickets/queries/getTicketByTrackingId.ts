import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'

export const getTicketByTrackingId = cache(async (trackingId: string) => {
  return db.ticket.findUnique({
    where: { trackingId },
    select: {
      id: true,
      trackingId: true,
      subject: true,
      status: true,
      updatedAt: true
    }
  })
})
