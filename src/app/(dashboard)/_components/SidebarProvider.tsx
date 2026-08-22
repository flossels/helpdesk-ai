'use client'

import { useLocalStorage } from 'usehooks-ts'
import { SidebarContext } from '@/context'
import type { SidebarContextValue } from '@/shared/types/sidebar'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function SidebarProvider({ children }: Props) {
  const [sidebar, setSidebar] = useLocalStorage('sidebar', { state: 'expanded' }, { initializeWithValue: false })
  const isCollapsed = sidebar.state === 'collapsed'

  const value: SidebarContextValue = {
    isCollapsed,
    toggleCollapsed: () =>
      setSidebar({
        state: isCollapsed ? 'expanded' : 'collapsed'
      })
  }

  return <SidebarContext value={value}>{children}</SidebarContext>
}
