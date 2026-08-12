import qs from 'qs'

export function toQueryString(params: Record<string, unknown>): string {
  return qs.stringify(params, {
    skipNulls: true,
    arrayFormat: 'repeat'
  })
}

export function fromQueryString(query: string): Record<string, unknown> {
  return qs.parse(query)
}
