'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getUserCampaignProgress, getUserSubmissions } from '../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, CheckCircle2, Clock, XCircle, Target, TrendingUp, Award, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { MyProgressPageSkeleton } from '@/components/campaigns/my-progress-skeleton'

export default function MyProgressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [progressList, setProgressList] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect admins away from this page
  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      router.push('/dashboard/admin/campaigns')
    }
  }, [user, router])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [progressData, submissionsData] = await Promise.all([
          getUserCampaignProgress(),
          getUserSubmissions(),
        ])
        setProgressList((progressData || []) as any[])
        setSubmissions((submissionsData || []) as any[])
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare chart data
  const chartData = useMemo(() => {
    if (progressList.length === 0) return { campaignProgress: [], pointsByCampaign: [], statusDistribution: [] }

    // 1. Campaign Progress Data for Area Chart
    const campaignProgress = progressList.map((progress) => {
      const campaign = progress.campaign
      const totalTasks = campaign.tasks.length
      const completedTasks = progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0

      return {
        name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
        points: progress.totalPoints,
        completed: completedTasks,
        total: totalTasks,
        progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      }
    })

    // 2. Points by Campaign for Bar Chart
    const pointsByCampaign = progressList
      .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
      .slice(0, 6)
      .map((progress) => {
        const campaign = progress.campaign
        return {
          name: campaign.name.length > 12 ? campaign.name.substring(0, 12) + '...' : campaign.name,
          points: progress.totalPoints,
          tasks: campaign.tasks.length,
          completed: progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0,
        }
      })

    // 3. Status Distribution for Donut Chart
    const completedTasks = submissions.filter((s: any) => s.status === 'APPROVED').length
    const pendingTasks = submissions.filter((s: any) => s.status === 'SUBMITTED').length
    const rejectedTasks = submissions.filter((s: any) => s.status === 'REJECTED').length

    const statusDistribution = [
      { name: 'Completed', value: completedTasks, color: '#10b981' },
      { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
      {name: 'Rejected', value: rejectedTasks, color: '#ef4444' },
    ]

    return { campaignProgress, pointsByCampaign, statusDistribution }
  }, [progressList, submissions])

  // Calculate overall stats
  const totalPoints = progressList.reduce((sum: number, p: any) => sum + p.totalPoints, 0)
  const totalCampaigns = progressList.length
  const completedTasks = submissions.filter((s: any) => s.status === 'APPROVED').length
  const totalTasks = progressList.reduce((sum: number, p: any) => sum + p.campaign.tasks.length, 0)
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b']

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
            setProgressList((progressData || []) as any[])
            setSubmissions((submissionsData || []) as any[])
            setLoading(false)
          },
          variant: 'outline',
        },
      ]}
    >
      {loading ? (
        <MyProgressPageSkeleton />
      ) : progressList.length === 0 ? (
        <EmptyStateCard
          icon={Target}
          title="No campaigns joined yet"
          description="You haven't joined any campaigns. Browse available campaigns to start earning rewards!"
          action={{
            label: 'Browse Campaigns',
            onClick: () => router.push('/dashboard/campaigns/gamified'),
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold mt-1">{totalPoints.toLocaleString()}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Campaigns</p>
                    <p className="text-2xl font-bold mt-1">{totalCampaigns}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold mt-1">{completedTasks}/{totalTasks}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold mt-1">{overallProgress}%</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Progress Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress Overview</CardTitle>
                <CardDescription>Your journey across all campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.campaignProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                      }}
                      formatter={(value: any) => `${value} points`}
                    />
                    <Area
                      type="monotone"
                      dataKey="points"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution Donut Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
                <CardDescription>Distribution of your task submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      dataKey="value"
                    >
                      {chartData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Points by Campaign Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Points by Campaign</CardTitle>
              <CardDescription>Your top performing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.pointsByCampaign}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                    }}
                    cursor={{ fill: '#8b5cf6' }}
                  />
                  <Bar dataKey="points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Progress Cards */}
          <div>
            <h2 className="text-lg font-bold mb-4">Campaign Progress</h2>
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
                        <div className="flex-1">
                          <CardTitle className="text-base">{campaign.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
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
          </div>

          {/* Recent Submissions */}
          <div>
            <h2 className="text-lg font-bold mb-4">Recent Submissions</h2>
            {submissions.length === 0 ? (
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
        </div>
      )}
    </DashboardPage>
  )
}
