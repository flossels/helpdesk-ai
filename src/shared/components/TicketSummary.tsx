import { getTicketSummary } from '@/lib/placeholderData'

export async function TicketSummary() {
  const summary = await getTicketSummary()

  return (
    <div>
      <h2>AI Summary</h2>
      <p>{summary}</p>
    </div>
  )
}
