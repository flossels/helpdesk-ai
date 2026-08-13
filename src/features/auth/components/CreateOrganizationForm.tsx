'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { cn } from '@/shared/lib/cn'
import { createOrganizationAction } from '@/features/auth/actions/createOrganization'

export function CreateOrganizationForm() {
  const router = useRouter()
  const { update } = useSession()

  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof createOrganizationAction>> | null, formData: FormData) => {
      const result = await createOrganizationAction(prev, formData)

      if (result.success) {
        await update({})
        router.push('/tickets')
      }

      return result
    },
    null
  )

  const errors = state?.success === false ? state.fieldErrors : undefined
  const formError = state?.success === false && !errors ? state.error : undefined

  return (
    <form action={formAction} className={cn('space-y-3')}>
      {formError && (
        <p className={cn('rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300')}>
          {formError}
        </p>
      )}
      <div>
        <Input name="name" required placeholder="Acme Support" />
        {errors?.name && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.name[0]}</p>}
      </div>
      <Button type="submit" className={cn('w-full')}>
        Create workspace
      </Button>
    </form>
  )
}
