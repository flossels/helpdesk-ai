'use client'

import { useEffect } from 'react'
import { useIsClient, useLocalStorage } from 'usehooks-ts'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import cn from '@/shared/lib/cn'
import Toggle from '@/shared/components/ui/Toggle'

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', { preference: 'light' }, { initializeWithValue: true })
  const isClient = useIsClient()
  const isDark = isClient ? theme.preference === 'dark' : false

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  const onChange = (checked: boolean) => setTheme({ preference: checked ? 'dark' : 'light' })

  return (
    <div className={cn('flex items-center gap-2')}>
      <SunIcon className="size-5" />
      <Toggle checked={isDark} onChange={onChange} />
      <MoonIcon className="size-5" />
    </div>
  )
}
