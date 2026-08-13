import { notFound } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { ConversationList } from '@/features/copilot/components/ConversationList'
import { CopilotChat } from '@/features/copilot/components/CopilotChat'
import { NewConversationButton } from '@/features/copilot/components/NewConversationButton'
import { toUIMessages } from '@/features/copilot/lib/loadConversation'
import { getConversation, getConversations } from '@/features/copilot/queries/getConversations'

export default async function CopilotPage({ params }: PageProps<'/[locale]/copilot/[conversationId]'>) {
  const { conversationId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'ai:use')) notFound()

  const [conversation, conversations] = await Promise.all([getConversation(conversationId, user.id), getConversations(user.id)])
  const initialMessages = conversation ? toUIMessages(conversation.messages) : []

  return (
    <div className={cn('grid h-[calc(100vh-8rem)] grid-cols-[16rem_1fr] gap-6')}>
      <aside className={cn('min-h-0 space-y-3 overflow-y-auto')}>
        <NewConversationButton />
        <ConversationList conversations={conversations} activeId={conversationId} />
      </aside>
      <div className={cn('flex min-h-0 flex-col rounded-md border dark:border-slate-700')}>
        <CopilotChat conversationId={conversationId} initialMessages={initialMessages} />
      </div>
    </div>
  )
}
