'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { fromQueryString, toQueryString } from '@/shared/lib/searchParams'

export function useUpdateSearchParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (updates: Record<string, unknown>) => {
    const current = fromQueryString(searchParams.toString())
    const merged = { ...current, ...updates }
    const query = toQueryString(merged)
    router.replace(`?${query}`, { scroll: false })
  }
}
