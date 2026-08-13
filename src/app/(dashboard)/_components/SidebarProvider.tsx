'use client'

import { useLocalStorage } from 'usehooks-ts'
import { SidebarContext } from '@/context'
import type { ReactNode } from 'react'
import type { SidebarContextValue } from '@/shared/types/sidebar'

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
