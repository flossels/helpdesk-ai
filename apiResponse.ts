type ApiResponse<T> = { success: true, data: T } | { success: false, error: string }

function createTicket(subject: string): ApiResponse<{ ticketId: string, trackingId: string }> {
  if (subject.length < 5) {
    return {
      success: false,
      error: 'Subject must be at least 5 characters.',
    }
  }

  return {
    success: true,
    data: {
      ticketId: crypto.randomUUID(),
      trackingId: 'HD-0001',
    },
  }
}

// Test both paths
const fail = createTicket('Hi')
if (!fail.success) console.log('Error:', fail.error)

const ok = createTicket('Login page broken')
if (ok.success) console.log('Created:', ok.data.trackingId)