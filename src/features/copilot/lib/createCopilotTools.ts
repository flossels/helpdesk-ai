import 'server-only'
import { generateText, tool } from 'ai'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { publishEvent } from '@/shared/lib/eventBus'
import { logActivity } from '@/shared/lib/logActivity'
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/shared/types/ticket'
import { getModel } from '@/features/ai/lib/getModel'
import { formatTicketThread } from '@/features/ai/lib/formatTicketThread'
import { DRAFT_REPLY_PROMPT } from '@/features/ai/lib/prompts'
import { getTicketThread } from '@/features/tickets/queries/getTicketThread'
import type { Scope } from '@/shared/types/scopes'
import type { ToolApprovalStatus } from 'ai'

export type CopilotContext = {
  organizationId: string
  userId: string
  model: string
  scopes: Scope[]
}

const ticketSelect = {
  trackingId: true,
  subject: true,
  status: true,
  priority: true
}

export const COPILOT_TOOL_APPROVAL = {
  updateTicket: 'user-approval',
  createArticle: 'user-approval'
} satisfies Record<string, ToolApprovalStatus>

export function createCopilotTools(ctx: CopilotContext) {
  const canWrite = hasScope(ctx.scopes, 'tickets:write')
  const canKnowledgeWrite = hasScope(ctx.scopes, 'knowledge:write')

  const searchTickets = tool({
    description: 'Search tickets by keyword, optionally filtered by status or priority. Returns up to 10 matching tickets.',
    inputSchema: z.object({
      query: z.string().describe('Keywords to match in subject or body'),
      status: z.enum(TICKET_STATUSES).optional(),
      priority: z.enum(TICKET_PRIORITIES).optional()
    }),
    execute: ({ query, status, priority }) =>
      db.ticket.findMany({
        where: {
          organizationId: ctx.organizationId,
          isDeleted: false,
          status,
          priority,
          OR: [{ subject: { contains: query, mode: 'insensitive' } }, { description: { contains: query, mode: 'insensitive' } }]
        },
        select: ticketSelect,
        take: 10
      })
  })

  const searchKnowledge = tool({
    description: 'Search published knowledge base articles by keyword. Returns up to 5 articles with their slug and an excerpt.',
    inputSchema: z.object({ query: z.string().describe('Keywords to match in title or body') }),
    execute: async ({ query }) => {
      const articles = await db.article.findMany({
        where: {
          organizationId: ctx.organizationId,
          status: 'PUBLISHED',
          OR: [{ title: { contains: query, mode: 'insensitive' } }, { contentText: { contains: query, mode: 'insensitive' } }]
        },
        select: { slug: true, title: true, contentText: true },
        take: 5
      })
      return articles.map((a) => ({ slug: a.slug, title: a.title, excerpt: a.contentText.slice(0, 300) }))
    }
  })

  const findSimilarTickets = tool({
    description: 'Find tickets that resemble a given ticket, matched on its subject. Returns up to 5 tickets.',
    inputSchema: z.object({ ticketId: z.string().describe('The ticket to find neighbors for') }),
    execute: async ({ ticketId }) => {
      const ticket = await db.ticket.findFirst({
        where: { id: ticketId, organizationId: ctx.organizationId },
        select: { subject: true }
      })
      if (!ticket) return { error: 'Ticket not found.' }

      const words = ticket.subject
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 4)
      return db.ticket.findMany({
        where: {
          organizationId: ctx.organizationId,
          isDeleted: false,
          id: { not: ticketId },
          OR: words.map((w) => ({ subject: { contains: w, mode: 'insensitive' as const } }))
        },
        select: ticketSelect,
        take: 5
      })
    }
  })

  const draftReply = tool({
    description: 'Draft a reply to a ticket from its thread. Returns draft text only. It never sends the reply.',
    inputSchema: z.object({
      ticketId: z.string(),
      tone: z.enum(['professional', 'friendly', 'technical']).optional()
    }),
    execute: async ({ ticketId, tone }) => {
      const ticket = await getTicketThread(ticketId, ctx.organizationId)
      if (!ticket) return { error: 'Ticket not found.' }

      const result = await generateText({
        model: getModel(ctx.model),
        instructions: DRAFT_REPLY_PROMPT,
        prompt: `Tone: ${tone ?? 'professional'}\n\n${formatTicketThread(ticket)}`,
        maxOutputTokens: 3000
      })
      return { draft: result.text.trim() }
    }
  })

  const updateTicket = tool({
    description: "Update a ticket's status, priority, or assigned agent.",
    inputSchema: z.object({
      ticketId: z.string(),
      status: z.enum(TICKET_STATUSES).optional(),
      priority: z.enum(TICKET_PRIORITIES).optional(),
      assigneeId: z.string().optional()
    }),
    execute: async ({ ticketId, status, priority, assigneeId }) => {
      if (assigneeId && !hasScope(ctx.scopes, 'tickets:assign')) {
        return { error: 'You cannot assign tickets.' }
      }

      await db.ticket.update({
        where: { id: ticketId, organizationId: ctx.organizationId },
        data: { status, priority, assigneeId }
      })

      await logActivity({
        organizationId: ctx.organizationId,
        userId: ctx.userId,
        action: 'ai.ticket_updated',
        entityType: 'ticket',
        entityId: ticketId,
        metadata: { status, priority, assigneeId }
      })

      publishEvent({
        organizationId: ctx.organizationId,
        type: 'ticket:updated',
        data: { ticketId }
      })
      return { updated: ticketId }
    }
  })

  const createArticle = tool({
    description: 'Create a draft knowledge base article. It is never published directly.',
    inputSchema: z.object({
      title: z.string().describe('A specific, searchable title'),
      content: z.string().describe('The article body as plain text')
    }),
    execute: async ({ title, content }) => {
      const slug = `${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now()}`
      const article = await db.article.create({
        data: {
          organizationId: ctx.organizationId,
          authorId: ctx.userId,
          title,
          slug,
          content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }] },
          contentText: content,
          status: 'DRAFT'
        },
        select: { slug: true, title: true }
      })
      return { created: article.slug, title: article.title }
    }
  })

  return {
    searchTickets,
    searchKnowledge,
    findSimilarTickets,
    ...(canWrite ? { draftReply, updateTicket } : {}),
    ...(canKnowledgeWrite ? { createArticle } : {})
  }
}
