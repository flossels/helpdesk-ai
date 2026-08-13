import './globals.css'
import { Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { cn } from '@/shared/lib/cn'
import { SwrConfig } from '@/shared/components/SwrConfig'
import { MixpanelProvider } from '@/shared/components/analytics/MixpanelProvider'
import { ConsentBanner } from '@/shared/components/ConsentBanner'
import { inter, poppins } from '@/shared/lib/fonts'
import { WebVitalsReporter } from '@/app/WebVitalsReporter'
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
      </body>
    </html>
  )
}
