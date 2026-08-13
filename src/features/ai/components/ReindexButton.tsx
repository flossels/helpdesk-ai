'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/Button'
import { embedAllContent } from '@/features/ai/actions/embedAll'

export function ReindexButton() {
  const [isPending, startTransition] = useTransition()

  function reindex() {
    startTransition(async () => {
      const result = await embedAllContent()
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(`Re-indexed ${result.data.articles} articles and ${result.data.tickets} tickets.`)
    })
  }

  return (
    <Button variant="secondary" isLoading={isPending} onClick={reindex}>
      Re-index all content
    </Button>
  )
}
