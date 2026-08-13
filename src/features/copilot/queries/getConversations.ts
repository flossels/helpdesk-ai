import 'server-only'
import { cache } from 'react'
import { db } from '@/shared/lib/db'

const messageSelect = {
  select: { id: true, role: true, contentText: true },
  orderBy: { createdAt: 'asc' }
} as const

export const getConversation = cache(async (conversationId: string, agentId: string) => {
  return db.copilotConversation.findFirst({
    where: { id: conversationId, agentId },
    select: { id: true, title: true, messages: messageSelect }
  })
})

export const getConversations = cache(async (agentId: string) => {
  return db.copilotConversation.findMany({
    where: { agentId },
    select: { id: true, title: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 20
  })
})

export const getLatestTicketConversation = cache(async (ticketId: string, agentId: string) => {
  return db.copilotConversation.findFirst({
    where: { ticketId, agentId },
    select: { id: true, messages: messageSelect },
    orderBy: { updatedAt: 'desc' }
  })
})
