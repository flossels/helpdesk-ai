import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    'src/app/(public)/actions/revalidateArticles.ts',
    'src/shared/lib/authorization.ts',
    'src/shared/types/database.ts',
    'src/shared/types/scopes.ts',
    'src/features/tickets/types.ts'
  ],
  ignoreDependencies: ['@prisma/client', 'prisma']
}

export default config
