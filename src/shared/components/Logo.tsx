import { cn } from '@/shared/lib/cn'

export function Logo() {
  return (
    <span className={cn('font-heading flex items-center gap-2 text-lg font-bold text-blue-600')}>
      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white')}>H</span>
      <span className={cn('whitespace-nowrap')}>HelpDesk AI</span>
    </span>
  )
}
