import { routing } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import { getPublishedArticles } from '@/features/knowledge/queries/getPublishedArticles'
import type { MetadataRoute } from 'next'

const base = process.env.APP_URL ?? 'http://localhost:3000'
const STATIC_PATHS = ['/', '/submit', '/about']

function localizedEntries(href: string, locales: readonly string[], lastModified?: Date): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((alt) => [alt, base + getPathname({ href, locale: alt })]))

  return locales.map((locale) => ({
    url: base + getPathname({ href, locale }),
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages }
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles()

  const bySlug = new Map<string, { locales: string[]; updatedAt: Date }>()
  for (const article of articles) {
    const entry = bySlug.get(article.slug)
    if (entry) {
      entry.locales.push(article.locale)
      if (article.updatedAt > entry.updatedAt) entry.updatedAt = article.updatedAt
    } else {
      bySlug.set(article.slug, { locales: [article.locale], updatedAt: article.updatedAt })
    }
  }

  return [
    ...STATIC_PATHS.flatMap((path) => localizedEntries(path, routing.locales)),
    ...[...bySlug].flatMap(([slug, { locales, updatedAt }]) => localizedEntries(`/help/${slug}`, locales, updatedAt))
  ]
}
