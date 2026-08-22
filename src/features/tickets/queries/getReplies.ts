import { cache } from 'react'
import { getRepliesFromStore } from '@/shared/lib/placeholderData'

export const getReplies = cache(async (id: string) => {
  return getRepliesFromStore(id)
})
