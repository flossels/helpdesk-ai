'use client'

import { toast } from 'sonner'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { deleteWebhook } from '@/features/settings/actions/manageWebhooks'

type Webhook = { id: string; url: string; events: unknown; isActive: boolean }

type Props = {
  webhooks: Webhook[]
}
export function WebhookList({ webhooks }: Props) {
  if (webhooks.length === 0) {
    return <p className={cn('text-sm text-slate-500')}>No endpoints registered yet.</p>
  }

  const remove = async (id: string) => {
    const result = await deleteWebhook(id)
    toast[result.success ? 'success' : 'error'](result.success ? 'Webhook removed.' : result.error)
  }

  return (
    <ul className={cn('space-y-2')}>
      {webhooks.map((webhook) => (
        <li key={webhook.id} className={cn('flex items-center gap-4 text-sm')}>
          <code className={cn('grow truncate')}>{webhook.url}</code>
          <span className={cn('text-xs text-slate-500')}>{(webhook.events as string[]).join(', ')}</span>
          <Button variant="ghost" size="sm" onClick={() => remove(webhook.id)}>
            Remove
          </Button>
        </li>
      ))}
    </ul>
  )
}
