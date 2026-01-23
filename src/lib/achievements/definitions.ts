/**
 * Achievement Definitions
 *
 * All available achievements with their requirements and rewards
 */

import type { AchievementCategory, AchievementTier } from '@prisma/client'

export interface AchievementDefinition {
  code: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  tier: AchievementTier
  xp: number
  requirements: {
    type: string
    count?: number
    field?: string
    comparison?: 'eq' | 'gte' | 'lte' | 'gt'
  }
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ============================================================================
  // CONTRIBUTION ACHIEVEMENTS
  // ============================================================================

  {
    code: 'FIRST_BLOG_POST',
    name: 'First Words',
    description: 'Publish your first blog post',
    icon: '✍️',
    category: 'CONTRIBUTION',
    tier: 'BRONZE',
    xp: 10,
    requirements: { type: 'BLOG_POSTS_CREATED', count: 1, comparison: 'gte' }
  },
  {
    code: 'BLOGGER_5',
    name: 'Prolific Writer',
    description: 'Publish 5 blog posts',
    icon: '✍️',
    category: 'CONTRIBUTION',
    tier: 'SILVER',
    xp: 50,
    requirements: { type: 'BLOG_POSTS_CREATED', count: 5, comparison: 'gte' }
  },
  {
    code: 'BLOGGER_10',
    name: 'Content Creator',
    description: 'Publish 10 blog posts',
    icon: '✍️',
    category: 'CONTRIBUTION',
    tier: 'GOLD',
    xp: 100,
    requirements: { type: 'BLOG_POSTS_CREATED', count: 10, comparison: 'gte' }
  },
  {
    code: 'FIRST_COMMENT',
    name: 'First Voice',
    description: 'Leave your first blog comment',
    icon: '💬',
    category: 'CONTRIBUTION',
    tier: 'BRONZE',
    xp: 5,
    requirements: { type: 'COMMENTS_POSTED', count: 1, comparison: 'gte' }
  },

  // ============================================================================
  // MARKETPLACE ACHIEVEMENTS
  // ============================================================================

  {
    code: 'FIRST_LISTING',
    name: 'First Sale',
    description: 'Create your first marketplace listing',
    icon: '🏪',
    category: 'MARKETPLACE',
    tier: 'BRONZE',
    xp: 15,
    requirements: { type: 'SELL_POSTS_CREATED', count: 1, comparison: 'gte' }
  },
  {
    code: 'SELLER_5',
    name: 'Active Seller',
    description: 'Create 5 marketplace listings',
    icon: '🏪',
    category: 'MARKETPLACE',
    tier: 'BRONZE',
    xp: 30,
    requirements: { type: 'SELL_POSTS_CREATED', count: 5, comparison: 'gte' }
  },
  {
    code: 'SELLER_10',
    name: 'Top Seller',
    description: 'Create 10 marketplace listings',
    icon: '🏪',
    category: 'MARKETPLACE',
    tier: 'SILVER',
    xp: 75,
    requirements: { type: 'SELL_POSTS_CREATED', count: 10, comparison: 'gte' }
  },
  {
    code: 'FIRST_OFFER',
    name: 'First Offer',
    description: 'Make your first offer on a listing',
    icon: '💰',
    category: 'MARKETPLACE',
    tier: 'BRONZE',
    xp: 10,
    requirements: { type: 'OFFERS_MADE', count: 1, comparison: 'gte' }
  },
  {
    code: 'OFFERS_10',
    name: 'Negotiator',
    description: 'Make 10 offers on listings',
    icon: '💰',
    category: 'MARKETPLACE',
    tier: 'BRONZE',
    xp: 30,
    requirements: { type: 'OFFERS_MADE', count: 10, comparison: 'gte' }
  },
  {
    code: 'FIRST_REVIEW',
    name: 'First Review',
    description: 'Leave your first review',
    icon: '⭐',
    category: 'MARKETPLACE',
    tier: 'BRONZE',
    xp: 15,
    requirements: { type: 'REVIEWS_LEFT', count: 1, comparison: 'gte' }
  },
  {
    code: 'REVIEWS_10',
    name: 'Reviewer',
    description: 'Leave 10 reviews',
    icon: '⭐',
    category: 'MARKETPLACE',
    tier: 'SILVER',
    xp: 50,
    requirements: { type: 'REVIEWS_LEFT', count: 10, comparison: 'gte' }
  },

  // ============================================================================
  // SOCIAL ACHIEVEMENTS
  // ============================================================================

  {
    code: 'SOCIAL_BUTTERFLY',
    name: 'Social Butterfly',
    description: 'Have 5 conversations with different users',
    icon: '🦋',
    category: 'SOCIAL',
    tier: 'BRONZE',
    xp: 25,
    requirements: { type: 'CONVERSATIONS_STARTED', count: 5, comparison: 'gte' }
  },
  {
    code: 'CONNECTOR',
    name: 'Connector',
    description: 'Have 20 conversations with different users',
    icon: '🤝',
    category: 'SOCIAL',
    tier: 'SILVER',
    xp: 75,
    requirements: { type: 'CONVERSATIONS_STARTED', count: 20, comparison: 'gte' }
  },
  {
    code: 'HELPFUL',
    name: 'Helpful',
    description: 'Get 10 helpful votes on your support responses',
    icon: '👍',
    category: 'SOCIAL',
    tier: 'BRONZE',
    xp: 30,
    requirements: { type: 'HELPFUL_VOTES', count: 10, comparison: 'gte' }
  },

  // ============================================================================
  // ENGAGEMENT ACHIEVEMENTS
  // ============================================================================

  {
    code: 'FIRST_LOGIN',
    name: 'Welcome Aboard',
    description: 'Log in for the first time',
    icon: '👋',
    category: 'ENGAGEMENT',
    tier: 'BRONZE',
    xp: 5,
    requirements: { type: 'LOGINS', count: 1, comparison: 'gte' }
  },
  {
    code: 'LOGIN_STREAK_7',
    name: 'Week Warrior',
    description: 'Log in for 7 consecutive days',
    icon: '🔥',
    category: 'ENGAGEMENT',
    tier: 'BRONZE',
    xp: 50,
    requirements: { type: 'LOGIN_STREAK', count: 7, comparison: 'gte' }
  },
  {
    code: 'LOGIN_STREAK_30',
    name: 'Monthly Master',
    description: 'Log in for 30 consecutive days',
    icon: '🔥',
    category: 'ENGAGEMENT',
    tier: 'SILVER',
    xp: 150,
    requirements: { type: 'LOGIN_STREAK', count: 30, comparison: 'gte' }
  },
  {
    code: 'LOGIN_STREAK_90',
    name: 'Quarterly Champion',
    description: 'Log in for 90 consecutive days',
    icon: '🔥',
    category: 'ENGAGEMENT',
    tier: 'GOLD',
    xp: 300,
    requirements: { type: 'LOGIN_STREAK', count: 90, comparison: 'gte' }
  },
  {
    code: 'PROFILE_COMPLETE',
    name: 'All About You',
    description: 'Complete your profile (name, bio, avatar)',
    icon: '👤',
    category: 'ENGAGEMENT',
    tier: 'BRONZE',
    xp: 20,
    requirements: { type: 'PROFILE_COMPLETENESS', count: 100, comparison: 'eq' }
  },
  {
    code: 'SUPPORT_TICKET',
    name: 'Feedback Provider',
    description: 'Submit your first support ticket',
    icon: '🎫',
    category: 'ENGAGEMENT',
    tier: 'BRONZE',
    xp: 10,
    requirements: { type: 'SUPPORT_TICKETS_CREATED', count: 1, comparison: 'gte' }
  },

  // ============================================================================
  // SPECIAL ACHIEVEMENTS
  // ============================================================================

  {
    code: 'EARLY_ADOPTER',
    name: 'Pioneer',
    description: 'Joined in the first month of platform launch',
    icon: '🌟',
    category: 'SPECIAL',
    tier: 'LEGENDARY',
    xp: 500,
    requirements: { type: 'EARLY_ADOPTER', count: 1, comparison: 'eq' }
  },
  {
    code: 'COMMUNITY_LEADER',
    name: 'Community Leader',
    description: 'Reach the highest tier in all achievement categories',
    icon: '🏆',
    category: 'SPECIAL',
    tier: 'LEGENDARY',
    xp: 1000,
    requirements: { type: 'ALL_CATEGORIES', count: 1, comparison: 'eq' }
  },
]

/**
 * Get achievement by code
 */
export function getAchievementByCode(code: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find(a => a.code === code)
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): AchievementDefinition[] {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

/**
 * Get achievements by tier
 */
export function getAchievementsByTier(tier: AchievementTier): AchievementDefinition[] {
  return ACHIEVEMENTS.filter(a => a.tier === tier)
}
