import { expect, test } from '@playwright/test'
import { instant } from '@next/playwright'

const ARTICLE = 'Getting Started with HelpDesk AI'

test.describe('Instant navigation', () => {
  test('the help article is in the static shell, the header is not', async ({ page, baseURL }) => {
    await instant(
      page,
      async () => {
        await page.goto('/help/getting-started')
        await expect(page.getByRole('heading', { name: ARTICLE })).toBeVisible()
        // The log-in link is behind Suspense, so it must NOT be here yet.
        await expect(page.getByRole('link', { name: 'Log in' })).toHaveCount(0)
      },
      { baseURL }
    )

    // Outside the scope, the held-back content is released and arrives.
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible()
  })
})
