import 'server-only'

import { db } from '@/shared/lib/db'
import type { TicketPriority } from '@/shared/types/ticket'

export async function computeSlaDeadline(organizationId: string, priority: TicketPriority) {
  const rule = await db.slaRule.findUnique({
    where: { organizationId_priority: { organizationId, priority } },
    select: { responseMinutes: true }
  })
  if (!rule) return null

  return new Date(Date.now() + rule.responseMinutes * 60_000)
}
