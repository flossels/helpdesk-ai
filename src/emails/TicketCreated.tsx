import { Html, Head, Body, Container, Section, Text, Button, Hr, Link, Tailwind } from 'react-email'

type Props = {
  trackingId: string
  subject: string
  ticketUrl: string
}

export function TicketCreated({ trackingId, subject, ticketUrl }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <Section>
              <Text className="text-lg font-semibold text-slate-900">We received your ticket</Text>
              <Text className="text-slate-700">
                Your ticket <strong>{trackingId}</strong>, {subject}, is in our queue. We&apos;ll reply within one business day.
              </Text>
              <Button href={ticketUrl} className="rounded-md bg-blue-600 px-5 py-3 text-white">
                Track your ticket
              </Button>
              <Hr className="my-6 border-slate-200" />
              <Link href={ticketUrl} className="text-sm text-blue-600">
                {ticketUrl}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
