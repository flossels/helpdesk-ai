'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useTicketEvents() {
  const router = useRouter()

  useEffect(() => {
    const source = new EventSource('/api/events')
    const refresh = () => router.refresh()

    source.addEventListener('ticket.created', refresh)
    source.addEventListener('ticket.status_changed', refresh)
    source.addEventListener('ticket.replied', refresh)

    return () => source.close()
  }, [router])
}
