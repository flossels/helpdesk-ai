'use client'

import { useActionState, useRef } from 'react'
import { Field, Label, Textarea } from '@headlessui/react'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { cn } from '@/shared/lib/cn'
import { replyToTicketAction } from '@/app/(dashboard)/actions/replyToTicket'

type Props = {
  ticketId: string
}

export function TicketReplyForm({ ticketId }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof replyToTicketAction>> | null, formData: FormData) => {
      const result = await replyToTicketAction(prev, formData)

      if (result.success) formRef.current?.reset()

      return result
    },
    null
  )

  const errors = state?.success === false ? state.fieldErrors : undefined

  return (
    <form ref={formRef} action={formAction} className={cn('space-y-3')}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <Field>
        <Label className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')}>Your reply</Label>
        <Textarea
          name="content"
          rows={4}
          required
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
          )}
        />
      </Field>
      {errors?.content && <p className={cn('text-sm text-rose-600')}>{errors.content[0]}</p>}

      <SubmitButton label="Send Reply" pendingLabel="Sending..." />
    </form>
  )
}
