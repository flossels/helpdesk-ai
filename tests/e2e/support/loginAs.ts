import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export async function loginAs(page: Page, email: string) {
  const response = await page.request.post('/api/test/login', {
    data: { email }
  })
  expect(response.ok()).toBe(true)
}
