'use client'

import updateTicketStatus from '@/app/(dashboard)/actions/updateTicketStatus'
import { TicketStatus } from '@/lib/placeholderData'
import { ChangeEventHandler, useOptimistic, useTransition } from 'react'

type Props = {
  ticketId: string
  status: string
}

const TicketStatusSelect = ({ ticketId, status }: Props) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)
  const [isPending, startTransition] = useTransition()

  const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const status = event.target.value as TicketStatus

    startTransition(async () => {
      setOptimisticStatus(status)

      await updateTicketStatus({
        ticketId,
        status
      })
    })
  }

  return (
    <select disabled={isPending} value={optimisticStatus} onChange={onChange}>
      <option value="OPEN">Open</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="WAITING">Waiting</option>
      <option value="RESOLVED">Resolved</option>
      <option value="CLOSED">Closed</option>
    </select>
  )
}

export default TicketStatusSelect
