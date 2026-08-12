'use client'

type Props = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function TicketsError({ error, retry }: Props) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={retry}>Try again</button>
    </div>
  )
}
