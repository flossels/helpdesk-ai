'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'analytics-consent'

type ConsentStatus = 'granted' | 'denied' | 'unset'

const listeners = new Set<() => void>()

function read(): ConsentStatus {
  if (typeof window === 'undefined') return 'unset'
  return (localStorage.getItem(KEY) as ConsentStatus | null) ?? 'unset'
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function emit() {
  for (const listener of listeners) listener()
}

export function useConsent() {
  const status = useSyncExternalStore(subscribe, read, () => 'unset' as ConsentStatus)

  return {
    status,
    granted: status === 'granted',
    grant() {
      localStorage.setItem(KEY, 'granted')
      emit()
    },
    deny() {
      localStorage.setItem(KEY, 'denied')
      emit()
    }
  }
}
