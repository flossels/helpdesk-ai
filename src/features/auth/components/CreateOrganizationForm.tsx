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
import { createOrganizationSchema } from '@/features/auth/schemas'
import { createOrganization } from '@/features/auth/actions/createOrganization'
import type { CreateOrganizationInput } from '@/features/auth/schemas'

export function CreateOrganizationForm() {
  const router = useRouter()
  const { update } = useSession()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CreateOrganizationInput>({ resolver: zodResolver(createOrganizationSchema) })

  const onSubmit = handleSubmit(async (data) => {
    const result = await createOrganization(data)

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
        <Input {...register('name')} placeholder="Acme Support" />
        {errors?.name && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.name.message}</p>}
      </div>
      <Button type="submit" isLoading={isSubmitting} className={cn('w-full')}>
        Create workspace
      </Button>
    </form>
  )
}
