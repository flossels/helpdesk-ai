const CHARS_PER_TOKEN = 4

type ChunkOptions = {
  maxTokens?: number
  overlapTokens?: number
}

function splitLongParagraphs(paragraphs: string[], maxChars: number): string[] {
  const out: string[] = []
  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxChars) {
      out.push(paragraph)
      continue
    }
    for (let i = 0; i < paragraph.length; i += maxChars) {
      out.push(paragraph.slice(i, i + maxChars))
    }
  }
  return out
}

export function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const maxChars = (options.maxTokens ?? 500) * CHARS_PER_TOKEN
  const overlapChars = (options.overlapTokens ?? 50) * CHARS_PER_TOKEN

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const chunks: string[] = []
  let current = ''
  for (const paragraph of splitLongParagraphs(paragraphs, maxChars)) {
    if (current && current.length + paragraph.length > maxChars) {
      chunks.push(current)
      current = `${current.slice(-overlapChars)}\n\n${paragraph}`
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph
    }
  }
  if (current) chunks.push(current)
  return chunks.length > 0 ? chunks : [text]
}
