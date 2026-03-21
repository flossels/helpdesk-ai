import { getTicketSummary } from '@/lib/placeholderData'

const TicketSummary = async () => {
  const summary = await getTicketSummary()

  return (
    <div>
      <h2>AI Summary</h2>
      <p>{summary}</p>
    </div>
  )
}

export default TicketSummary
