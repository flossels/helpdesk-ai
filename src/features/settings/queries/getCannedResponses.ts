import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { JSONContent } from '@tiptap/react'
import type { CannedResponseItem } from '@/features/settings/types'

export const getCannedResponses = cache(async (organizationId: string): Promise<CannedResponseItem[]> => {
  const rows = await db.cannedResponse.findMany({
    where: { organizationId },
    select: { id: true, title: true, content: true },
    orderBy: { title: 'asc' }
  })

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content as JSONContent
  }))
})
