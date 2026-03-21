import { Route } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import LinkContent from './LinkContent'

type Props<T extends string = string> = {
  href: T
  children: ReactNode
}

const NavLink = ({ href, children }: Props<Route>) => (
  <Link href={href} prefetch={false}>
    <LinkContent>{children}</LinkContent>
  </Link>
)

export default NavLink
