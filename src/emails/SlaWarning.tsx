import { Html, Head, Body, Container, Section, Text, Button, Hr, Tailwind } from 'react-email'

type Props = {
  trackingId: string
  subject: string
  minutesLeft: number
  ticketUrl: string
}

export function SlaWarning({ trackingId, subject, minutesLeft, ticketUrl }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <Section>
              <Text className="text-lg font-semibold text-red-600">
                {trackingId} is due in {minutesLeft} minutes
              </Text>
              <Text className="text-slate-700">{subject}</Text>
              <Text className="text-slate-700">
                This ticket is approaching its response deadline. Reply now to keep it within its service level.
              </Text>
              <Hr className="my-6 border-slate-200" />
              <Button href={ticketUrl} className="rounded-md bg-blue-600 px-5 py-3 text-white">
                Open the ticket
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
