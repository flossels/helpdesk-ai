import { HomeIcon, TicketIcon, BookOpenIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  TicketIcon as TicketIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ClockIcon as ClockIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid'
import { NavLink } from '@/shared/components/NavLink'
import { getCurrentUser } from '@/lib/placeholderData'
import type { ComponentType } from 'react'
import type { Route } from 'next'

type IconType = ComponentType<{ className?: string }>

type NavItem<T extends string = string> = {
  href: T
  label: string
  icon: IconType
  activeIcon: IconType
}

const NAV_ITEMS: NavItem<Route>[] = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
  { href: '/tickets', label: 'Tickets', icon: TicketIcon, activeIcon: TicketIconSolid },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
  { href: '/activity', label: 'Activity', icon: ClockIcon, activeIcon: ClockIconSolid }
]

export async function SidebarNav() {
  const user = await getCurrentUser()

  return (
    <nav>
      <ul>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const ActiveIcon = item.activeIcon
          return (
            <li key={item.href}>
              <NavLink
                href={item.href}
                icon={<Icon className="size-5 shrink-0" />}
                activeIcon={<ActiveIcon className="size-5 shrink-0" />}
              >
                {item.label}
              </NavLink>
            </li>
          )
        })}
        {user.role === 'admin' && (
          <li>
            <NavLink
              href="/settings"
              icon={<Cog6ToothIcon className="size-5 shrink-0" />}
              activeIcon={<Cog6ToothIconSolid className="size-5 shrink-0" />}
            >
              Settings
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}
