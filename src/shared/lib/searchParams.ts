import qs from 'qs'

export const toQueryString = (params: Record<string, unknown>): string => {
  return qs.stringify(params, {
    skipNulls: true,
    arrayFormat: 'repeat'
  })
}
