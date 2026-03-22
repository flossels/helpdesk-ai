'use client'

import Dialog from '@/shared/components/ui/Dialog'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function TicketPreview() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true)

  return (
    <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={`Ticket Preview: ${ticketId}`}>
      <p>Quick summary of the ticket. Click through for the full view.</p>
    </Dialog>
  )
}
