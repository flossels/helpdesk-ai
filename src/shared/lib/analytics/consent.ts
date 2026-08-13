'use client'

import { useLocalStorage } from 'usehooks-ts'

type ConsentStatus = 'granted' | 'denied' | 'unset'

const KEY = 'analytics-consent'

export function useConsent() {
  const [status, setStatus] = useLocalStorage<ConsentStatus>(KEY, 'unset', {
    initializeWithValue: false
  })
  return {
    status,
    granted: status === 'granted',
    grant: () => setStatus('granted'),
    deny: () => setStatus('denied')
  }
}
