'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, Award, TrendingUp, Star, Crown, Medal, Flame, Sparkles, Zap } from 'lucide-react'
import { PageBackground } from '@/components/layout/page-background'

// Distinctive gradient themes for campaign selector cards
const campaignThemes = [
  { gradient: 'from-cyan-500 via-blue-600 to-violet-600', bg: 'from-cyan-500/20 to-blue-600/20', icon: Trophy },
  { gradient: 'from-violet-500 via-purple-600 to-fuchsia-600', bg: 'from-violet-500/20 to-purple-600/20', icon: Sparkles },
  { gradient: 'from-orange-500 via-red-600 to-rose-600', bg: 'from-orange-500/20 to-red-600/20', icon: Flame },
  { gradient: 'from-emerald-500 via-teal-600 to-cyan-600', bg: 'from-emerald-500/20 to-teal-600/20', icon: Zap },
]

// Metallic gradient configs for podium ranks
const rankGradients = {
  1: 'from-amber-400 via-yellow-500 to-amber-600',
  2: 'from-slate-300 via-gray-400 to-slate-400',
  3: 'from-orange-500 via-orange-600 to-orange-700',
}

function CampaignSelectorSkeleton({ index }: { index: number }) {
  const theme = campaignThemes[index % campaignThemes.length]
  const Icon = theme.icon

  return (
    <button
      className="relative group px-6 py-4 rounded-2xl font-semibold text-base overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${index * 120}ms`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.05) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />

      <div className="relative flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${theme.bg} animate-pulse`}>
          <Icon className="w-5 h-5 text-white/50" />
        </div>
        <div className="flex-1 text-left">
          <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-1" />
          <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </button>
  )
}

function StatCardSkeleton({ index }: { index: number }) {
  const icons = [Users, Award, TrendingUp, Star]
  const Icon = icons[index % icons.length]
  const theme = campaignThemes[0]
  const delay = index * 100

  return (
    <Card
      className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${400 + delay}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0`} />

      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer" />

      <CardContent className="relative p-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${theme.gradient} shadow-lg animate-pulse`}
            style={{ animationDelay: `${delay}ms` }}
          >
            <Icon className="w-6 h-6 text-white/50" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-8 w-20 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${delay + 50}ms` }} />
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${delay + 100}ms` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PodiumCardSkeleton({ rank }: { rank: number }) {
  const isWinner = rank === 1
  const gradient = rankGradients[rank as keyof typeof rankGradients] || rankGradients[1]
  const icons = [Medal, Crown, Medal]
  const Icon = icons[rank - 1]

  return (
    <Card
      className={`
        relative bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-xl border-2
        overflow-hidden opacity-0 transition-all duration-500
        ${isWinner ? 'border-amber-500/30 md:-mt-8' : 'border-white/10'}
      `}
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${800 + rank * 150}ms`,
      }}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 animate-pulse`} />

      {/* Winner glow effect */}
      {isWinner && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 blur-xl animate-pulse" />
      )}

      <CardContent className="relative p-8 text-center">
        {/* Icon Badge */}
        <div className="flex justify-center mb-4">
          <div
            className={`
              relative p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-xl
              ${isWinner ? 'w-24 h-24' : 'w-20 h-20'}
              animate-pulse
            `}
          >
            <Icon className="w-full h-full text-white/50" />
            {isWinner && (
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl opacity-50 blur-lg animate-pulse" />
            )}
          </div>
        </div>

        {/* Rank */}
        <div
          className={`
            text-5xl font-black mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent
            animate-pulse
          `}
          style={{ animationDelay: `${rank * 150 + 100}ms` }}
        >
          #{rank}
        </div>

        {/* Avatar */}
        <div
          className={`
            w-20 h-20 rounded-full bg-gradient-to-br ${gradient} mx-auto mb-4
            flex items-center justify-center text-2xl font-black text-white/50
            shadow-xl border-4 border-white/10 animate-pulse
          `}
          style={{ animationDelay: `${rank * 150 + 150}ms` }}
        >
          ?
        </div>

        {/* Name */}
        <div className="h-6 w-40 mx-auto mb-4 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${rank * 150 + 200}ms` }} />

        {/* Points */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500/50 fill-yellow-500/50 animate-pulse" style={{ animationDelay: `${rank * 150 + 250}ms` }} />
          <div className="h-8 w-24 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${rank * 150 + 300}ms` }} />
        </div>

        {/* Label */}
        <div className="h-4 w-28 mx-auto bg-white/5 rounded animate-pulse" style={{ animationDelay: `${rank * 150 + 350}ms` }} />
      </CardContent>
    </Card>
  )
}

function LeaderboardItemSkeleton({ index }: { index: number }) {
  const rank = index + 4 // Starting from rank 4
  const theme = campaignThemes[0]

  return (
    <Card
      className="group bg-neutral-900/40 backdrop-blur-xl border border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${1300 + index * 80}ms`,
      }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />

      <CardContent className="relative p-5">
        <div className="flex items-center gap-5">
          {/* Rank Badge */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800
            flex items-center justify-center font-black text-neutral-500/50 border border-white/10 animate-pulse"
            style={{ animationDelay: `${index * 80 + 50}ms` }}
          >
            #{rank}
          </div>

          {/* Avatar */}
          <div
            className={`
              w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient}
              flex items-center justify-center text-lg font-bold text-white/50
              shadow-lg animate-pulse
            `}
            style={{ animationDelay: `${index * 80 + 100}ms` }}
          >
            ?
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="h-6 w-48 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 80 + 150}ms` }} />
          </div>

          {/* Points */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/50 border border-white/10">
              <Star className="w-4 h-4 text-yellow-500/50 fill-yellow-500/50 animate-pulse" style={{ animationDelay: `${index * 80 + 200}ms` }} />
              <div className="h-5 w-20 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 80 + 250}ms` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CampaignInfoSkeleton() {
  return (
    <Card
      className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: '1800ms',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer" />

      <CardContent className="relative p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="h-7 w-64 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="flex gap-3 mt-4">
              <div className="h-8 w-40 bg-white/5 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="h-8 w-24 bg-white/5 rounded animate-pulse" style={{ animationDelay: '250ms' }} />
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="h-14 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg w-48 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LeaderboardSkeleton() {
  return (
    <>
      <PageBackground />

      {/* Hero Section */}
      <section className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden my-10 pt-20 pb-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 my-16">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 opacity-0"
              style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="h-4 w-28 bg-cyan-400/30 rounded animate-pulse" />
            </div>

            {/* Title */}
            <div
              className="h-16 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 rounded-xl mx-auto mb-6 opacity-0 animate-pulse"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 100ms',
                animationFillMode: 'forwards',
              }}
            />

            {/* Description */}
            <div
              className="h-6 w-[500px] mx-auto bg-white/5 rounded opacity-0 animate-pulse"
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 200ms',
                animationFillMode: 'forwards',
              }}
            />
          </div>

          {/* Campaign Selector */}
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {[0, 1, 2].map((i) => (
              <CampaignSelectorSkeleton key={i} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-neutral-950 relative">
        <div className="relative container mx-auto max-w-7xl px-6 py-12">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4 mb-12">
            {[0, 1, 2, 3].map((i) => (
              <StatCardSkeleton key={i} index={i} />
            ))}
          </div>

          {/* Podium Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[2, 1, 3].map((rank) => (
              <PodiumCardSkeleton key={rank} rank={rank} />
            ))}
          </div>

          {/* Leaderboard List Skeleton */}
          <div className="space-y-3 mb-12">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <LeaderboardItemSkeleton key={i} index={i} />
            ))}
          </div>

          {/* Campaign Info Skeleton */}
          <CampaignInfoSkeleton />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  )
}
