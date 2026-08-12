type Props = {
  name: string
  ticketCount: number
}

export function Greeting({ name, ticketCount }: Props) {
  return (
    <div>
      <h1>Welcome, {name}</h1>
      {ticketCount > 0 && (
        <p>
          You have {ticketCount} open{' '}
          {ticketCount === 1 ? 'ticket' : 'tickets'}.
        </p>
      )}
    </div>
  )
}
