'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Target,
  Users,
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
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

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

export default function CampaignsLandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
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
                className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight transition-all duration-1000 delay-200 ${
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
                Join gamified campaigns, complete exciting tasks, earn rewards, and compete with
                others on real-time leaderboards.
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
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
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
                            <Star className="w-4 h-4 text-amber-400" />
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
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
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
                <div key={index} className="relative group">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-white/10 flex items-center justify-center text-xl font-black text-neutral-600 z-10">
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
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
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
          <div className="relative p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <div className="relative text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-2" />
                Join Now
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-lg text-cyan-100 mb-10 max-w-2xl mx-auto">
                Join thousands of users already competing, achieving goals, and earning rewards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-neutral-900 hover:bg-neutral-100 text-base px-10 py-6 h-auto font-semibold shadow-xl"
                >
                  <Link href="/sign-up" className="gap-2">
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base px-10 py-6 h-auto backdrop-blur-sm"
                >
                  <Link href="/campaigns">Browse Campaigns</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-cyan-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Free to Join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Start Earning Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </>
  )
}
