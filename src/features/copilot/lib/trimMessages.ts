import { messageText } from '@/features/copilot/lib/messageText'
import { estimateContextTokens } from '@/features/copilot/lib/estimateContextTokens'
import type { UIMessage } from 'ai'

const KEEP_RECENT = 4

export function trimMessages(messages: UIMessage[], systemTokens: number, limit: number): UIMessage[] {
  const tokensOf = (m: UIMessage) => estimateContextTokens(messageText(m))

  let total = systemTokens + messages.reduce((sum, m) => sum + tokensOf(m), 0)
  if (total <= limit) return messages

  const trimmed = [...messages]
  while (total > limit && trimmed.length > KEEP_RECENT) {
    const removed = trimmed.shift()
    if (!removed) break
    total -= tokensOf(removed)
  }
  return trimmed
}
