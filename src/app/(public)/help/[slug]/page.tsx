'use cache'

import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import { cn } from '@/shared/lib/cn'
import { getArticleBySlug } from '@/features/knowledge/queries/getArticleBySlug'
import { getPublishedArticles } from '@/features/knowledge/queries/getPublishedArticles'
import { ArticleJsonLd } from '@/features/knowledge/components/ArticleJsonLd'
import type { Metadata } from 'next'

const siteUrl = process.env.APP_URL ?? 'http://localhost:3000'

export async function generateStaticParams() {
  const articles = await getPublishedArticles()

  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps<'/help/[slug]'>): Promise<Metadata> {
  cacheLife('articles')

  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const description = article.excerpt ?? undefined

  return {
    title: article.title,
    description,
    alternates: { canonical: `/help/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description
    },
    twitter: { card: 'summary_large_image' }
  }
}

export default async function ArticlePage({ params }: PageProps<'/help/[slug]'>) {
  cacheLife('articles')
  cacheTag('articles')

  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <article className={cn('prose dark:prose-invert max-w-none')}>
      <ArticleJsonLd article={article} url={`${siteUrl}/help/${slug}`} />
      <h1>{article.title}</h1>
      <p>{article.contentText}</p>
    </article>
  )
}
