'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Target, CheckCircle2, Award } from 'lucide-react'

// Icon gradient colors for stat cards
const statCardGradients = [
  'from-yellow-500/20 to-amber-600/20',
  'from-blue-500/20 to-cyan-600/20',
  'from-green-500/20 to-emerald-600/20',
  'from-violet-500/20 to-purple-600/20',
]

// Chart skeleton colors
const chartColors = {
  area: ['from-violet-500/30 to-purple-600/30', 'from-cyan-500/30 to-blue-600/30'],
  bar: 'from-violet-500/40 to-purple-600/40',
  pie: ['#10b981', '#f59e0b', '#ef4444'],
}

function StatCardSkeleton({ index }: { index: number }) {
  const icons = [Trophy, Target, CheckCircle2, Award]
  const Icon = icons[index % icons.length]
  const gradient = statCardGradients[index % statCardGradients.length]

  return (
    <Card
      className="relative overflow-hidden animate-pulse opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-8 w-16 bg-neutral-700/50 rounded animate-pulse" />
          </div>
          <div className="p-2 rounded-full bg-neutral-700/30 border border-white/10">
            <Icon className="h-6 w-6 text-neutral-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AreaChartSkeleton() {
  return (
    <Card
      className="opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: '400ms',
      }}
    >
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-neutral-700/50 rounded animate-pulse" />
          <div className="h-4 w-64 bg-neutral-700/30 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[300px] bg-neutral-900/30 rounded-lg border border-white/5 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 space-y-12 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-px bg-neutral-700/30" />
            ))}
          </div>

          {/* Chart areas */}
          <div className="absolute inset-0 p-6">
            <div className="relative w-full h-full">
              {/* Area 1 */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-violet-500/20 to-transparent rounded-t-lg animate-pulse" />
              {/* Area 2 */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-t-lg animate-pulse" />
            </div>
          </div>

          {/* X-axis line */}
          <div className="absolute bottom-6 left-6 right-6 h-px bg-neutral-700/50" />
        </div>
      </CardContent>
    </Card>
  )
}

function PieChartSkeleton() {
  return (
    <Card
      className="opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: '500ms',
      }}
    >
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 w-40 bg-neutral-700/50 rounded animate-pulse" />
          <div className="h-4 w-56 bg-neutral-700/30 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[300px] flex items-center justify-center">
          {/* Pie chart */}
          <div className="relative w-48 h-48 rounded-full bg-neutral-900/30 border border-white/5 overflow-hidden animate-pulse">
            {/* Segments */}
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(
                  #10b981 0deg 120deg,
                  #f59e0b 120deg 240deg,
                  #ef4444 240deg 360deg
                )`,
                opacity: 0.3,
              }}
            />
            {/* Inner circle for donut */}
            <div className="absolute inset-0 m-12 rounded-full bg-neutral-900/50" />
          </div>

          {/* Legend */}
          <div className="absolute bottom-0 right-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 animate-pulse" />
              <div className="w-16 h-3 bg-neutral-700/30 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500/30 animate-pulse" />
              <div className="w-14 h-3 bg-neutral-700/30 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/30 animate-pulse" />
              <div className="w-14 h-3 bg-neutral-700/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChartSkeleton() {
  return (
    <Card
      className="opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: '600ms',
      }}
    >
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 w-40 bg-neutral-700/50 rounded animate-pulse" />
          <div className="h-4 w-48 bg-neutral-700/30 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[300px] bg-neutral-900/30 rounded-lg border border-white/5 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 space-y-12 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-px bg-neutral-700/30" />
            ))}
          </div>

          {/* Bars */}
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

          {/* X-axis line */}
          <div className="absolute bottom-6 left-6 right-6 h-px bg-neutral-700/50" />
        </div>
      </CardContent>
    </Card>
  )
}

function CampaignProgressCardSkeleton({ index }: { index: number }) {
  return (
    <Card
      className="relative overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${700 + index * 100}ms`,
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-3/4 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-full bg-neutral-700/30 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-neutral-700/30 rounded-full animate-pulse flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-neutral-700/30 rounded animate-pulse" />
            <div className="h-4 w-20 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="w-full h-2 bg-neutral-700/30 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-neutral-700/30">
              <Trophy className="h-4 w-4 text-neutral-600" />
            </div>
            <div className="h-4 w-16 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="h-7 w-24 bg-neutral-700/20 rounded-md animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

function SubmissionCardSkeleton({ index }: { index: number }) {
  return (
    <Card
      className="opacity-0"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${1000 + index * 50}ms`,
      }}
    >
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-32 bg-neutral-700/30 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-neutral-700/30 rounded-full animate-pulse" />
            <div className="w-4 h-4 bg-neutral-700/50 rounded animate-pulse" />
            <div className="h-4 w-20 bg-neutral-700/30 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MyProgressPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <StatCardSkeleton key={i} index={i} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartSkeleton />
        <PieChartSkeleton />
      </div>

      {/* Bar Chart */}
      <BarChartSkeleton />

      {/* Campaign Progress Section */}
      <div>
        <div className="h-7 w-48 bg-neutral-700/50 rounded animate-pulse mb-4 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '700ms' }} />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <CampaignProgressCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>

      {/* Recent Submissions Section */}
      <div>
        <div className="h-7 w-40 bg-neutral-700/50 rounded animate-pulse mb-4 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: '1000ms' }} />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <SubmissionCardSkeleton key={i} index={i} />
          ))}
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
    </div>
  )
}
