import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    'src/features/knowledge/actions/revalidateArticles.ts',
    'src/shared/lib/authorization.ts',
    'src/shared/types/scopes.ts',
    'src/shared/types/database.ts',
    'src/features/tickets/types.ts'
  ],
  ignoreDependencies: ['@prisma/client', 'prisma']
}

export default config
