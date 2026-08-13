'use cache'

import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { OG_LOCALES } from '@/i18n/localeNames'
import { getArticleBySlug } from '@/features/knowledge/queries/getArticleBySlug'
import { getPublishedArticles } from '@/features/knowledge/queries/getPublishedArticles'
import { ArticleJsonLd } from '@/features/knowledge/components/ArticleJsonLd'
import type { Metadata } from 'next'

const siteUrl = process.env.APP_URL ?? 'http://localhost:3000'

export async function generateStaticParams() {
  const articles = await getPublishedArticles()

  return articles.map((article) => ({ locale: article.locale, slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/help/[slug]'>): Promise<Metadata> {
  cacheLife('articles')

  const { locale, slug } = await params
  const article = await getArticleBySlug(slug, locale)
  if (!article) return {}

  const translations = (await getPublishedArticles()).filter((candidate) => candidate.slug === slug)

  const languages = {
    ...Object.fromEntries(
      translations.map((translation) => [translation.locale, getPathname({ href: `/help/${slug}`, locale: translation.locale })])
    ),
    'x-default': getPathname({ href: `/help/${slug}`, locale: routing.defaultLocale })
  }

  const description = article.excerpt ?? undefined

  return {
    title: article.title,
    description,
    alternates: {
      canonical: getPathname({ href: `/help/${slug}`, locale }),
      languages
    },
    openGraph: {
      type: 'article',
      locale: OG_LOCALES[locale],
      title: article.title,
      description
    },
    twitter: { card: 'summary_large_image' }
  }
}

export default async function ArticlePage({ params }: PageProps<'/[locale]/help/[slug]'>) {
  cacheLife('articles')
  cacheTag('articles')

  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'helpCenter' })
  const article = await getArticleBySlug(slug, locale)
  if (!article) notFound()

  return (
    <article className={cn('prose dark:prose-invert max-w-none')}>
      <ArticleJsonLd article={article} url={`${siteUrl}/help/${slug}`} />
      <p>{t('title')}</p>
      <h1>{article.title}</h1>
      <p>{article.contentText}</p>
    </article>
  )
}
