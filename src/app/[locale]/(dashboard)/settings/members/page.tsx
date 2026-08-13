import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { InviteMemberForm } from '@/features/auth/components/InviteMemberForm'

export default async function MembersSettingsPage() {
  const user = await getCurrentUser()
  if (!user || !hasScope(user.scopes, 'members:manage')) forbidden()

  return (
    <div className={cn('space-y-6')}>
      <div>
        <h1 className={cn('text-2xl font-bold text-slate-900 dark:text-slate-100')}>Members</h1>
        <p className={cn('mt-1 text-sm text-slate-500 dark:text-slate-400')}>
          Invite a teammate by email. They join after signing in with that address.
        </p>
      </div>
      <InviteMemberForm />
    </div>
  )
}
