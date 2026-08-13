'use client'

import { cn } from '@/shared/lib/cn'
import { Markdown } from '@/features/copilot/components/Markdown'
import { messageText } from '@/features/copilot/lib/messageText'
import type { UIMessage } from 'ai'

type Props = {
  message: UIMessage
}

export function ChatMessage({ message }: Props) {
  const text = messageText(message)

  if (message.role === 'user') {
    return (
      <div className={cn('flex justify-end')}>
        <p className={cn('max-w-[85%] rounded-lg bg-blue-600 px-3 py-2 text-sm text-white')}>{text}</p>
      </div>
    )
  }

  return (
    <div className={cn('max-w-[95%] text-sm text-slate-700 dark:text-slate-300')}>
      <div
        className={cn(
          'prose prose-sm dark:prose-invert max-w-none',
          'prose-code:before:content-none prose-code:after:content-none'
        )}
      >
        <Markdown>{text}</Markdown>
      </div>
    </div>
  )
}
