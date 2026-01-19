'use client'

import type { LucideIcon, Icon } from 'lucide-react'
import {
  Home,
  Users,
  Settings,
  PenTool,
  MessageSquare,
  Bell,
  Palette,
  Monitor,
  User,
  CreditCard,
  LayoutDashboard,
  FileText,
  Trophy,
  BarChart3,
  FolderOpen,
  ShieldCheck,
  HelpCircle,
  Mail,
} from 'lucide-react'

export interface BreadcrumbRoute {
  path: string
  name: string
  icon?: LucideIcon
  hidden?: boolean
  parent?: string
}

export const breadcrumbRoutes: BreadcrumbRoute[] = [
  // Public Routes
  {
    path: '/',
    name: 'Home',
    icon: Home,
  },

  // Premium
  {
    path: '/premium',
    name: 'Premium',
    icon: Trophy,
    parent: '/',
  },

  // Dashboard Routes
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    hidden: true,
  },
  {
    path: '/dashboard/users',
    name: 'Users',
    icon: Users,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/users/[id]',
    name: 'User Details',
    icon: User,
    parent: '/dashboard/users',
  },
  {
    path: '/dashboard/notices',
    name: 'Notices',
    icon: Bell,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/site-settings',
    name: 'Site Settings',
    icon: ShieldCheck,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/support-tickets',
    name: 'Support Tickets',
    icon: MessageSquare,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/campaigns',
    name: 'Campaigns',
    icon: Mail,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/help-center/faqs',
    name: 'Help Center FAQs',
    icon: HelpCircle,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/legal',
    name: 'Legal Content',
    icon: FileText,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/admin/content',
    name: 'Pricing Content',
    icon: FileText,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/blog',
    name: 'Blog Posts',
    icon: FileText,
    parent: '/dashboard',
  },
  {
    path: '/dashboard/blog/comments',
    name: 'Blog Comments',
    icon: MessageSquare,
    parent: '/dashboard/blog',
  },

  // Settings Routes
  {
    path: '/settings',
    name: 'Settings',
    icon: Settings,
    parent: '/',
  },
  {
    path: '/settings/profile',
    name: 'Profile',
    icon: User,
    parent: '/settings',
  },
  {
    path: '/settings/account',
    name: 'Account',
    icon: CreditCard,
    parent: '/settings',
  },
  {
    path: '/settings/appearance',
    name: 'Appearance',
    icon: Palette,
    parent: '/settings',
  },
  {
    path: '/settings/notifications',
    name: 'Notifications',
    icon: Bell,
    parent: '/settings',
  },
  {
    path: '/settings/display',
    name: 'Display',
    icon: Monitor,
    parent: '/settings',
  },

  // Blog Routes
  {
    path: '/blog',
    name: 'Blog',
    icon: FileText,
    parent: '/',
  },
  {
    path: '/blog/[slug]',
    name: 'Blog Post',
    icon: FileText,
    parent: '/blog',
  },

  // Support Routes
  {
    path: '/help-center',
    name: 'Help Center',
    icon: HelpCircle,
    parent: '/',
  },
  {
    path: '/about',
    name: 'About Us',
    icon: FileText,
    parent: '/',
  },
  {
    path: '/contact',
    name: 'Contact',
    icon: Mail,
    parent: '/',
  },
  {
    path: '/pricing',
    name: 'Pricing',
    icon: Trophy,
    parent: '/',
  },

  // Auth Routes (hidden from breadcrumbs)
  {
    path: '/auth/sign-in',
    name: 'Sign In',
    hidden: true,
  },
  {
    path: '/auth/sign-up',
    name: 'Sign Up',
    hidden: true,
  },
  {
    path: '/auth/forgot-password',
    name: 'Forgot Password',
    hidden: true,
  },
  {
    path: '/auth/otp',
    name: 'OTP',
    hidden: true,
  },
]

/**
 * Convert a dynamic route path to match a specific URL
 * e.g., "/blog/[slug]" -> "/blog/my-post"
 */
export function matchDynamicRoute(routePath: string, url: string): boolean {
  const routeSegments = routePath.split('/')
  const urlSegments = url.split('/')

  if (routeSegments.length !== urlSegments.length) {
    return false
  }

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i]
    const urlSegment = urlSegments[i]

    // If route segment is a dynamic parameter (e.g., [id], [slug])
    if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
      continue // Skip, this is a match
    }

    if (routeSegment !== urlSegment) {
      return false
    }
  }

  return true
}

/**
 * Get breadcrumb route for a specific URL
 */
export function getBreadcrumbRoute(url: string): BreadcrumbRoute | undefined {
  return breadcrumbRoutes.find((route) => route.path === url || matchDynamicRoute(route.path, url))
}

/**
 * Get the complete breadcrumb trail for a URL
 */
export function getBreadcrumbTrail(url: string): BreadcrumbRoute[] {
  const trail: BreadcrumbRoute[] = []
  let currentRoute = getBreadcrumbRoute(url)
  let currentUrl = url

  while (currentRoute) {
    if (!currentRoute.hidden) {
      trail.unshift(currentRoute)
    }

    // Find parent route
    if (currentRoute.parent) {
      currentRoute = getBreadcrumbRoute(currentRoute.parent)
      currentUrl = currentRoute?.path || currentUrl
    } else if (currentRoute.path !== '/') {
      // Try to find parent by removing the last segment
      const segments = currentUrl.split('/').filter(Boolean)
      segments.pop()
      const parentUrl = '/' + segments.join('/')
      currentRoute = getBreadcrumbRoute(parentUrl)
      currentUrl = parentUrl
    } else {
      break
    }
  }

  return trail
}

/**
 * Get route name with dynamic parameter values
 * e.g., "Blog Post" with slug "my-post" -> "Blog Post: my-post"
 */
export function getRouteDisplayName(route: BreadcrumbRoute, url: string): string {
  // Extract dynamic parameters from URL
  const routeSegments = route.path.split('/')
  const urlSegments = url.split('/')

  let displayName = route.name

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i]
    if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
      const paramName = routeSegment.slice(1, -1)
      const paramValue = urlSegments[i]

      // Add parameter value to display name
      if (paramValue && (paramName === 'id' || paramName === 'slug')) {
        displayName = `${displayName}: ${paramValue}`
      }
    }
  }

  return displayName
}
