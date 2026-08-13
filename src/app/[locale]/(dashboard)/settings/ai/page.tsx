import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getAiSettings } from '@/features/ai/queries/getAiSettings'
import { AiSettingsForm } from '@/features/ai/components/AiSettingsForm'
import { ReindexButton } from '@/features/ai/components/ReindexButton'

export default async function AiSettingsPage() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'ai:configure')) forbidden()

  const settings = await getAiSettings(user.organizationId)
  if (!settings) forbidden()

  return (
    <div className={cn('space-y-8')}>
      <h1>AI Settings</h1>
      <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>
        Choose the model every AI feature runs on and cap what this organization may spend each month.
      </p>
      <AiSettingsForm settings={settings} />
      <ReindexButton />
    </div>
  )
}
