'use client'

import { useState } from 'react'
import { Bars3Icon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/Logo'
import { cn } from '@/shared/lib/cn'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { Link } from '@/i18n/navigation'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function CollapsibleSidebar({ children }: Props) {
  const { isCollapsed, toggleCollapsed } = useSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="absolute top-3 left-4 z-30 md:hidden">
        <Button variant="ghost" size="sm" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
          <Bars3Icon className="size-5" />
        </Button>
      </div>

      {mobileOpen && <div className={cn('fixed inset-0 z-20 bg-black/50 md:hidden')} onClick={() => setMobileOpen(false)} />}

      <aside
        className={cn(
          '@container/sidebar fixed inset-y-0 left-0 z-30 flex w-64 -translate-x-full flex-col bg-white drop-shadow-sm transition-all duration-300 ease-in-out md:w-16 md:translate-x-0 dark:border-e dark:bg-slate-700 dark:drop-shadow-none',
          { 'translate-x-0': mobileOpen },
          { 'lg:w-64': !isCollapsed, 'lg:w-16': isCollapsed }
        )}
      >
        <div className={cn('flex items-center justify-between gap-2 p-4')}>
          <Link href="/" className={cn('flex overflow-hidden')}>
            <Logo />
          </Link>
          <div className="md:hidden">
            <Button variant="ghost" size="sm" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
              <XMarkIcon className="size-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 overflow-hidden p-4">{children}</nav>

        <div className="hidden p-4 lg:block">
          <Button
            variant="ghost"
            size="sm"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggleCollapsed}
          >
            {isCollapsed ? <ChevronRightIcon className="size-5" /> : <ChevronLeftIcon className="size-5" />}
          </Button>
        </div>
      </aside>
    </>
  )
}
