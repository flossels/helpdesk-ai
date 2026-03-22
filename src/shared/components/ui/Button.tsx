import cn from '@/shared/lib/cn'
import { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600',
  secondary: 'bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
}

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm'
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  isLoading?: boolean
}

const Button = ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }: Props) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      variants[variant],
      sizes[size],
      className
    )}
    disabled={disabled ?? isLoading}
    {...props}
  >
    {isLoading && <Spinner />}
    {children}
  </button>
)

export default Button
