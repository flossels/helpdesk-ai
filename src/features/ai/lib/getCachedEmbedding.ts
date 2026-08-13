'use cache'

import { cacheLife } from 'next/cache'
import { embed } from 'ai'
import { getEmbeddingModel } from '@/features/ai/lib/getEmbeddingModel'

export async function getCachedQueryEmbedding(query: string) {
  cacheLife('days')

  const { embedding } = await embed({
    model: getEmbeddingModel(),
    value: query
  })

  return embedding
}
