import {
  Bookmark,
  Settings,
  LayoutDashboard,
  User,
  MessageSquare,
  ShoppingBag,
  Plus,
  PenTool,
  Bell,
  Palette,
  Monitor,
  CreditCard,
  Home,
  ShieldCheck,
  BarChart3,
  Inbox,
  FileText,
  Hash,
  List,
  Trophy,
  Crown,
  HelpCircle,
  Info,
  Mail,
  FileCheck,
  Lock,
  Users,
  LogIn,
  UserPlus,
  Megaphone,
  Link2,
  Ticket,
  Sparkles,
  Target,
  Files,
  CheckCircle,
  Layers,
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
    icon: Crown,
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
  settingsConnectedAccounts: {
    label: 'Connected Accounts',
    href: '/dashboard/settings/connected-accounts',
    icon: Link2,
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
    icon: Crown,
    access: RoleAccess.AUTHENTICATED,
  },
  settingsDisplay: {
    label: 'Display',
    href: '/dashboard/settings/display',
    icon: Monitor,
    access: RoleAccess.AUTHENTICATED,
  },

  // Marketplace
  marketplace: {
    label: 'Items Marketplace',
    href: '/dashboard/marketplace',
    icon: ShoppingBag,
    access: RoleAccess.AUTHENTICATED,
  },

  // Messages
  messages: {
    label: 'Messages',
    href: '/dashboard/marketplace/messages',
    icon: MessageSquare,
    access: RoleAccess.AUTHENTICATED,
  },

  // Activity
  dashboardActivity: {
    label: 'Activity',
    href: '/dashboard/settings/activity',
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
    href: '/about-2',
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

  // Marketplace Routes
  marketplacePosts: {
    label: 'My Posts',
    href: '/dashboard/marketplace/posts',
    icon: ShoppingBag,
    access: RoleAccess.AUTHENTICATED,
  },
  marketplaceConversations: {
    label: 'Conversations',
    href: '/dashboard/marketplace/conversations',
    icon: MessageSquare,
    access: RoleAccess.AUTHENTICATED,
  },
  marketplaceAnalytics: {
    label: 'Analytics',
    href: '/dashboard/marketplace/analytics',
    icon: BarChart3,
    access: RoleAccess.AUTHENTICATED,
  },

  // Marketplace (public URLs)
  offersSent: {
    label: 'My Offers',
    href: '/offers/sent',
    icon: List,
    access: RoleAccess.AUTHENTICATED,
  },
  offersReceived: {
    label: 'Received Offers',
    href: '/offers/received',
    icon: Inbox,
    access: RoleAccess.AUTHENTICATED,
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

  // Marketplace Management
  marketplaceMyPosts: {
    label: 'My Listings',
    href: '/marketplace/my-posts',
    icon: ShoppingBag,
    access: RoleAccess.AUTHENTICATED,
  },
  dashboardMarketplace: {
    label: 'Marketplace Overview',
    href: '/dashboard/marketplace',
    icon: LayoutDashboard,
    access: RoleAccess.AUTHENTICATED,
  },
  dashboardMarketplaceReviews: {
    label: 'Reviews',
    href: '/dashboard/marketplace/reviews',
    icon: Trophy,
    access: RoleAccess.AUTHENTICATED,
  },

  // Achievements
  achievements: {
    label: 'Achievements',
    href: '/achievements',
    icon: Trophy,
    access: RoleAccess.AUTHENTICATED,
  },

  // Gamified Campaigns Routes
  gamifiedCampaigns: {
    label: 'Campaigns',
    href: '/dashboard/campaigns/gamified',
    icon: Target,
    access: RoleAccess.AUTHENTICATED,
  },
  myProgress: {
    label: 'My Progress',
    href: '/dashboard/campaigns/my-progress',
    icon: BarChart3,
    access: RoleAccess.AUTHENTICATED,
  },
  teams: {
    label: 'Teams',
    href: '/dashboard/campaigns/teams',
    icon: Users,
    access: RoleAccess.AUTHENTICATED,
  },
  leaderboard: {
    label: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: Trophy,
    access: RoleAccess.AUTHENTICATED,
  },

  // Public Campaign Routes
  publicCampaigns: {
    label: 'Campaigns',
    href: '/campaigns',
    icon: Target,
    access: RoleAccess.ALL,
  },
  publicLeaderboard: {
    label: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    access: RoleAccess.ALL,
  },

  // Admin Campaign Routes
  adminProofVerification: {
    label: 'Proof Verification',
    href: '/dashboard/admin/proof-verification',
    icon: CheckCircle,
    access: RoleAccess.ADMIN_ONLY,
  },
  adminCampaignTemplates: {
    label: 'Campaign Templates',
    href: '/dashboard/admin/campaign-templates',
    icon: Files,
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
