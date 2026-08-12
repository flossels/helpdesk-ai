import { useState } from 'react'
import type { FilterValue } from '../types'
import { useDebounceValue, useLocalStorage } from 'usehooks-ts'

type TicketFilters = {
  status: FilterValue
  search: string
  debouncedSearch: string
  setStatus: (status: FilterValue) => void
  setSearch: (search: string) => void
}

export function useTicketFilters(): TicketFilters {
  const [status, setStatus] = useState<FilterValue>('ALL')
  const [search, setSearch] = useLocalStorage('filter-search', '')
  const [debouncedSearch] = useDebounceValue(search, 300)

  return { status, search, debouncedSearch, setStatus, setSearch }
}