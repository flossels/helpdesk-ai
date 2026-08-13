import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/features/knowledge/queries/getArticleBySlug'
import { getPublishedArticles } from '@/features/knowledge/queries/getPublishedArticles'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'HelpDesk AI Help Center'

export async function generateStaticParams() {
  const articles = await getPublishedArticles()

  return articles.map((article) => ({ slug: article.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#0f172a',
        color: 'white'
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 600, color: '#38bdf8' }}>HelpDesk AI</div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{article?.title ?? 'Help Center'}</div>
      <div style={{ fontSize: 28, color: '#94a3b8' }}>Help Center</div>
    </div>,
    size
  )
}
