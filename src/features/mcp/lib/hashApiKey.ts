import { createHash, randomBytes } from 'node:crypto'

const KEY_PREFIX = 'hd_sk_'

export function hashApiKey(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex')
}

export function generateApiKey(): { plaintext: string; keyHash: string } {
  const plaintext = `${KEY_PREFIX}${randomBytes(24).toString('base64url')}`
  return { plaintext, keyHash: hashApiKey(plaintext) }
}
