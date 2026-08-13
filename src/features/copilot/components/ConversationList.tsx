import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'

type Props = {
  conversations: { id: string; title: string | null }[]
  activeId: string
}

export function ConversationList({ conversations, activeId }: Props) {
  if (!conversations.length) return <p className={cn('text-sm text-slate-500')}>No conversations yet.</p>

  return (
    <ul className={cn('space-y-1')}>
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <Link
            href={`/copilot/${conversation.id}`}
            className={cn(
              'block truncate rounded px-2 py-1.5 text-sm',
              conversation.id === activeId ? 'bg-blue-50 dark:bg-slate-800' : 'text-slate-600'
            )}
          >
            {conversation.title ?? 'Untitled'}
          </Link>
        </li>
      ))}
    </ul>
  )
}
