import { rateLimitRedis } from '@/shared/lib/rateLimitRedis'

export type RateLimitConfig = {
  maxRequests: number
  windowMs: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: Date
}

const store = new Map<string, { count: number; resetAt: number }>()

function rateLimitMemory(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: new Date(resetAt) }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: new Date(entry.resetAt) }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: new Date(entry.resetAt)
  }
}

const useRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL)

export async function rateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  if (useRedis) return rateLimitRedis(key, config)
  return rateLimitMemory(key, config)
}
