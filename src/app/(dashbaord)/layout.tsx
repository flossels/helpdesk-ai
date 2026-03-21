import CollapsibleSidebar from '@/shared/components/CollapsibleSidebar'
import SidebarNav from '@/shared/components/SidebarNav'
import { Suspense } from 'react'

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex gap-6">
      <Suspense fallback={null}>
        <CollapsibleSidebar>
          <SidebarNav />
        </CollapsibleSidebar>
      </Suspense>
      <div>
        <header>Dashboard Header</header>
        <main>{children}</main>
      </div>
    </div>
  )
}
