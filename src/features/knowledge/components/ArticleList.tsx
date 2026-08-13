import { notFound } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getArticles } from '@/features/knowledge/queries/getArticles'
import { PublishArticleButton } from '@/features/knowledge/components/PublishArticleButton'

export async function ArticleList() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'knowledge:read')) notFound()

  const articles = await getArticles(user.organizationId)
  const canPublish = hasScope(user.scopes, 'knowledge:publish')

  return (
    <ul className={cn('divide-y dark:divide-slate-700')}>
      {articles.map((article) => (
        <li key={article.id} className={cn('flex items-center justify-between gap-4 py-2')}>
          <div>
            <p className={cn('font-medium')}>{article.title}</p>
            <p className={cn('text-xs text-slate-500')}>
              {article.status} &middot; {article._count.embeddings} embedded chunks
            </p>
          </div>
          {canPublish && article.status !== 'PUBLISHED' && <PublishArticleButton articleId={article.id} />}
        </li>
      ))}
    </ul>
  )
}
