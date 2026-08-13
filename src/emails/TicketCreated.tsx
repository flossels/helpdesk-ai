import { Html, Head, Body, Container, Section, Text, Button, Hr, Link, Tailwind } from 'react-email'

type Props = {
  heading: string
  body: string
  cta: string
  ticketUrl: string
}

export function TicketCreated({ heading, body, cta, ticketUrl }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <Section>
              <Text className="text-lg font-semibold text-slate-900">{heading}</Text>
              <Text className="text-slate-700">{body}</Text>
              <Button href={ticketUrl} className="rounded-md bg-blue-600 px-5 py-3 text-white">
                {cta}
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
