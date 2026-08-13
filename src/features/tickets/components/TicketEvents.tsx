'use client'

import { useTicketEvents } from '@/features/tickets/hooks/useTicketEvents'

export function TicketEvents() {
  useTicketEvents()
  return null
}
