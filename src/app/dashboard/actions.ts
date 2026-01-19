'use server'

import { prisma } from '@/lib/prisma'

// ============================================================================
// OVERVIEW CHART DATA
// ============================================================================

export async function getOverviewData() {
  const now = new Date()
  const months: string[] = []
  const data: number[] = []

  // Get data for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('default', { month: 'short' })

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

    // Count activity logs in this month as a proxy for activity
    const activities = await prisma.activityLog.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    months.push(monthName)
    data.push(activities)
  }

  return months.map((name, i) => ({ name, total: data[i] }))
}

// ============================================================================
// ANALYTICS DATA
// ============================================================================

export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  topContent: Array<{ id: string; name: string; views: number }>
  viewsOverTime: Array<{ date: string; views: number }>
  userEngagement: {
    totalUsers: number
    activeUsers: number
    totalBlogPosts: number
  }
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalViews,
    uniqueVisitors,
    topBlogPosts,
    viewsOverTime,
    userStats,
  ] = await Promise.all([
    // Total activity logs in last 30 days as proxy for views
    prisma.activityLog.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),

    // Unique users from activity logs
    prisma.activityLog.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: thirtyDaysAgo }, userId: { not: null } },
    }).then(groups => groups.length),

    // Top blog posts (using published posts as proxy)
    Promise.resolve([] as Array<{ id: string; name: string; views: number }>),

    // Activity over time (last 30 days)
    prisma.activityLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }).then(activities => {
      const dailyViews = new Map<string, number>()
      activities.forEach(a => {
        const date = a.createdAt.toISOString().split('T')[0]
        dailyViews.set(date, (dailyViews.get(date) || 0) + 1)
      })
      return Array.from(dailyViews.entries()).map(([date, views]) => ({ date, views }))
    }),

    // User engagement stats
    Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          isActive: true,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    ]).then(([totalUsers, activeUsers, totalBlogPosts]) => ({
      totalUsers,
      activeUsers,
      totalBlogPosts,
    })),
  ])

  return {
    totalViews,
    uniqueVisitors,
    topContent: topBlogPosts,
    viewsOverTime,
    userEngagement: userStats,
  }
}

// ============================================================================
// REPORTS DATA
// ============================================================================

export interface ReportData {
  activityByAction: Array<{ action: string; count: number }>
  activityByResource: Array<{ resourceType: string; count: number }>
  userActivity: Array<{ action: string; count: number }>
  systemHealth: {
    totalUsers: number
    totalBlogPosts: number
    totalSupportTickets: number
    totalActivityLogs: number
  }
}

export async function getReportData(): Promise<ReportData> {
  const [
    activityByAction,
    activityByResource,
    userActivity,
    systemHealth,
  ] = await Promise.all([
    // Activity by action
    prisma.activityLog.groupBy({
      by: ['action'],
      _count: { action: true },
    }).then(groups => groups.map(g => ({ action: g.action, count: g._count.action }))),

    // Activity by resource type
    prisma.activityLog.groupBy({
      by: ['resourceType'],
      _count: { resourceType: true },
    }).then(groups => groups.map(g => ({ resourceType: g.resourceType, count: g._count.resourceType }))),

    // Recent user activity (last 7 days)
    prisma.activityLog.groupBy({
      by: ['action'],
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 10,
    }).then(groups => groups.map(g => ({ action: g.action, count: g._count.action }))),

    // System health
    Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.blogPost.count(),
      prisma.supportTicket.count(),
      prisma.activityLog.count(),
    ]).then(([totalUsers, totalBlogPosts, totalSupportTickets, totalActivityLogs]) => ({
      totalUsers,
      totalBlogPosts,
      totalSupportTickets,
      totalActivityLogs,
    })),
  ])

  return {
    activityByAction,
    activityByResource,
    userActivity,
    systemHealth,
  }
}

// ============================================================================
// NOTIFICATIONS DATA
// ============================================================================

export interface NotificationData {
  unread: number
  notifications: Array<{
    id: string
    type: 'info' | 'warning' | 'success' | 'error'
    title: string
    message: string
    createdAt: Date
  }>
}

export async function getNotificationData(): Promise<NotificationData> {
  const notifications = await prisma.notification.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  })

  return {
    unread: notifications.filter(n => !n.isRead).length,
    notifications: notifications.map(n => ({
      id: n.id,
      type: n.type.toLowerCase() as any,
      title: n.title,
      message: n.message.substring(0, 200) + (n.message.length > 200 ? '...' : ''),
      createdAt: n.createdAt,
    })),
  }
}

// ============================================================================
// ADMIN DASHBOARD STATS
// ============================================================================

export interface AdminDashboardStats {
  totalUsers: number
  totalBlogPosts: number
  totalViews: number
  totalSupportTickets: number
  blogPostsThisMonth: number
  usersThisMonth: number
  viewsThisMonth: number
  openTickets: number
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsers,
    totalBlogPosts,
    totalSupportTickets,
    openTickets,
    blogPostsThisMonth,
    usersThisMonth,
    totalViews,
  ] = await Promise.all([
    // Total counts
    prisma.user.count({ where: { isActive: true } }),
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    prisma.supportTicket.count(),
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),

    // This month stats
    prisma.blogPost.count({
      where: {
        status: 'PUBLISHED',
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.user.count({
      where: { createdAt: { gte: startOfMonth }, isActive: true },
    }),

    // Activity logs as proxy for views
    prisma.activityLog.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
  ])

  return {
    totalUsers,
    totalBlogPosts,
    totalViews,
    totalSupportTickets,
    blogPostsThisMonth,
    usersThisMonth,
    viewsThisMonth: totalViews,
    openTickets,
  }
}

export interface RecentActivity {
  id: string
  type: 'user' | 'blog' | 'ticket' | 'system'
  action: string
  description: string
  createdAt: Date
  user?: {
    name: string
    avatar?: string | null
  } | null
}

export async function getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
  const activities: RecentActivity[] = []

  try {
    // Get recent activity logs
    const recentLogs = await prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            directAvatarUrl: true,
          },
        },
      },
    })

    for (const log of recentLogs) {
      let type: RecentActivity['type'] = 'system'
      if (log.resourceType === 'BLOG_POST' || log.resourceType === 'BLOG_COMMENT') {
        type = 'blog'
      } else if (log.resourceType === 'USER') {
        type = 'user'
      } else if (log.resourceType === 'TICKET') {
        type = 'ticket'
      }

      activities.push({
        id: `activity-${log.id}`,
        type,
        action: log.action,
        description: log.description || log.resourceName || `${log.action} on ${log.resourceType}`,
        createdAt: log.createdAt,
        user: log.user ? {
          name: log.user.name,
          avatar: log.user.directAvatarUrl || log.user.avatar,
        } : null,
      })
    }

    return activities.slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

// ============================================================================
// USER DASHBOARD STATS
// ============================================================================

export interface UserDashboardStats {
  totalBlogPosts: number
  totalUsers: number
  totalSupportTickets: number
  yourTickets: number
  openTickets: number
}

export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  const [
    totalBlogPosts,
    totalUsers,
    yourTickets,
    openTickets,
  ] = await Promise.all([
    // Total public blog posts available
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),

    // Total active users
    prisma.user.count({ where: { isActive: true } }),

    // User's support tickets
    prisma.supportTicket.count({ where: { userId } }),

    // Open tickets
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),
  ])

  const totalSupportTickets = await prisma.supportTicket.count()

  return {
    totalBlogPosts,
    totalUsers,
    totalSupportTickets,
    yourTickets,
    openTickets,
  }
}

export interface RecentlyViewedContent {
  id: string
  title: string
  type: 'blog' | 'faq'
  lastViewedAt: Date
}

export async function getRecentlyViewedContent(userId: string, limit: number = 5) {
  // Get recent activity logs for this user related to viewing content
  const recentActivities = await prisma.activityLog.findMany({
    where: {
      userId,
      action: 'VIEW',
      resourceType: { in: ['BLOG_POST', 'FAQ'] },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      resourceId: true,
      resourceType: true,
      createdAt: true,
      resourceName: true,
    },
  })

  return recentActivities
    .map(activity => ({
      id: activity.resourceId || activity.id,
      title: activity.resourceName || activity.resourceType,
      type: activity.resourceType === 'BLOG_POST' ? ('blog' as const) : ('faq' as const),
      lastViewedAt: activity.createdAt,
    }))
    .slice(0, limit)
}

export interface PopularContent {
  id: string
  title: string
  type: 'blog' | 'faq'
  viewCount: number
}

export async function getPopularContent(limit: number = 6) {
  // Get most viewed content from activity logs
  const popularContent = await prisma.activityLog.groupBy({
    by: ['resourceId', 'resourceType'],
    where: {
      action: 'VIEW',
      resourceId: { not: null },
      resourceType: { in: ['BLOG_POST', 'FAQ'] },
    },
    _count: true,
    orderBy: { _count: { resourceId: 'desc' } },
    take: limit,
  })

  return popularContent.map(item => ({
    id: item.resourceId || '',
    title: `${item.resourceType}`,
    type: item.resourceType === 'BLOG_POST' ? ('blog' as const) : ('faq' as const),
    viewCount: item._count,
  }))
}

// Legacy export for RecentSales component
export async function getRecentSales() {
  // Return empty array for now - this component is not used in the dashboard
  return []
}
