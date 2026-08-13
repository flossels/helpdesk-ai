'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { cn } from '@/shared/lib/cn'

type Props<T> = {
  items: T[]
  value: T
  onChange: (value: T) => void
  displayValue: (item: T) => string
  disabled?: boolean
}

export function Select<T>({ items, value, onChange, displayValue, disabled }: Props<T>) {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton
        className={cn(
          'relative w-full cursor-pointer rounded-lg border py-2 pr-10 pl-3 text-left text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
        )}
      >
        {displayValue(value)}
        <span className={cn('pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2')}>
          <ChevronUpDownIcon className="size-4 text-slate-400" />
        </span>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={cn(
          'z-50 w-(--button-width) rounded-lg bg-white shadow-lg ring-1 ring-slate-200 transition duration-150 [--anchor-gap:4px] data-closed:scale-95 data-closed:opacity-0 dark:bg-slate-800 dark:ring-slate-700'
        )}
      >
        {items.map((item, index) => (
          <ListboxOption
            key={index}
            value={item}
            className={cn(
              'cursor-pointer px-4 py-2 text-sm text-slate-900 data-focus:bg-blue-50 data-selected:font-semibold data-selected:text-blue-600 dark:text-slate-100 dark:data-focus:bg-blue-900/20 dark:data-selected:text-blue-400'
            )}
          >
            {displayValue(item)}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
