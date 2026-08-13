import { getPublishedArticles } from '@/features/knowledge/queries/getPublishedArticles'
import type { MetadataRoute } from 'next'

const base = process.env.APP_URL ?? 'http://localhost:3000'
const STATIC_PATHS = ['/', '/submit', '/about']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles()

  return [
    ...STATIC_PATHS.map((path): MetadataRoute.Sitemap[number] => ({
      url: base + path,
      changeFrequency: 'monthly'
    })),
    ...articles.map((article): MetadataRoute.Sitemap[number] => ({
      url: `${base}/help/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly'
    }))
  ]
}
