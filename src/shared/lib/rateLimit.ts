import * as Sentry from '@sentry/nextjs'
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
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: new Date(entry.resetAt) }
}

// Pick the backend per call: Redis when either client is configured, the
// native one on our server or the REST one on Vercel, otherwise the
// in-memory store, which keeps tests and local dev free of any Redis.
const useRedis = Boolean(process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL)

export async function rateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const result = useRedis ? await rateLimitRedis(key, config) : rateLimitMemory(key, config)

  if (!result.allowed) {
    // A rejection is a security signal (abuse or a runaway client). Tag it
    // for Sentry alerting, dropping the key's last segment, which is the
    // IP or user id we do not want in an event.
    Sentry.captureMessage('Rate limit exceeded', {
      level: 'warning',
      tags: { endpoint: key.split(':').slice(0, -1).join(':') }
    })
  }

  return result
}
