'use client'

import { useState } from 'react'
import { Field, Label, Description, Input, Textarea } from '@headlessui/react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { FileUpload } from '@/shared/components/ui/FileUpload'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { uploadAttachments } from '@/shared/lib/uploadAttachments'
import { createTicketSchema } from '@/features/tickets/schemas'
import { useRouter } from '@/i18n/navigation'
import { createTicket } from '@/features/tickets/actions/createTicket'
import { PrioritySelect } from '@/features/tickets/components/PrioritySelect'
import { CategorySelect } from '@/features/tickets/components/CategorySelect'
import { AiTitleSuggestion } from '@/features/ai/components/AiTitleSuggestion'
import type { CreateTicketInput } from '@/features/tickets/schemas'

const inputClasses = cn(
  'w-full rounded-lg border px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
)

const labelClasses = cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')

type Props = {
  categories: Array<{
    id: string
    name: string
  }>
}

export function CreateTicketForm({ categories }: Props) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const methods = useForm<CreateTicketInput>({
    defaultValues: { categoryId: categories[0]?.id || '', priority: 'MEDIUM' },
    resolver: zodResolver(createTicketSchema)
  })

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = methods

  const description = useWatch({ control, name: 'description' })

  const onSubmit = handleSubmit(async (data) => {
    let attachmentIds: string[] = []
    if (files.length) {
      try {
        attachmentIds = await uploadAttachments(files, 'ticket', crypto.randomUUID())
      } catch {
        toast.error('File upload failed. Please try again.')
        return
      }
    }

    const result = await createTicket({ ...data, attachmentIds })

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) {
        toast.error(result.error)
      }
      return
    }

    toast.success('Ticket created.')
    setFiles([])
    router.push(`/tickets/${result.data.ticketId}`)
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className={cn('space-y-4')}>
        <Field>
          <Label className={labelClasses}>Subject</Label>
          <Input {...register('subject')} className={inputClasses} />
          {errors?.subject && <Description className={cn('mt-1 text-sm text-rose-600')}>{errors.subject.message}</Description>}
          <AiTitleSuggestion
            description={description ?? ''}
            onUse={(title) => setValue('subject', title, { shouldValidate: true })}
          />
        </Field>

        <Field>
          <Label className={labelClasses}>Email</Label>
          <Input type="email" {...register('email')} className={inputClasses} />
          {errors?.email && <Description className={cn('mt-1 text-sm text-rose-600')}>{errors.email.message}</Description>}
        </Field>

        <Field>
          <Label className={labelClasses}>Description</Label>
          <Description className={cn('mb-1 text-xs text-slate-500')}>
            Include what you expected to happen and what actually happened.
          </Description>
          <Textarea {...register('description')} rows={4} className={inputClasses} />
          {errors?.description && (
            <Description className={cn('mt-1 text-sm text-rose-600')}>{errors.description.message}</Description>
          )}
        </Field>

        <Field>
          <Label className={labelClasses}>Priority</Label>
          <PrioritySelect />
        </Field>

        <Field>
          <Label className={labelClasses}>Category</Label>
          <CategorySelect categories={categories} />
        </Field>

        <Field>
          <Label className={labelClasses}>Attachments</Label>
          <FileUpload onFiles={(dropped) => setFiles((prev) => [...prev, ...dropped])} />
          {files.length > 0 && (
            <ul className={cn('mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300')}>
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>{file.name}</li>
              ))}
            </ul>
          )}
        </Field>

        <SubmitButton label="Create Ticket" pendingLabel="Creating..." pending={isSubmitting} />
      </form>
    </FormProvider>
  )
}
