import { cache } from 'react'
import { getTicketByTrackingIdFromStore } from '@/shared/lib/placeholderData'

export const getTicketByTrackingId = cache(async (trackingId: string) => {
  return getTicketByTrackingIdFromStore(trackingId)
})
