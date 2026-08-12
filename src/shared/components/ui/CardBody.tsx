import { cn } from '@/shared/lib/cn'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function CardBody({ children, className }: Props) {
  return <div className={cn('py-4', className)}>{children}</div>
}
