import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

// The E2E run points at a dedicated test database and enables the
// test-login route (both defined in .env.test).
loadEnv({ path: '.env.test' })

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // The build runs first, so the suite exercises the same output that
    // ships. The default timeout is far too short for a cold build.
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // The server this starts must talk to the test database, not the
    // one in .env.local. Prisma's driver adapter reads DATABASE_URL and
    // its config reads DIRECT_URL, so both have to be passed through.
    env: {
      ENABLE_TEST_LOGIN: 'true',
      // `next start` loads .env.local, and that is where the gateway key
      // lives; an empty value here wins over the file and keeps every
      // model call out of the run.
      AI_GATEWAY_API_KEY: '',
      // Without AUTH_URL, Auth.js trusts no host in a production build
      // and rejects every session.
      AUTH_URL: process.env.AUTH_URL ?? '',
      DATABASE_URL: process.env.DATABASE_URL ?? '',
      DIRECT_URL: process.env.DIRECT_URL ?? '',
      AUTH_SECRET: process.env.AUTH_SECRET ?? '',
      APP_URL: process.env.APP_URL ?? ''
    }
  }
})
