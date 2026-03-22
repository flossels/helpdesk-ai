import CollapsibleSidebar from '@/shared/components/CollapsibleSidebar'
import SidebarNav from '@/shared/components/SidebarNav'
import cn from '@/shared/lib/cn'
import { Suspense } from 'react'

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className={cn('flex flex-1')}>
      <Suspense fallback={null}>
        <CollapsibleSidebar>
          <SidebarNav />
        </CollapsibleSidebar>
      </Suspense>
      <div className={cn('p-4 transition-[width] duration-300 ease-in-out')}>
        <main>{children}</main>
      </div>
    </div>
  )
}
