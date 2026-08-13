'use client'

import { useActionState } from 'react'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { Input } from '@/shared/components/ui/Input'
import { cn } from '@/shared/lib/cn'
import { signUpAction } from '@/features/auth/actions/signUp'

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, null)
  const errors = state?.success === false ? state.fieldErrors : undefined
  const error = state?.success === false ? state.error : undefined

  return (
    <form action={formAction} className={cn('space-y-3')}>
      <div>
        <Input type="text" name="name" required placeholder="Your name" />
        {errors?.name && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.name[0]}</p>}
      </div>
      <div>
        <Input type="email" name="email" required placeholder="you@example.com" />
        {errors?.email && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.email[0]}</p>}
      </div>
      <div>
        <Input type="password" name="password" required placeholder="Password (min. 8 characters)" />
        {errors?.password && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.password[0]}</p>}
      </div>
      {error && !errors && <p className={cn('text-sm text-rose-600')}>{error}</p>}
      <SubmitButton label="Create account" pendingLabel="Creating account..." />
    </form>
  )
}
