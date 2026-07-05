type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

type Ticket = {
  id: string
  trackingId: string
  subject: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchTicket(id: string): Promise<ApiResponse<Ticket>> {
  await delay(100) // simulate network

  if (id === 'not-found') return { success: false, error: `Ticket ${id} not found` }

  return {
    success: true,
    data: {
      id,
      trackingId: `HD-${id.padStart(4, '0')}`,
      subject: `Issue #${id}`
    }
  }
}

async function loadTicket(id: string) {
  const result = await fetchTicket(id)

  if (!result.success) return console.error(`Error: ${result.error}`)

  console.log(`Loaded: ${result.data.trackingId}, ${result.data.subject}`)
}

async function loadMultiple(ids: string[]) {
  const results = await Promise.all(ids.map((id) => fetchTicket(id)))

  for (const result of results) {
    if (result.success) {
      console.log(`${result.data.trackingId}`)
    } else {
      console.log(`Error: ${result.error}`)
    }
  }
}

async function riskyOperation() {
  try {
    throw new Error('Database connection lost')
  } catch (error: unknown) {
    if (error instanceof Error) console.error(`Caught: ${error.message}`)
  } finally {
    console.log('Cleanup complete')
  }
}

async function main() {
  console.log('--- Single ticket ---')
  await loadTicket('42')
  await loadTicket('not-found')

  console.log('\n--- Multiple tickets ---')
  await loadMultiple(['1', '2', 'not-found', '3'])

  console.log('\n--- Error handling ---')
  await riskyOperation()
}

main()