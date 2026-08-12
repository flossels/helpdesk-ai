import { cn } from '@/shared/lib/cn'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: Props) {
  return <div className={cn('border-b pb-4 dark:border-slate-700', className)}>{children}</div>
}
