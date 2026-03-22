import cn from '@/shared/lib/cn'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

const Card = ({ children, className }: Props) => (
  <div
    className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800', className)}
  >
    {children}
  </div>
)

export default Card
