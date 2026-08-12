import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { TicketPriority } from './types'

type NewTicket = {
  subject: string
  description: string
  priority: TicketPriority
}

type Props = {
  onSubmit: (ticket: NewTicket) => void
}

export function TicketForm({ onSubmit }: Props) {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM')
  const subjectRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!subject.trim() || !description.trim()) return

    onSubmit({ subject, description, priority })
    setSubject('')
    setDescription('')
    setPriority('MEDIUM')
    subjectRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="subject">Subject</label>
        <input
          ref={subjectRef}
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TicketPriority)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
      <button type="submit">Add Ticket</button>
    </form>
  )
}
