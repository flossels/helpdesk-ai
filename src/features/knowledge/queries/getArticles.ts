import 'server-only'
import { cache } from 'react'
import { db } from '@/shared/lib/db'

export const getArticles = cache(async (organizationId: string) => {
  return db.article.findMany({
    where: { organizationId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      _count: { select: { embeddings: true } }
    }
  })
})
