import { describe, expect, it } from 'vitest'
import { createTicketSchema } from '@/features/tickets/schemas'

const valid = {
  subject: 'Invoice for March is missing',
  description: 'The invoice never arrived and February was fine.',
  categoryId: 'cat-1',
  email: 'customer@example.test'
}

describe('createTicketSchema', () => {
  it('accepts a well-formed ticket', () => {
    expect(createTicketSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts a subject at exactly the minimum length', () => {
    const result = createTicketSchema.safeParse({
      ...valid,
      subject: 'Login'
    })
    expect(result.success).toBe(true)
  })

  it('rejects a subject that is too short', () => {
    const result = createTicketSchema.safeParse({ ...valid, subject: 'help' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = createTicketSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('treats priority as optional', () => {
    expect(createTicketSchema.safeParse({ ...valid, priority: 'HIGH' }).success).toBe(true)
  })

  it('requires a longer description for an urgent ticket', () => {
    const result = createTicketSchema.safeParse({
      ...valid,
      priority: 'URGENT'
    })
    expect(result.success).toBe(false)
  })
})
