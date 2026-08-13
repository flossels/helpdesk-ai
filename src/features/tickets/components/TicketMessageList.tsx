import { cn } from '@/shared/lib/cn'
import type { TicketReplyItem } from '@/features/tickets/types'

type Props = {
  messages: TicketReplyItem[]
}

export function TicketMessageList({ messages }: Props) {
  return (
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
              <div
                className={cn(
                  '[&_a]:underline',
                  '[&_strong]:font-semibold',
                  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5',
                  '[&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:text-xs',
                  '[&_pre]:mt-1 [&_pre]:rounded [&_pre]:bg-black/20 [&_pre]:p-2 [&_pre]:text-xs',
                  '[&_>*+*]:mt-1'
                )}
                dangerouslySetInnerHTML={{ __html: msg.bodyHtml }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
