type Scope =
  | 'tickets:read'
  | 'tickets:write'
  | 'knowledge:read'
  | 'ai:use'

type ScopeInfo = {
  label: string
  description: string
  category: 'tickets' | 'knowledge' | 'ai'
}

const SCOPES = {
  'tickets:read': {
    label: 'View Tickets',
    description: 'Read and search tickets',
    category: 'tickets'
  },
  'tickets:write': {
    label: 'Edit Tickets',
    description: 'Create and reply to tickets',
    category: 'tickets'
  },
  'knowledge:read': {
    label: 'View Articles',
    description: 'Read knowledge base articles',
    category: 'knowledge'
  },
  'ai:use': {
    label: 'Use AI Copilot',
    description: 'Generate suggestions and summaries',
    category: 'ai'
  }
} satisfies Record<Scope, ScopeInfo>

// Type-safe access; autocomplete works
console.log(SCOPES['tickets:read'].label)
// 'View Tickets'

// Helper: check if a user has a scope
function hasScope(userScopes: Scope[], required: Scope): boolean {
  return userScopes.includes(required)
}

const viewerScopes: Scope[] = [
  'tickets:read',
  'knowledge:read'
]

console.log('Can read tickets:', hasScope(viewerScopes, 'tickets:read'))
console.log('Can write tickets:', hasScope(viewerScopes, 'tickets:write'))
