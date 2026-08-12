import { Suspense } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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
            <div className={cn('relative w-full max-w-xs')}>
              <MagnifyingGlassIcon
                className={cn('pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400')}
              />
              <input
                type="search"
                placeholder="Search..."
                className={cn(
                  'w-full rounded-lg border py-2 pr-3 pl-9 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                )}
              />
            </div>
            <ThemeToggle />
          </header>
          <main className={cn('p-4')}>{children}</main>
        </DashboardMain>
      </div>
    </SidebarProvider>
  )
}
