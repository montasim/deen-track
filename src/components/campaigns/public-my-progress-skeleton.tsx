'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Target, TrendingUp, Award, Sparkles, Clock, CheckCircle2, Flame, Lock } from 'lucide-react'
import { PageBackground } from '@/components/layout/page-background'

// Gradient themes matching the page
const gradientThemes = [
  { from: 'cyan-500', via: 'blue-600', to: 'violet-600', bg: 'from-cyan-500/20 to-blue-600/20' },
  { from: 'violet-500', via: 'purple-600', to: 'fuchsia-600', bg: 'from-violet-500/20 to-purple-600/20' },
  { from: 'emerald-500', via: 'teal-600', to: 'cyan-600', bg: 'from-emerald-500/20 to-teal-600/20' },
]

// Stats colors
const statColors = [
  'from-amber-500 to-yellow-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
]

// Achievement tier colors
const tierColors = [
  'border-orange-500/30',
  'border-slate-400/30',
  'border-yellow-500/30',
  'border-cyan-400/30',
  'border-blue-400/30',
  'border-purple-400/30',
]

function StatCardSkeleton({ index, delay }: { index: number; delay: number }) {
  const icons = [Trophy, Target, CheckCircle2, TrendingUp]
  const Icon = icons[index % icons.length]
  const color = statColors[index % statColors.length]

  return (
    <Card
      className="relative overflow-hidden opacity-0 bg-neutral-900/40 backdrop-blur-xl border-white/10"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`} />
      <CardContent className="relative p-6">
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg animate-pulse`}>
            <Icon className="w-6 h-6 text-white/50" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-8 w-16 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-20 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AreaChartSkeleton() {
  return (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '400ms' }}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 animate-pulse">
            <TrendingUp className="w-5 h-5 text-cyan-400/50" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-40 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-32 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="relative w-full h-[300px] bg-neutral-900/30 rounded-lg overflow-hidden">
          <div className="absolute inset-0 space-y-12 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-px bg-neutral-700/30" />
            ))}
          </div>
          <div className="absolute inset-0 p-6">
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-violet-500/20 to-transparent rounded-t-lg animate-pulse" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-t-lg animate-pulse" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 h-px bg-neutral-700/50" />
        </div>
      </CardContent>
    </Card>
  )
}

function PieChartSkeleton() {
  return (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '500ms' }}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 animate-pulse">
            <Award className="w-5 h-5 text-emerald-400/50" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-36 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-40 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="relative w-full h-[300px] flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full bg-neutral-900/30 border border-white/5 overflow-hidden animate-pulse">
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(#10b981 0deg 120deg, #f59e0b 120deg 240deg, #ef4444 240deg 360deg)`,
                opacity: 0.3,
              }}
            />
            <div className="absolute inset-0 m-12 rounded-full bg-neutral-900/50" />
          </div>
          <div className="absolute bottom-0 right-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 animate-pulse" />
              <div className="w-14 h-3 bg-neutral-700/30 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500/30 animate-pulse" />
              <div className="w-12 h-3 bg-neutral-700/30 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/30 animate-pulse" />
              <div className="w-12 h-3 bg-neutral-700/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChartSkeleton() {
  return (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '600ms' }}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 animate-pulse">
            <Award className="w-5 h-5 text-violet-400/50" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-44 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-48 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="relative w-full h-[300px] bg-neutral-900/30 rounded-lg overflow-hidden">
          <div className="absolute inset-0 space-y-12 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-px bg-neutral-700/30" />
            ))}
          </div>
          <div className="absolute bottom-6 left-6 right-6 top-6 flex items-end justify-around gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                <div
                  className="w-full bg-gradient-to-t from-violet-500/30 to-purple-600/30 rounded-t-lg animate-pulse"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
                <div className="w-full h-3 bg-neutral-700/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-6 right-6 h-px bg-neutral-700/50" />
        </div>
      </CardContent>
    </Card>
  )
}

function CampaignProgressCardSkeleton({ index }: { index: number }) {
  const theme = gradientThemes[index % gradientThemes.length]
  const statusIcons = [CheckCircle2, Flame, Clock]
  const StatusIcon = statusIcons[index % statusIcons.length]

  return (
    <Card
      className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${700 + index * 100}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${theme.from}-5 via-${theme.via}-5 to-${theme.to}-5 opacity-0`} />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-3/4 bg-neutral-700/50 rounded animate-pulse" />
              <div className="p-1 rounded bg-neutral-700/30">
                <StatusIcon className="w-4 h-4 text-neutral-600" />
              </div>
            </div>
            <div className="h-4 w-full bg-neutral-700/30 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="h-9 w-16 bg-neutral-700/20 rounded-md animate-pulse flex-shrink-0" />
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-neutral-700/30 rounded animate-pulse" />
            <div className="h-4 w-24 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="w-full h-2 bg-neutral-700/30 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-12 bg-neutral-700/20 rounded animate-pulse ml-auto" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-neutral-700/30">
              <Trophy className="w-4 h-4 text-neutral-600" />
            </div>
            <div className="h-4 w-20 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-neutral-700/30">
              <Clock className="w-4 h-4 text-neutral-600" />
            </div>
            <div className="h-4 w-24 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </Card>
  )
}

function SubmissionCardSkeleton({ index }: { index: number }) {
  return (
    <Card className="group bg-neutral-900/40 backdrop-blur-xl border-white/10 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${1000 + index * 50}ms` }}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-5 w-40 bg-neutral-700/50 rounded animate-pulse" />
              <div className="h-6 w-20 bg-neutral-700/30 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="h-4 w-20 bg-neutral-700/30 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

function AchievementStatCardSkeleton({ index }: { index: number }) {
  const icons = [Award, Sparkles, TrendingUp, Target]
  const Icon = icons[index % icons.length]
  const color = statColors[(index + 1) % statColors.length]

  return (
    <Card
      className="relative overflow-hidden opacity-0 bg-neutral-900/40 backdrop-blur-xl border-white/10"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${1300 + index * 100}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`} />
      <CardContent className="relative p-6">
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg animate-pulse`}>
            <Icon className="w-6 h-6 text-white/50" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-8 w-20 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-24 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AchievementCardSkeleton({ index }: { index: number }) {
  const tierColor = tierColors[index % tierColors.length]

  return (
    <Card
      className={`group relative bg-neutral-900/40 backdrop-blur-xl ${tierColor} overflow-hidden opacity-0`}
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${1700 + index * 100}ms`,
      }}
    >
      <CardContent className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl grayscale opacity-40 animate-pulse">🏆</div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-40 bg-neutral-700/50 rounded animate-pulse" />
              <div className="h-5 w-14 bg-neutral-700/30 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-full bg-neutral-700/30 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-neutral-700/30 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-neutral-700/30">
                <Lock className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="h-4 w-16 bg-neutral-700/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PublicMyProgressSkeleton() {
  return (
    <>
      <PageBackground />

      {/* Page Header Skeleton */}
      <section className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden my-10 pt-20 pb-10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
              <Sparkles className="w-4 h-4 text-cyan-400/50 animate-pulse" />
              <span className="text-sm font-medium text-cyan-300/50 w-24 h-4 bg-neutral-700/30 rounded animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal space-y-2 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards 100ms', animationFillMode: 'forwards' }}>
              <div className="h-10 w-32 bg-neutral-700/50 rounded animate-pulse mx-auto" />
              <div className="h-10 w-48 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 rounded animate-pulse mx-auto" />
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto h-6 w-80 bg-neutral-700/30 rounded animate-pulse opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards 200ms', animationFillMode: 'forwards' }} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-neutral-950 relative">
        {/* Stats Grid */}
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-4 md:grid-cols-4 mb-12">
            {[0, 1, 2, 3].map((i) => (
              <StatCardSkeleton key={i} index={i} delay={i * 100} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <AreaChartSkeleton />
            <PieChartSkeleton />
          </div>

          {/* Bar Chart */}
          <BarChartSkeleton />

          {/* Campaign Progress Cards */}
          <div className="mb-12 mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 animate-pulse">
                <Target className="w-5 h-5 text-amber-400/50" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-48 bg-neutral-700/50 rounded animate-pulse" />
                <div className="h-4 w-56 bg-neutral-700/30 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <CampaignProgressCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-600/20 animate-pulse">
                <Clock className="w-5 h-5 text-pink-400/50" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-40 bg-neutral-700/50 rounded animate-pulse" />
                <div className="h-4 w-48 bg-neutral-700/30 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <SubmissionCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 animate-pulse">
                <Award className="w-5 h-5 text-amber-400/50" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-40 bg-neutral-700/50 rounded animate-pulse" />
                <div className="h-4 w-56 bg-neutral-700/30 rounded animate-pulse" />
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <AchievementStatCardSkeleton key={i} index={i} />
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <AchievementCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
