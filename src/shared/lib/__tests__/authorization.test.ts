import { describe, expect, it } from 'vitest'

import { getEffectiveScopes, hasScope } from '@/shared/lib/authorization'

import type { Scope } from '@/shared/types/scopes'

const agentScopes: Scope[] = ['tickets:read', 'tickets:write', 'ai:use']

describe('hasScope', () => {
  it('grants a scope the user holds', () => {
    expect(hasScope(agentScopes, 'tickets:write')).toBe(true)
  })

  it('denies a scope the user lacks', () => {
    expect(hasScope(agentScopes, 'knowledge:publish')).toBe(false)
  })

  it('denies everything for an empty scope list', () => {
    expect(hasScope([], 'tickets:read')).toBe(false)
  })
})

describe('getEffectiveScopes', () => {
  it('returns the base scopes for a role', () => {
    const scopes = getEffectiveScopes('VIEWER')

    expect(scopes).toContain('tickets:read')
    expect(scopes).not.toContain('tickets:write')
  })

  it('applies custom additions and removals', () => {
    const scopes = getEffectiveScopes('VIEWER', {
      add: ['tickets:write'],
      remove: ['analytics:view']
    })

    expect(scopes).toContain('tickets:write')
    expect(scopes).not.toContain('analytics:view')
  })

  it('does not duplicate a scope the role already holds', () => {
    const scopes = getEffectiveScopes('AGENT', { add: ['tickets:read'] })

    expect(scopes.filter((s) => s === 'tickets:read')).toHaveLength(1)
  })
})
