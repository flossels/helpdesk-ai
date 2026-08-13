import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { Link } from '@/i18n/navigation'
import { getActivity } from '@/features/activity/queries/getActivity'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

const LABELS: Record<string, string> = {
  'ticket.created': 'created',
  'ticket.replied': 'replied to',
  'ticket.status_changed': 'changed the status of'
}

type Props = {
  searchParams: Promise<{ cursor?: string | string[] }>
}

export async function ActivityFeed({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const { cursor } = await searchParams
  const { entries, nextCursor } = await getActivity(user.organizationId, cursor?.toString())

  if (entries.length === 0) {
    return <p className={cn('text-sm text-slate-500')}>Nothing has happened yet.</p>
  }

  return (
    <div className={cn('space-y-4')}>
      <ul className={cn('space-y-3')}>
        {entries.map((entry) => (
          <li key={entry.id} className={cn('flex items-baseline gap-2 text-sm')}>
            <span className={cn('font-medium text-slate-900 dark:text-slate-100')}>{entry.user.name}</span>
            <span className={cn('text-slate-600 dark:text-slate-300')}>{LABELS[entry.action] ?? entry.action}</span>
            <Link href={`/tickets/${entry.entityId}`} className={cn('text-blue-600 hover:underline')}>
              a ticket
            </Link>
            <span className={cn('ml-auto text-xs text-slate-500')}>
              <RelativeTime date={entry.createdAt} />
            </span>
          </li>
        ))}
      </ul>

      {nextCursor && (
        <Link href={`/activity?cursor=${nextCursor}`} className={cn('text-sm text-blue-600 hover:underline')}>
          Load more
        </Link>
      )}
    </div>
  )
}
