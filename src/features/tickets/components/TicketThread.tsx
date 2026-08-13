import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { getReplies } from '@/features/tickets/queries/getReplies'
import { TicketMessageList } from '@/features/tickets/components/TicketMessageList'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

type Props = {
  ticketId: string
}

export async function TicketThread({ ticketId }: Props) {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const messages = await getReplies(ticketId, user.organizationId)

  return (
    <div className={cn('space-y-4')}>
      <h2 className={cn('text-sm font-semibold text-slate-900 dark:text-slate-100')}>Conversation</h2>
      <TicketMessageList messages={messages} />
    </div>
  )
}
