'use client'

import { createContext, useContext } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import type { ReactNode } from 'react'

type SidebarContextValue = {
  isCollapsed: boolean
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

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

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }

  return context
}
