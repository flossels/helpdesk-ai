'use client'

import { useLinkStatus } from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function LinkContent({ children }: Props) {
  const { pending } = useLinkStatus()

  // A template literal would interpolate the word "false" into the class
  // list on every idle render, so branch on the whole string instead.
  const className = pending ? 'transition-opacity opacity-60' : 'transition-opacity'

  return <span className={className}>{children}</span>
}
