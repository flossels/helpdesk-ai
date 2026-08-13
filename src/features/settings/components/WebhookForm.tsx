'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, Label, Input } from '@headlessui/react'
import { toast } from 'sonner'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { createWebhookSchema, WEBHOOK_EVENTS } from '@/features/settings/schemas'
import { createWebhook } from '@/features/settings/actions/manageWebhooks'
import type { CreateWebhookInput } from '@/features/settings/schemas'

export function WebhookForm() {
  const [secret, setSecret] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CreateWebhookInput>({
    defaultValues: { url: '', events: [...WEBHOOK_EVENTS] },
    resolver: zodResolver(createWebhookSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    const result = await createWebhook(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) toast.error(result.error)
      return
    }

    setSecret(result.data.secret)
    reset({ url: '', events: [...WEBHOOK_EVENTS] })
    toast.success('Webhook registered.')
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4')}>
      <Field>
        <Label className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')}>Endpoint URL</Label>
        <Input
          {...register('url')}
          placeholder="https://example.com/hooks/helpdesk"
          className={cn('w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800')}
        />
        {errors?.url && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.url.message}</p>}
      </Field>

      <fieldset className={cn('space-y-1')}>
        <legend className={cn('mb-1 text-sm font-medium text-slate-700 dark:text-slate-300')}>Events</legend>
        {WEBHOOK_EVENTS.map((event) => (
          <label key={event} className={cn('flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300')}>
            <input type="checkbox" value={event} {...register('events')} />
            {event}
          </label>
        ))}
        {errors?.events && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.events.message}</p>}
      </fieldset>

      <SubmitButton label="Register webhook" pendingLabel="Registering..." pending={isSubmitting} />

      {secret && (
        <p className={cn('rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200')}>
          Signing secret, shown once: <code>{secret}</code>
        </p>
      )}
    </form>
  )
}
