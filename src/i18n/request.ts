import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export const TIME_ZONE = 'Europe/Berlin'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const messages = (await import(`@/messages/${locale}.json`)).default
  if (locale === routing.defaultLocale) return { locale, messages, timeZone: TIME_ZONE }

  const fallback = (await import('@/messages/en.json')).default

  return { locale, messages: { ...fallback, ...messages }, timeZone: TIME_ZONE }
})
