'use cache'

import { cacheLife } from 'next/cache'
import { embed } from 'ai'
import { getEmbeddingModel } from '@/features/ai/lib/getEmbeddingModel'

// Embedding a string is deterministic: the same query text always yields
// the same vector. Caching by argument turns a repeated search like
// "password reset" into a cache hit instead of an embedding API call.
export async function getCachedQueryEmbedding(query: string) {
  cacheLife('days')

  const { embedding } = await embed({
    model: getEmbeddingModel(),
    value: query
  })
  return embedding
}
