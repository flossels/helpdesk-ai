'use client'

import { useSidebar } from '@/shared/components/SidebarProvider'
import { cn } from '@/shared/lib/cn'
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
