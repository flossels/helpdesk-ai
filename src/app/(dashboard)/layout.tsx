import { Suspense } from 'react'
import { SidebarNav } from '@/shared/components/SidebarNav'
import { CollapsibleSidebar } from '@/shared/components/CollapsibleSidebar'

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex gap-6">
      <Suspense>
        <CollapsibleSidebar>
          <SidebarNav />
        </CollapsibleSidebar>
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  )
}
