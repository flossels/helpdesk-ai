'use client'

import { useActionState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { cn } from '@/shared/lib/cn'
import { createInvitationAction } from '@/features/auth/actions/createInvitation'

const selectClasses = cn(
  'rounded-lg border px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
)

export function InviteMemberForm() {
  const [state, formAction] = useActionState(createInvitationAction, null)

  const errors = state?.success === false ? state.fieldErrors : undefined
  const formError = state?.success === false && !errors ? state.error : undefined

  return (
    <div className={cn('space-y-3')}>
      <form action={formAction} className={cn('flex flex-col gap-3 sm:flex-row sm:items-start')}>
        <div className={cn('flex-1')}>
          <Input type="email" name="email" required placeholder="teammate@company.com" />
          {errors?.email && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.email[0]}</p>}
        </div>
        <select name="role" defaultValue="AGENT" className={selectClasses} aria-label="Role">
          <option value="AGENT">Agent</option>
          <option value="ADMIN">Admin</option>
          <option value="VIEWER">Viewer</option>
        </select>
        <Button type="submit">Invite</Button>
      </form>

      {formError && <p className={cn('text-sm text-rose-600')}>{formError}</p>}
      {state?.success && (
        <p
          className={cn(
            'rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800',
            'dark:bg-emerald-950 dark:text-emerald-200'
          )}
        >
          Invite created. Share this code: <strong>{state.data.token}</strong>
        </p>
      )}
    </div>
  )
}
