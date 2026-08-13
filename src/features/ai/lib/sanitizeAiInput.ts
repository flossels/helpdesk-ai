const INJECTION_PATTERNS = [
  /---\s*system\s*---/gi,
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /disregard\s+(everything|all|the\s+above)/gi,
  /you\s+are\s+now\s+a/gi,
  /\[\/?inst\]/gi,
  /<\|im_(start|end)\|>/gi,
  /<<\/?sys>>/gi
]

export function sanitizeAiInput(input: string): { sanitized: string; flagged: boolean } {
  let flagged = false
  let sanitized = input
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, () => {
      flagged = true
      return '[filtered]'
    })
  }
  return { sanitized, flagged }
}
