import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getWebhooks } from '@/features/settings/queries/getWebhooks'
import { WebhookForm } from '@/features/settings/components/WebhookForm'
import { WebhookList } from '@/features/settings/components/WebhookList'

export default async function WebhooksPage() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'settings:manage')) forbidden()

  const webhooks = await getWebhooks(user.organizationId)

  return (
    <div className={cn('space-y-8')}>
      <h1>Webhooks</h1>
      <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>
        Register a URL and we will POST every subscribed event to it, signed with a secret only the two of us know.
      </p>
      <WebhookList webhooks={webhooks} />
      <WebhookForm />
    </div>
  )
}
