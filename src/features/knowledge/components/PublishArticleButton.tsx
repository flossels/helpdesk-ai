'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/Button'
import { publishArticle } from '@/features/knowledge/actions/publishArticle'

type Props = {
  articleId: string
}

export function PublishArticleButton({ articleId }: Props) {
  const [isPending, startTransition] = useTransition()

  function publish() {
    startTransition(async () => {
      const result = await publishArticle({ articleId })
      if (!result.success) toast.error(result.error)
    })
  }

  return (
    <Button size="sm" isLoading={isPending} onClick={publish}>
      Publish
    </Button>
  )
}
