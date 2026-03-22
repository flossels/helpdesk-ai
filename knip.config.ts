import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  next: {
    entry: [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/**/route.ts',
      'src/app/**/loading.tsx',
      'src/app/**/error.tsx',
      'src/app/**/not-found.tsx',
      'src/app/**/global-error.tsx',
      'src/app/**/unauthorized.tsx',
      'src/app/**/forbidden.tsx',
      'src/proxy.ts'
    ]
  },
  ignore: ['src/lib/db.ts', 'src/app/(dashboard)/actions/revalidateArticles.ts'],
  ignoreDependencies: ['postcss']
}

export default config
