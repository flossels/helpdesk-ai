import 'server-only'

import { db } from '@/shared/lib/db'

export async function getApiKeys(organizationId: string) {
  return db.apiKey.findMany({
    where: { organizationId },
    select: { id: true, name: true, isActive: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: 'desc' }
  })
}
