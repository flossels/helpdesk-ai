'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { joinOrganizationSchema } from '@/features/auth/schemas'
import { joinOrganization } from '@/features/auth/actions/joinOrganization'
import type { JoinOrganizationInput } from '@/features/auth/schemas'

export function JoinOrganizationForm() {
  const router = useRouter()
  const { update } = useSession()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<JoinOrganizationInput>({ resolver: zodResolver(joinOrganizationSchema) })

  const onSubmit = handleSubmit(async (data) => {
    const result = await joinOrganization(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) {
        toast.error(result.error)
      }
      return
    }

    await update({})
    router.push('/tickets')
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-3')}>
      <div>
        <Input {...register('token')} placeholder="Invite code" />
        {errors?.token && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.token.message}</p>}
      </div>
      <Button type="submit" variant="secondary" isLoading={isSubmitting} className={cn('w-full')}>
        Join workspace
      </Button>
    </form>
  )
}
