'use client'

import cn from '@/shared/lib/cn'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react'

type TabDefinition = {
  label: string
  content: React.ReactNode
}

type Props = {
  tabs: TabDefinition[]
}

const Tabs = ({ tabs }: Props) => {
  return (
    <TabGroup>
      <TabList className={cn('flex gap-4 border-b border-slate-200 dark:border-slate-700')}>
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={cn(
              'border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 focus:outline-none data-selected:border-blue-600 data-selected:text-blue-600 dark:text-slate-400 dark:hover:text-slate-200 dark:data-selected:border-blue-400 dark:data-selected:text-blue-400'
            )}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels className={cn('mt-4')}>
        {tabs.map((tab) => (
          <TabPanel key={tab.label}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}

export default Tabs
