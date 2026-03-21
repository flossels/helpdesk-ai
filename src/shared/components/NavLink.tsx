'use client'

import { Route } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import LinkContent from './LinkContent'
import { usePathname } from 'next/navigation'

type Props<T extends string = string> = {
  href: T
  children: ReactNode
}

const NavLink = ({ href, children }: Props<Route>) => {
  const pathname = usePathname()

  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} prefetch={false} aria-current={isActive && 'page'}>
      <LinkContent>{children}</LinkContent>
    </Link>
  )
}

export default NavLink
