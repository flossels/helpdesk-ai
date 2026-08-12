'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LinkContent } from '@/shared/components/LinkContent'
import type { Route } from 'next'
import type { ReactNode } from 'react'

type Props<T extends string = string> = {
  href: T
  children: ReactNode
}

export function NavLink({ href, children }: Props<Route>) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} aria-current={isActive && 'page'}>
      <LinkContent>{children}</LinkContent>
    </Link>
  )
}
