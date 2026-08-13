'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsClient } from 'usehooks-ts'
import { checkSlaWarning } from '@/features/tickets/actions/checkSlaWarning'

const WARNING_THRESHOLD_MS = 30 * 60_000

type Props = {
  ticketId: string
  deadline: Date
}

function remaining(deadline: Date) {
  return deadline.getTime() - Date.now()
}

export function SlaCountdown({ ticketId, deadline }: Props) {
  const isClient = useIsClient()
  const [ms, setMs] = useState(() => remaining(deadline))
  const warned = useRef(false)

  useEffect(() => {
    const tick = () => {
      const left = remaining(deadline)
      setMs(left)

      if (!warned.current && left <= WARNING_THRESHOLD_MS) {
        warned.current = true
        checkSlaWarning(ticketId)
      }
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [deadline, ticketId])

  if (!isClient) return <span className="text-slate-500 dark:text-slate-400">…</span>

  const overdue = ms < 0
  const minutes = Math.floor(Math.abs(ms) / 60_000)
  const tone = overdue || minutes < 5 ? 'text-red-600' : minutes < 30 ? 'text-amber-600' : 'text-slate-600'

  return <span className={tone}>{overdue ? `Overdue by ${minutes}min` : `${minutes}min remaining`}</span>
}
