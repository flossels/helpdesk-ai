import { cache } from 'react'
import { getTicketByIdFromStore } from '@/shared/lib/placeholderData'

export const getTicketById = cache(async (id: string) => {
  return getTicketByIdFromStore(id)
})
