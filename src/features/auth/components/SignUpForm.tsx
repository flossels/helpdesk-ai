'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { Input } from '@/shared/components/ui/Input'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { signUpSchema } from '@/features/auth/schemas'
import { signUp } from '@/features/auth/actions/signUp'
import type { SignUpInput } from '@/features/auth/schemas'

export function SignUpForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = handleSubmit(async (data) => {
    const result = await signUp(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) {
        toast.error(result.error)
      }
      return
    }

    router.push('/portal')
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-3')}>
      <div>
        <Input type="text" {...register('name')} placeholder="Your name" />
        {errors?.name && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.name.message}</p>}
      </div>
      <div>
        <Input type="email" {...register('email')} placeholder="you@example.com" />
        {errors?.email && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.email.message}</p>}
      </div>
      <div>
        <Input type="password" {...register('password')} placeholder="Password (min. 8 characters)" />
        {errors?.password && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.password.message}</p>}
      </div>
      <SubmitButton label="Create account" pendingLabel="Creating account..." pending={isSubmitting} />
    </form>
  )
}
