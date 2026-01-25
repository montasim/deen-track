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
      {/* Header */}
      <div className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
              <Trophy className="w-3 h-3 mr-2" />
              Active Campaigns
            </Badge>
            <h1 className="text-4xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Discover Your Next
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Challenge
              </span>
            </h1>
            <p className="text-lg text-neutral-400">
              Browse through our active campaigns and start earning rewards today
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-12 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                type="text"
                placeholder="Search campaigns..."
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
                    ${
                      selectedDifficulty === difficulty
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-neutral-900/60 border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                    }
                  `}
                >
                  {difficulty === 'ALL' ? 'All Levels' : difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center text-sm text-neutral-500">
              {loading ? (
                'Loading campaigns...'
              ) : (
                <>
                  Showing {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
                  {!searchQuery && selectedDifficulty === 'ALL' && ` available`}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="container mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-neutral-900/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-neutral-900/60 border border-white/10 mb-6">
              <Trophy className="w-12 h-12 text-neutral-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No campaigns found</h3>
            <p className="text-neutral-400 mb-8">
              {searchQuery || selectedDifficulty !== 'ALL'
                ? 'Try adjusting your filters to see more results'
                : 'Check back later for new exciting campaigns!'}
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
                Clear Filters
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
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} shadow-lg`}>
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                      <Badge className={`${config.bg} ${config.text} ${config.border} border`}>
                        {campaign.difficulty}
                      </Badge>
                    </div>

                    {/* Campaign Info */}
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                      {campaign.name}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-6 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Campaign Stats */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Users className="w-4 h-4" />
                          <span>{campaign._count?.participations || campaign.participations?.length || 0} participants</span>
                        </div>
                        {campaign.estimatedDuration && (
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.estimatedDuration}h</span>
                          </div>
                        )}
                      </div>

                      {campaign.tasks && campaign.tasks.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="text-neutral-400">
                            {campaign.tasks.length} {campaign.tasks.length === 1 ? 'task' : 'tasks'} available
                          </span>
                        </div>
                      )}

                      {campaign.minPointsToQualify && campaign.minPointsToQualify > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-neutral-400">
                            {campaign.minPointsToQualify} min points to qualify
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
                      >
                        <Link href={`/campaigns/${campaign.id}`} className="gap-2">
                          View Details
                          <ArrowRight className="w-4 h-4" />
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

      {/* CTA Section */}
      <div className="border-t border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="inline-flex p-4 rounded-full bg-neutral-900/60 border border-white/10 mb-6">
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to start earning?
          </h2>
          <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users competing in exciting campaigns and earning amazing rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
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
              className="border-white/20 text-white hover:bg-white/5"
            >
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
