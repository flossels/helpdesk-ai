'use client'

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import cn from '@/shared/lib/cn'
import Button from '@/shared/components/ui/Button'
import { ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

type DropdownItem = {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}

type Props = {
  trigger: ReactNode
  items: DropdownItem[]
}

const Dropdown = ({ trigger, items }: Props) => {
  return (
    <Menu>
      <MenuButton as={Button} variant="secondary">
        {trigger}
        <ChevronDownIcon className="size-4" />
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        transition
        className={cn(
          'z-50 w-48 rounded-(--border-radius) bg-white shadow-lg ring-1 ring-slate-200 transition duration-300 [--anchor-gap:4px] data-closed:scale-95 data-closed:opacity-0 dark:bg-slate-800 dark:ring-slate-700'
        )}
      >
        {items.map((item) => (
          <MenuItem key={item.label} disabled={item.disabled}>
            <button
              onClick={item.onClick}
              className={cn('block w-full px-4 py-2 text-left text-sm data-focus:bg-slate-100 dark:data-focus:bg-slate-700', {
                'text-rose-600': item.danger,
                'text-slate-700 dark:text-slate-200': !item.danger,
                'opacity-50': item.disabled
              })}
            >
              {item.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default Dropdown
