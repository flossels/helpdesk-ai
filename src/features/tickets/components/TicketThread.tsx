import { getReplies } from '@/lib/placeholderData'

type Props = {
  ticketId: string
}

const TicketThread = async ({ ticketId }: Props) => {
  const messages = await getReplies(ticketId)

  return (
    <div>
      <h2>Conversation</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.author}</strong>
            <p>{msg.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TicketThread
