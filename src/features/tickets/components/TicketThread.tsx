import { getTicketThread } from '@/lib/placeholderData'

const TicketThread = async () => {
  const messages = await getTicketThread()

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
