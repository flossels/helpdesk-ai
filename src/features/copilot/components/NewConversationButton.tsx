'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/Button'

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
