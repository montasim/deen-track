'use client'

import { useState, useEffect, useMemo } from 'react'
import { getPendingProofs, approveProof, rejectProof } from '../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, XCircle, Image as ImageIcon, Link as LinkIcon, FileText, CheckCircle, RefreshCw } from 'lucide-react'
import { CheckCircle2 as Check } from 'lucide-react'

interface Proof {
  id: string
  type: string
  fileUrl: string | null
  directFileUrl: string | null
  url: string | null
  text: string | null
  validationStatus: string
  submission: {
    id: string
    user: {
      id: string
      name: string
      avatar?: string | null
    }
    task: {
      id: string
      name: string
    }
    progress?: {
      campaign?: {
        id: string
        name: string
      }
    }
  }
}

export default function ProofVerificationPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const [proofs, setProofs] = useState<Proof[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(parseInt(searchParams.page || '1'))

  useEffect(() => {
    const fetchProofs = async () => {
      setLoading(true)
      try {
        const { proofs: proofsData } = await getPendingProofs(page, 20)
        setProofs(proofsData)
      } catch (error) {
        console.error('Error fetching proofs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProofs()
  }, [page])

  const summaryItems = useMemo(() => {
    const pendingCount = proofs.length
    const imageCount = proofs.filter((p) => p.type === 'IMAGE').length
    const urlCount = proofs.filter((p) => p.type === 'URL').length
    const textCount = proofs.filter((p) => p.type === 'TEXT').length

    return [
      {
        title: 'Pending Review',
        value: pendingCount.toString(),
        description: 'Awaiting verification',
        icon: CheckCircle,
      },
      {
        title: 'Images',
        value: imageCount.toString(),
        description: 'Image submissions',
        icon: ImageIcon,
      },
      {
        title: 'URLs',
        value: urlCount.toString(),
        description: 'Link submissions',
        icon: LinkIcon,
      },
      {
        title: 'Text',
        value: textCount.toString(),
        description: 'Text submissions',
        icon: FileText,
      },
    ]
  }, [proofs])

  const handleApprove = async (proofId: string) => {
    try {
      await approveProof(proofId)
      // Refresh proofs
      const { proofs: proofsData } = await getPendingProofs(page, 20)
      setProofs(proofsData)
    } catch (error) {
      console.error('Error approving proof:', error)
    }
  }

  const handleReject = async (proofId: string) => {
    try {
      await rejectProof(proofId, 'Does not meet requirements')
      // Refresh proofs
      const { proofs: proofsData } = await getPendingProofs(page, 20)
      setProofs(proofsData)
    } catch (error) {
      console.error('Error rejecting proof:', error)
    }
  }

  return (
    <DashboardPage
      icon={CheckCircle}
      title="Proof Verification"
      description="Review and verify user submissions"
      actions={[
        {
          label: 'Refresh',
          icon: RefreshCw,
          onClick: async () => {
            setLoading(true)
            const { proofs: proofsData } = await getPendingProofs(page, 20)
            setProofs(proofsData)
            setLoading(false)
          },
          variant: 'outline',
        },
      ]}
    >
      {/* Dashboard Summary */}
      {loading ? (
        <DashboardSummarySkeleton count={4} />
      ) : (
        <DashboardSummary summaries={summaryItems} />
      )}

      {/* Proof List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : proofs.length === 0 ? (
        <EmptyStateCard
          icon={CheckCircle}
          title="No pending proofs"
          description="All submissions have been reviewed. Check back later for new submissions!"
        />
      ) : (
        <div className="space-y-4">
          {proofs.map((proof: Proof) => (
            <Card key={proof.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={proof.submission.user.avatar || undefined} />
                      <AvatarFallback>
                        {proof.submission.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{proof.submission.task.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {proof.submission.user.name} • {proof.submission.progress?.campaign?.name || 'Unknown Campaign'}
                      </p>
                    </div>
                  </div>
                  <Badge>{proof.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Proof Content */}
                <div>
                  <p className="text-sm font-medium mb-2">Submitted Proof:</p>
                  {proof.type === 'IMAGE' && proof.fileUrl && (
                    <div className="border rounded-lg p-2">
                      <img
                        src={proof.directFileUrl || proof.fileUrl}
                        alt="Submitted proof"
                        className="max-w-full max-h-64 mx-auto rounded"
                      />
                    </div>
                  )}
                  {proof.type === 'URL' && proof.url && (
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {proof.url}
                    </a>
                  )}
                  {proof.type === 'TEXT' && proof.text && (
                    <div className="border rounded-lg p-4 bg-muted">
                      <p className="text-sm whitespace-pre-wrap">{proof.text}</p>
                    </div>
                  )}
                  {proof.type === 'AUDIO' && proof.fileUrl && (
                    <audio controls className="w-full">
                      <source src={proof.directFileUrl || proof.fileUrl} />
                      Your browser does not support audio.
                    </audio>
                  )}
                </div>

                {/* Task Rules */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Task Rules:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    Review the submission against the task requirements and rules.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleApprove(proof.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(proof.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPage>
  )
}
