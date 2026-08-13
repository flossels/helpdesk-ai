import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/shared/lib/db'

export async function getPublicOrganizationId(): Promise<string | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('organizations')

  const org = await db.organization.findFirst({
    orderBy: { name: 'asc' },
    select: { id: true }
  })
  return org?.id ?? null
}
