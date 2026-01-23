/**
 * Achievement Service
 *
 * Handles checking and unlocking achievements based on user activity
 */

import { prisma } from '@/lib/prisma'
import { ACHIEVEMENTS, getAchievementByCode } from './definitions'
import type { AchievementCheckResult, UserStats } from './types'
import { sendAchievementUnlockedNotificationEmail } from '@/lib/auth/email'

/**
 * Seed achievements into database
 */
export async function seedAchievements() {
  const session = await requireAuth()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const created = []
  for (const achievement of ACHIEVEMENTS) {
    const existing = await prisma.achievement.findUnique({
      where: { code: achievement.code }
    })

    if (!existing) {
      const record = await prisma.achievement.create({
        data: {
          code: achievement.code,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          tier: achievement.tier,
          xp: achievement.xp,
          requirements: achievement.requirements as any,
          entryById: session.userId,
        }
      })
      created.push(record)
    }
  }

  return created
}

/**
 * Calculate user stats for achievement checking
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const [
    blogPostsCount,
    blogCommentsCount,
    marketplaceStats,
    conversationStats,
    user,
  ] = await Promise.all([
    // Blog posts created
    prisma.blogPost.count({
      where: { authorId: userId }
    }),

    // Blog comments posted
    prisma.blogComment.count({
      where: { authorId: userId }
    }),

    // Marketplace stats
    Promise.all([
      prisma.itemSellPost.count({ where: { sellerId: userId } }),
      prisma.itemOffer.count({ where: { buyerId: userId } }),
      prisma.sellerReview.count({ where: { reviewerId: userId } }),
    ]),

    // Conversation stats
    prisma.conversation.count({
      where: {
        OR: [
          { sellerId: userId },
          { buyerId: userId }
        ]
      }
    }),

    // User for profile completeness
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        createdAt: true,
      }
    }),
  ])

  const [sellPostsCount, offersCount, reviewsCount] = marketplaceStats as [number, number, number]

  // Profile completeness
  let profileCompleteness = 0
  if (user) {
    if (user.name && user.name !== '') profileCompleteness += 25
    if (user.firstName && user.firstName !== '') profileCompleteness += 25
    if (user.bio && user.bio !== '') profileCompleteness += 25
    if (user.avatar && user.avatar !== '') profileCompleteness += 25
  }

  return {
    blogPostsCreated: blogPostsCount,
    commentsPosted: blogCommentsCount,
    sellPostsCreated: sellPostsCount,
    offersMade: offersCount,
    reviewsLeft: reviewsCount,
    conversationsStarted: conversationStats,
    loginCount: 0, // TODO: Track logins
    loginStreak: 0, // TODO: Track login streaks
    profileCompleteness,
  }
}

/**
 * Check and unlock achievements based on user stats
 */
export async function checkAndUnlockAchievements(
  userId: string
): Promise<AchievementCheckResult> {
  const stats = await getUserStats(userId)
  const unlocked: string[] = []
  const progress: Record<string, number> = {}

  // Get all achievements that aren't unlocked yet
  const unlockedAchievementIds = await prisma.userAchievement
    .findMany({
      where: { userId },
      select: { achievementId: true }
    })
    .then(uas => uas.map(ua => ua.achievementId))

  const achievements = await prisma.achievement.findMany({
    where: {
      id: { notIn: unlockedAchievementIds },
      isVisible: true
    }
  })

  for (const achievement of achievements) {
    const req = achievement.requirements as any
    const definition = getAchievementByCode(achievement.code)

    if (!definition) continue

    let currentValue = 0
    let targetValue = req.count || 1
    let shouldUnlock = false

    // Calculate current value based on requirement type
    switch (req.type) {
      case 'BLOG_POSTS_CREATED':
        currentValue = stats.blogPostsCreated
        break
      case 'COMMENTS_POSTED':
        currentValue = stats.commentsPosted
        break
      case 'SELL_POSTS_CREATED':
        currentValue = stats.sellPostsCreated
        break
      case 'OFFERS_MADE':
        currentValue = stats.offersMade
        break
      case 'REVIEWS_LEFT':
        currentValue = stats.reviewsLeft
        break
      case 'CONVERSATIONS_STARTED':
        currentValue = stats.conversationsStarted
        break
      case 'LOGINS':
        currentValue = stats.loginCount
        break
      case 'LOGIN_STREAK':
        currentValue = stats.loginStreak
        break
      case 'PROFILE_COMPLETENESS':
        currentValue = stats.profileCompleteness
        break
      case 'EARLY_ADOPTER':
        // Special check: joined before a certain date
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { createdAt: true }
        })
        if (user && user.createdAt < new Date('2025-02-01')) {
          currentValue = 1
        }
        break
      case 'ALL_CATEGORIES':
        // Special check: Achievement for completing all categories
        // This would be custom based on your needs
        currentValue = 0 // TODO: Implement if needed
        break
      default:
        continue
    }

    // Check if achievement should unlock
    if (req.comparison === 'eq') {
      shouldUnlock = currentValue === targetValue
    } else if (req.comparison === 'gte') {
      shouldUnlock = currentValue >= targetValue
    } else if (req.comparison === 'gt') {
      shouldUnlock = currentValue > targetValue
    } else if (req.comparison === 'lte') {
      shouldUnlock = currentValue <= targetValue
    }

    if (shouldUnlock) {
      // Unlock the achievement
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          progress: targetValue,
          maxProgress: targetValue
        }
      })

      // Update unlock count
      await prisma.achievement.update({
        where: { id: achievement.id },
        data: { unlockCount: { increment: 1 } }
      })

      unlocked.push(achievement.code)

      // Send achievement unlocked email notification (non-blocking)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      })

      if (user) {
        sendAchievementUnlockedNotificationEmail(
          user.email,
          achievement.name,
          achievement.description,
          achievement.icon || undefined
        ).catch(console.error)
      }
    } else {
      // Update progress
      progress[achievement.code] = currentValue
    }
  }

  return { unlocked, progress }
}

/**
 * Get user achievements with progress
 */
export async function getUserAchievements(userId: string) {
  const achievements = await prisma.achievement.findMany({
    where: { isVisible: true },
    include: {
      userAchievements: {
        where: { userId }
      }
    },
    orderBy: [
      { category: 'asc' },
      { tier: 'asc' },
      { xp: 'desc' }
    ]
  })

  return achievements.map(a => {
    const userAchievement = a.userAchievements[0]
    return {
      ...a,
      userProgress: userAchievement?.progress || 0,
      userUnlocked: !!userAchievement,
      unlockedAt: userAchievement?.unlockedAt
    }
  })
}

import { requireAuth } from '@/lib/auth/session'
