'use client'

import { useTransition } from 'react'
import { cn } from '@/shared/lib/cn'
import { translateReply } from '@/features/tickets/actions/translateReply'
import { LOCALE_NAMES } from '@/i18n/localeNames'
import type { Locale } from '@/i18n/routing'

type Props = {
  content: string
  customerLocale: Locale
  onTranslated: (text: string) => void
}

export function TranslateReplyButton({ content, customerLocale, onTranslated }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleTranslate() {
    startTransition(async () => {
      const result = await translateReply({ content, targetLocale: customerLocale })
      if (result.success) onTranslated(result.data.translated)
    })
  }

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={isPending || !content.trim()}
      className={cn('text-sm text-blue-600 disabled:opacity-50 dark:text-blue-400')}
    >
      {isPending ? 'Translating...' : `Translate to ${LOCALE_NAMES[customerLocale]}`}
    </button>
  )
}
