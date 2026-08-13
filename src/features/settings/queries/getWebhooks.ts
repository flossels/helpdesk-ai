import 'server-only'

import { db } from '@/shared/lib/db'

export async function getWebhooks(organizationId: string) {
  return db.webhook.findMany({
    where: { organizationId },
    select: { id: true, url: true, events: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
}
