import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// A unique subject per run: the inbox accumulates tickets, and a locator
// that matches several of them fails Playwright's strict mode.
const SUBJECT = `Cannot log in after password reset ${Date.now()}`

test.describe('Ticket lifecycle', () => {
  test('customer submits, agent replies and resolves', async ({ page }) => {
    // 1. A customer submits a ticket through the public portal. The
    // locators are scoped to <main>, because streamed content is staged
    // in a hidden container before React places it.
    await page.goto('/submit')
    const form = page.getByRole('main')
    await form.getByLabel('Your name').fill('Test Customer')
    await form.getByLabel('Email').fill('customer@example.test')
    await form.getByLabel('Subject').fill(SUBJECT)
    await form.getByLabel('Description').fill('I reset my password yesterday but login still shows an error.')
    await form.getByRole('button', { name: /submit/i }).click()

    // The portal redirects to the tracking page, and the tracking id
    // (HD-0001 style) rides along in the URL.
    await expect(page).toHaveURL(/\/track\/HD-\d{4}/)
    await expect(page.getByRole('heading', { name: SUBJECT })).toBeVisible()

    // 2. An agent signs in and finds the ticket in the inbox.
    await loginAs(page, 'dana@acme.test')
    await page.goto('/tickets')
    // Each inbox row is one link whose accessible name carries the status,
    // the subject and the age, so we match the row by name rather than
    // looking for the subject as standalone text.
    const row = page.getByRole('link', { name: new RegExp(SUBJECT) })
    await expect(row).toBeVisible()

    // 3. The agent opens the ticket. Clicking the row inside the app would
    // hit the intercepting route and open the preview modal, so we navigate
    // to the row's own href to land on the full detail page.
    const href = await row.getAttribute('href')
    await page.goto(href!)
    await expect(page.getByRole('heading', { name: SUBJECT })).toBeVisible()

    // 4. The agent replies.
    await page.getByRole('textbox', { name: /reply/i }).fill('Please clear your browser cache and try again.')
    await page.getByRole('button', { name: /send reply/i }).click()
    await expect(page.getByText(/clear your browser cache/i)).toBeVisible()

    // 5. The customer signs in, finds the ticket in the portal, and
    // answers. The portal reaches the ticket by id, and the query behind it
    // filters on the signed-in customer, so this also proves that path.
    await loginAs(page, 'customer@example.test')
    await page.goto('/portal')
    await page.getByRole('link', { name: new RegExp(SUBJECT) }).click()
    await expect(page.getByText(/clear your browser cache/i)).toBeVisible()
    await page.getByRole('textbox', { name: /your reply/i }).fill('That worked, thank you.')
    await page.getByRole('button', { name: /send reply/i }).click()
    await expect(page.getByText('That worked, thank you.')).toBeVisible()

    // 6. The agent resolves the ticket.
    await loginAs(page, 'dana@acme.test')
    await page.goto(href!)

    // The status control is a Headless UI listbox, not a native select, so
    // we open it and click the option. Its accessible name is the label and
    // the value together.
    await page.getByRole('button', { name: 'Status OPEN', exact: true }).click()
    await page.getByRole('option', { name: 'RESOLVED' }).click()
    await expect(page.getByRole('button', { name: 'Status RESOLVED', exact: true })).toBeVisible()
  })
})

// Authenticate without the Google OAuth flow via the test-login route. It
// mints a session for whichever user the email belongs to, agent or
// customer, which is how one test can cover both sides of a conversation.
async function loginAs(page: Page, email: string) {
  const response = await page.request.post('/api/test/login', {
    data: { email }
  })
  expect(response.ok()).toBe(true)
}
