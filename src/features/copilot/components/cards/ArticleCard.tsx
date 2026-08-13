'use client'

import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import type { ArticleResult } from '@/features/copilot/components/cards/types'

type Props = {
  article: ArticleResult
}

export function ArticleCard({ article }: Props) {
  return (
    <div className={cn('rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700')}>
      <Link href={`/help/${article.slug}`} className={cn('font-medium hover:underline')}>
        {article.title}
      </Link>
      <p className={cn('mt-1 line-clamp-2 text-xs text-slate-500')}>{article.excerpt}</p>
    </div>
  )
}
