import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/shared/lib/db'

export async function getCategories() {
  'use cache'
  cacheLife('hours')
  cacheTag('categories')

  return db.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
}
