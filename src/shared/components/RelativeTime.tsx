'use client'

import { useIsClient } from 'usehooks-ts'
import { useFormatter } from 'next-intl'

type Props = {
  date: Date
}

export function RelativeTime({ date }: Props) {
  const isClient = useIsClient()
  const format = useFormatter()

  if (!isClient) return <time dateTime={date.toISOString()}>{date.toISOString().split('T')[0]}</time>

  return <time dateTime={date.toISOString()}>{format.relativeTime(date)}</time>
}
