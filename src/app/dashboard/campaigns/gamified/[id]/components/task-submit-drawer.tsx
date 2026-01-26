'use client'

import { ProofSubmissionDrawer } from './proof-submission-drawer'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
  campaignId: string
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string }>
}

export function TaskSubmitDrawer({ open, onOpenChange, task, campaignId, onSubmit }: Props) {
  return (
    <ProofSubmissionDrawer
      open={open}
      onOpenChange={onOpenChange}
      task={task}
      campaignId={campaignId}
      onSubmit={onSubmit}
    />
  )
}
