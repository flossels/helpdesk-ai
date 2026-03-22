import cn from '@/shared/lib/cn'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

const CardHeader = ({ children, className }: Props) => (
  <div className={cn('border-b border-slate-200 pb-4 dark:border-slate-700', className)}>{children}</div>
)

export default CardHeader
