'use client'

import { useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, Label } from '@headlessui/react'
import { toast } from 'sonner'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { replyToTicketSchema } from '@/features/tickets/schemas'
import { replyToTicket } from '@/features/tickets/actions/replyToTicket'
import { CannedResponsePicker } from '@/features/settings/components/CannedResponsePicker'
import { useDraftStore } from '@/features/tickets/stores/draftStore'
import type { JSONContent } from '@tiptap/react'
import type { ReplyToTicketInput } from '@/features/tickets/schemas'
import type { CannedResponseItem } from '@/features/settings/types'

type Props = {
  ticketId: string
  cannedResponses: CannedResponseItem[]
}

const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

function extractText(node: JSONContent): string {
  if (typeof node.text === 'string') return node.text
  return (node.content ?? []).map(extractText).join(' ').trim()
}

export function TicketReplyForm({ ticketId, cannedResponses }: Props) {
  const [editorKey, setEditorKey] = useState(0)
  const draft = useDraftStore((state) => state.drafts[ticketId])
  const setDraft = useDraftStore((state) => state.setDraft)
  const clearDraft = useDraftStore((state) => state.clearDraft)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ReplyToTicketInput>({
    defaultValues: {
      ticketId,
      content: draft?.content ?? EMPTY_DOC,
      contentText: draft?.contentText ?? ''
    },
    resolver: zodResolver(replyToTicketSchema)
  })

  const { field } = useController({ name: 'content', control })

  const insertCanned = (response: CannedResponseItem) => {
    setValue('content', response.content, { shouldValidate: true })
    setValue('contentText', extractText(response.content), { shouldValidate: true })
    setEditorKey((key) => key + 1)
  }

  const onSubmit = handleSubmit(async (data) => {
    const result = await replyToTicket(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) {
        toast.error(result.error)
      }
      return
    }

    clearDraft(ticketId)
    reset({ ticketId, content: EMPTY_DOC, contentText: '' })
    setEditorKey((key) => key + 1)
    toast.success('Reply sent.')
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-3')}>
      <Field>
        <Label className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')}>Your reply</Label>
        <div className={cn('mb-2')}>
          <CannedResponsePicker responses={cannedResponses} onSelect={insertCanned} />
        </div>
        <RichTextEditor
          key={editorKey}
          value={field.value ?? EMPTY_DOC}
          onChange={(content, text) => {
            field.onChange(content)
            setValue('contentText', text, { shouldValidate: true })
            setDraft(ticketId, { content, contentText: text })
          }}
          placeholder="Write your reply…"
        />
        {errors?.contentText && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.contentText.message}</p>}
      </Field>

      <SubmitButton label="Send Reply" pendingLabel="Sending..." pending={isSubmitting} />
    </form>
  )
}
