import 'server-only'

import { cookies } from 'next/headers'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'

const LOCALE_COOKIE = 'NEXT_LOCALE'

export async function resolveRecipientLocale(stored?: string | null): Promise<Locale> {
  if (hasLocale(routing.locales, stored)) return stored

  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value
  return hasLocale(routing.locales, cookie) ? cookie : routing.defaultLocale
}
