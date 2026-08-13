import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { ApiKeySettings } from '@/features/mcp/components/ApiKeySettings'

export default function ApiKeysPage() {
  return (
    <div className={cn('space-y-8')}>
      <h1>API Keys</h1>
      <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>
        An API key lets an MCP client such as Claude Code work with this organization&apos;s tickets and articles. We store only a
        hash of it, so a key that is lost cannot be recovered, only replaced.
      </p>
      <Suspense fallback={null}>
        <ApiKeySettings />
      </Suspense>
    </div>
  )
}
