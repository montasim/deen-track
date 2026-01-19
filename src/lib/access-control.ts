/**
 * Access Control Utilities
 *
 * Centralized access control logic for premium content
 * Handles authorization checks for different user types and content
 */

import { getSession, isAuthenticated } from '@/lib/auth/session'
import { AuthenticationError, SessionExpiredError } from '@/lib/auth/types'
import { publicConfig } from '@/config'

// ============================================================================
// CONTENT ACCESS CONTROL
// ============================================================================

export interface ContentAccessInfo {
    canAccess: boolean
    canRead: boolean
    requiresPremium: boolean
    reason?: string
    canDownload?: boolean
}

/**
 * Check if user can access premium content
 *
 * @param {Object} content - Content information
 * @param {string} content.id - Content ID
 * @param {boolean} content.isPublic - Whether content is public
 * @param {boolean} content.requiresPremium - Whether content requires premium
 * @param {string} [userId] - Optional user ID (checks if provided)
 * @returns {Promise<ContentAccessInfo>} Access information
 */
export async function checkContentAccess(
    content: {
        id: string
        isPublic: boolean
        requiresPremium: boolean
    },
    userId?: string
): Promise<ContentAccessInfo> {
    // Check if content is public
    if (!content.isPublic) {
        return {
            canAccess: false,
            canRead: false,
            requiresPremium: false,
            reason: 'This content is not publicly available'
        }
    }

    // Get user session or use provided userId
    let userSession = null
    let userHasPremium = false

    if (userId) {
        // Check premium status for specific user
        const { isUserPremium } = await import('@/lib/user/repositories/user.repository')

        userHasPremium = await isUserPremium(userId)
    } else {
        // Check current user session
        try {
            userSession = await getSession()
            userHasPremium = userSession?.isPremium || false
        } catch (error) {
            // User not authenticated
        }
    }

    // Check premium access
    if (content.requiresPremium && !userHasPremium) {
        return {
            canAccess: false,
            canRead: false,
            requiresPremium: true,
            reason: 'This content requires a premium subscription'
        }
    }

    // Determine if user can download the content
    const canDownload = userHasPremium

    return {
        canAccess: true,
        canRead: true,
        requiresPremium: content.requiresPremium,
        canDownload
    }
}

/**
 * Require content access (throws if access denied)
 *
 * @param {Object} content - Content information
 * @throws {PremiumRequiredError} If premium access required
 * @throws {UserSessionExpiredError} If authentication required
 */
export async function requireContentAccess(
    content: {
        id: string
        isPublic: boolean
        requiresPremium: boolean
    }
): Promise<void> {
    const access = await checkContentAccess(content)

    if (!access.canAccess) {
        if (access.requiresPremium) {
            throw new AuthenticationError(access.reason || 'Premium access required', 'PREMIUM_REQUIRED', 403)
        } else {
            throw new Error(access.reason || 'Access denied')
        }
    }
}

/**
 * Require premium access (throws if not premium)
 *
 * @throws {PremiumRequiredError} If user doesn't have premium access
 */
export async function requirePremium(): Promise<void> {
    const userSession = await getSession()

    if (!userSession) {
        throw new SessionExpiredError('Authentication required')
    }

    const userHasPremium = userSession?.isPremium || false

    if (!userHasPremium) {
        throw new AuthenticationError('Premium subscription required to access this content', 'PREMIUM_REQUIRED', 403)
    }
}

// ============================================================================
// FEATURE ACCESS CONTROL
// ============================================================================

export interface FeatureAccessInfo {
    canCreateContent: boolean
    canShareContent: boolean
    canTrackProgress: boolean
    canAccessPremiumContent: boolean
    canDownloadContent: boolean
    canUnlimitedAccess: boolean
}

/**
 * Get user's feature access based on subscription level
 *
 * @returns {Promise<FeatureAccessInfo>} Feature access information
 */
export async function getFeatureAccess(): Promise<FeatureAccessInfo> {
    const userSession = await getSession()
    const userHasPremium = userSession ? (userSession.isPremium || false) : false

    return {
        canCreateContent: !!userSession, // All authenticated users
        canShareContent: !!userSession, // All authenticated users
        canTrackProgress: !!userSession, // All authenticated users
        canAccessPremiumContent: userHasPremium,
        canDownloadContent: userHasPremium, // Premium users can download
        canUnlimitedAccess: userHasPremium, // Premium users have unlimited access
    }
}

/**
 * Check if user can perform a specific action
 *
 * @param {string} action - Action to check
 * @returns {Promise<boolean>} Whether user can perform the action
 */
export async function canPerformAction(action: keyof FeatureAccessInfo): Promise<boolean> {
    const features = await getFeatureAccess()
    return features[action]
}

// ============================================================================
// ROUTE PROTECTION UTILITIES
// ============================================================================

/**
 * Middleware function to protect routes that require authentication
 */
export async function requireAuthentication() {
    const userSession = await getSession()

    if (!userSession) {
        throw new SessionExpiredError('Authentication required')
    }

    return userSession
}

/**
 * Middleware function to protect routes that require premium access
 */
export async function requirePremiumAccess() {
    await requireAuthentication()
    await requirePremium()
}

/**
 * Check if user has sufficient access level for a route
 *
 * @param {'public' | 'authenticated' | 'premium'} requiredLevel - Required access level
 * @returns {Promise<boolean>} Whether user has sufficient access
 */
export async function hasSufficientAccess(
    requiredLevel: 'public' | 'authenticated' | 'premium'
): Promise<boolean> {
    switch (requiredLevel) {
        case 'public':
            return true // Everyone can access public routes
        case 'authenticated':
            return !!(await getSession()) // Must be authenticated
        case 'premium':
            const userSession = await getSession()
            return !!userSession && (userSession.isPremium || false) // Must be authenticated and have premium
        default:
            return false
    }
}

// ============================================================================
// ACCESS-RESTRICTED URLs
// ============================================================================

/**
 * Get access-restricted content URL
 *
 * @param {string} contentId - Content ID
 * @param {string} baseUrl - Base URL for the application
 * @returns {string} URL for access-restricted page
 */
export function getAccessRestrictedUrl(
    contentId: string,
    baseUrl: string = publicConfig.appUrl || 'http://localhost:3000'
): string {
    return `${baseUrl}/content/${contentId}?access=denied`
}

/**
 * Get subscription upgrade URL
 *
 * @param {string} baseUrl - Base URL for the application
 * @returns {string} URL for subscription page
 */
export function getSubscriptionUrl(
    baseUrl: string = publicConfig.appUrl || 'http://localhost:3000'
): string {
    return `${baseUrl}/subscription`
}
