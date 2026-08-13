import './globals.css'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { cn } from '@/shared/lib/cn'
import { SwrConfig } from '@/shared/components/SwrConfig'
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
        </SessionProvider>
        <Toaster richColors />
        <WebVitalsReporter />
      </body>
    </html>
  )
}
