'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Eye,
  RefreshCw,
  Filter,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getGlobalLeaderboard, getCampaignLeaderboard } from '../../dashboard/gamified-campaigns/actions'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all')
  const [campaignFilter, setCampaignFilter] = useState<string>('all')
  const [allCampaigns, setAllCampaigns] = useState<any[]>([])

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard/campaigns/gamified')
    }
  }, [user, router])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch campaigns for the filter dropdown
        const { getAllGamifiedCampaigns } = await import('../../dashboard/gamified-campaigns/actions')
        const campaigns = await getAllGamifiedCampaigns()
        setAllCampaigns(campaigns)

        // Fetch leaderboard data
        const data = await getGlobalLeaderboard({ limit: 100 })
        setLeaderboard(data.leaderboard)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePeriodChange = async (newPeriod: 'all' | 'weekly' | 'monthly') => {
    setPeriod(newPeriod)
    setLoading(true)
    try {
      const data = await getGlobalLeaderboard({ limit: 100, timePeriod: newPeriod })
      setLeaderboard(data.leaderboard)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignChange = async (campaignId: string) => {
    setCampaignFilter(campaignId)
    setLoading(true)
    try {
      if (campaignId === 'all') {
        const data = await getGlobalLeaderboard({ limit: 100 })
        setLeaderboard(data.leaderboard)
      } else {
        const data = await getCampaignLeaderboard(campaignId, { limit: 100 })
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Error fetching campaign leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const summaryItems = [
    {
      title: 'Total Users',
      value: leaderboard.length.toString(),
      description: 'On leaderboard',
      icon: Users,
    },
    {
      title: 'Top Score',
      value: leaderboard.length > 0 ? leaderboard[0].totalPoints.toLocaleString() : '0',
      description: 'Highest points',
      icon: Trophy,
    },
    {
      title: 'Active Campaigns',
      value: allCampaigns.filter((c) => c.isActive).length.toString(),
      description: 'Currently running',
      icon: Target,
    },
    {
      title: 'Total Points',
      value: leaderboard.reduce((sum, user) => sum + (user.totalPoints || 0), 0).toLocaleString(),
      description: 'All time earned',
      icon: Flame,
    },
  ]

  const getRankConfig = (rank: number) => {
    if (rank === 1) {
      return {
        icon: Crown,
        color: 'text-cyan-400',
        bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        cardBg: 'from-cyan-500/20 via-blue-600/10 to-violet-500/20',
        border: 'border-cyan-500/30',
        size: 'w-16 h-16',
      }
    }
    if (rank === 2) {
      return {
        icon: Medal,
        color: 'text-violet-300',
        bg: 'bg-gradient-to-br from-violet-500 to-purple-600',
        cardBg: 'from-violet-500/20 via-purple-600/10 to-pink-500/20',
        border: 'border-violet-500/30',
        size: 'w-12 h-12',
      }
    }
    if (rank === 3) {
      return {
        icon: Medal,
        color: 'text-blue-400',
        bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        cardBg: 'from-blue-500/20 via-cyan-600/10 to-teal-500/20',
        border: 'border-blue-500/30',
        size: 'w-12 h-12',
      }
    }
    return null
  }

  return (
    <DashboardPage
      icon={Trophy}
      title="Leaderboard"
      description="View top performers and user rankings"
      actions={[
        {
          label: 'Refresh',
          icon: RefreshCw,
          onClick: async () => {
            setLoading(true)
            const data = await getGlobalLeaderboard({ limit: 100 })
            setLeaderboard(data.leaderboard)
            setLoading(false)
          },
          variant: 'outline',
        },
      ]}
    >
      {/* Dashboard Summary */}
      {loading ? (
        <DashboardSummarySkeleton count={4} />
      ) : (
        <DashboardSummary summaries={summaryItems} />
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Period:</span>
        </div>
        <Select value={period} onValueChange={(value: any) => handlePeriodChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-muted-foreground">Campaign:</span>
        </div>
        <Select value={campaignFilter} onValueChange={(value: string) => handleCampaignChange(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {allCampaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <EmptyStateCard
          icon={Trophy}
          title="No leaderboard data"
          description="No users have earned points yet."
        />
      ) : (
        <div className="mt-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 items-end mb-8">
            {leaderboard.slice(0, 3).map((user, index) => {
              const config = getRankConfig(index + 1)
              const Icon = config?.icon || Trophy

              return (
                <Card
                  key={user.userId}
                  className={`
                    relative bg-gradient-to-br ${config?.cardBg || 'from-neutral-800/50 to-neutral-900/50'} backdrop-blur-xl border border-white/10
                    transition-all duration-500 hover:scale-105
                    ${index === 0 ? 'md:-mt-8 order-2 md:order-2' : index === 1 ? 'order-1 md:order-1' : 'order-3 md:order-3'}
                  `}
                >
                  <CardContent className="p-6 text-center">
                    {/* Icon */}
                    {config && (
                      <div
                        className={`inline-flex p-3 rounded-full mb-4 ${config.bg} shadow-lg ${config.size}`}
                      >
                        <Icon className={`w-8 h-8 text-white`} />
                      </div>
                    )}

                    {/* Rank */}
                    <div className={`text-3xl font-black mb-2 ${config?.color || 'text-neutral-400'}`}>
                      #{index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto mb-3 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                      {user.user?.name?.[0] || '?'}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-white mb-2 truncate">{user.user?.name || 'Unknown'}</h3>

                    {/* Points */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white text-lg">
                        {user.totalPoints?.toLocaleString() || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href={`/dashboard/admin/users/${user.userId}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Rest of Leaderboard */}
          <div className="space-y-2">
            {leaderboard.slice(3).map((user, index) => {
              const rank = index + 4

              return (
                <Card
                  key={user.userId}
                  className="group bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center font-bold text-white text-sm border border-white/10">
                        {rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                        {user.user?.name?.[0] || '?'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {user.user?.name || 'Unknown'}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          {user.totalPoints?.toLocaleString() || 0} points
                        </p>
                      </div>

                      {/* Points */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white">
                          {user.totalPoints?.toLocaleString() || 0}
                        </span>
                      </div>

                      {/* Action */}
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/dashboard/admin/users/${user.userId}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </DashboardPage>
  )
}
