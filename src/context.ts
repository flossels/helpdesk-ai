import { createContext } from 'react'
import type { SidebarContextValue } from '@/shared/types/sidebar'

export const SidebarContext = createContext<SidebarContextValue | null>(null)
