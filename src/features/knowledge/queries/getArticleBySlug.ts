import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/shared/lib/db'
import type { Prisma } from '@/shared/types/database'

const articleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  contentText: true,
  updatedAt: true
} satisfies Prisma.ArticleSelect

export async function getArticleBySlug(slug: string, locale: string) {
  'use cache'
  cacheLife('articles')
  cacheTag('articles')

  return db.article.findFirst({
    where: { slug, locale, status: 'PUBLISHED', isPublic: true },
    select: articleSelect
  })
}
