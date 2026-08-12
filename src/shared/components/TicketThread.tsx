import { getReplies } from '@/lib/placeholderData'

type Props = Pick<PageProps<'/tickets/[ticketId]'>, 'params'>

export async function TicketThread({ params }: Props) {
  const { ticketId } = await params
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
