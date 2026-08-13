import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDb } from '@/tests/mocks/db'
import { mockStreamText, streamResult } from '@/tests/mocks/ai'

import type { Scope } from '@/shared/types/scopes'

// The levers: each one opens a different exit.
vi.mock('@/features/ai/lib/requireAuthApi', () => ({
  requireAuthApi: vi.fn()
}))
vi.mock('@/shared/lib/verifyOrigin', () => ({ verifyOrigin: vi.fn(async () => true) }))
vi.mock('@/features/ai/lib/checkBudget', () => ({
  getRemainingBudget: vi.fn(),
  budgetExceeded: vi.fn(() => () => false)
}))
vi.mock('@/features/copilot/lib/saveConversation', () => ({
  appendMessage: vi.fn(),
  ensureConversation: vi.fn(async () => true)
}))
// The ballast: neutralized so POST can run, never asserted on.
vi.mock('@/features/ai/lib/getModel', () => ({
  getModel: vi.fn(() => 'mock-model'),
  resolveModelId: vi.fn((id: string) => id)
}))
vi.mock('@/features/ai/lib/trackUsage', () => ({ trackUsage: vi.fn() }))
vi.mock('@/features/ai/lib/buildCopilotPrompt', () => ({
  buildCopilotPrompt: vi.fn(() => 'system prompt')
}))
vi.mock('@/features/tickets/queries/getTicketThread', () => ({
  getTicketThread: vi.fn()
}))
vi.mock('@/features/copilot/lib/messageText', () => ({
  messageText: vi.fn(() => 'Summarize this ticket')
}))
vi.mock('@/features/copilot/lib/estimateContextTokens', () => ({
  estimateContextTokens: vi.fn(() => 10)
}))
vi.mock('@/features/copilot/lib/trimMessages', () => ({
  trimMessages: vi.fn((messages: unknown) => messages)
}))
vi.mock('@/features/copilot/lib/createCopilotTools', () => ({
  createCopilotTools: vi.fn(() => ({})),
  COPILOT_TOOL_APPROVAL: {}
}))

import { POST } from '@/app/api/copilot/route'
import { requireAuthApi } from '@/features/ai/lib/requireAuthApi'
import { getRemainingBudget } from '@/features/ai/lib/checkBudget'
import { ensureConversation } from '@/features/copilot/lib/saveConversation'

const mockRequireAuthApi = vi.mocked(requireAuthApi)
const mockGetRemainingBudget = vi.mocked(getRemainingBudget)
const mockEnsureConversation = vi.mocked(ensureConversation)

const authedUser = {
  id: 'agent-1',
  organizationId: 'org-1',
  scopes: ['ai:use'] as Scope[]
}

function copilotRequest(body: unknown) {
  return new Request('http://localhost/api/copilot', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
    body: JSON.stringify(body)
  })
}

const userMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Summarize this ticket' }]
}

describe('POST /api/copilot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAuthApi.mockResolvedValue({ user: authedUser })
    mockGetRemainingBudget.mockResolvedValue(50_000)
    mockEnsureConversation.mockResolvedValue(true)
    mockDb.organization.findUnique.mockResolvedValue({
      aiModel: 'openai/gpt-5.6-terra'
    } as never)
    mockStreamText.mockReturnValue(
      streamResult(
        new ReadableStream({
          start(controller) {
            controller.enqueue({ type: 'text-start', id: 't1' })
            controller.enqueue({ type: 'text-delta', id: 't1', text: 'Hello' })
            controller.enqueue({ type: 'text-end', id: 't1' })
            controller.close()
          }
        })
      )
    )
  })

  it('returns a streaming response', async () => {
    const response = await POST(copilotRequest({ conversationId: 'conv-1', messages: [userMessage] }))

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/event-stream')
  })

  it('returns 401 when unauthenticated', async () => {
    mockRequireAuthApi.mockResolvedValue({
      response: new Response('Unauthorized', { status: 401 })
    })

    const response = await POST(copilotRequest({ conversationId: 'conv-1', messages: [userMessage] }))

    expect(response.status).toBe(401)
  })

  it('rejects a malformed body before spending anything', async () => {
    const response = await POST(copilotRequest({ conversationId: 'conv-1', messages: [] }))

    expect(response.status).toBe(400)
    expect(mockGetRemainingBudget).not.toHaveBeenCalled()
  })

  it('returns 403 when the token budget is exceeded', async () => {
    mockGetRemainingBudget.mockResolvedValue(0)

    const response = await POST(copilotRequest({ conversationId: 'conv-1', messages: [userMessage] }))

    expect(response.status).toBe(403)
    expect(mockStreamText).not.toHaveBeenCalled()
  })

  it('returns 403 when the conversation belongs to someone else', async () => {
    mockEnsureConversation.mockResolvedValue(false)

    const response = await POST(copilotRequest({ conversationId: 'conv-1', messages: [userMessage] }))

    expect(response.status).toBe(403)
    expect(mockStreamText).not.toHaveBeenCalled()
  })
})
