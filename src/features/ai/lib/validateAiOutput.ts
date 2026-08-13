const SENSITIVE_MARKERS = [
  { pattern: /internal note/i, warning: 'mentions an internal note' },
  { pattern: /\bsk-[a-zA-Z0-9]{16,}\b/, warning: 'looks like an API key' },
  {
    pattern: /\b(AUTH_SECRET|DATABASE_URL|AWS_SECRET_ACCESS_KEY)\b/,
    warning: 'names a secret'
  }
]

export function validateAiOutput(text: string): { safe: boolean; warnings: string[] } {
  const warnings = SENSITIVE_MARKERS.filter(({ pattern }) => pattern.test(text)).map((m) => m.warning)
  return { safe: warnings.length === 0, warnings }
}
