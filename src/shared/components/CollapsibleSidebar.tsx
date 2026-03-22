'use client'

import type { ReactNode } from 'react'
import Button from '@/shared/components/ui/Button'
import cn from '../lib/cn'
import { useLocalStorage } from 'usehooks-ts'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type Props = {
  children: ReactNode
}

const CollapsibleSidebar = ({ children }: Props) => {
  const [sidebar, setSidebar] = useLocalStorage('sidebar', { state: 'expanded' }, { initializeWithValue: true })
  const setIsCollapsed = (isCollapsed: boolean) => setSidebar({ state: isCollapsed ? 'collapsed' : 'expanded' })
  const isCollapsed = sidebar.state === 'collapsed'

  return (
    <aside
      className={cn(
        'dark:boder-e inset-y-0 left-0 z-10 flex w-64 flex-col bg-white drop-shadow-sm transition-[width] duration-300 ease-in-out lg:translate-x-0 dark:bg-slate-700 dark:drop-shadow-none',
        {
          'w-64': !isCollapsed,
          'w-16 overflow-hidden': isCollapsed
        }
      )}
    >
      <div className={cn('my-4', { 'mx-auto': isCollapsed, 'ms-4': !isCollapsed })}>
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRightIcon className="size-5" /> : <ChevronLeftIcon className="size-5" />}
        </Button>
      </div>

      <div className="mb-4 p-4">{!isCollapsed && children}</div>
    </aside>
  )
}

export default CollapsibleSidebar
