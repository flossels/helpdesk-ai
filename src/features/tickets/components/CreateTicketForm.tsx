'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field, Label, Description, Input, Textarea } from '@headlessui/react'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect'
import { cn } from '@/shared/lib/cn'
import { createTicketAction } from '@/features/tickets/actions/createTicket'

type CategoryOption = { id: string; name: string }

const inputClasses = cn(
  'w-full rounded-lg border px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
)

const labelClasses = cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')

export function CreateTicketForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter()
  const [category, setCategory] = useState<CategoryOption | undefined>(categories[0])
  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof createTicketAction>> | null, formData: FormData) => {
      const result = await createTicketAction(prev, formData)

      if (result.success) router.push(`/track/${result.data.trackingId}`)

      return result
    },
    null
  )

  const errors = state?.success === false ? state.fieldErrors : undefined

  return (
    <form action={formAction} className={cn('space-y-4')}>
      <Field>
        <Label className={labelClasses}>Subject</Label>
        <Input name="subject" required className={inputClasses} />
        {errors?.subject && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.subject[0]}</p>}
      </Field>

      <Field>
        <Label className={labelClasses}>Description</Label>
        <Description className={cn('mb-1 text-xs text-slate-500')}>
          Include what you expected to happen and what actually happened.
        </Description>
        <Textarea name="description" rows={4} required className={inputClasses} />
        {errors?.description && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.description[0]}</p>}
      </Field>

      <Field>
        <Label className={labelClasses}>Category</Label>
        <SearchableSelect
          items={categories}
          value={category}
          onChange={(value) => value && setCategory(value)}
          displayValue={(c) => c.name}
          placeholder="Select a category"
        />
      </Field>
      <input type="hidden" name="categoryId" value={category?.id ?? ''} />

      <SubmitButton label="Create Ticket" pendingLabel="Creating..." />
    </form>
  )
}
