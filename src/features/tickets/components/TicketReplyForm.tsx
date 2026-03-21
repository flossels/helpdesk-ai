'use client'

import { useState } from 'react'

type Props = {
  ticketId: string
}

const TicketReplyForm = ({ ticketId }: Props) => {
  const [reply, setReply] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder — Server Actions come in Ch 8
    console.log(`Reply to ${ticketId}: ${reply}`)
    setReply('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="reply-input">Your reply</label>
      <textarea id="reply-input" value={reply} onChange={(e) => setReply(e.target.value)} rows={4} />
      <button type="submit">Send Reply</button>
    </form>
  )
}

export default TicketReplyForm
