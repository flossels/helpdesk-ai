'use client'

import { cn } from '@/shared/lib/cn'
import { useSidebar } from '@/shared/hooks/useSidebar'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function DashboardMain({ children }: Props) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={cn('flex-1 transition-[margin] duration-300 ease-in-out md:ms-16', {
        'lg:ms-64': !isCollapsed,
        'lg:ms-16': isCollapsed
      })}
    >
      {children}
    </div>
  )
}
