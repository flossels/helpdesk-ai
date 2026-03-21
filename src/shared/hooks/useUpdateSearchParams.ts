'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { toQueryString } from '@/shared/lib/searchParams'

const useUpdateSearchParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (updates: Record<string, unknown>) => {
    const current = Object.fromEntries(searchParams.entries())
    const merged = { ...current, ...updates }
    const query = toQueryString(merged)
    router.replace(`?${query}`, { scroll: false })
  }
}

export default useUpdateSearchParams
