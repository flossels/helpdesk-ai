import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/shared/lib/db'
import type { Prisma } from '@/shared/types/database'

const publishedArticleSelect = {
  title: true,
  slug: true,
  excerpt: true,
  updatedAt: true
} satisfies Prisma.ArticleSelect

export async function getPublishedArticles() {
  'use cache'
  cacheLife('articles')
  cacheTag('articles')

  return db.article.findMany({
    where: { status: 'PUBLISHED', isPublic: true },
    orderBy: { updatedAt: 'desc' },
    select: publishedArticleSelect
  })
}
