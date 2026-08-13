import { describe, expect, it } from 'vitest'

import { rateLimit } from '@/shared/lib/rateLimit'

describe('rateLimit', () => {
  it('allows requests up to the cap and refuses the next one', async () => {
    const key = `test-${Math.random()}`
    const config = { maxRequests: 2, windowMs: 60_000 }

    expect((await rateLimit(key, config)).allowed).toBe(true)
    expect((await rateLimit(key, config)).allowed).toBe(true)

    const blocked = await rateLimit(key, config)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('counts each key separately', async () => {
    const config = { maxRequests: 1, windowMs: 60_000 }
    await rateLimit('key-a', config)

    expect((await rateLimit('key-b', config)).allowed).toBe(true)
  })
})
