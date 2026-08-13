import 'server-only'

import { cache } from 'react'
import { getTicketSummaryFromStore } from '@/shared/lib/placeholderData'

export const getTicketSummary = cache(async () => {
  return getTicketSummaryFromStore()
})
