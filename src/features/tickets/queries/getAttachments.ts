import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'

export const getAttachments = cache(async (entityType: string, entityId: string, organizationId: string) => {
  return db.attachment.findMany({
    where: { entityType, entityId, organizationId, status: 'ACTIVE' },
    select: { id: true, fileName: true, fileType: true, fileSize: true },
    orderBy: { createdAt: 'asc' }
  })
})
