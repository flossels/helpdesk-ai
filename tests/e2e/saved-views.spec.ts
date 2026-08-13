import { expect, test } from '@playwright/test'

import { loginAs } from '@/tests/e2e/support/loginAs'

test('an agent saves the current filters, applies them again and removes the view', async ({ page }) => {
  await loginAs(page, 'dana@acme.test')
  await page.goto('/tickets?status=OPEN')

  const name = `open only ${Date.now()}`
  const box = page.getByPlaceholder('Save current filters as…')
  await box.click()
  await box.pressSequentially(name)
  const save = page.getByRole('button', { name: 'Save', exact: true })
  await expect(save).toBeEnabled()
  await save.click()

  const chip = page.getByRole('button', { name })
  await expect(chip).toBeVisible()

  await page.goto('/tickets')
  await expect(page).toHaveURL(/\/tickets$/)
  await page.getByRole('button', { name }).click()
  await expect(page).toHaveURL(/status=OPEN/)

  await chip.locator('xpath=..').getByRole('button', { name: 'Remove saved view' }).click()
  await expect(page.getByRole('button', { name })).toBeHidden()
})
