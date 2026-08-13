import { Html, Head, Body, Container, Section, Text, Button, Hr, Tailwind } from 'react-email'

type Props = {
  heading: string
  replyHtml: string
  cta: string
  ticketUrl: string
}

export function AgentReply({ heading, replyHtml, cta, ticketUrl }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <Section>
              <Text className="text-lg font-semibold text-slate-900">{heading}</Text>
              <div className="text-slate-700" dangerouslySetInnerHTML={{ __html: replyHtml }} />
              <Hr className="my-6 border-slate-200" />
              <Button href={ticketUrl} className="rounded-md bg-blue-600 px-5 py-3 text-white">
                {cta}
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
