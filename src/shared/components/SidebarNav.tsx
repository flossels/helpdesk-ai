import { NavLink } from '@/shared/components/NavLink'
import { getCurrentUser } from '@/lib/placeholderData'
import type { Route } from 'next'

type NavItem<T extends string = string> = { href: T; label: string }

const NAV_ITEMS: NavItem<Route>[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/activity', label: 'Activity' }
]

export async function SidebarNav() {
  const user = await getCurrentUser()

  return (
    <nav>
      <ul>
        {NAV_ITEMS.map((item) => {
          return (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          )
        })}
        {user.role === 'admin' && (
          <li>
            <NavLink href="/settings">Settings</NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}
