import { Suspense } from 'react'
import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  )
}

async function SettingsContent() {
  const user = await getCurrentUser()
  if (!user || !hasScope(user.scopes, 'settings:manage')) forbidden()

  return <h1>Settings</h1>
}
