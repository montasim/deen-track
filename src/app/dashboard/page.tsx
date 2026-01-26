'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton'
import { Overview } from "@/components/dashboard/overview"
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { DashboardSummarySkeleton } from "@/components/dashboard/dashboard-summary-skeleton"
import { HeaderContainer } from "@/components/ui/header-container"
import { useAuth } from '@/context/auth-context'
import {
  getAdminDashboardStats,
  getRecentActivity,
  getAnalyticsData,
} from './actions'
import type {
  AdminDashboardStats,
  RecentActivity,
  AnalyticsData,
} from './actions'
import { Users, TrendingUp, ShoppingBag, MessageSquare, FileText, Award, Loader2, ChevronLeft, ChevronRight, BarChart3, Bell, AlertCircle } from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'
import { getProxiedImageUrl } from '@/lib/image-proxy'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function AdminDashboard() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  // Tab-specific loading states
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const [statsData, activityData] = await Promise.all([
          getAdminDashboardStats(),
          getRecentActivity(8),
        ])
        setStats(statsData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Fetch data for other tabs when they become active
  useEffect(() => {
    const fetchTabData = async () => {
      if (activeTab === 'analytics' && !analyticsData) {
        setIsLoadingAnalytics(true)
        try {
          const data = await getAnalyticsData()
          setAnalyticsData(data)
        } catch (error) {
          console.error('Error fetching analytics data:', error)
        } finally {
          setIsLoadingAnalytics(false)
        }
      }
    }

    fetchTabData()
  }, [activeTab, analyticsData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>

          <DashboardSummarySkeleton count={4} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 overflow-y-auto pb-4">
      <HeaderContainer>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
      </HeaderContainer>

      <Tabs value={activeTab}>
        <div className="w-full overflow-x-auto">
          <TabsList>
            <Link href="/dashboard?tab=overview">
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </Link>
            <Link href="/dashboard?tab=analytics">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </Link>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <DashboardSummary
            summaries={stats ? [
              {
                title: 'Total Users',
                value: stats.totalUsers,
                description: `${stats.usersThisMonth} joined this month`,
                icon: Users,
              },
              {
                title: 'Total Views',
                value: stats.totalViews.toLocaleString(),
                description: `${stats.viewsThisMonth} this month`,
                icon: TrendingUp,
              },
              {
                title: 'Marketplace Posts',
                value: stats.totalMarketplacePosts.toLocaleString(),
                description: `${stats.marketplacePostsThisMonth} this month`,
                icon: ShoppingBag,
              },
              {
                title: 'Support Tickets',
                value: stats.activeSupportTickets,
                description: stats.pendingSupportTickets > 0 ? `${stats.pendingSupportTickets} pending` : 'All responded',
                icon: MessageSquare,
              },
            ] : []}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>
                  Platform activity and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <Avatar className="h-9 w-9">
                        {activity.user?.avatar ? (
                          <AvatarImage src={getProxiedImageUrl(activity.user.avatar) || activity.user.avatar} alt={activity.user.name} />
                        ) : (
                          <AvatarFallback>
                            {activity.user?.name?.[0] || activity.type[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {isLoadingAnalytics ? (
            <>
              <DashboardSummarySkeleton count={4} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-5 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-5 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <>
              <DashboardSummary
                summaries={analyticsData ? [
                  {
                    title: 'Total Views',
                    value: analyticsData.totalViews.toLocaleString(),
                    description: 'Last 30 days',
                    icon: TrendingUp,
                  },
                  {
                    title: 'Unique Visitors',
                    value: analyticsData.uniqueVisitors,
                    description: 'Distinct users',
                    icon: Users,
                  },
                  {
                    title: 'Achievements Unlocked',
                    value: analyticsData.totalAchievementsUnlocked,
                    description: 'User achievements',
                    icon: Award,
                  },
                ] : []}
              />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Top Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Content</CardTitle>
                    <CardDescription>Most viewed items in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.topContent.map((item, i) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {i + 1}
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.views} views</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!analyticsData?.topContent.length && (
                        <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity by Type</CardTitle>
                    <CardDescription>Content distribution by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.activityByType.map((item, i) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {i + 1}
                            </div>
                            <div>
                              <p className="font-medium">{item.type}</p>
                              <p className="text-sm text-muted-foreground">{item.count} items</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!analyticsData?.activityByType.length && (
                        <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UserDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [user])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <HeaderContainer>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Welcome to Admin Template</h1>
              <p className="text-muted-foreground">
                Manage your content and settings.
              </p>
            </div>
          </div>
        </HeaderContainer>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-4 w-4 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <HeaderContainer>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Welcome to Admin Template</h1>
            <p className="text-muted-foreground">
              Manage your content and settings.
            </p>
          </div>
        </div>
      </HeaderContainer>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href={ROUTES.marketplace.href}>
              <Button variant="outline" className="w-full">Manage Items</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href={ROUTES.dashboardSupportTickets.href}>
              <Button variant="outline" className="w-full">View Tickets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href={ROUTES.achievements.href}>
              <Button variant="outline" className="w-full">View Achievements</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Link href={ROUTES.marketplacePosts.href}>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="h-4 w-4 mr-2" />
                My Marketplace Posts
              </Button>
            </Link>
            <Link href={ROUTES.messages.href}>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </Link>
            <Link href={ROUTES.settings.href}>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

  if (isAdmin) {
    return <AdminDashboard />
  }

  return <UserDashboard />
}
