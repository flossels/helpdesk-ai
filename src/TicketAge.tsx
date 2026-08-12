import { useEffect, useState } from 'react'

function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)

  return `${hours}h ago`
}

function getTimestamp (createdAt: Date) {
  return Math.floor((Date.now() - createdAt.getTime()) / 1000)
}

type Props = {
  createdAt: Date
}

export function TicketAge({ createdAt }: Props) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => getTimestamp(createdAt))

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(getTimestamp(createdAt))
    }, 1000)

    return () => clearInterval(timer)
  }, [createdAt])

  return <span>{formatAge(elapsedSeconds)}</span>
}
