'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { cn } from '@/shared/lib/cn'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { NATIVE_NAMES } from '@/i18n/localeNames'

export function LanguageSwitcher() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Listbox value={locale} onChange={handleChange}>
      <ListboxButton
        aria-label={t('changeLanguage')}
        className={cn('text-sm text-slate-600 focus-visible:ring-2 dark:text-slate-300')}
      >
        {NATIVE_NAMES[locale]}
      </ListboxButton>
      <ListboxOptions anchor="bottom end" className={cn('rounded-md border bg-white p-1 text-sm dark:bg-slate-800')}>
        {routing.locales.map((candidate) => (
          <ListboxOption
            key={candidate}
            value={candidate}
            className={cn('cursor-pointer rounded px-3 py-1 data-focus:bg-slate-100')}
          >
            {NATIVE_NAMES[candidate]}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
