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

    // Count itemSellPost views in this month
    const views = await prisma.itemSellPostView.count({
      where: {
        visitedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    months.push(monthName)
    data.push(views)
  }

  return months.map((name, i) => ({ name, total: data[i] }))
}

// ============================================================================
// ANALYTICS DATA
// ============================================================================

export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  topContent: Array<{ id: string; title: string; views: number }>
  activityByType: Array<{ type: string; count: number }>
  totalBlogPosts: number
  totalAchievementsUnlocked: number
  viewsOverTime: Array<{ date: string; views: number }>
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalViews,
    uniqueVisitors,
    topSellPosts,
    activityByType,
    totalBlogPosts,
    totalAchievements,
    viewsOverTime,
  ] = await Promise.all([
    // Total views in last 30 days (from itemSellPostView)
    prisma.itemSellPostView.count({
      where: { visitedAt: { gte: thirtyDaysAgo } },
    }),

    // Unique visitors
    prisma.itemSellPostView.groupBy({
      by: ['userId'],
      where: { visitedAt: { gte: thirtyDaysAgo }, userId: { not: null } },
    }).then(groups => groups.length),

    // Top viewed marketplace posts
    prisma.itemSellPostView.groupBy({
      by: ['sellPostId'],
      where: { visitedAt: { gte: thirtyDaysAgo } },
      _count: { sellPostId: true },
      orderBy: { _count: { sellPostId: 'desc' } },
      take: 5,
    }).then(async (groups) => {
      const posts = await prisma.itemSellPost.findMany({
        where: { id: { in: groups.map(g => g.sellPostId) } },
        select: { id: true, title: true },
      })
      return groups.map(g => ({
        id: g.sellPostId,
        title: posts.find(p => p.id === g.sellPostId)?.title || 'Unknown',
        views: g._count.sellPostId,
      }))
    }),

    // Activity by type (from activity logs)
    prisma.activityLog.groupBy({
      by: ['resourceType'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { resourceType: true },
      orderBy: { _count: { resourceType: 'desc' } },
      take: 5,
    }).then(groups => groups.map(g => ({
      type: g.resourceType,
      count: g._count.resourceType,
    }))),

    // Total blog posts
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),

    // Total achievements unlocked
    prisma.userAchievement.count(),

    // Views over time (last 30 days)
    prisma.itemSellPostView.findMany({
      where: { visitedAt: { gte: thirtyDaysAgo } },
      select: { visitedAt: true },
    }).then(views => {
      const dailyViews = new Map<string, number>()
      views.forEach(v => {
        const date = v.visitedAt.toISOString().split('T')[0]
        dailyViews.set(date, (dailyViews.get(date) || 0) + 1)
      })
      return Array.from(dailyViews.entries()).map(([date, views]) => ({ date, views }))
    }),
  ])

  return {
    totalViews,
    uniqueVisitors,
    topContent: topSellPosts,
    activityByType,
    totalBlogPosts,
    totalAchievementsUnlocked: totalAchievements,
    viewsOverTime,
  }
}

// ============================================================================
// ADMIN DASHBOARD STATS
// ============================================================================

export interface AdminDashboardStats {
  totalUsers: number
  totalViews: number
  totalMarketplacePosts: number
  activeSupportTickets: number
  pendingSupportTickets: number
  usersThisMonth: number
  viewsThisMonth: number
  marketplacePostsThisMonth: number
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsers,
    totalViews,
    totalMarketplacePosts,
    activeSupportTickets,
    pendingSupportTickets,
    usersThisMonth,
    viewsThisMonth,
    marketplacePostsThisMonth,
  ] = await Promise.all([
    // Total users
    prisma.user.count({ where: { isActive: true } }),

    // Total marketplace views
    prisma.itemSellPostView.count(),

    // Total marketplace posts
    prisma.itemSellPost.count(),

    // Active support tickets
    prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),

    // Pending support tickets
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),

    // This month stats
    prisma.user.count({ where: { createdAt: { gte: startOfMonth }, isActive: true } }),
    prisma.itemSellPostView.count({ where: { visitedAt: { gte: startOfMonth } } }),
    prisma.itemSellPost.count({ where: { createdAt: { gte: startOfMonth } } }),
  ])

  return {
    totalUsers,
    totalViews,
    totalMarketplacePosts,
    activeSupportTickets,
    pendingSupportTickets,
    usersThisMonth,
    viewsThisMonth,
    marketplacePostsThisMonth,
  }
}

export interface RecentActivity {
  id: string
  type: 'marketplace' | 'blog' | 'user' | 'support' | 'view'
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
    // Get recent marketplace posts
    const recentPosts = await prisma.itemSellPost.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        seller: {
          select: { name: true, avatar: true, directAvatarUrl: true },
        },
      },
    })

    for (const post of recentPosts) {
      activities.push({
        id: `post-${post.id}`,
        type: 'marketplace',
        action: 'Marketplace Post Created',
        description: `New marketplace post "${post.title}" was added`,
        createdAt: post.createdAt,
        user: post.seller ? {
          name: post.seller.name,
          avatar: post.seller.directAvatarUrl || post.seller.avatar,
        } : null,
      })
    }

    // Get recent blog posts
    const recentBlogs = await prisma.blogPost.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: { name: true, avatar: true, directAvatarUrl: true },
        },
      },
    })

    for (const blog of recentBlogs) {
      activities.push({
        id: `blog-${blog.id}`,
        type: 'blog',
        action: 'Blog Post Published',
        description: `Blog post "${blog.title}" was published`,
        createdAt: blog.createdAt,
        user: blog.author ? {
          name: blog.author.name,
          avatar: blog.author.directAvatarUrl || blog.author.avatar,
        } : null,
      })
    }

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 4,
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    })

    for (const user of recentUsers) {
      activities.push({
        id: `user-${user.id}`,
        type: 'user',
        action: 'New User',
        description: `User "${user.name}" joined`,
        createdAt: user.createdAt,
        user: null,
      })
    }

    // Get recent support tickets
    const recentTickets = await prisma.supportTicket.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        status: true,
        createdAt: true,
        user: {
          select: { name: true, avatar: true, directAvatarUrl: true },
        },
      },
    })

    for (const ticket of recentTickets) {
      activities.push({
        id: `ticket-${ticket.id}`,
        type: 'support',
        action: `Support Ticket ${ticket.status}`,
        description: `"${ticket.subject}" - ${ticket.status}`,
        createdAt: ticket.createdAt,
        user: ticket.user ? {
          name: ticket.user.name,
          avatar: ticket.user.directAvatarUrl || ticket.user.avatar,
        } : null,
      })
    }

    // Get recent marketplace views
    const recentViews = await prisma.itemSellPostView.findMany({
      take: 4,
      orderBy: { visitedAt: 'desc' },
      select: {
        id: true,
        visitedAt: true,
        sellPostId: true,
        userId: true,
      },
    })

    // Get post names for the views
    const postIds = [...new Set(recentViews.map(v => v.sellPostId))]
    const posts = await prisma.itemSellPost.findMany({
      where: { id: { in: postIds } },
      select: { id: true, title: true },
    })

    for (const view of recentViews) {
      const post = posts.find(p => p.id === view.sellPostId)
      if (!post) continue

      activities.push({
        id: `view-${view.id}`,
        type: 'view',
        action: 'Marketplace Viewed',
        description: `"${post.title}" was viewed`,
        createdAt: view.visitedAt,
        user: null,
      })
    }

    // Sort by date and limit
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}
