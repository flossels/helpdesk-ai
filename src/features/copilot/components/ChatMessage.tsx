'use client'

import { isStaticToolUIPart } from 'ai'
import { cn } from '@/shared/lib/cn'
import { Markdown } from '@/features/copilot/components/Markdown'
import { ToolInvocation } from '@/features/copilot/components/ToolInvocation'
import { messageText } from '@/features/copilot/lib/messageText'
import type { UIMessage } from 'ai'

type Props = {
  message: UIMessage
  onApproval: (id: string, approved: boolean) => void
}

export function ChatMessage({ message, onApproval }: Props) {
  const text = messageText(message)

  if (message.role === 'user') {
    return (
      <div className={cn('flex justify-end')}>
        <p className={cn('max-w-[85%] rounded-lg bg-blue-600 px-3 py-2 text-sm text-white')}>{text}</p>
      </div>
    )
  }

  const toolParts = message.parts.filter(isStaticToolUIPart)

  return (
    <div className={cn('max-w-[95%] space-y-2 text-sm text-slate-700 dark:text-slate-300')}>
      {toolParts.map((part) => (
        <ToolInvocation key={part.toolCallId} part={part} onApproval={onApproval} />
      ))}
      {text && (
        <div
          className={cn(
            'prose prose-sm dark:prose-invert max-w-none',
            'prose-code:before:content-none prose-code:after:content-none'
          )}
        >
          <Markdown>{text}</Markdown>
        </div>
      )}
    </div>
  )
}
