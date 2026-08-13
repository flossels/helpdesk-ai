'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { ChatMessage } from '@/features/copilot/components/ChatMessage'
import type { UIMessage } from 'ai'

const FOLLOW_THRESHOLD = 80

type Props = {
  messages: UIMessage[]
  onApproval: (id: string, approved: boolean) => void
}

export function ChatMessageList({ messages, onApproval }: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const followRef = useRef(true)

  useEffect(() => {
    const list = listRef.current
    if (!list || !followRef.current) return
    list.scrollTop = list.scrollHeight
  }, [messages])

  return (
    <div
      ref={listRef}
      onScroll={(event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
        followRef.current = scrollHeight - scrollTop - clientHeight < FOLLOW_THRESHOLD
      }}
      className={cn('min-h-0 flex-1 space-y-3 overflow-y-auto p-3')}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onApproval={onApproval} />
      ))}
    </div>
  )
}
