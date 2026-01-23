'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Code,
  Database,
  Palette,
  Globe,
  Mail,
  Megaphone,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// Feature data
const features = [
  {
    icon: LayoutDashboard,
    title: 'Powerful Dashboard',
    description: 'Beautiful analytics dashboards with real-time data visualization and customizable widgets.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Comprehensive user management with roles, permissions, and activity tracking.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: FileText,
    title: 'Content Management',
    description: 'Full-featured blog, FAQ, and legal page management with rich text editor.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Megaphone,
    title: 'Campaign System',
    description: 'Email campaign management with scheduling, analytics, and automated delivery.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: MessageSquare,
    title: 'Support Tickets',
    description: 'Integrated support system with ticket management, priorities, and status tracking.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: TrendingUp,
    title: 'Marketplace Features',
    description: 'Built-in marketplace with listings, offers, reviews, and real-time messaging.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Activity Tracking',
    description: 'Detailed activity logs and analytics for complete system oversight.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'WebSocket-powered real-time notifications and live updates across the platform.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Settings,
    title: 'Site Settings',
    description: 'Global site configuration, branding, SEO, and contact information management.',
    color: 'from-slate-500 to-gray-500',
  },
]

const techStack = [
  { name: 'Next.js 16', icon: Code, description: 'Latest React framework' },
  { name: 'TypeScript', icon: Code, description: 'Type-safe codebase' },
  { name: 'Prisma', icon: Database, description: 'Modern ORM' },
  { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first styling' },
  { name: 'PostgreSQL', icon: Database, description: 'Robust database' },
  { name: 'Stripe', icon: Shield, description: 'Payment processing' },
]

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small projects',
    price: '$0',
    period: 'forever',
    features: [
      'Up to 100 users',
      'Basic analytics',
      'Email support',
      'Core features',
      'Community access',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses',
    price: '$49',
    period: 'per month',
    features: [
      'Up to 1,000 users',
      'Advanced analytics',
      'Priority support',
      'All features included',
      'Custom integrations',
      'API access',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: '$199',
    period: 'per month',
    features: [
      'Unlimited users',
      'Custom analytics',
      '24/7 dedicated support',
      'White-label solution',
      'On-premise deployment',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function LandingPage() {
  const [siteName, setSiteName] = useState('Admin Template')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/public/site/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.siteName) {
          setSiteName(data.data.siteName)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-slate-200/50 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {siteName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900">
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200/50 mb-8 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Production-Ready Admin Template</span>
            </div>

            <h1
              className={`text-5xl lg:text-7xl font-bold tracking-tight mb-8 transition-all duration-1000 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Build Amazing Admin
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Experiences
              </span>
            </h1>

            <p
              className={`text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              A complete, production-ready admin template with modern design, powerful features, and
              exceptional developer experience. Ship faster.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-xl shadow-blue-500/25 text-lg px-8 py-6 h-auto"
              >
                <Link href="/sign-up" className="gap-2">
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-2 hover:bg-slate-50"
              >
                <Link href="/dashboard">View Live Demo</Link>
              </Button>
            </div>

            <div
              className={`mt-16 flex items-center justify-center gap-8 text-sm text-slate-500 transition-all duration-1000 delay-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Packed with features to help you build modern admin applications quickly and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white border border-slate-200/50 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Built with Modern Tech
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Leverage the latest technologies for exceptional performance and developer experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {techStack.map((tech, index) => {
              const Icon = tech.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 rounded-xl bg-white border border-slate-200/50 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{tech.name}</h3>
                    <p className="text-sm text-slate-500">{tech.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-2xl shadow-blue-500/25 scale-105'
                    : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full text-sm font-semibold text-slate-900 shadow-lg">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm opacity-80 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-80">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="relative p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of developers building amazing admin experiences. Start building for
                free today.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl text-lg px-8 py-6 h-auto"
                >
                  <Link href="/sign-up" className="gap-2">
                    Start Building Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto border-2 border-white/30 text-white hover:bg-white/10"
                >
                  <Link href="/dashboard">View Demo</Link>
                </Button>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-8 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Free forever plan available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">{siteName}</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-600">
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
