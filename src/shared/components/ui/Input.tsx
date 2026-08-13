import { Input as HuiInput } from '@headlessui/react'
import { cn } from '@/shared/lib/cn'
import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
  return (
    <HuiInput
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-sm text-slate-900',
        'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
        'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
        className
      )}
      {...props}
    />
  )
}
