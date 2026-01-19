'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { DashboardSummarySkeleton } from "@/components/dashboard/dashboard-summary-skeleton"
import { HeaderContainer } from "@/components/ui/header-container"
import { useAuth } from '@/context/auth-context'
import {
  getAdminDashboardStats,
  getRecentActivity,
} from './actions'
import type {
  AdminDashboardStats,
  RecentActivity,
} from './actions'
import { Users, FileText, BarChart3, Bell, Activity, Loader2, TrendingUp, Home } from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProxiedImageUrl } from '@/lib/image-proxy'

function AdminDashboard() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <DashboardSummarySkeleton count={4} />

        {/* Recent Activity Skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <Link href="/dashboard?tab=activity">
              <TabsTrigger value="activity">Activity</TabsTrigger>
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
                title: 'Blog Posts',
                value: stats.totalBlogPosts,
                description: `${stats.blogPostsThisMonth} added this month`,
                icon: FileText,
              },
              {
                title: 'Total Views',
                value: stats.totalViews.toLocaleString(),
                description: `${stats.viewsThisMonth} this month`,
                icon: TrendingUp,
              },
              {
                title: 'Support Tickets',
                value: stats.totalSupportTickets,
                description: `${stats.openTickets} open tickets`,
                icon: Bell,
              },
            ] : []}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href={ROUTES.dashboardUsers.href} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link href={ROUTES.dashboardBlog.href} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Manage Blog
                    </Button>
                  </Link>
                  <Link href={ROUTES.dashboardSupportTickets.href} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Support Tickets
                    </Button>
                  </Link>
                  <Link href={ROUTES.siteSettings.href} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Site Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All recent actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0">
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
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UserDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderContainer>
          <div className="flex items-center justify-between w-full">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </HeaderContainer>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <HeaderContainer>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your account today.
            </p>
          </div>
        </div>
      </HeaderContainer>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Complete your profile</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Posts created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">All systems go</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Open tickets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={ROUTES.settings.href} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </Link>
              <Link href={ROUTES.dashboardBlog.href} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Blog Posts
                </Button>
              </Link>
              <Link href={ROUTES.pricing.href} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Plans
                </Button>
              </Link>
              <Link href={ROUTES.contact.href} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Get Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity to display
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  // If no user, show loading while redirecting
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
