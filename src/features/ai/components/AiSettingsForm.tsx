'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, Label, Input, Listbox, ListboxButton, ListboxOption, ListboxOptions, Switch } from '@headlessui/react'
import { toast } from 'sonner'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { cn } from '@/shared/lib/cn'
import { applyFieldErrors } from '@/shared/lib/applyFieldErrors'
import { updateAiSettings } from '@/features/ai/actions/updateAiSettings'
import { aiSettingsSchema } from '@/features/ai/schemas/aiSettings'
import type { AiSettingsInput } from '@/features/ai/schemas/aiSettings'
import type { AiSettingsView } from '@/features/ai/types'

type Props = {
  settings: AiSettingsView
}

export function AiSettingsForm({ settings }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<AiSettingsInput>({
    defaultValues: {
      aiModel: settings.aiModel,
      tokenBudget: settings.tokenBudget,
      autoCategorizationEnabled: settings.autoCategorizationEnabled,
      autoSentimentEnabled: settings.autoSentimentEnabled
    },
    resolver: zodResolver(aiSettingsSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    const result = await updateAiSettings(data)

    if (!result.success) {
      if (!applyFieldErrors(result.fieldErrors, setError)) toast.error(result.error)
      return
    }

    toast.success('AI settings saved.')
  })

  return (
    <form onSubmit={onSubmit} className={cn('space-y-6')}>
      <Field>
        <Label className={cn('mb-1 block text-sm font-medium')}>Model</Label>
        <Controller
          control={control}
          name="aiModel"
          render={({ field }) => (
            <Listbox value={field.value} onChange={field.onChange}>
              <ListboxButton className={cn('w-full rounded-lg border px-3 py-2 text-left text-sm')}>
                {settings.models.find((model) => model.id === field.value)?.label ?? field.value}
              </ListboxButton>
              <ListboxOptions className={cn('mt-1 rounded-lg border bg-white p-1 dark:bg-slate-800')}>
                {settings.models.map((model) => (
                  <ListboxOption
                    key={model.id}
                    value={model.id}
                    className={cn('cursor-pointer rounded px-3 py-2 text-sm data-focus:bg-blue-50')}
                  >
                    <span className={cn('font-medium')}>{model.label}</span>
                    <span className={cn('text-slate-500')}> · {model.provider}</span>
                    <p className={cn('text-xs text-slate-500')}>{model.description}</p>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          )}
        />
      </Field>

      <Field>
        <Label className={cn('mb-1 block text-sm font-medium')}>Monthly token budget</Label>
        <Input
          type="number"
          {...register('tokenBudget', { valueAsNumber: true })}
          className={cn('w-full rounded-lg border px-3 py-2 text-sm')}
        />
        <p className={cn('mt-1 text-xs text-slate-500')}>{settings.usedThisMonth.toLocaleString()} tokens used this month.</p>
        {errors.tokenBudget && <p className={cn('mt-1 text-sm text-rose-600')}>{errors.tokenBudget.message}</p>}
      </Field>

      {(['autoCategorizationEnabled', 'autoSentimentEnabled'] as const).map((name) => (
        <Field key={name} className={cn('flex items-center gap-3')}>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={field.onChange}
                className={cn('relative h-6 w-11 rounded-full bg-slate-300 data-checked:bg-blue-600')}
              >
                <span className={cn('block size-4 translate-x-1 rounded-full bg-white transition data-checked:translate-x-6')} />
              </Switch>
            )}
          />
          <Label className={cn('text-sm')}>
            {name === 'autoCategorizationEnabled' ? 'Categorize new tickets automatically' : 'Analyze sentiment automatically'}
          </Label>
        </Field>
      ))}

      <SubmitButton label="Save settings" pendingLabel="Saving…" pending={isSubmitting} />
    </form>
  )
}
