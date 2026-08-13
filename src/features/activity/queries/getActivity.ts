import 'server-only'

import { db } from '@/shared/lib/db'

const PAGE_SIZE = 25

export async function getActivity(organizationId: string, cursor?: string) {
  const rows = await db.activityLog.findMany({
    where: { organizationId },
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      createdAt: true,
      user: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: PAGE_SIZE + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 })
  })

  const hasMore = rows.length > PAGE_SIZE
  const entries = hasMore ? rows.slice(0, PAGE_SIZE) : rows

  return { entries, nextCursor: hasMore ? entries[entries.length - 1]?.id : undefined }
}
