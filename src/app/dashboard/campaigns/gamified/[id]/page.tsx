'use client'

import { useState, useEffect, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getGamifiedCampaign, submitTaskProof } from '../../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { TaskCard } from '@/components/gamified-campaigns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, Users, Trophy, Target } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { TaskDetailDialog } from './components/task-detail-dialog'
import { TaskSubmitDrawer } from './components/task-submit-drawer'
import { toast } from '@/hooks/use-toast'

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user } = useAuth()
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true)
      try {
        console.log('Page: Fetching campaign with ID:', id)
        const campaignData = await getGamifiedCampaign(id)
        console.log('Page: Campaign data received:', campaignData)
        if (!campaignData) {
          console.log('Page: Campaign data is null, calling notFound()')
          setCampaign(null)
        } else {
          setCampaign(campaignData)
        }
      } catch (error) {
        console.error('Page: Error fetching campaign:', error)
        setCampaign(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [id])

  const summaryItems = useMemo(() => {
    if (!campaign) return []

    const userProgress = campaign.participations?.find((p: any) => p.userId === user?.id)
    const totalPoints = campaign.tasks?.reduce(
      (sum: number, ct: any) =>
        sum + (ct.task.achievements?.reduce((s: number, a: any) => s + a.points, 0) || 0),
      0
    ) || 0
    const completedTasks = userProgress?.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0
    const earnedPoints = userProgress?.totalPoints || 0

    return [
      {
        title: 'Total Points',
        value: totalPoints.toString(),
        description: 'Available to earn',
        icon: Trophy,
      },
      {
        title: 'Your Points',
        value: earnedPoints.toString(),
        description: 'Points earned',
        icon: Trophy,
      },
      {
        title: 'Tasks',
        value: (campaign.tasks?.length || 0).toString(),
        description: `${completedTasks} completed`,
        icon: Target,
      },
      {
        title: 'Participants',
        value: (campaign.participations?.length || 0).toString(),
        description: 'People joined',
        icon: Users,
      },
    ]
  }, [campaign, user?.id])

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
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </DashboardPage>
    )
  }

  if (!campaign) {
    return (
      <DashboardPage
        icon={Target}
        title="Campaign Not Found"
        description="The campaign you're looking for doesn't exist or you don't have access to it."
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
          description="The campaign may have been deleted or you may not have permission to view it."
        />
      </DashboardPage>
    )
  }

  // Check which tasks are unlocked for this user
  const userProgress = campaign.participations?.find((p: any) => p.userId === user?.id)
  const isJoined = !!userProgress

  // Get unlocked tasks (simplified - in real implementation, check dependencies)
  const unlockedTasks = campaign.tasks?.map((ct: any) => {
    const submission = userProgress?.submissions?.find((s: any) => s.taskId === ct.task.id)
    return {
      ...ct.task,
      isLocked: !isJoined,
      isCompleted: submission?.status === 'APPROVED',
      isInProgress: submission && submission.status !== 'APPROVED',
    }
  }) || []

  const handleViewTask = (task: any) => {
    setSelectedTask(task)
    setDetailOpen(true)
  }

  const handleSubmitTask = (task: any) => {
    setSelectedTask(task)
    setSubmitOpen(true)
  }

  const handleTaskSubmit = async (data: any) => {
    return await submitTaskProof(data)
  }

  return (
    <DashboardPage
      icon={Target}
      title={campaign.name}
      description={campaign.description}
      actions={[
        {
          label: 'Back to Campaigns',
          icon: ArrowLeft,
          href: '/dashboard/campaigns/gamified',
          variant: 'outline',
        },
      ]}
    >
      {/* Dashboard Summary */}
      <DashboardSummary summaries={summaryItems} />

      {/* Campaign Info */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Progress */}
      {userProgress && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">
                  {userProgress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0} / {campaign.tasks?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-medium">{userProgress.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : unlockedTasks.length === 0 ? (
          <EmptyStateCard
            icon={Target}
            title="No tasks yet"
            description="This campaign doesn't have any tasks yet."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {unlockedTasks.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                isLocked={task.isLocked}
                isCompleted={task.isCompleted}
                isInProgress={task.isInProgress}
                onViewDetails={() => handleViewTask(task)}
                onSubmit={() => handleSubmitTask(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        task={selectedTask}
      />

      {/* Task Submit Drawer */}
      <TaskSubmitDrawer
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        task={selectedTask}
        campaignId={id}
        onSubmit={handleTaskSubmit}
      />
    </DashboardPage>
  )
}
