import 'server-only'
import { gateway } from 'ai'
import { EMBEDDING_CONFIG } from '@/features/ai/lib/aiConfig'

export function getEmbeddingModel() {
  return gateway.embeddingModel(EMBEDDING_CONFIG.model)
}
