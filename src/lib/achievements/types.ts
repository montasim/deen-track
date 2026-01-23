/**
 * Achievement Types
 */

import type { Achievement, AchievementCategory, AchievementTier, UserAchievement } from '@prisma/client'

export type AchievementWithProgress = Achievement & {
  userProgress?: number
  userUnlocked?: boolean
  unlockedAt?: Date
}

export type UserStats = {
  // Contribution stats
  blogPostsCreated: number
  commentsPosted: number

  // Marketplace stats
  sellPostsCreated: number
  offersMade: number
  reviewsLeft: number

  // Social stats
  conversationsStarted: number

  // Engagement stats
  loginCount: number
  loginStreak: number
  profileCompleteness: number
}

export type AchievementCheckResult = {
  unlocked: string[]  // Achievement codes that were unlocked
  progress: Record<string, number>  // Achievement codes and their new progress
}
