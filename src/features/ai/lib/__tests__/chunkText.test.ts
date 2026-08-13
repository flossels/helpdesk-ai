import { describe, expect, it } from 'vitest'
import { chunkText } from '@/features/ai/lib/chunkText'

describe('chunkText', () => {
  it('keeps a short text as a single chunk', () => {
    expect(chunkText('One short paragraph.')).toEqual(['One short paragraph.'])
  })

  it('splits on paragraph boundaries when the budget is exceeded', () => {
    const paragraph = 'x'.repeat(1200)
    const chunks = chunkText(`${paragraph}\n\n${paragraph}`, {
      maxTokens: 400
    })
    expect(chunks.length).toBeGreaterThan(1)
  })

  it('carries an overlap from the previous chunk', () => {
    const first = 'a'.repeat(1000)
    const second = 'b'.repeat(1000)
    const chunks = chunkText(`${first}\n\n${second}`, {
      maxTokens: 300,
      overlapTokens: 50
    })
    expect(chunks[1]?.startsWith('a')).toBe(true)
  })

  it('hard-splits a paragraph that exceeds the budget on its own', () => {
    const chunks = chunkText('y'.repeat(8000), {
      maxTokens: 500,
      overlapTokens: 50
    })
    // The real ceiling is the chunk budget, plus the overlap tail the next
    // chunk carries over, plus the blank line joining them.
    const ceiling = (500 + 50) * 4 + 2
    expect(chunks.length).toBeGreaterThan(1)
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(ceiling)
  })

  it('falls back to the whole text when there is nothing to split', () => {
    expect(chunkText('')).toEqual([''])
  })
})
