import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getApiKeys } from '@/features/mcp/queries/getApiKeys'
import { ApiKeyForm } from '@/features/mcp/components/ApiKeyForm'
import { ApiKeyList } from '@/features/mcp/components/ApiKeyList'

export async function ApiKeySettings() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'settings:manage')) forbidden()

  const apiKeys = await getApiKeys(user.organizationId)

  return (
    <>
      <ApiKeyList apiKeys={apiKeys} />
      <ApiKeyForm />
    </>
  )
}
