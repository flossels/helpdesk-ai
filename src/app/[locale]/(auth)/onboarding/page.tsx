import { cn } from '@/shared/lib/cn'
import { CreateOrganizationForm } from '@/features/auth/components/CreateOrganizationForm'
import { JoinOrganizationForm } from '@/features/auth/components/JoinOrganizationForm'

export default function OnboardingPage() {
  return (
    <div className={cn('space-y-6')}>
      <h1 className={cn('text-center text-xl font-semibold text-slate-900 dark:text-slate-100')}>Set up your workspace</h1>
      <p className={cn('text-center text-sm text-slate-500 dark:text-slate-400')}>
        Create an organization to open your agent dashboard.
      </p>
      <CreateOrganizationForm />

      <div className={cn('flex items-center gap-3 text-xs text-slate-400')}>
        <span className={cn('h-px flex-1 bg-slate-200 dark:bg-slate-700')} />
        or join with an invite
        <span className={cn('h-px flex-1 bg-slate-200 dark:bg-slate-700')} />
      </div>
      <JoinOrganizationForm />
    </div>
  )
}
