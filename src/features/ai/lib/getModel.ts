import 'server-only'

import { gateway } from 'ai'
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '@/features/ai/lib/aiConfig'

// A stored id can outlive the list that offered it, so an unknown one falls
// back instead of failing the feature. Callers resolve first and log what
// they resolved to, or the usage ledger records a model we never called.
export function resolveModelId(modelId: string) {
  return AVAILABLE_MODELS.some((model) => model.id === modelId) ? modelId : DEFAULT_MODEL
}

export function getModel(modelId: string) {
  return gateway(resolveModelId(modelId))
}
