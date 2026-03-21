'use cache'

import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import { getPublishedArticles, getArticleBySlug } from '@/lib/placeholderData'

export async function generateStaticParams() {
  const articles = await getPublishedArticles()
  return articles.map((article) => ({
    slug: article.slug
  }))
}

export async function generateMetadata({ params }: PageProps<'/help/[slug]'>) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt
  }
}

export default async function ArticlePage({ params }: PageProps<'/help/[slug]'>) {
  cacheLife('hours')
  cacheTag('articles')

  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </article>
  )
}
