import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDb } from '@/tests/mocks/db'
import type { Scope } from '@/shared/types/scopes'
import type { ToolExecutionOptions } from 'ai'

vi.mock('@/features/ai/lib/searchEmbeddings', () => ({
  embedQuery: vi.fn(async () => [0.1, 0.2, 0.3]),
  searchTicketEmbeddings: vi.fn(async () => []),
  searchArticleEmbeddings: vi.fn(async () => [])
}))

import { createCopilotTools } from '@/features/copilot/lib/createCopilotTools'
import { searchArticleEmbeddings, searchTicketEmbeddings } from '@/features/ai/lib/searchEmbeddings'

const mockSearchArticles = vi.mocked(searchArticleEmbeddings)
const mockSearchTickets = vi.mocked(searchTicketEmbeddings)

const agentCtx = {
  organizationId: 'org-1',
  userId: 'agent-1',
  model: 'openai/gpt-5.6-terra',
  scopes: ['tickets:read', 'tickets:write', 'knowledge:read'] as Scope[]
}

const readOnlyCtx = {
  organizationId: 'org-1',
  userId: 'viewer-1',
  model: 'openai/gpt-5.6-terra',
  scopes: ['tickets:read', 'knowledge:read', 'analytics:view'] as Scope[]
}

// Tool.execute takes (input, options); our tools ignore the options.
const toolOptions = {} as unknown as ToolExecutionOptions<never>

describe('createCopilotTools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searchTickets loads the tickets behind the matching chunks', async () => {
    mockSearchTickets.mockResolvedValueOnce([
      { ticketId: 'ticket-1' },
      { ticketId: 'ticket-1' },
      { ticketId: 'ticket-2' }
    ] as never)
    mockDb.ticket.findMany.mockResolvedValue([
      { trackingId: 'HD-0001', subject: 'Login issue', status: 'OPEN', priority: 'HIGH' }
    ] as never)

    const tools = createCopilotTools(agentCtx)
    const result = await tools.searchTickets.execute!({ query: 'login' }, toolOptions)

    expect(result).toHaveLength(1)
    expect(mockDb.ticket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { in: ['ticket-1', 'ticket-2'] } })
      })
    )
  })

  it('searchKnowledge maps chunks to article snippets', async () => {
    mockSearchArticles.mockResolvedValueOnce([
      {
        chunkText: 'Clear the token cache and sign in again to fix it.',
        chunkIndex: 0,
        articleId: 'article-1',
        articleTitle: 'Reset Guide',
        articleSlug: 'reset-guide',
        similarity: 0.91
      }
    ] as never)

    const tools = createCopilotTools(agentCtx)
    const tool = tools.searchKnowledge.execute!
    const result = (await tool({ query: 'password reset' }, toolOptions)) as {
      slug: string
      title: string
    }[]

    expect(result[0]?.title).toBe('Reset Guide')
    expect(result[0]?.slug).toBe('reset-guide')
  })

  it('findSimilarTickets matches on subject words and excludes the source', async () => {
    mockDb.ticket.findFirst.mockResolvedValue({ subject: 'Login fails after reset' } as never)
    mockDb.ticket.findMany.mockResolvedValue([])

    const tools = createCopilotTools(agentCtx)
    await tools.findSimilarTickets.execute!({ ticketId: 'ticket-1' }, toolOptions)

    expect(mockDb.ticket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: 'ticket-1' },
          OR: [
            { subject: { contains: 'Login', mode: 'insensitive' } },
            { subject: { contains: 'fails', mode: 'insensitive' } },
            { subject: { contains: 'after', mode: 'insensitive' } },
            { subject: { contains: 'reset', mode: 'insensitive' } }
          ]
        })
      })
    )
  })

  it('findSimilarTickets reports a missing ticket instead of guessing', async () => {
    mockDb.ticket.findFirst.mockResolvedValue(null)

    const tools = createCopilotTools(agentCtx)
    const result = await tools.findSimilarTickets.execute!({ ticketId: 'nope' }, toolOptions)

    expect(result).toEqual({ error: 'Ticket not found.' })
    expect(mockDb.ticket.findMany).not.toHaveBeenCalled()
  })

  it('registers write tools only when the scopes allow them', () => {
    const tools = createCopilotTools(readOnlyCtx)

    expect(tools).toHaveProperty('searchTickets')
    expect(tools).not.toHaveProperty('draftReply')
    expect(tools).not.toHaveProperty('updateTicket')
    expect(tools).not.toHaveProperty('createArticle')
  })

  it('refuses to assign a ticket without the tickets:assign scope', async () => {
    const tools = createCopilotTools(agentCtx)
    const result = await tools.updateTicket!.execute!({ ticketId: 'ticket-1', assigneeId: 'agent-2' }, toolOptions)

    expect(result).toEqual({ error: 'You cannot assign tickets.' })
    expect(mockDb.ticket.update).not.toHaveBeenCalled()
  })
})
