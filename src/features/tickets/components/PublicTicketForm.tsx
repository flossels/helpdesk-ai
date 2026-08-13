'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Field, Label, Description, Input, Textarea } from '@headlessui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { FileUpload } from '@/shared/components/ui/FileUpload'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { uploadAttachments } from '@/shared/lib/uploadAttachments'
import { publicTicketSchema } from '@/features/tickets/schemas'
import { useRouter } from '@/i18n/navigation'
import { submitPublicTicket } from '@/features/tickets/actions/submitPublicTicket'
import { PrioritySelect } from '@/features/tickets/components/PrioritySelect'
import { CategorySelect } from '@/features/tickets/components/CategorySelect'
import type { PublicTicketInput } from '@/features/tickets/schemas'

type Props = {
  categories: Array<{
    id: string
    name: string
  }>
}

const inputClasses = cn(
  'w-full rounded-lg border px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
)

const labelClasses = cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')

type ValidationErrorKey =
  | 'name.required'
  | 'name.tooLong'
  | 'subject.tooShort'
  | 'subject.tooLong'
  | 'description.tooShort'
  | 'description.tooLong'
  | 'description.urgentTooShort'
  | 'email.invalid'
  | 'category.required'
  | 'attachments.tooMany'

export function PublicTicketForm({ categories }: Props) {
  const t = useTranslations('ticketForm')
  const tError = useTranslations('validation')
  const errorText = (message?: string) => (message ? tError(message as ValidationErrorKey) : null)

  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const methods = useForm<PublicTicketInput>({
    defaultValues: { categoryId: categories[0]?.id || '', priority: 'MEDIUM' },
    resolver: zodResolver(publicTicketSchema)
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = methods

  const onSubmit = handleSubmit(async (data) => {
    let attachmentIds: string[] = []
    if (files.length) {
      try {
        attachmentIds = await uploadAttachments(files, 'ticket', crypto.randomUUID(), data.categoryId)
      } catch {
        toast.error('File upload failed. Please try again.')
        return
      }
    }

    const result = await submitPublicTicket({ ...data, attachmentIds })

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) {
        toast.error(result.error)
      }
      return
    }

    toast.success('Ticket submitted.')
    setFiles([])
    router.push(`/track/${result.data.trackingId}`)
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className={cn('space-y-4')}>
        <Field>
          <Label className={labelClasses}>{t('name')}</Label>
          <Input {...register('name')} className={inputClasses} />
          {errors?.name && <p className={cn('mt-1 text-sm text-rose-600')}>{errorText(errors.name?.message)}</p>}
        </Field>

        <Field>
          <Label className={labelClasses}>{t('email')}</Label>
          <Input type="email" {...register('email')} className={inputClasses} />
          {errors?.email && <p className={cn('mt-1 text-sm text-rose-600')}>{errorText(errors.email?.message)}</p>}
        </Field>

        <Field>
          <Label className={labelClasses}>{t('subject')}</Label>
          <Input {...register('subject')} className={inputClasses} />
          {errors?.subject && <p className={cn('mt-1 text-sm text-rose-600')}>{errorText(errors.subject?.message)}</p>}
        </Field>

        <Field>
          <Label className={labelClasses}>{t('description')}</Label>
          <Description className={cn('mb-1 text-xs text-slate-500')}>{t('descriptionHint')}</Description>
          <Textarea {...register('description')} rows={4} className={inputClasses} />
          {errors?.description && <p className={cn('mt-1 text-sm text-rose-600')}>{errorText(errors.description?.message)}</p>}
        </Field>

        <Field>
          <Label className={labelClasses}>{t('priority')}</Label>
          <PrioritySelect />
        </Field>

        <Field>
          <Label className={labelClasses}>{t('category')}</Label>
          <CategorySelect categories={categories} />
        </Field>

        <Field>
          <Label className={labelClasses}>{t('attachments')}</Label>
          <Description className={cn('mb-1 text-xs text-slate-500')}>{t('attachmentsHint')}</Description>
          <FileUpload
            onFiles={(dropped) => setFiles((prev) => [...prev, ...dropped])}
            idleLabel={t('uploadIdle')}
            dropLabel={t('uploadDrop')}
          />
          {files.length > 0 && (
            <ul className={cn('mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300')}>
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>{file.name}</li>
              ))}
            </ul>
          )}
        </Field>

        <SubmitButton label={t('submit')} pendingLabel={t('submitting')} pending={isSubmitting} />
      </form>
    </FormProvider>
  )
}
