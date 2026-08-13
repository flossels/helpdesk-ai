import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getWebhooks } from '@/features/settings/queries/getWebhooks'
import { WebhookForm } from '@/features/settings/components/WebhookForm'
import { WebhookList } from '@/features/settings/components/WebhookList'

export async function WebhookSettings() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'settings:manage')) forbidden()

  const webhooks = await getWebhooks(user.organizationId)

  return (
    <>
      <WebhookList webhooks={webhooks} />
      <WebhookForm />
    </>
  )
}
