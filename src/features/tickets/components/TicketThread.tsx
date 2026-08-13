import { cn } from '@/shared/lib/cn'
import { getReplies } from '@/features/tickets/queries/getReplies'

type Props = Pick<PageProps<'/tickets/[ticketId]'>, 'params'>

export async function TicketThread({ params }: Props) {
  const { ticketId } = await params
  const messages = await getReplies(ticketId)

  return (
    <div className={cn('space-y-4')}>
      <h2 className={cn('text-sm font-semibold text-slate-900 dark:text-slate-100')}>Conversation</h2>
      <ul className={cn('space-y-3')}>
        {messages.map((msg) => {
          const isAgent = msg.isAgent

          return (
            <li
              key={msg.id}
              className={cn('flex', {
                'justify-end': isAgent,
                'justify-start': !isAgent
              })}
            >
              <div
                className={cn('max-w-[80%] rounded-lg px-4 py-2 text-sm', {
                  'bg-blue-600 text-white': isAgent,
                  'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100': !isAgent
                })}
              >
                <p className={cn('mb-1 text-xs font-medium opacity-80')}>{msg.author}</p>
                <p>{msg.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
