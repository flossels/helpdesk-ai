'use client'

import { useIsClient } from 'usehooks-ts'
import formatRelativeTime from '@/shared/lib/relativeTime'

type Props = {
  date: Date
}

const RelativeTime = ({ date }: Props) => {
  const isClient = useIsClient()

  if (!isClient) return <time dateTime={date.toISOString()}>{date.toISOString().split('T')[0]}</time>

  return <time dateTime={date.toISOString()}>{formatRelativeTime(date)}</time>
}

export default RelativeTime
