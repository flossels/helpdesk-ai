import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: RouteContext<'/api/tickets/[ticketId]'>) {
  const { ticketId } = await params

  return Response.json({ ticketId })
}
