'use client'

import { useLinkStatus } from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const LinkContent = ({ children }: Props) => {
  const { pending } = useLinkStatus()

  return <span className={`transition-opacity ${pending && 'opacity-60'}`}>{children}</span>
}

export default LinkContent
