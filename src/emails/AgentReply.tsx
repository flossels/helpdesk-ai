import { Html, Head, Body, Container, Section, Text, Button, Hr, Tailwind } from 'react-email'

type Props = {
  trackingId: string
  agentName: string
  replyHtml: string
  ticketUrl: string
}

export function AgentReply({ trackingId, agentName, replyHtml, ticketUrl }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <Section>
              <Text className="text-lg font-semibold text-slate-900">
                {agentName} replied to {trackingId}
              </Text>
              <div className="text-slate-700" dangerouslySetInnerHTML={{ __html: replyHtml }} />
              <Hr className="my-6 border-slate-200" />
              <Button href={ticketUrl} className="rounded-md bg-blue-600 px-5 py-3 text-white">
                View the conversation
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
