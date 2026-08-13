import 'server-only'

import { after } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { publishEvent } from '@/shared/lib/eventBus'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { trackServerEvent } from '@/shared/lib/analytics/mixpanelServer'
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@/shared/types/ticket'
import { computeSlaDeadline } from '@/features/tickets/lib/computeSlaDeadline'
import { generateTrackingId } from '@/features/tickets/lib/generateTrackingId'
import { categorizeTicket } from '@/features/ai/actions/categorizeTicket'
import { getDefaultCategoryId, getSystemCustomerId } from '@/features/mcp/lib/apiTicketDefaults'
import type { McpServer, ServerContext, CallToolResult } from '@modelcontextprotocol/server'

function organizationIdFrom(ctx: ServerContext): string {
  const organizationId = ctx.http?.authInfo?.extra?.organizationId
  if (typeof organizationId !== 'string') {
    throw new Error('Missing organization context on the MCP request.')
  }
  return organizationId
}

function jsonResult(data: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    'searchTickets',
    {
      description: 'Search support tickets by query, status, or priority',
      inputSchema: {
        query: z.string().optional().describe('Search term'),
        status: z.enum(TICKET_STATUSES).optional(),
        priority: z.enum(TICKET_PRIORITIES).optional(),
        limit: z.number().min(1).max(50).default(10)
      }
    },
    async ({ query, status, priority, limit }, ctx) => {
      const organizationId = organizationIdFrom(ctx)
      const tickets = await db.ticket.findMany({
        where: {
          organizationId,
          isDeleted: false,
          ...(status && { status }),
          ...(priority && { priority }),
          ...(query && {
            OR: [{ subject: { contains: query, mode: 'insensitive' } }, { trackingId: { contains: query, mode: 'insensitive' } }]
          })
        },
        select: {
          trackingId: true,
          subject: true,
          status: true,
          priority: true,
          category: { select: { name: true } }
        },
        take: limit,
        orderBy: { updatedAt: 'desc' }
      })
      return jsonResult(tickets)
    }
  )

  server.registerTool(
    'readArticle',
    {
      description: 'Read a published knowledge base article by its slug',
      inputSchema: {
        slug: z.string().describe('The article slug, for example password-reset'),
        locale: z.string().default('en').describe('Locale of the article')
      }
    },
    async ({ slug, locale }, ctx) => {
      const organizationId = organizationIdFrom(ctx)
      const article = await db.article.findFirst({
        where: { slug, locale, organizationId, status: 'PUBLISHED' },
        select: { title: true, slug: true, excerpt: true, contentText: true, updatedAt: true }
      })
      if (!article) return jsonResult({ error: 'Article not found.' })
      return jsonResult(article)
    }
  )

  server.registerTool(
    'createTicket',
    {
      description: 'Create a support ticket from an external agent',
      inputSchema: {
        subject: z.string().min(3).max(200).describe('Short summary of the problem'),
        description: z.string().min(10).describe('The full problem description'),
        priority: z.enum(TICKET_PRIORITIES).default('MEDIUM')
      }
    },
    async (input, ctx) => {
      const organizationId = organizationIdFrom(ctx)
      const [customerId, categoryId] = await Promise.all([
        getSystemCustomerId(organizationId),
        getDefaultCategoryId(organizationId)
      ])

      const ticket = await db.ticket.create({
        data: {
          trackingId: await generateTrackingId(),
          subject: input.subject,
          description: input.description,
          priority: input.priority,
          slaDeadline: await computeSlaDeadline(organizationId, input.priority),
          categoryId,
          customerId,
          organizationId
        },
        select: { id: true, trackingId: true, subject: true, status: true, priority: true }
      })

      publishEvent({
        organizationId,
        type: 'ticket.created',
        data: { ticketId: ticket.id }
      })

      after(() => categorizeTicket(ticket.id, organizationId))

      after(() => trackServerEvent(ANALYTICS_EVENTS.ticketCreated, organizationId, { priority: input.priority }))

      after(() =>
        dispatchWebhooks(organizationId, {
          type: 'ticket.created',
          data: { ticketId: ticket.id, trackingId: ticket.trackingId }
        }).catch((error) => {
          Sentry.captureException(error)
          console.error('Webhook dispatch failed:', error)
        })
      )

      const { id: _id, ...result } = ticket
      return jsonResult(result)
    }
  )
}
