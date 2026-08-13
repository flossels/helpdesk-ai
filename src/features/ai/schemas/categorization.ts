import z from 'zod'
import { TICKET_PRIORITIES } from '@/shared/types/ticket'

const SENTIMENTS = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] as const
export type Sentiment = (typeof SENTIMENTS)[number]

export const categorizationSchema = z.object({
  category: z.string().describe('The single best-fitting category name from the list'),
  priority: z.enum(TICKET_PRIORITIES).describe('Urgency based on the customer impact described'),
  sentiment: z.enum(SENTIMENTS).describe("The customer's emotional tone"),
  tags: z.array(z.string()).describe('Up to 3 short, relevant tags'),
  confidence: z.number().min(0).max(1).describe('Confidence in this classification (0 = unsure, 1 = certain)')
})

export type Categorization = z.infer<typeof categorizationSchema>
