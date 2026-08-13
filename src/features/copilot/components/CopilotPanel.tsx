'use client'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { useUiStore } from '@/features/copilot/stores/uiStore'
import { CopilotChat } from '@/features/copilot/components/CopilotChat'
import type { UIMessage } from 'ai'

type Props = {
  ticketId: string
  conversationId: string
  initialMessages: UIMessage[]
}

export function CopilotPanel({ ticketId, conversationId, initialMessages }: Props) {
  const copilotOpen = useUiStore((state) => state.copilotOpen)
  const toggleCopilot = useUiStore((state) => state.toggleCopilot)

  if (!copilotOpen) {
    return (
      <Button variant="ghost" size="sm" className={cn('self-start text-blue-600')} onClick={toggleCopilot}>
        ✨ AI Copilot
      </Button>
    )
  }

  return (
    <div className={cn('flex h-96 flex-col rounded-md border dark:border-slate-700')}>
      <div className={cn('flex items-center justify-between border-b px-3 py-2 dark:border-slate-700')}>
        <span className={cn('text-sm font-semibold')}>AI Copilot</span>
        <Button variant="ghost" size="sm" onClick={toggleCopilot}>
          Close
        </Button>
      </div>
      <CopilotChat
        ticketId={ticketId}
        conversationId={conversationId}
        initialMessages={initialMessages}
        placeholder="Ask about this ticket…"
      />
    </div>
  )
}
