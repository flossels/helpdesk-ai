import { getTicketByTrackingId } from '@/lib/placeholderData'
import RelativeTime from '@/shared/components/RelativeTime'
import { cacheLife, cacheTag } from 'next/cache'

type Props = {
  trackingId: string
}

const TrackingStatus = async ({ trackingId }: Props) => {
  'use cache'
  cacheLife('seconds')
  cacheTag(`tracking-${trackingId}`)

  const ticket = await getTicketByTrackingId(trackingId)

  if (!ticket) {
    return <p>No ticket found.</p>
  }

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

export default TrackingStatus
