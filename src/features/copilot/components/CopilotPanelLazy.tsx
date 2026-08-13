'use client'

import dynamic from 'next/dynamic'
import type { UIMessage } from 'ai'

type CopilotPanelProps = {
  ticketId: string
  conversationId: string
  initialMessages: UIMessage[]
}

const CopilotPanel = dynamic(() => import('@/features/copilot/components/CopilotPanel').then((mod) => mod.CopilotPanel), {
  ssr: false
})

export function CopilotPanelLazy(props: CopilotPanelProps) {
  return <CopilotPanel {...props} />
}
