'use client'

import { toast } from 'sonner'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { revokeApiKey } from '@/features/mcp/actions/manageApiKeys'

type ApiKey = {
  id: string
  name: string
  isActive: boolean
  createdAt: Date
  lastUsedAt: Date | null
}

type Props = {
  apiKeys: ApiKey[]
}

export function ApiKeyList({ apiKeys }: Props) {
  if (apiKeys.length === 0) {
    return <p className={cn('text-sm text-slate-500')}>No keys issued yet.</p>
  }

  const revoke = async (id: string) => {
    const result = await revokeApiKey(id)
    toast[result.success ? 'success' : 'error'](result.success ? 'Key revoked.' : result.error)
  }

  return (
    <ul className={cn('space-y-2')}>
      {apiKeys.map((apiKey) => (
        <li key={apiKey.id} className={cn('flex items-center gap-4 text-sm')}>
          <span className={cn('grow truncate font-medium')}>{apiKey.name}</span>
          <span className={cn('text-xs text-slate-500')}>
            {apiKey.lastUsedAt ? `used ${apiKey.lastUsedAt.toLocaleDateString('en-US')}` : 'never used'}
          </span>
          {apiKey.isActive ? (
            <Button variant="ghost" size="sm" onClick={() => revoke(apiKey.id)}>
              Revoke
            </Button>
          ) : (
            <span className={cn('text-xs text-slate-400')}>revoked</span>
          )}
        </li>
      ))}
    </ul>
  )
}
