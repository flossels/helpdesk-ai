'use client'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { ToolResult } from '@/features/copilot/components/ToolResult'
import { ApprovalCard } from '@/features/copilot/components/ApprovalCard'
import type { ToolUIPart } from 'ai'

type Props = {
  part: ToolUIPart
  onApproval: (id: string, approved: boolean) => void
}

export function ToolInvocation({ part, onApproval }: Props) {
  const toolName = part.type.replace('tool-', '')

  if (part.state === 'output-available') {
    return <ToolResult name={toolName} output={part.output} />
  }

  if (part.state === 'output-error') {
    return <p className={cn('text-sm text-rose-600')}>{`${toolName}: ${part.errorText}`}</p>
  }

  if (part.state === 'output-denied') {
    return <p className={cn('text-sm text-slate-500')}>{`${toolName} was declined.`}</p>
  }

  if (part.state === 'approval-requested') {
    return (
      <ApprovalCard name={toolName} input={part.input}>
        <Button size="sm" onClick={() => onApproval(part.approval.id, true)}>
          Approve
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onApproval(part.approval.id, false)}>
          Reject
        </Button>
      </ApprovalCard>
    )
  }

  if (part.state === 'approval-responded') {
    return (
      <p className={cn('text-sm text-slate-500')}>
        {part.approval.approved ? `${toolName} approved, running…` : `${toolName} rejected.`}
      </p>
    )
  }

  return <p className={cn('text-sm text-slate-400')}>{`Running ${toolName}…`}</p>
}
