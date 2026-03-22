import cn from '@/shared/lib/cn'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

const CardBody = ({ children, className }: Props) => <div className={cn('py-4', className)}>{children}</div>

export default CardBody
