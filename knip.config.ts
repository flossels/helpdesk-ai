import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    'src/features/knowledge/actions/revalidateArticles.ts',
    'src/shared/lib/authorization.ts',
    'src/shared/types/scopes.ts'
  ]
}

export default config
