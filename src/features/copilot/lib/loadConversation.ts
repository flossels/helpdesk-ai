import type { UIMessage } from 'ai'

type StoredMessage = { id: string; role: string; contentText: string }

export function toUIMessages(rows: StoredMessage[]): UIMessage[] {
  return rows.map((row) => ({
    id: row.id,
    role: row.role === 'assistant' ? 'assistant' : 'user',
    parts: [{ type: 'text', text: row.contentText }]
  }))
}
