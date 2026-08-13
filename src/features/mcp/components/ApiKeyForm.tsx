'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, Label, Input } from '@headlessui/react'
import { toast } from 'sonner'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { createApiKeySchema } from '@/features/mcp/schemas'
import { createApiKey } from '@/features/mcp/actions/manageApiKeys'
import type { CreateApiKeyInput } from '@/features/mcp/schemas'

export function ApiKeyForm() {
  const [plaintext, setPlaintext] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CreateApiKeyInput>({
    defaultValues: { name: '' },
    resolver: zodResolver(createApiKeySchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    const result = await createApiKey(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) toast.error(result.error)
      return
    }

    setPlaintext(result.data.plaintext)
    reset({ name: '' })
    toast.success('Key created.')
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4')}>
      <Field>
        <Label className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')}>Key name</Label>
        <Input
          {...register('name')}
          placeholder="Claude Code on my laptop"
          className={cn('w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900')}
        />
        {errors.name && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.name.message}</p>}
      </Field>

      <SubmitButton label="Create key" pendingLabel="Creating..." pending={isSubmitting} />

      {plaintext && (
        <div className={cn('rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950')}>
          <p className={cn('mb-2 text-sm font-medium')}>Copy this key now. It is not shown again.</p>
          <code className={cn('block text-xs break-all')}>{plaintext}</code>
        </div>
      )}
    </form>
  )
}
