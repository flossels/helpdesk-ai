import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'

export const getSavedViews = cache(async (organizationId: string) => {
  return db.savedView.findMany({
    where: { organizationId },
    select: { id: true, name: true, status: true, search: true },
    orderBy: { createdAt: 'desc' }
  })
})

export type SavedViewItem = Awaited<ReturnType<typeof getSavedViews>>[number]
