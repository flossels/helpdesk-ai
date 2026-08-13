export function estimateContextTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
