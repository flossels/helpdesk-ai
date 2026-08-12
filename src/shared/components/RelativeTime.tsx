'use client'

import { useIsClient } from 'usehooks-ts'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'

type Props = {
  date: Date
}

export function RelativeTime({ date }: Props) {
  const isClient = useIsClient()

  if (!isClient) return <time dateTime={date.toISOString()}>{date.toISOString().split('T')[0]}</time>

  return <time dateTime={date.toISOString()}>{formatRelativeTime(date)}</time>
}
