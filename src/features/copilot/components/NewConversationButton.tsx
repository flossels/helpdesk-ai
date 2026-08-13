'use client'

import { Button } from '@/shared/components/ui/Button'
import { useRouter } from '@/i18n/navigation'

export function NewConversationButton() {
  const router = useRouter()

  function startConversation() {
    router.push(`/copilot/${crypto.randomUUID()}`)
  }

  return (
    <Button size="sm" onClick={startConversation}>
      New conversation
    </Button>
  )
}
