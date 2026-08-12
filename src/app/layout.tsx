import './globals.css'
import { inter, poppins } from '@/shared/lib/fonts'
import { cn } from '@/shared/lib/cn'
import { ThemeProvider } from '@/shared/components/ThemeProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HelpDesk AI',
  description: 'AI-powered support portal for teams'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
