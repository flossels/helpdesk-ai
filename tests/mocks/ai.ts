import { vi } from 'vitest'
import type * as AiSdk from 'ai'

// Mock only the functions that call the external model. `importOriginal`
// keeps the rest of the SDK real: `Output`, `tool`, `gateway`,
// `convertToModelMessages`, `stepCountIs`, and all type exports.
vi.mock('ai', async (importOriginal) => {
  const actual = await importOriginal<typeof AiSdk>()
  return {
    ...actual,
    generateText: vi.fn(),
    streamText: vi.fn()
  }
})

import { generateText, streamText } from 'ai'

export const mockGenerateText = vi.mocked(generateText)
export const mockStreamText = vi.mocked(streamText)

// Build a `generateText` result with a structured `output` and a usage
// record, shaped the way our AI actions read it.
export function textResult(output: unknown, usage = { inputTokens: 100, outputTokens: 50, totalTokens: 150 }) {
  return { text: '', output, usage } as unknown as Awaited<ReturnType<typeof generateText>>
}

// Build a `streamText` result whose `stream` yields the canned chunks the
// route will wrap (streamText is synchronous, so we use mockReturnValue).
// The stub also carries `consumeStream`, which routes call to keep their
// `onEnd` running after the client disconnects.
export function streamResult(stream: ReadableStream) {
  return {
    stream,
    consumeStream: vi.fn(async () => undefined)
  } as unknown as ReturnType<typeof streamText>
}
