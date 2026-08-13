'use client'

import { LinkContent } from '@/shared/components/LinkContent'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import type { ReactNode } from 'react'

type Props<T extends string = string> = {
  href: T
  children: ReactNode
  icon?: ReactNode
  activeIcon?: ReactNode
}

export function NavLink({ href, children, icon, activeIcon }: Props<string>) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  const navIcon = isActive ? (activeIcon ?? icon) : icon

  return (
    <Link
      href={href}
      aria-current={isActive && 'page'}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 @max-[180px]/sidebar:justify-center @max-[180px]/sidebar:px-0 dark:text-slate-300 dark:hover:bg-slate-700',
        {
          'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400': isActive
        }
      )}
    >
      {navIcon}
      <span className={cn('@max-[180px]/sidebar:hidden')}>
        <LinkContent>{children}</LinkContent>
      </span>
    </Link>
  )
}
