import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

config({ path: process.env.ENV_FILE ?? '.env.local' })

export default defineConfig({
  experimental: { externalTables: true },
  tables: {
    external: ['public.ArticleEmbedding', 'public.TicketEmbedding']
  },
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: { url: env('DIRECT_URL') }
})
