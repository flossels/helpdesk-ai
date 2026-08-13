import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { SidebarNav } from '@/app/(dashboard)/_components/SidebarNav'
import { CollapsibleSidebar } from '@/app/(dashboard)/_components/CollapsibleSidebar'
import { SidebarProvider } from '@/app/(dashboard)/_components/SidebarProvider'
import { DashboardMain } from '@/app/(dashboard)/_components/DashboardMain'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false }
}

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <SidebarProvider>
      <div className={cn('flex flex-1')}>
        <Suspense fallback={null}>
          <CollapsibleSidebar>
            <SidebarNav />
          </CollapsibleSidebar>
        </Suspense>
        <DashboardMain>
          <header
            className={cn(
              'flex items-center justify-between gap-4 border-b border-slate-200 p-4 ps-16 md:ps-4 dark:border-slate-700'
            )}
          >
            <ThemeToggle />
          </header>
          <main id="main-content" className={cn('p-4')}>
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </DashboardMain>
      </div>
    </SidebarProvider>
  )
}
