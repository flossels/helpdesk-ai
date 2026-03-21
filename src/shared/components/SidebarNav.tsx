import { Route } from 'next'
import NavLink from './NavLink'
import { getCurrentUser } from '@/lib/placeholderData'

type NavItem<T extends string = string> = { href: T; label: string }

const NAV_ITEMS: NavItem<Route>[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/activity', label: 'Activity' }
]

const SidebarNav = async () => {
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
        {user.role === 'admin' && <NavLink href="/settings">Settings</NavLink>}
      </ul>
    </nav>
  )
}

export default SidebarNav
