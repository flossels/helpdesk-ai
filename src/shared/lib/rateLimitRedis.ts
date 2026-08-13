import 'server-only'

import { Redis as Upstash } from '@upstash/redis'
import { redis as ioredis } from '@/shared/lib/redis'
import type { RateLimitConfig, RateLimitResult } from '@/shared/lib/rateLimit'

// Both clients answer the two commands the counter needs. The native
// client serves the self-hosted stack over its socket, the REST client
// serves Vercel; REDIS_URL decides, once per process.
type Counter = {
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<unknown>
}

let client: Counter | null = null

function counter(): Counter {
  client ??= process.env.REDIS_URL ? ioredis : Upstash.fromEnv()
  return client
}

export async function rateLimitRedis(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const window = Math.floor(Date.now() / config.windowMs)
  const windowKey = `rate:${key}:${window}`
  const resetAt = new Date((window + 1) * config.windowMs)

  const count = await counter().incr(windowKey)
  if (count === 1) {
    await counter().expire(windowKey, Math.ceil(config.windowMs / 1000))
  }

  return {
    allowed: count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - count),
    resetAt
  }
}
