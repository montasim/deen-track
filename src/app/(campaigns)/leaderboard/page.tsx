'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Users,
  TrendingUp,
  Target,
  Flame,
  ArrowLeft,
  ArrowRight,
  Zap,
  Award,
} from 'lucide-react'

// Mock leaderboard data
const mockLeaderboardData = [
  { id: '1', name: 'Alex Champion', totalPoints: 15420, campaignsCompleted: 12, rank: 1 },
  { id: '2', name: 'Sarah Winner', totalPoints: 14350, campaignsCompleted: 11, rank: 2 },
  { id: '3', name: 'Mike Achiever', totalPoints: 13980, campaignsCompleted: 10, rank: 3 },
  { id: '4', name: 'Emma Success', totalPoints: 12500, campaignsCompleted: 9, rank: 4 },
  { id: '5', name: 'John Leader', totalPoints: 11800, campaignsCompleted: 8, rank: 5 },
  { id: '6', name: 'Lisa Pro', totalPoints: 10500, campaignsCompleted: 7, rank: 6 },
  { id: '7', name: 'Tom Expert', totalPoints: 9800, campaignsCompleted: 6, rank: 7 },
  { id: '8', name: 'Kate Star', totalPoints: 9200, campaignsCompleted: 6, rank: 8 },
  { id: '9', name: 'David Ace', totalPoints: 8750, campaignsCompleted: 5, rank: 9 },
  { id: '10', name: 'Anna Elite', totalPoints: 8200, campaignsCompleted: 5, rank: 10 },
]

const rankConfig = {
  1: {
    icon: Crown,
    color: 'text-cyan-400',
    bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    cardBg: 'from-cyan-500/20 via-blue-600/10 to-violet-500/20',
    border: 'border-cyan-500/30',
  },
  2: {
    icon: Medal,
    color: 'text-violet-300',
    bg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    cardBg: 'from-violet-500/20 via-purple-600/10 to-pink-500/20',
    border: 'border-violet-500/30',
  },
  3: {
    icon: Medal,
    color: 'text-blue-400',
    bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    cardBg: 'from-blue-500/20 via-cyan-600/10 to-teal-500/20',
    border: 'border-blue-500/30',
  },
}

const stats = [
  { label: 'Total Players', value: '50,234', icon: Users, color: 'from-cyan-500 to-blue-600' },
  { label: 'Active This Week', value: '12,456', icon: Flame, color: 'from-violet-500 to-purple-600' },
  { label: 'Points Awarded', value: '2.5M+', icon: Zap, color: 'from-emerald-500 to-teal-600' },
]

export default function PublicLeaderboardPage() {
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all')
  const [leaderboard, setLeaderboard] = useState(mockLeaderboardData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [period])

  return (
    <>
      {/* Hero Section */}
      <div className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 bottom-0 right-0 animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
              <Trophy className="w-3 h-3 mr-2" />
              Hall of Fame
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Global Leaderboard
              </span>
            </h1>
            <p className="text-lg text-neutral-400 mb-8">
              See who&apos;s topping the charts and competing for glory
            </p>

            {/* Period Filters */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {(['all', 'weekly', 'monthly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`
                    px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 capitalize
                    ${
                      period === p
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105'
                        : 'bg-neutral-900/60 border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white hover:bg-neutral-800/60'
                    }
                  `}
                >
                  {p === 'all' ? 'All Time' : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardContent className="relative p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-neutral-400">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="container mx-auto max-w-4xl px-6 pb-16">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-neutral-900/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Podium - Top 3 */}
            <div className="grid grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((user, index) => {
                const config = rankConfig[(index + 1) as keyof typeof rankConfig]
                const Icon = config?.icon || Trophy

                return (
                  <Card
                    key={user.id}
                    className={`
                      relative bg-gradient-to-br ${config.cardBg} backdrop-blur-xl border border-white/10
                      transition-all duration-500 hover:scale-105
                      ${index === 1 ? 'md:-mt-8' : index === 0 ? 'md:mt-4' : ''}
                    `}
                  >
                    <CardContent className="p-6 text-center">
                      {/* Icon */}
                      <div
                        className={`inline-flex p-4 rounded-full mb-4 ${config.bg} shadow-lg ${
                          index === 1 ? 'w-16 h-16' : 'w-14 h-14'
                        }`}
                      >
                        <Icon className={`w-${index === 1 ? '10' : '8'} h-${index === 1 ? '10' : '8'} text-white`} />
                      </div>

                      {/* Rank */}
                      <div
                        className={`text-4xl font-black mb-3 ${config.color} drop-shadow-lg`}
                      >
                        #{user.rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.bg} mx-auto mb-3 flex items-center justify-center text-xl font-black text-white shadow-lg`}
                      >
                        {user.name.charAt(0)}
                      </div>

                      {/* Name */}
                      <h3 className="font-bold text-white mb-3">{user.name}</h3>

                      {/* Points */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white text-lg">
                          {user.totalPoints.toLocaleString()}
                        </span>
                      </div>

                      {/* Campaigns */}
                      <div className="text-xs text-neutral-400">
                        {user.campaignsCompleted} campaigns completed
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Rest of Leaderboard */}
            <div className="space-y-3">
              {leaderboard.slice(3).map((user) => (
                <Card
                  key={user.id}
                  className="group bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center font-black text-neutral-400 text-sm border border-white/10">
                        #{user.rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                        {user.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          {user.campaignsCompleted} campaigns completed
                        </p>
                      </div>

                      {/* Points */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white">{user.totalPoints.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 border-0 shadow-2xl shadow-cyan-500/25">
            <CardContent className="relative p-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-xl mb-6">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Want to be on the leaderboard?
              </h2>
              <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join campaigns, complete tasks, and climb the ranks to earn your place among the
                champions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-neutral-900 hover:bg-neutral-100 font-semibold shadow-lg"
                >
                  <Link href="/campaigns" className="gap-2">
                    Browse Campaigns
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold"
                >
                  <Link href="/sign-up">Sign Up Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
