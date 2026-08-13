import { vi } from 'vitest'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { Scope } from '@/shared/types/scopes'

vi.mock('@/features/auth/queries/getCurrentUser', () => ({
  getCurrentUser: vi.fn()
}))

const mockGetCurrentUser = vi.mocked(getCurrentUser)

const AGENT_SCOPES: Scope[] = [
  'tickets:read',
  'tickets:write',
  'tickets:assign',
  'internal_notes:write',
  'knowledge:read',
  'knowledge:write',
  'ai:use',
  'analytics:view'
]

// getCurrentUser resolves to { id, name, role, organizationId, scopes }.
// These helpers simulate the common auth states.
export function mockAgent(scopes: Scope[] = AGENT_SCOPES) {
  mockGetCurrentUser.mockResolvedValue({
    id: 'agent-1',
    name: 'Sara Agent',
    role: 'AGENT',
    organizationId: 'org-1',
    scopes
  })
}

export function mockUnauthenticated() {
  mockGetCurrentUser.mockResolvedValue(null)
}
