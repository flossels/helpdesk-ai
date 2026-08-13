import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Tests import mock factories and helpers from `@/tests/*`.
      '@/tests': fileURLToPath(new URL('./tests', import.meta.url)),
      // `server-only` throws when imported outside a Server Component
      // context, so tests resolve it to an empty stub.
      'server-only': fileURLToPath(new URL('./tests/stubs/serverOnly.ts', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    env: { LOG_LEVEL: 'silent' },
    setupFiles: ['./tests/setup.ts'],
    server: { deps: { inline: ['next-intl'] } },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: [
        'src/features/ai/lib/chunkText.ts',
        'src/features/ai/lib/checkBudget.ts',
        'src/features/ai/actions/categorizeTicket.ts',
        'src/features/tickets/actions/createTicket.ts',
        'src/features/tickets/actions/updateTicketStatus.ts',
        'src/features/tickets/components/TicketStatusBadge.tsx',
        'src/features/tickets/components/TicketList.tsx',
        'src/features/copilot/lib/createCopilotTools.ts',
        'src/app/api/copilot/route.ts',
        'src/shared/lib/authorization.ts',
        'src/features/tickets/schemas.ts'
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60
      }
    }
  }
})
