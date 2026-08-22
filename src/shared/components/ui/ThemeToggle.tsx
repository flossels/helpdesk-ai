'use client'

import { useTheme } from 'next-themes'
import { useIsClient } from 'usehooks-ts'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { cn } from '@/shared/lib/cn'
import { Toggle } from '@/shared/components/ui/Toggle'

export function ThemeToggle() {
  const isClient = useIsClient()
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = isClient && resolvedTheme === 'dark'

  return (
    <div className={cn('ms-auto flex items-center gap-2')}>
      <SunIcon className="size-5" />
      <Toggle checked={isDark} onChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
      <MoonIcon className="size-5" />
    </div>
  )
}
