'use client'

import { usePathname } from 'next/navigation'
import { NavLink } from '@/shared/components/NavLink'
import type { Route } from 'next'

type NavItem<T extends string = string> = { href: T; label: string }

const NAV_ITEMS: NavItem<Route>[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/activity', label: 'Activity' },
  { href: '/settings', label: 'Settings' }
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav>
      <ul>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <li key={item.href}>
              <NavLink href={item.href} isActive={isActive}>
                {item.label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
