'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Code,
  Database,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Megaphone,
  Trophy,
  Ticket,
  Bell,
  Lock,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// Feature categories based on schema analysis
const featureCategories = [
  {
    title: 'Authentication',
    icon: Lock,
    description: 'Enterprise-grade auth system',
    items: ['JWT sessions (access + refresh tokens)', 'OTP-based verification', 'Role-based access (User/Admin/Super Admin)', 'Social OAuth (Google, GitHub)', 'Session management with IP tracking'],
    gradient: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
  },
  {
    title: 'Marketplace',
    icon: TrendingUp,
    description: 'Complete marketplace engine',
    items: ['Item listings with images & pricing', 'Offer negotiation system', 'Real-time messaging (WebSocket)', 'Seller reviews & ratings', 'View analytics & tracking'],
    gradient: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
  },
  {
    title: 'User Management',
    icon: Users,
    description: 'Comprehensive user system',
    items: ['Rich profiles with avatars & bios', 'Custom themes, fonts & languages', 'Notification preferences', 'Premium subscription status', 'Activity tracking'],
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Content & Blog',
    icon: FileText,
    description: 'Full CMS capabilities',
    items: ['Blog posts with categories & tags', 'Rich text editor (Markdown)', 'SEO optimization', 'Nested comments system', 'Scheduled publishing'],
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Campaign System',
    icon: Megaphone,
    description: 'Email campaign automation',
    items: ['One-time & recurring campaigns', 'Role-based targeting', 'Delivery analytics (open/click rates)', 'Unsubscribe tracking', 'Cron-based scheduling'],
    gradient: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Support System',
    icon: Ticket,
    description: 'Complete ticket management',
    items: ['Priority levels (Low to Urgent)', 'Admin assignment workflow', 'Ticket responses with attachments', 'FAQ system with analytics', 'Status tracking'],
    gradient: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
  },
  {
    title: 'Achievements',
    icon: Trophy,
    description: 'Gamification engine',
    items: ['6 achievement tiers (Bronze to Legendary)', 'Category-based system', 'XP rewards', 'Progress tracking', 'Unlock analytics'],
    gradient: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-500/10',
  },
  {
    title: 'Billing',
    icon: CreditCard,
    description: 'Stripe integration',
    items: ['Multiple subscription tiers', 'Monthly/yearly pricing', 'Pricing features management', 'Cancel at period end', 'Subscription management'],
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Real-time alerts',
    items: ['WebSocket-powered delivery', 'Multiple notification types', 'Read/unread tracking', 'Email preferences', 'Mobile push support'],
    gradient: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
  },
  {
    title: 'Audit & Logging',
    icon: Shield,
    description: 'Complete activity tracking',
    items: ['40+ action types', 'Resource-level logging', 'IP & user agent tracking', 'Performance metrics', 'Error tracking'],
    gradient: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-500/10',
  },
]

const techStack = [
  { name: 'Next.js 16', icon: Code, color: 'text-cyan-400' },
  { name: 'TypeScript', icon: Code, color: 'text-blue-400' },
  { name: 'Prisma', icon: Database, color: 'text-violet-400' },
  { name: 'PostgreSQL', icon: Database, color: 'text-indigo-400' },
  { name: 'Stripe', icon: CreditCard, color: 'text-emerald-400' },
  { name: 'Socket.io', icon: Zap, color: 'text-amber-400' },
]

const stats = [
  { value: '40+', label: 'Models' },
  { value: '10+', label: 'Feature Modules' },
  { value: '1,176', label: 'Lines of Schema' },
  { value: '100%', label: 'TypeScript' },
]

export default function LandingPage() {
  const [siteName, setSiteName] = useState('Admin Template')
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    fetch('/api/public/site/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.siteName) {
          setSiteName(data.data.siteName)
        }
      })
      .catch(console.error)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{
            left: '20%',
            top: '20%',
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{
            right: '20%',
            bottom: '20%',
            transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.03}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <LayoutDashboard className="w-5 h-5 text-neutral-900 relative z-10 group-hover:text-white transition-colors" />
              </div>
              <span className="text-lg font-bold tracking-tight">{siteName}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-neutral-400 hover:text-white hover:bg-white/5"
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-white text-neutral-900 hover:bg-neutral-100 font-semibold"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 transition-all duration-1000 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300 tracking-wide">
                  PRODUCTION-READY ADMIN TEMPLATE
                </span>
              </div>

              <h1
                className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight transition-all duration-1000 delay-200 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <span className="block text-white">10+ Modules.</span>
                <span className="block text-white">1,176 Lines</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mt-2">
                  of Schema.
                </span>
              </h1>

              <p
                className={`text-xl text-neutral-400 max-w-lg leading-relaxed transition-all duration-1000 delay-300 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                A complete production-ready admin template with marketplace, authentication, billing, campaigns, support, achievements, and more.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-neutral-900 hover:bg-neutral-100 text-base px-8 py-6 h-auto font-semibold"
                >
                  <Link href="/sign-up" className="gap-2">
                    Start Building
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 text-base px-8 py-6 h-auto"
                >
                  <Link href="/dashboard">Live Demo</Link>
                </Button>
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-4 gap-6 pt-8 border-t border-white/10 transition-all duration-1000 delay-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-xs font-medium text-neutral-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Feature Preview */}
            <div
              className={`relative transition-all duration-1000 delay-500 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {featureCategories.slice(0, 6).map((category, index) => {
                  const Icon = category.icon
                  return (
                    <div
                      key={index}
                      className={`group relative p-6 rounded-2xl ${category.bgColor} border border-white/10 hover:border-white/20 transition-all duration-300`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${category.gradient} mb-4`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{category.title}</h3>
                      <p className="text-sm text-neutral-400 leading-snug">{category.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Breakdown */}
      <section className="relative py-32 border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/50" />
              <span className="text-sm font-semibold text-cyan-400 tracking-widest uppercase">
                Complete Feature Set
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight text-center mb-6">
              Everything you need.
            </h2>
            <p className="text-xl text-neutral-400 text-center max-w-2xl mx-auto">
              Built from a 1,176-line Prisma schema with 40+ models. Ready to deploy.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {featureCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div
                  key={index}
                  className="group relative p-8 bg-neutral-900/50 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 hover:bg-neutral-900 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className="relative">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.gradient} flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                        <p className="text-neutral-400 text-sm">{category.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                          <Check className={`w-4 h-4 flex-shrink-0 ${category.gradient.replace('from-', 'text-').split(' ')[0]}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-900 to-neutral-950 border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">Built with Modern Technology</h2>
            <p className="text-neutral-400">Enterprise-grade stack for production deployments</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            {techStack.map((tech, index) => {
              const Icon = tech.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Icon className={`w-6 h-6 ${tech.color}`} />
                  <span className="font-semibold text-white">{tech.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 border-t border-white/10">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="relative p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                Ready to ship?
              </h2>
              <p className="text-lg text-cyan-100 mb-8 max-w-2xl">
                Stop building the same features. Start with 40+ models, 10+ modules, and everything you need to launch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-neutral-900 hover:bg-neutral-100 text-base px-8 py-6 h-auto font-semibold"
                >
                  <Link href="/sign-up" className="gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base px-8 py-6 h-auto"
                >
                  <Link href="/dashboard">View Demo</Link>
                </Button>
              </div>

              <div className="mt-10 pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-8 text-sm text-cyan-100">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Production Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>100% TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10 bg-neutral-950">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-neutral-900" />
              </div>
              <span className="text-lg font-bold">{siteName}</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-neutral-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <p className="text-sm text-neutral-600">
              © {new Date().getFullYear()} {siteName}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
