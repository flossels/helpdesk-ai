import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { AttachmentList } from '@/shared/components/ui/AttachmentList'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getAttachments } from '@/features/tickets/queries/getAttachments'

type Props = {
  params: Promise<{ ticketId: string }>
}

export async function TicketAttachments({ params }: Props) {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const attachments = await getAttachments('ticket', ticketId, user.organizationId)
  if (attachments.length === 0) return null

  return (
    <section>
      <h2 className={cn('mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300')}>Attachments</h2>
      <AttachmentList attachments={attachments} />
    </section>
  )
}
