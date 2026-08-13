'use client'

import { useParams, useRouter } from 'next/navigation'
import { Dialog } from '@/shared/components/ui/Dialog'

export default function TicketPreview() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const router = useRouter()

  return (
    <Dialog open animated={false} onClose={() => router.back()} title={`Ticket Preview: ${ticketId}`}>
      <p>Quick summary of the ticket. Click through for the full view.</p>
    </Dialog>
  )
}
