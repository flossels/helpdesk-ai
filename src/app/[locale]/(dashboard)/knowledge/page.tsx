import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { ArticleList } from '@/features/knowledge/components/ArticleList'

export default function KnowledgePage() {
  return (
    <div className={cn('space-y-4')}>
      <h1 className={cn('text-2xl font-bold')}>Knowledge</h1>
      <Suspense fallback={<p className={cn('text-sm text-slate-500')}>Loading articles…</p>}>
        <ArticleList />
      </Suspense>
    </div>
  )
}
