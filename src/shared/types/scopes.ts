// Platform-level role (on User)
export type UserRole = 'CUSTOMER' | 'AGENT'

// Organization-level role (on OrgMember)
export type OrgMemberRole = 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER'

export type Scope =
  | 'tickets:read'
  | 'tickets:write'
  | 'tickets:assign'
  | 'tickets:delete'
  | 'tickets:bulk'
  | 'internal_notes:write'
  | 'knowledge:read'
  | 'knowledge:write'
  | 'knowledge:publish'
  | 'settings:manage'
  | 'members:manage'
  | 'ai:use'
  | 'ai:configure'
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
    label: 'Manage Tickets',
    description: 'Create tickets and post replies',
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
  'tickets:bulk': {
    label: 'Bulk Actions',
    description: 'Update many tickets at once',
    category: 'tickets'
  },
  'internal_notes:write': {
    label: 'Write Internal Notes',
    description: 'Add private notes visible only to agents',
    category: 'tickets'
  },
  'knowledge:read': {
    label: 'View Knowledge Base',
    description: 'Read knowledge base articles',
    category: 'knowledge'
  },
  'knowledge:write': {
    label: 'Edit Articles',
    description: 'Create and edit knowledge base articles',
    category: 'knowledge'
  },
  'knowledge:publish': {
    label: 'Publish Articles',
    description: 'Publish and unpublish articles',
    category: 'knowledge'
  },
  'settings:manage': {
    label: 'Manage Settings',
    description: 'Configure organization settings',
    category: 'admin'
  },
  'members:manage': {
    label: 'Manage Members',
    description: 'Invite and manage team members',
    category: 'admin'
  },
  'ai:use': {
    label: 'Use AI',
    description: 'Use AI drafting and the copilot',
    category: 'ai'
  },
  'ai:configure': {
    label: 'Configure AI',
    description: 'Change the AI model and token budget',
    category: 'ai'
  },
  'analytics:view': {
    label: 'View Analytics',
    description: 'View dashboards and reports',
    category: 'admin'
  }
} satisfies Record<Scope, ScopeInfo>

export const ROLE_SCOPES: Record<OrgMemberRole, Scope[]> = {
  OWNER: Object.keys(SCOPES) as Scope[],
  ADMIN: Object.keys(SCOPES) as Scope[],
  AGENT: [
    'tickets:read',
    'tickets:write',
    'tickets:assign',
    'internal_notes:write',
    'knowledge:read',
    'knowledge:write',
    'ai:use',
    'analytics:view'
  ],
  VIEWER: ['tickets:read', 'knowledge:read', 'analytics:view']
}
