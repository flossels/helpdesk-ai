import 'server-only'
import { db } from '@/shared/lib/db'

export async function ensureConversation(input: {
  conversationId: string
  ticketId?: string
  agentId: string
  organizationId: string
  title: string
}) {
  const existing = await db.copilotConversation.findUnique({
    where: { id: input.conversationId },
    select: { agentId: true }
  })

  if (existing) return existing.agentId === input.agentId

  await db.copilotConversation.create({
    data: {
      id: input.conversationId,
      ticketId: input.ticketId ?? null,
      agentId: input.agentId,
      organizationId: input.organizationId,
      title: input.title.slice(0, 100)
    }
  })

  return true
}

export async function appendMessage(conversationId: string, role: 'user' | 'assistant', text: string, tokenCount: number) {
  await db.copilotConversation.update({
    where: { id: conversationId },
    data: {
      updatedAt: new Date(),
      messages: {
        create: {
          role,
          content: [{ type: 'text', text }],
          contentText: text,
          tokenCount
        }
      }
    }
  })
}
