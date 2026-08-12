'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function CollapsibleSidebar({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className="flex flex-col gap-4 border-r pr-4">
      <button onClick={() => setCollapsed(!collapsed)}>{collapsed ? 'Expand' : 'Collapse'}</button>
      {!collapsed && children}
    </aside>
  )
}
