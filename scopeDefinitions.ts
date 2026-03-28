type Scope =
  | 'tickets:read'
  | 'tickets:write'
  | 'tickets:assign'
  | 'tickets:delete'
  | 'knowledge:read'
  | 'knowledge:write'
  | 'settings:manage'
  | 'members:manage'
  | 'ai:use'
  | 'analytics:view'

type ScopeInfo = {
  label: string
  description: string
  category: 'tickets' | 'knowledge' | 'admin' | 'ai'
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
  'tickets:assign': {
    label: 'Assign Tickets',
    description: 'Assign tickets to agents',
    category: 'tickets'
  },
  'tickets:delete': {
    label: 'Delete Tickets',
    description: 'Soft-delete tickets',
    category: 'tickets'
  },
  'knowledge:read': {
    label: 'View Articles',
    description: 'Read knowledge base articles',
    category: 'knowledge'
  },
  'knowledge:write': {
    label: 'Edit Articles',
    description: 'Create and edit articles',
    category: 'knowledge'
  },
  'settings:manage': {
    label: 'Manage Settings',
    description: 'Organization and category settings',
    category: 'admin'
  },
  'members:manage': {
    label: 'Manage Members',
    description: 'Invite agents, assign roles',
    category: 'admin'
  },
  'ai:use': {
    label: 'Use AI Copilot',
    description: 'Generate suggestions and summaries',
    category: 'ai'
  },
  'analytics:view': {
    label: 'View Analytics',
    description: 'Dashboard metrics and reports',
    category: 'admin'
  }
} satisfies Record<Scope, ScopeInfo>

// Type-safe access — autocomplete works
console.log(SCOPES['tickets:read'].label)
// 'View Tickets'

// Helper: check if a user has a scope
function hasScope(userScopes: Scope[], required: Scope): boolean {
  return userScopes.includes(required)
}

const agentScopes: Scope[] = [
  'tickets:read',
  'tickets:write',
  'ai:use'
]

console.log('Can read tickets:', hasScope(agentScopes, 'tickets:read'))
console.log('Can manage settings:', hasScope(agentScopes, 'settings:manage'))