'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Target,
  Zap,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Crown,
  Shield,
  BarChart3,
  Gamepad2,
  Medal,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Home,
} from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getProxiedImageUrl } from '@/lib/image-proxy'
import { getUserInitials } from '@/lib/utils/user'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'

// Sample featured campaigns data
const featuredCampaigns = [
  {
    id: '1',
    name: 'Fitness Challenge 2024',
    description: 'Complete daily workout challenges and earn rewards',
    difficulty: 'INTERMEDIATE',
    participants: 1247,
    color: 'from-orange-500 to-red-600',
    icon: Flame,
    points: 500,
    duration: '30 days',
  },
  {
    id: '2',
    name: 'Learning Sprint',
    description: 'Master new skills with structured learning paths',
    difficulty: 'BEGINNER',
    participants: 892,
    color: 'from-blue-500 to-cyan-600',
    icon: Sparkles,
    points: 350,
    duration: '21 days',
  },
  {
    id: '3',
    name: 'Productivity Master',
    description: 'Build habits and boost your daily productivity',
    difficulty: 'ADVANCED',
    participants: 654,
    color: 'from-purple-500 to-violet-600',
    icon: Trophy,
    points: 750,
    duration: '45 days',
  },
]

const steps = [
  {
    icon: Target,
    title: 'Browse Campaigns',
    description: 'Find challenges that match your interests and skill level',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Gamepad2,
    title: 'Complete Tasks',
    description: 'Submit proof of your accomplishments and track progress',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: Crown,
    title: 'Earn Rewards',
    description: 'Unlock achievements, climb leaderboards, and earn points',
    color: 'from-amber-400 to-orange-500',
  },
]

const features = [
  {
    icon: BarChart3,
    title: 'Real-time Leaderboards',
    description: 'Compete with others and see your ranking update live',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'Team Competitions',
    description: 'Form teams and collaborate to achieve shared goals',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Award,
    title: 'Achievement Badges',
    description: 'Collect unique badges as you complete challenges',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Verified Progress',
    description: 'All submissions reviewed by admins for fairness',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500+', label: 'Campaigns' },
  { value: '1M+', label: 'Tasks Completed' },
  { value: '50M+', label: 'Points Earned' },
]

export default function LandingPage() {
  const { user, logout, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [siteName, setSiteName] = useState('CampaignHub')

  // Get proxied avatar URL for Google Drive images
  const avatarUrl = useMemo(() => {
    const rawUrl = user?.avatar ?? (user as any)?.directAvatarUrl ?? undefined
    return rawUrl ? (getProxiedImageUrl(rawUrl) || rawUrl) : undefined
  }, [user?.avatar, (user as any)?.directAvatarUrl])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)

    // Fetch site settings
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

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333308_1px,transparent_1px),linear-gradient(to_bottom,#33333308_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Animated Gradient Orbs */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-violet-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
          style={{
            left: '20%',
            top: '10%',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/25 via-purple-600/20 to-pink-500/25 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
          style={{
            right: '15%',
            bottom: '20%',
            transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.12}px)`,
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${-scrollY * 0.05}px, ${-scrollY * 0.05}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all">
                <Trophy className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                {siteName}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/campaigns"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Campaigns
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                About
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {isLoading ? (
                /* Show skeleton buttons during loading */
                <>
                  <Skeleton className="h-9 w-20 bg-white/10" />
                  <Skeleton className="h-9 w-24 bg-white/10" />
                </>
              ) : user ? (
                /* User is logged in - show profile dropdown */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8 border-2 border-cyan-500/30">
                        <AvatarImage src={avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                        <p className="text-xs leading-none text-neutral-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/" className="cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* User is not logged in - show sign in/up buttons */
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-neutral-400 hover:text-white hover:bg-white/5"
                  >
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                  >
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
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
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm transition-all duration-1000 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300 tracking-wide">
                  GAMIFIED CHALLENGES AWAIT
                </span>
              </div>

              <h1
                className={`text-4xl sm:text-5xl lg:text-5xl font-black leading-[0.95] tracking-tight transition-all duration-1000 delay-200 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <span className="block text-white">Turn Challenges</span>
                <span className="block text-white">Into</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mt-2">
                  Achievements
                </span>
              </h1>

              <p
                className={`text-xl text-neutral-400 max-w-lg leading-relaxed transition-all duration-1000 delay-300 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Join gamified campaigns, complete exciting tasks, earn rewards, and compete with others on real-time leaderboards.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-base px-8 py-6 h-auto font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  <Link href="/campaigns" className="gap-2">
                    Explore Campaigns
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 text-base px-8 py-6 h-auto backdrop-blur-sm"
                >
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-4 gap-6 pt-8 border-t border-white/10 transition-all duration-1000 delay-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-neutral-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Animated Cards */}
            <div
              className={`relative transition-all duration-1000 delay-500 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-violet-500/20 rounded-3xl blur-3xl" />

                {/* Floating Cards */}
                <div className="relative space-y-4">
                  {featuredCampaigns.slice(0, 2).map((campaign, index) => {
                    const Icon = campaign.icon
                    return (
                      <div
                        key={index}
                        className="group relative p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                        style={{
                          animation: `float 6s ease-in-out infinite`,
                          animationDelay: `${index * 0.5}s`,
                        }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${campaign.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />

                        <div className="relative">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${campaign.color} flex-shrink-0 shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white mb-1">{campaign.name}</h3>
                              <p className="text-sm text-neutral-400 line-clamp-2">{campaign.description}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <Badge className={`bg-gradient-to-r ${campaign.color} text-white border-0`}>
                                  {campaign.difficulty}
                                </Badge>
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {campaign.participants.toLocaleString()}
                                </span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-400" />
                                  {campaign.points} pts
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="relative py-32 border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
              Featured
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Active Campaigns
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Join thousands of users competing in exciting challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign, index) => {
              const Icon = campaign.icon
              return (
                <Card
                  key={index}
                  className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${campaign.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <CardContent className="relative p-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${campaign.color} mb-6 shadow-lg group-hover:shadow-xl group-hover:shadow-${campaign.color.split('-')[1]}-500/30 transition-all`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{campaign.name}</h3>
                    <p className="text-neutral-400 mb-6">{campaign.description}</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={`bg-gradient-to-r ${campaign.color} text-white border-0`}>
                          {campaign.difficulty}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {campaign.participants.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 w-4 text-amber-400" />
                            {campaign.points}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-sm text-neutral-500">{campaign.duration}</span>
                        <Button
                          asChild
                          size="sm"
                          className="bg-white text-neutral-900 hover:bg-neutral-100 font-semibold"
                        >
                          <Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 hover:border-white/30"
            >
              <Link href="/campaigns" className="gap-2">
                View All Campaigns
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 border-t border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-violet-500/20 to-purple-600/20 text-violet-300 border-violet-500/30">
              Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Start your journey in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-white/10 flex items-center justify-center text-xl font-black text-neutral-600">
                    {index + 1}
                  </div>

                  <div className="relative p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:scale-[1.02]">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-32 border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-300 border-emerald-500/30">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Everything you need for an engaging campaign experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                  <div className="relative flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient} flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-neutral-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 border-t border-white/5">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="relative p-12 lg:p-16 rounded-3xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
            {/* Background Pattern - like contact page */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Glow - similar to contact page */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10" />

            <div className="relative text-center">
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
                <Sparkles className="w-3 h-3 mr-2" />
                Join Now
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-base text-neutral-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users already competing, achieving goals, and earning rewards.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Button
                  asChild
                  size="default"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm px-6 py-5 h-auto font-semibold shadow-lg shadow-cyan-500/25"
                >
                  <Link href="/sign-up" className="gap-2">
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="default"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 text-sm px-6 py-5 h-auto backdrop-blur-sm"
                >
                  <Link href="/campaigns">Browse Campaigns</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Free to Join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Start Earning Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/5 bg-neutral-900/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">{siteName}</span>
              </Link>
              <p className="text-sm text-neutral-400">
                Turn your challenges into achievements with gamified campaigns and exciting rewards.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/campaigns" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Campaigns
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Teams
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 3.743 0 01-1.804 4.57 11.659 11.659 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
