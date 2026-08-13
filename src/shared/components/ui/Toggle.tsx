'use client'

import { Switch } from '@headlessui/react'
import { cn } from '@/shared/lib/cn'

type Props = {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({ label, checked, onChange, disabled = false }: Props) {
  return (
    <Switch
      as="div"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className={cn(
        'group relative flex h-6 w-12 rounded-full bg-slate-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-checked:bg-blue-500 data-focus:outline-1 data-focus:outline-white dark:bg-slate-500 dark:data-checked:bg-blue-800',
        {
          'cursor-pointer': !disabled,
          'cursor-not-allowed': disabled
        }
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-6 dark:bg-slate-200'
        )}
      />
    </Switch>
  )
}
