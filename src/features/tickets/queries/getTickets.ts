import { cache } from 'react'
import { getTicketsFromStore } from '@/shared/lib/placeholderData'
import type { TicketFilters } from '@/features/tickets/types'

export const getTickets = cache(async (filters: TicketFilters = {}) => {
  return getTicketsFromStore(filters)
})
