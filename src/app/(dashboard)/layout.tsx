import { Suspense } from 'react'
import { SidebarNav } from '@/shared/components/SidebarNav'
import { CollapsibleSidebar } from '@/shared/components/CollapsibleSidebar'
import { SidebarProvider } from '@/shared/components/SidebarProvider'
import { DashboardMain } from '@/shared/components/DashboardMain'
import { cn } from '@/shared/lib/cn'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'

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
          <main className={cn('p-4')}>{children}</main>
        </DashboardMain>
      </div>
    </SidebarProvider>
  )
}
