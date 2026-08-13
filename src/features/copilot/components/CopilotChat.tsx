'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { ChatMessageList } from '@/features/copilot/components/ChatMessageList'
import { ChatInput } from '@/features/copilot/components/ChatInput'
import type { UIMessage } from 'ai'

type Props = {
  conversationId: string
  initialMessages: UIMessage[]
  ticketId?: string
  placeholder?: string
}

export function CopilotChat({ conversationId, initialMessages, ticketId, placeholder }: Props) {
  const { messages, sendMessage, status, stop, error, regenerate, addToolApprovalResponse } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/copilot',
      body: { ticketId, conversationId }
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  return (
    <div className={cn('flex h-full flex-col')}>
      {messages.length === 0 ? (
        <div className={cn('flex-1 p-4 text-sm text-slate-500')}>
          {ticketId ? 'Ask about this ticket, or request a reply draft.' : 'Ask anything about your work in HelpDesk AI.'}
        </div>
      ) : (
        <ChatMessageList messages={messages} onApproval={(id, approved) => addToolApprovalResponse({ id, approved })} />
      )}

      {error && (
        <Button variant="ghost" size="sm" className={cn('text-rose-600')} onClick={() => regenerate()}>
          Something went wrong. Retry
        </Button>
      )}

      <ChatInput onSend={(text) => sendMessage({ text })} disabled={isStreaming} placeholder={placeholder} />

      {isStreaming && (
        <Button variant="ghost" size="sm" className={cn('text-blue-600')} onClick={() => stop()}>
          Stop
        </Button>
      )}
    </div>
  )
}
