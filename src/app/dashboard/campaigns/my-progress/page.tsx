'use client'

import { useState, useEffect, useMemo } from 'react'
import { getUserCampaignProgress, getUserSubmissions } from '../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, CheckCircle2, Clock, XCircle, Target } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface ProgressData {
  totalPoints: number
  totalCampaigns: number
  completedTasks: number
  pendingTasks: number
}

export default function MyProgressPage() {
  const [progressList, setProgressList] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [progressData, submissionsData] = await Promise.all([
          getUserCampaignProgress(),
          getUserSubmissions(),
        ])
        setProgressList(progressData)
        setSubmissions(submissionsData)
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const summaryItems = useMemo(() => {
    const totalPoints = progressList.reduce((sum: number, p: any) => sum + p.totalPoints, 0)
    const totalCampaigns = progressList.length
    const completedTasks = submissions.filter((s: any) => s.status === 'APPROVED').length
    const pendingTasks = submissions.filter((s: any) => s.status === 'SUBMITTED').length

    return [
      {
        title: 'Total Points',
        value: totalPoints.toString(),
        description: 'All time earned',
        icon: Trophy,
      },
      {
        title: 'Campaigns',
        value: totalCampaigns.toString(),
        description: 'Participating in',
        icon: Target,
      },
      {
        title: 'Completed Tasks',
        value: completedTasks.toString(),
        description: 'Approved submissions',
        icon: CheckCircle2,
      },
      {
        title: 'Pending Review',
        value: pendingTasks.toString(),
        description: 'Awaiting approval',
        icon: Clock,
      },
    ]
  }, [progressList, submissions])

  return (
    <DashboardPage
      icon={Trophy}
      title="My Progress"
      description="Track your campaign progress and achievements"
      actions={[
        {
          label: 'Refresh',
          icon: RefreshCw,
          onClick: async () => {
            setLoading(true)
            const [progressData, submissionsData] = await Promise.all([
              getUserCampaignProgress(),
              getUserSubmissions(),
            ])
            setProgressList(progressData)
            setSubmissions(submissionsData)
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

      {/* Campaign Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Campaign Progress</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : progressList.length === 0 ? (
          <EmptyStateCard
            icon={Target}
            title="No campaigns joined yet"
            description="You haven't joined any campaigns. Browse available campaigns to start earning rewards!"
            action={{
              label: 'Browse Campaigns',
              href: '/dashboard/campaigns/gamified',
            }}
          />
        ) : (
          <div className="grid gap-4">
            {progressList.map((progress: any) => {
              const campaign = progress.campaign
              const totalTasks = campaign.tasks.length
              const completedInCampaign = progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0
              const progressPercent = totalTasks > 0 ? (completedInCampaign / totalTasks) * 100 : 0

              return (
                <Card key={progress.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription>{campaign.description}</CardDescription>
                      </div>
                      <Badge>{progress.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {completedInCampaign} / {totalTasks} tasks
                        </span>
                      </div>
                      <Progress value={progressPercent} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{progress.totalPoints} points</span>
                      </div>
                      <Link href={`/dashboard/campaigns/gamified/${campaign.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          View Campaign
                        </Badge>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent Submissions</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <EmptyStateCard
            icon={XCircle}
            title="No submissions yet"
            description="Complete tasks in campaigns to earn points and achievements!"
          />
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 10).map((submission: any) => {
              const statusIcons = {
                APPROVED: <CheckCircle2 className="h-4 w-4 text-green-500" />,
                REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
                SUBMITTED: <Clock className="h-4 w-4 text-orange-500" />,
                DRAFT: <Clock className="h-4 w-4 text-gray-500" />,
              }

              return (
                <Card key={submission.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{submission.task.name}</p>
                        <p className="text-sm text-muted-foreground">{submission.progress?.campaign?.name || 'Unknown Campaign'}</p>
                        {submission.feedback && (
                          <p className="text-sm text-muted-foreground mt-1">{submission.feedback}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge>{submission.status}</Badge>
                        {statusIcons[submission.status as keyof typeof statusIcons]}
                        {submission.submittedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardPage>
  )
}
