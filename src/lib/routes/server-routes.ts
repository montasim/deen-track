/**
 * Server API Routes Configuration
 *
 * Defines all API routes and their access requirements.
 * Used by proxy.ts for API route protection and access validation.
 */

import { AccessConfig, RoleAccess } from '@/lib/auth/roles'

/**
 * Server API Route configuration
 */
export interface ServerRoute extends AccessConfig {
  /** Route path (supports wildcards) */
  path: string
  /** HTTP methods allowed (empty array = all methods) */
  methods?: string[]
  /** Description of the route */
  description?: string
}

/**
 * API Routes configuration
 * Pattern matching: '*' matches any characters, '**' matches any path segment
 */
export const API_ROUTES: Record<string, ServerRoute> = {
  // ============================================================================
  // AUTH ROUTES (PUBLIC)
  // ============================================================================
  authCheckEmail: {
    path: '/api/auth/check-email',
    methods: ['POST'],
    description: 'Check if email exists',
    access: RoleAccess.ALL,
  },
  authSendOtp: {
    path: '/api/auth/send-otp',
    methods: ['POST'],
    description: 'Send OTP code',
    access: RoleAccess.ALL,
  },
  authVerifyOtp: {
    path: '/api/auth/verify-otp',
    methods: ['POST'],
    description: 'Verify OTP code',
    access: RoleAccess.ALL,
  },
  authCreateAccount: {
    path: '/api/auth/create-account',
    methods: ['POST'],
    description: 'Create new account',
    access: RoleAccess.ALL,
  },
  authRefreshSession: {
    path: '/api/auth/refresh-session',
    methods: ['POST'],
    description: 'Refresh auth session',
    access: RoleAccess.ALL,
  },

  // ============================================================================
  // AUTHENTICATED USER ROUTES
  // ============================================================================
  userSession: {
    path: '/api/user/session',
    methods: ['GET'],
    description: 'Get current user session',
    access: RoleAccess.AUTHENTICATED,
  },
  userUpdateProfile: {
    path: '/api/user/profile',
    methods: ['PATCH', 'PUT'],
    description: 'Update user profile',
    access: RoleAccess.AUTHENTICATED,
  },
  userChangePassword: {
    path: '/api/user/change-password',
    methods: ['POST'],
    description: 'Change user password',
    access: RoleAccess.AUTHENTICATED,
  },
  userDeleteAccount: {
    path: '/api/user/account',
    methods: ['DELETE'],
    description: 'Delete user account',
    access: RoleAccess.AUTHENTICATED,
  },

  // ============================================================================
  // ADMIN ROUTES
  // ============================================================================
  // User Management
  adminUsers: {
    path: '/api/admin/users',
    methods: ['GET'],
    description: 'Get all users',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminUserById: {
    path: '/api/admin/users/*',
    methods: ['GET', 'PATCH', 'DELETE'],
    description: 'Get, update, or delete user by ID',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminInviteUser: {
    path: '/api/admin/invite',
    methods: ['POST'],
    description: 'Invite new user',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminInvites: {
    path: '/api/admin/invites',
    methods: ['GET'],
    description: 'Get all invites',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Support Tickets
  adminSupportTickets: {
    path: '/api/admin/support-tickets',
    methods: ['GET'],
    description: 'Get all support tickets',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminSupportTicketById: {
    path: '/api/admin/support-tickets/*',
    methods: ['GET', 'PATCH'],
    description: 'Get or update support ticket',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Contact Submissions
  adminContactSubmissions: {
    path: '/api/admin/contact',
    methods: ['GET'],
    description: 'Get contact submissions',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Notices
  adminNotices: {
    path: '/api/admin/notices',
    methods: ['GET', 'POST'],
    description: 'Get or create notices',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminNoticeById: {
    path: '/api/admin/notices/*',
    methods: ['GET', 'PATCH', 'DELETE'],
    description: 'Get, update, or delete notice by ID',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Campaigns
  adminCampaigns: {
    path: '/api/admin/campaigns',
    methods: ['GET', 'POST'],
    description: 'Get or create email campaigns',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminCampaignById: {
    path: '/api/admin/campaigns/*',
    methods: ['GET', 'PATCH', 'DELETE'],
    description: 'Get, update, or delete campaign by ID',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Site Settings
  adminSiteSettings: {
    path: '/api/admin/site-settings',
    methods: ['GET', 'PATCH'],
    description: 'Get or update site settings',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Legal Content
  adminLegal: {
    path: '/api/admin/legal',
    methods: ['GET', 'PATCH'],
    description: 'Get or update legal content',
    access: RoleAccess.ADMIN_ONLY,
  },

  // Analytics
  adminAnalytics: {
    path: '/api/admin/analytics',
    methods: ['GET'],
    description: 'Get analytics data',
    access: RoleAccess.ADMIN_ONLY,
  },
  adminBooksCostAnalytics: {
    path: '/api/admin/analytics/books-cost',
    methods: ['GET'],
    description: 'Get books cost analytics',
    access: RoleAccess.ADMIN_ONLY,
  },

  // ============================================================================
  // SUPER ADMIN ROUTES
  // ============================================================================
  superAdminSettings: {
    path: '/api/super-admin/settings',
    methods: ['GET', 'PATCH'],
    description: 'Get or update system settings',
    access: RoleAccess.SUPER_ADMIN_ONLY,
  },
  superAdminLogs: {
    path: '/api/super-admin/logs',
    methods: ['GET'],
    description: 'Get system logs',
    access: RoleAccess.SUPER_ADMIN_ONLY,
  },
}

/**
 * Get all API routes as an array
 */
export function getAllApiRoutes(): ServerRoute[] {
  return Object.values(API_ROUTES)
}

/**
 * Find API route by path pattern
 * Supports wildcard matching with '*'
 */
export function findApiRoute(path: string, method: string = 'GET'): ServerRoute | null {
  // First try exact match
  for (const route of Object.values(API_ROUTES)) {
    if (matchRoutePattern(route.path, path)) {
      // Check if method is allowed (if methods are specified)
      if (route.methods && route.methods.length > 0) {
        if (!route.methods.includes(method)) {
          continue // Method not allowed for this route
        }
      }
      return route
    }
  }

  return null
}

/**
 * Match route pattern with wildcard support
 * '*' matches any characters except '/'
 * '**' matches any characters including '/'
 */
function matchRoutePattern(pattern: string, path: string): boolean {
  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
    .replace(/\\\*\\\*/g, '.*') // Replace ** with .*
    .replace(/\\\*/g, '[^/]*') // Replace * with [^/]*

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * Check if user has access to API route
 */
export function checkApiRouteAccess(
  path: string,
  userRole: string | null,
  method: string = 'GET'
): { allowed: boolean; route?: ServerRoute } {
  const route = findApiRoute(path, method)

  // If no route found, allow by default (or you could deny by default)
  if (!route) {
    return { allowed: true }
  }

  // Check if user role is in the allowed access list
  const normalizedRole = userRole || 'PUBLIC'
  const allowed = route.access.includes(normalizedRole as any)

  return { allowed, route }
}
