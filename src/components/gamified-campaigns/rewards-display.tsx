'use client'

import { Gift, Trophy, Award, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Reward {
  id?: string
  name: string
  description: string
  imageUrl?: string
  icon?: string
  value?: string
  quantity?: number
  tier?: string
}

interface RewardsDisplayProps {
  rewards: Reward[]
  compact?: boolean
  showAll?: boolean
  variant?: 'card' | 'list' | 'badges'
  className?: string
}

const tierConfig = {
  '1st': {
    color: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: Trophy,
  },
  '2nd': {
    color: 'from-slate-300 to-slate-400',
    bg: 'bg-slate-400/15',
    text: 'text-slate-300',
    border: 'border-slate-400/30',
    icon: Award,
  },
  '3rd': {
    color: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    icon: Award,
  },
  'runner-up': {
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: Star,
  },
  'participation': {
    color: 'from-neutral-400 to-neutral-500',
    bg: 'bg-neutral-500/15',
    text: 'text-neutral-300',
    border: 'border-neutral-500/30',
    icon: Gift,
  },
  'default': {
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
    icon: Gift,
  },
}

function getTierConfig(tier?: string) {
  if (!tier) return tierConfig.default
  const lowerTier = tier.toLowerCase()
  if (lowerTier.includes('1st') || lowerTier.includes('first') || lowerTier.includes('প্রথম')) {
    return tierConfig['1st']
  }
  if (lowerTier.includes('2nd') || lowerTier.includes('second') || lowerTier.includes('দ্বিতীয়')) {
    return tierConfig['2nd']
  }
  if (lowerTier.includes('3rd') || lowerTier.includes('third') || lowerTier.includes('তৃতীয়')) {
    return tierConfig['3rd']
  }
  if (lowerTier.includes('runner') || lowerTier.includes('রানার')) {
    return tierConfig['runner-up']
  }
  if (lowerTier.includes('participation') || lowerTier.includes('অংশগ্রহণ')) {
    return tierConfig['participation']
  }
  return tierConfig.default
}

export function RewardsDisplay({
  rewards,
  compact = false,
  showAll = false,
  variant = 'card',
  className = '',
}: RewardsDisplayProps) {
  if (!rewards || rewards.length === 0) {
    return null
  }

  const displayRewards = showAll ? rewards : rewards.slice(0, 3)
  const hasMore = rewards.length > 3 && !showAll

  // Badges variant (for compact display)
  if (variant === 'badges') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {displayRewards.map((reward, index) => {
          const config = getTierConfig(reward.tier)
          const Icon = config.icon

          return (
            <Badge
              key={index}
              variant="outline"
              className={`${config.bg} ${config.border} ${config.text} border flex items-center gap-1.5 px-3 py-1`}
            >
              <Icon className="w-3 h-3" />
              <span className="font-semibold">{reward.name}</span>
              {reward.value && (
                <span className="ml-1 text-xs opacity-80">({reward.value})</span>
              )}
            </Badge>
          )
        })}
        {hasMore && (
          <Badge variant="outline" className="border-white/20 text-neutral-400">
            +{rewards.length - 3} আরও
          </Badge>
        )}
      </div>
    )
  }

  // List variant
  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {displayRewards.map((reward, index) => {
          const config = getTierConfig(reward.tier)
          const Icon = config.icon

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${config.border} ${config.bg} group hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color} shadow-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold text-sm ${config.text}`}>{reward.name}</p>
                  {reward.tier && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
                      {reward.tier}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1">{reward.description}</p>
              </div>
              {reward.value && (
                <div className={`text-sm font-bold ${config.text}`}>
                  {reward.value}
                </div>
              )}
            </div>
          )
        })}
        {hasMore && (
          <div className="text-center py-2">
            <span className="text-sm text-neutral-500">
              +{rewards.length - 3} আরও পুরস্কার
            </span>
          </div>
        )}
      </div>
    )
  }

  // Card variant (default)
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-pink-500/10 via-rose-600/5 to-violet-500/10 backdrop-blur-xl border border-pink-500/20 ${className}`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-pink-500/20 via-rose-600/15 to-violet-500/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2" />

      <CardContent className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/25">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">পুরস্কার ও প্রাইজ</h3>
            <p className="text-sm text-neutral-400">এই ক্যাম্পেইনে জেতার সুযোগ</p>
          </div>
          {rewards.length > 3 && !showAll && (
            <Badge variant="outline" className="ml-auto bg-pink-500/20 text-pink-400 border-pink-500/30">
              {rewards.length}টি পুরস্কার
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {displayRewards.map((reward, index) => {
            const config = getTierConfig(reward.tier)
            const Icon = config.icon

            return (
              <div
                key={index}
                className={`group relative p-4 rounded-xl border ${config.border} ${config.bg} hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative flex items-start gap-4">
                  {/* Icon or Image */}
                  {reward.imageUrl ? (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-white/10">
                      <img
                        src={reward.imageUrl}
                        alt={reward.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${config.color} shadow-lg`}>
                      {reward.icon ? (
                        <span className="text-2xl">{reward.icon}</span>
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold text-base ${config.text}`}>{reward.name}</h4>
                          {reward.tier && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border} font-semibold`}>
                              {reward.tier}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-300 line-clamp-2">{reward.description}</p>
                      </div>
                      {reward.value && (
                        <div className={`flex-shrink-0 text-lg font-black bg-gradient-to-br ${config.color} bg-clip-text text-transparent`}>
                          {reward.value}
                        </div>
                      )}
                    </div>

                    {/* Quantity indicator */}
                    {reward.quantity && reward.quantity > 1 && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <span className="font-semibold">{reward.quantity}</span>
                        <span>জন বিজয়ীর জন্য</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {hasMore && (
            <div className="text-center pt-4 border-t border-white/10">
              <span className="text-sm text-neutral-400">
                আরও <span className="font-bold text-pink-300">{rewards.length - 3}</span>টি পুরস্কার রয়েছে...
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
