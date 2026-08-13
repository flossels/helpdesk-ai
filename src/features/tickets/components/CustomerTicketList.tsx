import { getTranslations } from 'next-intl/server'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'
import type { TicketListItem } from '@/features/tickets/types'

type Props = {
  tickets: TicketListItem[]
}

export async function CustomerTicketList({ tickets }: Props) {
  const t = await getTranslations('portal')
  const tStatus = await getTranslations('ticketStatus')

  if (!tickets.length) {
    return <p className={cn('text-sm text-slate-500 dark:text-slate-400')}>{t('empty')}</p>
  }

  return (
    <ul className={cn('space-y-3')}>
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/portal/${ticket.id}`}
            className={cn(
              'flex items-center gap-3 rounded-(--border-radius) bg-white p-4 shadow-sm',
              'transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700'
            )}
          >
            <TicketStatusBadge status={ticket.status} label={tStatus(ticket.status)} />
            <span className={cn('flex-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100')}>{ticket.subject}</span>
            <span className={cn('shrink-0 text-xs text-slate-500 dark:text-slate-400')}>
              <RelativeTime date={ticket.updatedAt} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
