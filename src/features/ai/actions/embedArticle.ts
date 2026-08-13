'use server'

import { embedMany } from 'ai'
import { db } from '@/shared/lib/db'
import { getEmbeddingModel } from '@/features/ai/lib/getEmbeddingModel'
import { chunkText } from '@/features/ai/lib/chunkText'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { EMBEDDING_CONFIG } from '@/features/ai/lib/aiConfig'

export async function embedArticle(articleId: string, organizationId: string) {
  const article = await db.article.findUnique({
    where: { id: articleId },
    select: { title: true, contentText: true }
  })
  if (!article?.contentText) return

  const chunks = chunkText(`${article.title}\n\n${article.contentText}`)
  try {
    const { embeddings, usage } = await embedMany({
      model: getEmbeddingModel(),
      values: chunks
    })

    await db.$transaction([
      db.articleEmbedding.deleteMany({ where: { articleId } }),
      ...chunks.map(
        (chunk, i) => db.$executeRaw`
          INSERT INTO "ArticleEmbedding"
            (id, "articleId", "chunkIndex", "chunkText", embedding)
          VALUES (
            ${crypto.randomUUID()}, ${articleId}, ${i}, ${chunk},
            ${JSON.stringify(embeddings[i])}::vector
          )
        `
      )
    ])

    await trackUsage({
      organizationId,
      model: EMBEDDING_CONFIG.model,
      feature: 'embed-article',
      inputTokens: usage.tokens,
      outputTokens: 0,
      totalTokens: usage.tokens
    })
  } catch (error) {
    console.error('Embedding article failed:', error)
  }
}
