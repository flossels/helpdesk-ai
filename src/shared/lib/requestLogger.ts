import 'server-only'

import { logger } from '@/shared/lib/logger'

export function createRequestLogger(context: { action: string; requestId?: string }) {
  return logger.child({
    action: context.action,
    requestId: context.requestId ?? crypto.randomUUID()
  })
}
