import type { Metadata } from 'next'
import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import cn from '@/shared/lib/cn'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import Script from 'next/script'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'HelpDesk AI',
  description: 'AI-powered support portal for teams'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)} data-scroll-behavior="smooth">
      <Script
        id="theme-injector"
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                var t = localStorage.getItem('theme')
                var d = t === 'dark' ||
                  (!t && matchMedia(
                    '(prefers-color-scheme:dark)'
                  ).matches)
                if (d) document.documentElement
                  .classList.add('dark')
              })()
            `
        }}
      />
      <body>
        <div
          className={cn(
            'relative z-20 flex w-full items-center justify-between bg-white p-4 drop-shadow-sm select-none dark:border-b dark:bg-slate-700 dark:drop-shadow-none'
          )}
        >
          <Link href="/" className={cn('font-heading text-lg font-bold')}>
            HelpDesk AI
          </Link>
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  )
}
