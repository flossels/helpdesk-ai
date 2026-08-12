'use client'

import { useLinkStatus } from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function LinkContent({ children }: Props) {
  const { pending } = useLinkStatus()

  const className = pending ? 'transition-opacity opacity-60' : 'transition-opacity'

  return <span className={className}>{children}</span>
}
