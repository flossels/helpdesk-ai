import { expect, test } from '@playwright/test'

import { loginAs } from '@/tests/e2e/support/loginAs'

test.describe('API keys', () => {
  test('an owner can issue a key, see it once, and revoke it', async ({ page }) => {
    await loginAs(page, 'dana@acme.test')
    await page.goto('/settings/api-keys')

    await expect(page.getByRole('heading', { name: 'API Keys' })).toBeVisible()

    const name = `e2e key ${Date.now()}`
    const box = page.getByPlaceholder('Claude Code on my laptop')
    await box.click()
    await box.pressSequentially(name)
    const create = page.getByRole('button', { name: 'Create key' })
    await expect(create).toBeEnabled()
    await create.click()

    const secret = page.getByText(/^hd_sk_/)
    await expect(secret).toBeVisible()
    expect((await secret.textContent())?.startsWith('hd_sk_')).toBe(true)

    const row = page.locator('main li').filter({ hasText: name })
    await expect(row).toBeVisible()

    await page.reload()
    await expect(page.getByText(/^hd_sk_/)).toHaveCount(0)
    await expect(row).toBeVisible()

    await row.getByRole('button', { name: 'Revoke' }).click()
    await expect(row.getByText('revoked')).toBeVisible()
  })

  test('a customer never sees the page', async ({ page }) => {
    await loginAs(page, 'sam@customer.test')
    await page.goto('/settings/api-keys')
    await expect(page.getByRole('heading', { name: 'API Keys' })).toHaveCount(0)
  })
})
