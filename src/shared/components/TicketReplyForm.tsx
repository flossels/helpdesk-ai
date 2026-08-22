'use client'

import { useState } from 'react'

type Props = {
  ticketId: string
}

export function TicketReplyForm({ ticketId }: Props) {
  const [reply, setReply] = useState('')

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    // A Server Action replaces this `console.warn` in Chapter 8
    console.warn(`Reply to ${ticketId}: ${reply}`)
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
