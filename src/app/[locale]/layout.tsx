import '@/app/globals.css'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { inter, poppins } from '@/shared/lib/fonts'
import { cn } from '@/shared/lib/cn'
import { SwrConfig } from '@/shared/components/SwrConfig'
import { MixpanelProvider } from '@/shared/components/analytics/MixpanelProvider'
import { ConsentBanner } from '@/shared/components/ConsentBanner'
import { OrganizationJsonLd } from '@/shared/components/OrganizationJsonLd'
import { WebVitalsReporter } from '@/app/WebVitalsReporter'
import { OG_LOCALES } from '@/i18n/localeNames'
import { TIME_ZONE } from '@/i18n/request'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

const BUILD_NOW = new Date()

const siteUrl = process.env.APP_URL ?? 'http://localhost:3000'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params

  return {
    metadataBase: new URL(siteUrl),
    title: { default: 'HelpDesk AI', template: '%s | HelpDesk AI' },
    description: 'AI-powered support portal for teams',
    openGraph: {
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => OG_LOCALES[candidate] ?? candidate)
    }
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} className={cn(inter.variable, poppins.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <OrganizationJsonLd url={siteUrl} />
        <a
          href="#main-content"
          className={cn(
            'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-white focus:p-3 focus:text-blue-700 dark:focus:bg-slate-800 dark:focus:text-sky-300'
          )}
        >
          Skip to content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={TIME_ZONE} formats={{}} now={BUILD_NOW}>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SwrConfig>{children}</SwrConfig>
            </ThemeProvider>
            <Suspense fallback={null}>
              <MixpanelProvider />
            </Suspense>
          </SessionProvider>
          <ConsentBanner />
        </NextIntlClientProvider>
        <Toaster richColors />
        <WebVitalsReporter />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
