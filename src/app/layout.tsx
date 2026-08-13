import './globals.css'
import { Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { cn } from '@/shared/lib/cn'
import { SwrConfig } from '@/shared/components/SwrConfig'
import { MixpanelProvider } from '@/shared/components/analytics/MixpanelProvider'
import { ConsentBanner } from '@/shared/components/ConsentBanner'
import { OrganizationJsonLd } from '@/shared/components/OrganizationJsonLd'
import { inter, poppins } from '@/shared/lib/fonts'
import { WebVitalsReporter } from '@/app/WebVitalsReporter'
import type { Metadata } from 'next'

const siteUrl = process.env.APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'HelpDesk AI', template: '%s | HelpDesk AI' },
  description: 'AI-powered support portal for teams'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
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
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SwrConfig>{children}</SwrConfig>
          </ThemeProvider>
          <Suspense fallback={null}>
            <MixpanelProvider />
          </Suspense>
        </SessionProvider>
        <Toaster richColors />
        <WebVitalsReporter />
        <ConsentBanner />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
