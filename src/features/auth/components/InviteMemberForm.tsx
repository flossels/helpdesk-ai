'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { invitationSchema } from '@/features/auth/schemas'
import { createInvitation } from '@/features/auth/actions/createInvitation'
import type { InvitationInput } from '@/features/auth/schemas'

const selectClasses = cn(
  'rounded-lg border px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
)

export function InviteMemberForm() {
  const [token, setToken] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<InvitationInput>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { role: 'AGENT' }
  })

  const onSubmit = handleSubmit(async (data) => {
    const result = await createInvitation(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) {
        toast.error(result.error)
      }
      return
    }

    setToken(result.data.token)
    reset({ role: 'AGENT' })
  })

  return (
    <div className={cn('space-y-3')}>
      <form onSubmit={onSubmit} className={cn('flex flex-col gap-3 sm:flex-row sm:items-start')}>
        <div className={cn('flex-1')}>
          <Input type="email" {...register('email')} placeholder="teammate@company.com" />
          {errors?.email && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.email.message}</p>}
        </div>
        <select {...register('role')} className={selectClasses} aria-label="Role">
          <option value="AGENT">Agent</option>
          <option value="ADMIN">Admin</option>
          <option value="VIEWER">Viewer</option>
        </select>
        <Button type="submit" isLoading={isSubmitting}>
          Invite
        </Button>
      </form>

      {token && (
        <p
          className={cn(
            'rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800',
            'dark:bg-emerald-950 dark:text-emerald-200'
          )}
        >
          Invite created. Share this code: <strong>{token}</strong>
        </p>
      )}
    </div>
  )
}
