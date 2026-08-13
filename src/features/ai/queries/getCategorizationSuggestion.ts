import 'server-only'
import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { Categorization } from '@/features/ai/schemas/categorization'

export const getCategorizationSuggestion = cache(
  async (ticketId: string, organizationId: string): Promise<Categorization | null> => {
    const latest = await db.activityLog.findFirst({
      where: {
        organizationId,
        entityType: 'ticket',
        entityId: ticketId,
        action: { startsWith: 'ai.categoriz' }
      },
      orderBy: { createdAt: 'desc' },
      select: { action: true, metadata: true }
    })

    if (latest?.action !== 'ai.categorization_suggested') return null
    return latest.metadata as Categorization
  }
)
