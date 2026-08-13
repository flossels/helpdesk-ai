import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { CategorizationBanner } from '@/features/ai/components/CategorizationBanner'
import { SuggestReplyButton } from '@/features/ai/components/SuggestReplyButton'
import { getCategorizationSuggestion } from '@/features/ai/queries/getCategorizationSuggestion'
import { TicketSummary } from '@/features/tickets/components/TicketSummary'
import { CopilotPanelLazy } from '@/features/copilot/components/CopilotPanelLazy'
import { toUIMessages } from '@/features/copilot/lib/loadConversation'
import { getLatestTicketConversation } from '@/features/copilot/queries/getConversations'

type Props = {
  params: Promise<{ ticketId: string }>
}

export async function TicketAiPanel({ params }: Props) {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const canUseAi = hasScope(user.scopes, 'ai:use')
  const suggestion = await getCategorizationSuggestion(ticketId, user.organizationId)
  const showBanner = suggestion && hasScope(user.scopes, 'tickets:write')

  if (!canUseAi) {
    return showBanner ? <CategorizationBanner ticketId={ticketId} suggestion={suggestion} /> : null
  }

  const latestChat = await getLatestTicketConversation(ticketId, user.id)

  return (
    <div className={cn('flex flex-col gap-8')}>
      {showBanner && <CategorizationBanner ticketId={ticketId} suggestion={suggestion} />}
      <TicketSummary ticketId={ticketId} />
      <SuggestReplyButton ticketId={ticketId} />
      <CopilotPanelLazy
        ticketId={ticketId}
        conversationId={latestChat?.id ?? crypto.randomUUID()}
        initialMessages={latestChat ? toUIMessages(latestChat.messages) : []}
      />
    </div>
  )
}
