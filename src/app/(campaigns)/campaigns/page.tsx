'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Search,
  Trophy,
  Flame,
  Sparkles,
  Users,
  Star,
  ArrowRight,
  Filter,
  Calendar,
  Zap,
} from 'lucide-react'
import { CampaignCard } from '@/components/gamified-campaigns'
import { PageHeader } from '@/components/layout/page-header'
import { CallToAction } from '@/components/marketing/call-to-action'
import { PageBackground } from '@/components/layout/page-background'
import { CampaignCardGridSkeleton } from '@/components/campaigns/campaign-card-skeleton'
import { useAuth } from '@/context/auth-context'

// Difficulty colors
const difficultyConfig = {
  BEGINNER: {
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  INTERMEDIATE: {
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
  },
  ADVANCED: {
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
  },
  EXPERT: {
    color: 'from-red-500 to-orange-600',
    bg: 'bg-red-500/10',
    text: 'text-red-300',
    border: 'border-red-500/30',
  },
}

export default function PublicCampaignsPage() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL')
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/campaigns')
        if (response.ok) {
          const result = await response.json()
          setCampaigns(result)
          setFilteredCampaigns(result)
        } else {
          console.error('Failed to fetch campaigns')
          setCampaigns([])
          setFilteredCampaigns([])
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error)
        setCampaigns([])
        setFilteredCampaigns([])
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  // Filter campaigns based on search and difficulty
  useEffect(() => {
    let filtered = campaigns

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'ALL') {
      filtered = filtered.filter((campaign) => campaign.difficulty === selectedDifficulty)
    }

    setFilteredCampaigns(filtered)
  }, [searchQuery, selectedDifficulty, campaigns])

  const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

  return (
    <>
      <PageBackground />
      {/* Header */}
      <PageHeader
        badgeIcon={Trophy}
        badgeText="চলমান চ্যালেঞ্জ"
        badgeColor="cyan"
        title={
          <>
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              পুরস্কার জিততে
            </span>
            {' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              আজই শুরু করুন!
            </span>
          </>
        }
        description="সহজ চ্যালেঞ্জ করে পয়েন্ট জিনুন, লিডারবোর্ডে আগুয়ে যান - সবই ফ্রি!"
      />

      {/* Search and Filters */}
      <div className="container mx-auto max-w-7xl px-6 -mt-6 mb-8">
        <div className="space-y-6">
          <div className="mt-12 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                type="text"
                placeholder="পছন্দের চ্যালেঞ্জ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 bg-neutral-900/60 backdrop-blur-xl border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-lg"
              />
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-neutral-500" />
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${selectedDifficulty === difficulty
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-neutral-900/60 border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                    }
                  `}
                >
                  {difficulty === 'ALL' ? 'সব লেভেল' :
                    difficulty === 'BEGINNER' ? 'সহজ' :
                      difficulty === 'INTERMEDIATE' ? 'মধ্যম' :
                        difficulty === 'ADVANCED' ? 'উন্নত' :
                          difficulty === 'EXPERT' ? 'কঠিন' :
                            difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center text-sm text-neutral-500">
              {loading ? (
                'চ্যালেঞ্জ লোড হচ্ছে...'
              ) : (
                <>
                  {filteredCampaigns.length} টি চ্যালেঞ্জ পাওয়া গেছে
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="container mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <CampaignCardGridSkeleton count={6} />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-neutral-900/60 border border-white/10 mb-6">
              <Trophy className="w-12 h-12 text-neutral-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">কোনো চ্যালেঞ্জ পাওয়া যায়নি 😔</h3>
            <p className="text-neutral-400 mb-8">
              {searchQuery || selectedDifficulty !== 'ALL'
                ? 'অন্য কিওয়ার্ড দিয়ে চেষ্টা করে দেখুন, না হলে ফিল্টার সরিয়ে সব চ্যালেঞ্জ দেখুন!'
                : 'শীঘ্রই নতুন চ্যালেঞ্জ আসছে - আবার দেখুন! 🎮'}
            </p>
            {(searchQuery || selectedDifficulty !== 'ALL') && (
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedDifficulty('ALL')
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                ফিল্টার সরান
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => {
              const config = difficultyConfig[campaign.difficulty as keyof typeof difficultyConfig] || difficultyConfig.INTERMEDIATE

              return (
                <Card
                  key={campaign.id}
                  className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <CardContent className="relative p-6">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} shadow-lg`}>
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${config.bg} ${config.text} ${config.border} border text-xs`}>
                        {campaign.difficulty === 'BEGINNER' ? 'সহজ' :
                          campaign.difficulty === 'INTERMEDIATE' ? 'মধ্যম' :
                            campaign.difficulty === 'ADVANCED' ? 'উন্নত' :
                              campaign.difficulty === 'EXPERT' ? 'কঠিন' :
                                campaign.difficulty}
                      </Badge>
                    </div>

                    {/* Campaign Info */}
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {campaign.name}
                    </h3>
                    <p className="text-neutral-400 text-xs mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Campaign Stats */}
                    <div className="space-y-3 mb-4">
                      {/* Date Range */}
                      {campaign.startDate && campaign.endDate && (
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(campaign.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                            {' — '}
                            {new Date(campaign.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>{campaign._count?.participations || campaign.participations?.length || 0} জন</span>
                        </div>

                        {/* Calculate Total Points */}
                        {campaign.tasks && campaign.tasks.length > 0 && (
                          <div className="flex items-center gap-1.5 text-neutral-400">
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                            <span>
                              {campaign.tasks.reduce((sum: number, ct: any) => {
                                const taskPoints = ct.points || ct.task?.points || ct.task?.achievements?.reduce((s: number, a: any) => s + (a.points || 0), 0) || 0
                                return sum + taskPoints
                              }, 0)} পয়েন্ট
                            </span>
                          </div>
                        )}

                        {campaign.estimatedDuration && (
                          <div className="flex items-center gap-1.5 text-neutral-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{campaign.estimatedDuration}ঘণ্টা</span>
                          </div>
                        )}
                      </div>

                      {campaign.minPointsToQualify && campaign.minPointsToQualify > 0 && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-neutral-400">
                            যোগ্যতার জন্য {campaign.minPointsToQualify}+ পয়েন্ট
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Task Names List */}
                    {campaign.tasks && campaign.tasks.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-neutral-900/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-medium text-neutral-300">
                            {campaign.tasks.length} টি চ্যালেঞ্জ
                          </span>
                        </div>
                        <div className="space-y-1">
                          {campaign.tasks.slice(0, 4).map((ct: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <span className="text-neutral-600 flex-shrink-0">{idx + 1}.</span>
                              <span className="text-neutral-400 line-clamp-1">
                                {ct.task?.name || `Task ${idx + 1}`}
                              </span>
                            </div>
                          ))}
                          {campaign.tasks.length > 4 && (
                            <div className="text-xs text-neutral-500 mt-1">
                              +{campaign.tasks.length - 4} আরও চ্যালেঞ্জ...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 h-9"
                      >
                        <Link href={`/campaigns/${campaign.id}`} className="gap-2">
                          চ্যালেঞ্জ দেখুন
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA Section - Only show for non-logged-in users */}
      {!user && (
        <CallToAction
        icon={Zap}
        title="এখনই শুরু করুন, পুরস্কার জিনুন!"
        description="হাজার খেলোয়াড়ের সাথে জয়োগ দিন, মজার চ্যালেঞ্জ করুন, পয়েন্ট জিনুন - সবই ফ্রি!"
        primaryButtonHref="/sign-up"
        primaryButtonText="ফ্রিয়ে জয়োগ দিন"
        primaryButtonIcon={ArrowRight}
        secondaryButtonHref="/leaderboard"
        secondaryButtonText="লিডারবোর্ড দেখুন"
      />
      )}
    </>
  )
}
