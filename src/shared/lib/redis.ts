import 'server-only'

import Redis from 'ioredis'

// One ioredis client per process for the self-hosted stack. lazyConnect
// defers the TCP connection until the first command, so importing this
// module (including during the build) never tries to reach Redis; it
// reconnects on its own afterward. The rate limiter and the health check
// both use this client when REDIS_URL is set.
export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  lazyConnect: true
})
