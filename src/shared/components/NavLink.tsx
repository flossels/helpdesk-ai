import Link from 'next/link'
import { LinkContent } from '@/shared/components/LinkContent'
import type { Route } from 'next'
import type { ReactNode } from 'react'

type Props<T extends string = string> = {
  href: T
  children: ReactNode
  isActive?: boolean
}

export function NavLink({ href, children, isActive }: Props<Route>) {
  return (
    <Link href={href} prefetch={false} aria-current={isActive && 'page'}>
      <LinkContent>{children}</LinkContent>
    </Link>
  )
}
