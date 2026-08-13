'use client'

import { cn } from '@/shared/lib/cn'
import type { ReactNode } from 'react'

type Props = {
  name: string
  input: unknown
  children: ReactNode
}

export function ApprovalCard({ name, input, children }: Props) {
  return (
    <div className={cn('rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:bg-amber-950')}>
      <p className={cn('font-medium')}>The copilot wants to run {name}</p>
      <pre className={cn('my-2 overflow-x-auto text-xs')}>{JSON.stringify(input, null, 2)}</pre>
      <div className={cn('flex gap-2')}>{children}</div>
    </div>
  )
}
