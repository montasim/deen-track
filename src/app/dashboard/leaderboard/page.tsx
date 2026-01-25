'use client'

import { useState, useEffect, useMemo } from 'react'
import { getGlobalLeaderboard, getTopPerformers, getUserRank } from '../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { LeaderboardTable, TopPerformersPodium } from '@/components/gamified-campaigns/leaderboard-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target } from 'lucide-react'

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<any>({ leaderboard: [], total: 0, pages: 0 })
  const [topUsers, setTopUsers] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number>(-1)
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<'all' | 'weekly' | 'monthly'>('all')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [data, top] = await Promise.all([
          getGlobalLeaderboard({ timePeriod, limit: 50 }),
          getTopPerformers('user', undefined, 3),
        ])
        setLeaderboardData(data)
        setTopUsers(top)

        const rank = await getUserRank()
        setUserRank(rank)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timePeriod])

  const leaderboardEntries = useMemo(() => {
    return leaderboardData.leaderboard.map((entry: any) => ({
      rank: entry.rank,
      userId: entry.user.id,
      userName: entry.user.name,
      userAvatar: entry.user.avatar,
      totalPoints: entry.totalPoints,
      tasksCompleted: entry.campaignsParticipated,
    }))
  }, [leaderboardData])

  const topPerformers = useMemo(() => {
    return topUsers.map((p: any) => ({
      rank: p.totalPoints > 0 ? 1 : 0,
      userId: p.user.id,
      userName: p.user.name,
      userAvatar: p.user.avatar,
      totalPoints: p.totalPoints,
    }))
  }, [topUsers])

  const summaryItems = useMemo(() => {
    const totalParticipants = leaderboardData.total
    const avgPoints = leaderboardEntries.length > 0
      ? Math.round(leaderboardEntries.reduce((sum: number, e: any) => sum + e.totalPoints, 0) / leaderboardEntries.length)
      : 0

    return [
      {
        title: 'Total Participants',
        value: totalParticipants.toString(),
        description: 'Active users',
        icon: Target,
      },
      {
        title: 'Your Rank',
        value: userRank > 0 ? `#${userRank}` : 'N/A',
        description: 'Current position',
        icon: Trophy,
      },
      {
        title: 'Avg Points',
        value: avgPoints.toString(),
        description: 'Per participant',
        icon: Trophy,
      },
      {
        title: 'Top Score',
        value: leaderboardEntries[0]?.totalPoints?.toString() || '0',
        description: 'Highest points',
        icon: Trophy,
      },
    ]
  }, [leaderboardData, leaderboardEntries, userRank])

  return (
    <DashboardPage
      icon={Trophy}
      title="Leaderboard"
      description="Top performers across all campaigns"
      actions={[]}
    >
      {/* Dashboard Summary */}
      {loading ? (
        <DashboardSummarySkeleton count={4} />
      ) : (
        <DashboardSummary summaries={summaryItems} />
      )}

      {/* Top 3 Podium */}
      {loading ? (
        <div className="h-48 animate-pulse bg-muted rounded-lg" />
      ) : topPerformers.length > 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Leading the pack this season</CardDescription>
          </CardHeader>
          <CardContent>
            <TopPerformersPodium entries={topPerformers} type="user" />
          </CardContent>
        </Card>
      ) : null}

      {/* Time Period Tabs */}
      <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Time</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <LeaderboardTable
              title="All Time Rankings"
              description="Highest total points across all campaigns"
              entries={leaderboardEntries}
              type="user"
              currentUserId="current-user"
            />
          )}
        </TabsContent>

        <TabsContent value="weekly">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <LeaderboardTable
              title="Weekly Rankings"
              description="Top performers this week"
              entries={leaderboardEntries.slice(0, 10)}
              type="user"
              currentUserId="current-user"
            />
          )}
        </TabsContent>

        <TabsContent value="monthly">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <LeaderboardTable
              title="Monthly Rankings"
              description="Top performers this month"
              entries={leaderboardEntries.slice(0, 10)}
              type="user"
              currentUserId="current-user"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Your Rank Card */}
      {loading ? (
        <div className="mt-8 h-32 animate-pulse bg-muted rounded-lg" />
      ) : userRank > 0 ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Position</p>
                <p className="text-3xl font-bold">#{userRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">
                  {leaderboardEntries.find((e: any) => e.userId === 'current-user')?.totalPoints || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </DashboardPage>
  )
}
