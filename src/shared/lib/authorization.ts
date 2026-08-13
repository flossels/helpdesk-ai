import { ROLE_SCOPES } from '@/shared/types/scopes'
import type { OrgMemberRole, Scope } from '@/shared/types/scopes'

export function getEffectiveScopes(role: OrgMemberRole, customScopes?: { add?: Scope[]; remove?: Scope[] }): Scope[] {
  const base = ROLE_SCOPES[role]
  if (!customScopes) return base

  const withAdded = customScopes.add ? [...new Set([...base, ...customScopes.add])] : base

  return customScopes.remove ? withAdded.filter((s) => !customScopes.remove!.includes(s)) : withAdded
}

export function hasScope(userScopes: Scope[], required: Scope): boolean {
  return userScopes.includes(required)
}
