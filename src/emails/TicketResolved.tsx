import { Html, Head, Body, Container, Section, Text, Link, Hr, Tailwind } from 'react-email'

type Props = {
  trackingId: string
  subject: string
  ticketUrl: string
  ratingUrlFor: (score: number) => string
}

const SCORES = [1, 2, 3, 4, 5]

export function TicketResolved({ trackingId, subject, ticketUrl, ratingUrlFor }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <Section>
              <Text className="text-lg font-semibold text-slate-900">Your ticket {trackingId} is resolved</Text>
              <Text className="text-slate-700">{subject}</Text>
              <Hr className="my-6 border-slate-200" />
              <Text className="text-slate-700">How did we do?</Text>
              <Section>
                {SCORES.map((score) => (
                  <Link key={score} href={ratingUrlFor(score)} className="mr-2 text-xl text-amber-500">
                    ★
                  </Link>
                ))}
              </Section>
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
