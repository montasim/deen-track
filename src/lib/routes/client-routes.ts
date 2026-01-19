import {
  Brain,
  Settings,
  LayoutDashboard,
  User,
  MessageSquare,
  PenTool,
  Bell,
  Palette,
  Monitor,
  CreditCard,
  FolderTree,
  Home,
  ShieldCheck,
  BarChart3,
  Inbox,
  FileText,
  Trophy,
  HelpCircle,
  Info,
  Mail,
  FileCheck,
  Lock,
  Users,
  LogIn,
  UserPlus,
  Megaphone,
  Sparkles,
  ChevronRight,
  Ticket,
} from 'lucide-react'
import { AccessConfig, AccessLevel, RoleAccess } from '@/lib/auth/roles'

export interface AppRoute extends AccessConfig {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Global app routes configuration
 * Define all routes here with their labels, paths, and icons
 * Use the route name to reference it in components
 */
export const ROUTES = {
  // Public Routes
  home: {
    label: 'Home',
    href: '/',
    icon: Home,
    access: RoleAccess.ALL,
  },

  // Premium
  premium: {
    label: 'Premium',
    href: '/premium',
    icon: Trophy,
    access: RoleAccess.ALL,
  },

  // Dashboard
  dashboard: {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    access: RoleAccess.AUTHENTICATED,
  },

  // Settings
  settings: {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    access: RoleAccess.AUTHENTICATED,
  },

  // User Settings Sub-routes
  settingsAccount: {
    label: 'Account',
    href: '/dashboard/settings/account',
    icon: User,
    access: RoleAccess.AUTHENTICATED,
  },
  settingsAppearance: {
    label: 'Appearance',
    href: '/dashboard/settings/appearance',
    icon: Palette,
    access: RoleAccess.AUTHENTICATED,
  },
  settingsBilling: {
    label: 'Billing',
    href: '/dashboard/settings/billing',
    icon: CreditCard,
    access: RoleAccess.AUTHENTICATED,
  },
  settingsNotifications: {
    label: 'Notifications',
    href: '/dashboard/settings/notifications',
    icon: Bell,
    access: RoleAccess.AUTHENTICATED,
  },
  settingsSubscription: {
    label: 'Subscription',
    href: '/dashboard/settings/subscription',
    icon: Trophy,
    access: RoleAccess.AUTHENTICATED,
  },
  settingsDisplay: {
    label: 'Display',
    href: '/dashboard/settings/display',
    icon: Monitor,
    access: RoleAccess.AUTHENTICATED,
  },

  // Activity
  dashboardActivity: {
    label: 'Activity',
    href: '/dashboard/activity',
    icon: BarChart3,
    access: RoleAccess.AUTHENTICATED,
  },

  // Support Routes
  helpCenter: {
    label: 'Help Center',
    href: '/help-center',
    icon: HelpCircle,
    access: RoleAccess.ALL,
  },
  about: {
    label: 'About Us',
    href: '/about',
    icon: Info,
    access: RoleAccess.ALL,
  },
  contact: {
    label: 'Contact',
    href: '/contact',
    icon: Mail,
    access: RoleAccess.ALL,
  },

  // Legal Routes
  terms: {
    label: 'Terms of Service',
    href: '/terms',
    icon: FileCheck,
    access: RoleAccess.ALL,
  },
  privacy: {
    label: 'Privacy Policy',
    href: '/privacy',
    icon: Lock,
    access: RoleAccess.ALL,
  },

  // Notices
  notices: {
    label: 'Notices',
    href: '/notices',
    icon: Megaphone,
    access: RoleAccess.ALL,
  },

  // Auth Routes
  signIn: {
    label: 'Sign In',
    href: '/auth/sign-in',
    icon: LogIn,
    access: RoleAccess.ALL,
  },
  signUp: {
    label: 'Sign Up',
    href: '/auth/sign-up',
    icon: UserPlus,
    access: RoleAccess.ALL,
  },
  login: {
    label: 'Login',
    href: '/login',
    icon: LogIn,
    access: RoleAccess.ALL,
  },
  signUpSimple: {
    label: 'Sign Up',
    href: '/sign-up',
    icon: UserPlus,
    access: RoleAccess.ALL,
  },
  otp: {
    label: 'OTP',
    href: '/otp',
    icon: Lock,
    access: RoleAccess.ALL,
  },
  forgotPassword: {
    label: 'Forgot Password',
    href: '/forgot-password',
    icon: HelpCircle,
    access: RoleAccess.ALL,
  },

  // Site Settings
  siteSettings: {
    label: 'Site Settings',
    href: '/dashboard/site-settings',
    icon: Settings,
    access: RoleAccess.ADMIN_ONLY,
  },

  // Subscription
  signup: {
    label: 'Sign Up',
    href: '/signup',
    icon: UserPlus,
    access: RoleAccess.ALL,
  },
  pricing: {
    label: 'Pricing',
    href: '/pricing',
    icon: Trophy,
    access: RoleAccess.ALL,
  },

  // Dashboard Routes
  dashboardUsers: {
    label: 'Users',
    href: '/dashboard/users',
    icon: Users,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardCampaigns: {
    label: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Mail,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardNotices: {
    label: 'Notices',
    href: '/dashboard/notices',
    icon: Bell,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardActivities: {
    label: 'Activity Logs',
    href: '/dashboard/activities',
    icon: BarChart3,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardSupportTickets: {
    label: 'Support Tickets',
    href: '/dashboard/support-tickets',
    icon: MessageSquare,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardHelpCenterFaqs: {
    label: 'Help Center FAQs',
    href: '/dashboard/help-center/faqs',
    icon: HelpCircle,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardAdminContactSubmissions: {
    label: 'Contact Submissions',
    href: '/dashboard/admin/contact-submissions',
    icon: Mail,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardLegal: {
    label: 'Legal Content',
    href: '/dashboard/legal',
    icon: FileText,
    access: RoleAccess.ADMIN_ONLY,
  },
  dashboardAdminContent: {
    label: 'Pricing Page Content',
    href: '/dashboard/admin/content',
    icon: Sparkles,
    access: RoleAccess.ADMIN_ONLY,
  },

  // Blog Routes
  blog: {
    label: 'Blog',
    href: '/blog',
    icon: FileText,
    access: RoleAccess.ALL,
  },
  dashboardBlog: {
    label: 'Blog Posts',
    href: '/dashboard/blog',
    icon: FileText,
    access: RoleAccess.AUTHENTICATED,
  },
  dashboardBlogComments: {
    label: 'Blog Comments',
    href: '/dashboard/blog/comments',
    icon: MessageSquare,
    access: RoleAccess.ADMIN_ONLY,
  },
} as const

export type RouteKey = keyof typeof ROUTES

/**
 * Helper to get route by key
 */
export function getRoute(key: RouteKey): AppRoute {
  return ROUTES[key]
}

/**
 * Helper to get multiple routes by keys
 */
export function getRoutes(keys: RouteKey[]): AppRoute[] {
  return keys.map(key => ROUTES[key])
}
