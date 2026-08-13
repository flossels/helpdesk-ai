import { describe, expect, it } from 'vitest'

import { sanitizeFilename } from '@/shared/lib/sanitizeFilename'

describe('sanitizeFilename', () => {
  it('keeps an ordinary name intact', () => {
    expect(sanitizeFilename('invoice-2026.pdf')).toBe('invoice-2026.pdf')
  })

  it('strips a path traversal attempt', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd')
  })

  it('removes null bytes and replaces unsafe characters', () => {
    expect(sanitizeFilename('re\0port name.pdf')).toBe('report_name.pdf')
  })

  it('bounds the length', () => {
    expect(sanitizeFilename('a'.repeat(300))).toHaveLength(100)
  })
})
