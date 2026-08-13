import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { SidebarProvider } from '@/app/(dashboard)/_components/SidebarProvider'
import { CollapsibleSidebar } from '@/app/(dashboard)/_components/CollapsibleSidebar'
import { SidebarNav } from '@/app/(dashboard)/_components/SidebarNav'
import { DashboardMain } from '@/app/(dashboard)/_components/DashboardMain'

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
