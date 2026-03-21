'use client'

import { useEffect } from 'react'

export default function SettingsTemplate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Runs on every navigation within settings
    console.log('Settings page viewed')
  }, [])

  return <div>{children}</div>
}
