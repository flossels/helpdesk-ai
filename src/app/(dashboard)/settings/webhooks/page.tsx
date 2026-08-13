import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { WebhookSettings } from '@/features/settings/components/WebhookSettings'

export default function WebhooksPage() {
  return (
    <div className={cn('space-y-8')}>
      <h1>Webhooks</h1>
      <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>
        Register a URL and we will POST every subscribed event to it, signed with a secret only the two of us know.
      </p>
      <Suspense fallback={null}>
        <WebhookSettings />
      </Suspense>
    </div>
  )
}
