'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Difficulty gradient colors for skeleton
const difficultyGradients = {
  0: 'from-emerald-500/20 to-green-600/20',
  1: 'from-blue-500/20 to-cyan-600/20',
  2: 'from-violet-500/20 to-purple-600/20',
  3: 'from-red-500/20 to-orange-600/20',
}

export function CampaignCardSkeleton({ delay = 0 }: { delay?: number }) {
  const gradientClass = difficultyGradients[delay % 4 as keyof typeof difficultyGradients]

  return (
    <Card
      className={cn(
        'relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden',
        'animate-pulse opacity-0',
        delay > 0 && `animation-delay-${delay * 100}`
      )}
      style={{
        animation: 'fadeIn 0.5s ease-out forwards',
        animationDelay: `${delay * 100}ms`,
      }}
    >
      {/* Gradient overlay */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', gradientClass, 'opacity-30')} />

      <CardContent className="relative p-6">
        {/* Campaign Header - Icon + Badge */}
        <div className="flex items-start justify-between mb-6">
          {/* Icon placeholder */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 border border-white/5">
            <div className="w-8 h-8 bg-neutral-600/50 rounded animate-pulse" />
          </div>

          {/* Badge placeholder */}
          <div className="px-3 py-1 rounded-full bg-neutral-700/30 border border-white/10">
            <div className="w-16 h-4 bg-neutral-600/30 rounded animate-pulse" />
          </div>
        </div>

        {/* Campaign Title */}
        <div className="mb-3 space-y-2">
          <div className="h-7 w-4/5 bg-gradient-to-r from-neutral-700/50 via-neutral-600/30 to-neutral-700/50 rounded animate-pulse" />
          <div className="h-4 w-full bg-neutral-700/30 rounded animate-pulse" />
          <div className="h-4 w-3/5 bg-neutral-700/30 rounded animate-pulse" />
        </div>

        {/* Campaign Stats */}
        <div className="space-y-4 mb-6">
          {/* Players count */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-neutral-700/50 rounded animate-pulse" />
              <div className="w-24 h-4 bg-neutral-700/30 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-neutral-700/50 rounded animate-pulse" />
              <div className="w-16 h-4 bg-neutral-700/30 rounded animate-pulse" />
            </div>
          </div>

          {/* Tasks count */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-neutral-700/50 rounded animate-pulse" />
            <div className="w-28 h-4 bg-neutral-700/30 rounded animate-pulse" />
          </div>

          {/* Points requirement */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-neutral-700/50 rounded animate-pulse" />
            <div className="w-40 h-4 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <div className="flex-1 h-11 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-cyan-500/20 rounded-lg animate-pulse shadow-lg" />
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  )
}

export function CampaignCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <CampaignCardSkeleton key={i} delay={i} />
      ))}
    </div>
  )
}
