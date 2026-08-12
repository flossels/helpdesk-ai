import { cacheLife, cacheTag } from 'next/cache'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { getTicketByTrackingId } from '@/lib/placeholderData'

type Props = Pick<PageProps<'/track/[trackingId]'>, 'params'>

export async function TrackingStatus({ params }: Props) {
  const { trackingId } = await params

  return <TrackingCard trackingId={trackingId} />
}

async function TrackingCard({ trackingId }: { trackingId: string }) {
  'use cache'
  cacheLife('seconds')
  cacheTag(`tracking-${trackingId}`)

  const ticket = await getTicketByTrackingId(trackingId)
  if (!ticket) return <p>No ticket found.</p>

  return (
    <div>
      <h2>{ticket.subject}</h2>
      <p>Status: {ticket.status}</p>
      <p>
        Last updated: <RelativeTime date={ticket.updatedAt} />
      </p>
    </div>
  )
}
