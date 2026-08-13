import 'server-only'
import { db } from '@/shared/lib/db'
import type { Prisma } from '@/shared/types/database'

type LogActivityInput = {
  organizationId: string
  userId: string
  action: string
  entityType: string
  entityId: string
  metadata?: Prisma.InputJsonValue
}

export async function logActivity(input: LogActivityInput) {
  await db.activityLog.create({ data: input })
}
