import './globals.css'
import { Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { cn } from '@/shared/lib/cn'
import { SwrConfig } from '@/shared/components/SwrConfig'
import { inter, poppins } from '@/shared/lib/fonts'
import { WebVitalsReporter } from '@/shared/components/WebVitalsReporter'
import { MixpanelProvider } from '@/shared/components/analytics/MixpanelProvider'
import { ConsentBanner } from '@/shared/components/ConsentBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HelpDesk AI',
  description: 'AI-powered support portal for teams'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
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
        {/* VERCEL is set on the platform and nowhere else, so the two
            widgets render only where their scripts exist. */}
        {process.env.VERCEL && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  )
}
