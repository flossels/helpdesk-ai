'use client'

import { useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { cn } from '@/shared/lib/cn'

type Props<T> = {
  items: T[]
  value: T | null | undefined
  onChange: (value: T | null) => void
  displayValue: (item: T) => string
  placeholder?: string
}

export function SearchableSelect<T>({ items, value, onChange, displayValue, placeholder = 'Search...' }: Props<T>) {
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? items
      : items.filter((item) => {
          return displayValue(item).toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <ComboboxInput
          className={cn(
            'w-full rounded-lg border py-2 pr-10 pl-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
          )}
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(item: T | null) => (item ? displayValue(item) : '')}
          placeholder={placeholder}
        />
        <ComboboxButton aria-label="Show options" className={cn('absolute inset-y-0 right-0 flex items-center pr-2')}>
          <ChevronUpDownIcon className="size-4 text-slate-400" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        transition
        className={cn(
          'z-50 w-(--input-width) rounded-lg bg-white shadow-lg ring-1 ring-slate-200 transition duration-150 [--anchor-gap:4px] data-closed:scale-95 data-closed:opacity-0 dark:bg-slate-800 dark:ring-slate-700'
        )}
      >
        {filtered.length === 0 ? (
          <div className={cn('px-4 py-2 text-sm text-slate-500')}>No results found.</div>
        ) : (
          filtered.map((item, index) => (
            <ComboboxOption
              key={index}
              value={item}
              className={cn(
                'cursor-pointer px-4 py-2 text-sm text-slate-900 data-focus:bg-blue-50 dark:text-slate-100 dark:data-focus:bg-blue-900/20'
              )}
            >
              {displayValue(item)}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
