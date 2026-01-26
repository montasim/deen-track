'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { getGamifiedCampaign } from '../../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Users, Trophy, Target, Edit2, Trash2, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { CampaignMutateDrawer } from '../components/campaign-mutate-drawer'
import { toggleCampaignActive } from '../../../gamified-campaigns/actions'
import { toast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editingCampaign, setEditingCampaign] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard/campaigns/templates')
    }
  }, [user, router])

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true)
      try {
        const campaignData = await getGamifiedCampaign(id)
        setCampaign(campaignData)
      } catch (error) {
        console.error('Error fetching campaign:', error)
        setCampaign(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [id])

  const summaryItems = useMemo(() => {
    if (!campaign) return []

    const totalPoints = campaign.tasks?.reduce(
      (sum: number, ct: any) =>
        sum + (ct.task.achievements?.reduce((s: number, a: any) => s + a.points, 0) || 0),
      0
    ) || 0

    // Calculate overall stats
    const totalCompleted = campaign.participations?.reduce((sum: number, p: any) => {
      return sum + (p.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0)
    }, 0) || 0

    const totalEarnedPoints = campaign.participations?.reduce((sum: number, p: any) => sum + (p.totalPoints || 0), 0) || 0

    return [
      {
        title: 'Total Points',
        value: totalPoints.toString(),
        description: 'Available to earn',
        icon: Trophy,
      },
      {
        title: 'Tasks',
        value: (campaign.tasks?.length || 0).toString(),
        description: 'Total tasks',
        icon: Target,
      },
      {
        title: 'Participants',
        value: (campaign._count?.participations || campaign.participations?.length || 0).toString(),
        description: 'People joined',
        icon: Users,
      },
      {
        title: 'Completed Tasks',
        value: totalCompleted.toString(),
        description: 'Across all users',
        icon: CheckCircle2,
      },
    ]
  }, [campaign])

  const handleEditCampaign = () => {
    setEditingCampaign(campaign)
    setDrawerOpen(true)
  }

  const handleToggleActive = async () => {
    try {
      const result = await toggleCampaignActive(campaign.id)

      if (result.success) {
        toast({
          title: 'Campaign updated',
          description: `Campaign has been ${result.campaign.isActive ? 'activated' : 'deactivated'}.`,
        })

        const refreshed = await getGamifiedCampaign(id)
        setCampaign(refreshed)
      }
    } catch (error: any) {
      console.error('Error toggling campaign:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update campaign',
      })
    }
  }

  const getStatusBadge = () => {
    const now = new Date()
    const endDate = new Date(campaign.endDate)
    endDate.setHours(23, 59, 59, 999)
    const startDate = new Date(campaign.startDate)
    startDate.setHours(0, 0, 0, 0)

    if (!campaign.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }

    if (now < startDate) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (now > endDate) {
      return <Badge variant="secondary">Ended</Badge>
    } else {
      return <Badge className="bg-green-500">Active</Badge>
    }
  }

  if (loading) {
    return (
      <DashboardPage
        icon={Target}
        title="Campaign Details"
        description="Loading campaign information..."
        actions={[
          {
            label: 'Back',
            icon: ArrowLeft,
            href: '/dashboard/campaigns/gamified',
            variant: 'outline',
          },
        ]}
      >
        <DashboardSummarySkeleton count={4} />
      </DashboardPage>
    )
  }

  if (!campaign) {
    return (
      <DashboardPage
        icon={Target}
        title="Campaign Not Found"
        description="The campaign you're looking for doesn't exist."
        actions={[
          {
            label: 'Back to Campaigns',
            icon: ArrowLeft,
            href: '/dashboard/campaigns/gamified',
            variant: 'outline',
          },
        ]}
      >
        <EmptyStateCard
          icon={Target}
          title="Campaign not found"
          description="The campaign may have been deleted."
        />
      </DashboardPage>
    )
  }

  return (
    <>
      <DashboardPage
        icon={Target}
        title={campaign.name}
        description={campaign.description}
        actions={[
          {
            label: 'Back',
            icon: ArrowLeft,
            href: '/dashboard/campaigns/gamified',
            variant: 'outline',
          },
          {
            label: 'Edit',
            icon: Edit2,
            onClick: handleEditCampaign,
          },
          {
            label: campaign.isActive ? 'Deactivate' : 'Activate',
            icon: campaign.isActive ? XCircle : CheckCircle2,
            onClick: handleToggleActive,
            variant: 'outline',
          },
        ]}
      >
        {/* Dashboard Summary */}
        <DashboardSummary summaries={summaryItems} />

        {/* Campaign Info */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign Information</CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="font-medium">{new Date(campaign.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>
              {campaign.maxParticipants && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Max Participants</p>
                  <p className="font-medium">{campaign.maxParticipants}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created By</p>
                <p className="font-medium">{campaign.entryBy?.name || 'Unknown'}</p>
              </div>
            </div>

            {campaign.rules && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Rules</p>
                <p className="text-sm whitespace-pre-wrap">{campaign.rules}</p>
              </div>
            )}

            {campaign.disqualificationRules && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Disqualification Rules</p>
                <p className="text-sm whitespace-pre-wrap">{campaign.disqualificationRules}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tasks ({campaign.tasks?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {campaign.tasks?.map((ct: any, index: number) => {
                const task = ct.task
                const totalPoints = task.achievements?.reduce((sum: number, a: any) => sum + a.points, 0) || 0

                return (
                  <div key={ct.task.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{totalPoints} pts</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Participants Leaderboard */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Participants ({campaign.participations?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {campaign.participations?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No participants yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.participations
                    ?.sort((a: any, b: any) => b.totalPoints - a.totalPoints)
                    .slice(0, 10)
                    .map((progress: any, index: number) => {
                      const completedTasks = progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0
                      const totalTasks = campaign.tasks?.length || 0

                      return (
                        <TableRow key={progress.id}>
                          <TableCell>#{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                                {progress.user?.name?.[0] || '?'}
                              </div>
                              <span className="font-medium">{progress.user?.name || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{progress.totalPoints}</span>
                          </TableCell>
                          <TableCell>
                            {completedTasks} / {totalTasks}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={progress.status === 'COMPLETED' ? 'default' : 'secondary'}
                            >
                              {progress.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/admin/proof-verification?campaignId=${campaign.id}&userId=${progress.user.id}`}>
                                View Progress
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </DashboardPage>

      <CampaignMutateDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open)
          if (!open) setEditingCampaign(null)
        }}
        campaign={editingCampaign}
        onSubmit={async (data) => {
          const result = await toggleCampaignActive(campaign.id)
          const refreshed = await getGamifiedCampaign(id)
          setCampaign(refreshed)
          return { success: true }
        }}
        onSuccess={async () => {
          const refreshed = await getGamifiedCampaign(id)
          setCampaign(refreshed)
        }}
      />
    </>
  )
}
