'use client'

import { SWRConfig } from 'swr'
import type { ReactNode } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Props = {
  children: ReactNode
}

export function SwrConfig({ children }: Props) {
  return <SWRConfig value={{ fetcher, revalidateOnFocus: true }}>{children}</SWRConfig>
}
