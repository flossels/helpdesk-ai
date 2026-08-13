import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import AxeBuilder from '@axe-core/playwright'

import { loginAs } from '@/tests/e2e/support/loginAs'

const scan = (page: Page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])

test.describe('accessibility', () => {
  test('the ticket submission page has no violations', async ({ page }) => {
    await page.goto('/submit')
    const { violations } = await scan(page).analyze()
    expect(violations).toEqual([])
  })

  test('a help article has no violations', async ({ page }) => {
    await page.goto('/help/getting-started')
    const { violations } = await scan(page).analyze()
    expect(violations).toEqual([])
  })

  test('the agent inbox has no violations', async ({ page }) => {
    await loginAs(page, 'dana@acme.test')
    await page.goto('/tickets')
    const { violations } = await scan(page).analyze()
    expect(violations).toEqual([])
  })
})
