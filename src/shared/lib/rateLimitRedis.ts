import 'server-only'

import { Redis } from '@upstash/redis'
import type { RateLimitConfig, RateLimitResult } from '@/shared/lib/rateLimit'

let client: Redis | null = null

function redis(): Redis {
  client ??= Redis.fromEnv()
  return client
}

export async function rateLimitRedis(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const window = Math.floor(Date.now() / config.windowMs)
  const windowKey = `rate:${key}:${window}`
  const resetAt = new Date((window + 1) * config.windowMs)

  const count = await redis().incr(windowKey)
  if (count === 1) {
    await redis().expire(windowKey, Math.ceil(config.windowMs / 1000))
  }

  return {
    allowed: count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - count),
    resetAt
  }
}
