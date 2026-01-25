'use client'

import { useState, useEffect, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { getCampaignLeaderboard, getTeamLeaderboard, getTopPerformers, getGamifiedCampaign } from '../../../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { LeaderboardTable, TopPerformersPodium } from '@/components/gamified-campaigns/leaderboard-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, ArrowLeft, Target, Users } from 'lucide-react'
import Link from 'next/link'

export default function CampaignLeaderboardPage({
  params,
}: {
  params: { id: string }
}) {
  const [campaign, setCampaign] = useState<any>(null)
  const [userLeaderboard, setUserLeaderboard] = useState<any>({ leaderboard: [], total: 0, pages: 0 })
  const [teamLeaderboard, setTeamLeaderboard] = useState<any>({ leaderboard: [], total: 0, pages: 0 })
  const [topUsers, setTopUsers] = useState<any[]>([])
  const [topTeams, setTopTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId] = useState('current-user') // TODO: Get from auth

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [campaignData, userData, teamData, users, teams] = await Promise.all([
          getGamifiedCampaign(params.id),
          getCampaignLeaderboard(params.id, { limit: 50 }),
          getTeamLeaderboard(params.id, { limit: 20 }),
          getTopPerformers('user', params.id, 3),
          getTopPerformers('team', params.id, 3),
        ])

        if (!campaignData) {
          notFound()
        }

        setCampaign(campaignData)
        setUserLeaderboard(userData)
        setTeamLeaderboard(teamData)
        setTopUsers(users)
        setTopTeams(teams)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const summaryItems = useMemo(() => {
    if (!campaign || loading) return []

    const userEntries = userLeaderboard.leaderboard || []
    const userRank = userEntries.find((e: any) => e.userId === currentUserId)?.rank
    const teamCount = teamLeaderboard.leaderboard?.length || 0

    return [
      {
        title: 'Participants',
        value: (campaign.participations?.length || 0).toString(),
        description: 'People joined',
        icon: Users,
      },
      {
        title: 'Your Rank',
        value: userRank ? `#${userRank}` : 'N/A',
        description: 'Your position',
        icon: Trophy,
      },
      {
        title: 'Teams',
        value: teamCount.toString(),
        description: 'Teams competing',
        icon: Users,
      },
      {
        title: 'Total Points',
        value: userEntries[0]?.totalPoints?.toString() || '0',
        description: 'Top score',
        icon: Trophy,
      },
    ]
  }, [campaign, userLeaderboard, teamLeaderboard, loading, currentUserId])

  const userEntries = useMemo(() => {
    return (userLeaderboard.leaderboard || []).map((entry: any) => ({
      rank: entry.rank,
      userId: entry.userId,
      userName: entry.userName,
      userAvatar: entry.userAvatar,
      totalPoints: entry.totalPoints,
      tasksCompleted: entry.tasksCompleted,
    }))
  }, [userLeaderboard])

  const teamEntries = useMemo(() => {
    return (teamLeaderboard.leaderboard || []).map((entry: any) => ({
      rank: entry.rank,
      teamId: entry.teamId,
      teamName: entry.teamName,
      teamDescription: entry.teamDescription,
      teamImage: entry.teamImage,
      memberCount: entry.memberCount,
      members: entry.members,
      totalPoints: entry.totalPoints,
    }))
  }, [teamLeaderboard])

  const topUserPerformers = useMemo(() => {
    return topUsers.map((p: any) => ({
      rank: p.totalPoints > 0 ? 1 : 0,
      userId: p.user.id,
      userName: p.user.name,
      userAvatar: p.user.avatar,
      totalPoints: p.totalPoints,
    }))
  }, [topUsers])

  const topTeamPerformers = useMemo(() => {
    return topTeams.map((p: any) => ({
      rank: p.totalPoints > 0 ? 1 : 0,
      teamId: p.team.id,
      teamName: p.team.name,
      totalPoints: p.totalPoints,
    }))
  }, [topTeams])

  const userRank = userEntries.find((e: any) => e.userId === currentUserId)?.rank
  const hasParticipated = !!userRank

  if (loading) {
    return (
      <DashboardPage
        icon={Trophy}
        title="Campaign Leaderboard"
        description="Loading leaderboard..."
        actions={[
          {
            label: 'Back',
            icon: ArrowLeft,
            href: `/dashboard/campaigns/gamified/${params.id}`,
            variant: 'outline',
          },
        ]}
      >
        <DashboardSummarySkeleton count={4} />
        <div className="h-64 animate-pulse bg-muted rounded-lg mt-6" />
      </DashboardPage>
    )
  }

  if (!campaign) {
    return notFound()
  }

  return (
    <DashboardPage
      icon={Trophy}
      title={`${campaign.name} - Leaderboard`}
      description="See how you rank against other participants"
      actions={[
        {
          label: 'Back to Campaign',
          icon: ArrowLeft,
          href: `/dashboard/campaigns/gamified/${params.id}`,
          variant: 'outline',
        },
      ]}
    >
      {/* Dashboard Summary */}
      <DashboardSummary summaries={summaryItems} />

      {!hasParticipated && (
        <Card className="mt-6">
          <CardContent className="py-8">
            <p className="text-center">
              Join this campaign to see your name on the leaderboard!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium - Users */}
      {topUserPerformers.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Top Participants</h2>
            <TopPerformersPodium entries={topUserPerformers} type="user" />
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="individual" className="mt-6">
        <TabsList>
          <TabsTrigger value="individual">Individual Rankings</TabsTrigger>
          <TabsTrigger value="team">Team Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : (
            <LeaderboardTable
              title="Individual Rankings"
              description="Top performers in this campaign"
              entries={userEntries}
              type="user"
              currentUserId={currentUserId}
            />
          )}
        </TabsContent>

        <TabsContent value="team">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : teamEntries.length > 0 ? (
            <>
              {/* Top 3 Podium - Teams */}
              {topTeamPerformers.length > 0 && (
                <div className="mb-6">
                  <TopPerformersPodium entries={topTeamPerformers} type="team" />
                </div>
              )}
              <LeaderboardTable
                title="Team Rankings"
                description="Top performing teams in this campaign"
                entries={teamEntries}
                type="team"
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No teams have joined this campaign yet
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Your Rank in Campaign */}
      {hasParticipated && (
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Campaign Rank</h3>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-4xl font-bold">#{userRank}</p>
                    <p className="text-sm text-muted-foreground">Position</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">
                      {userEntries.find((e: any) => e.userId === currentUserId)?.totalPoints || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">
                      {userEntries.find((e: any) => e.userId === currentUserId)?.tasksCompleted || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress to next rank */}
          {userRank && userRank > 1 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Progress to Rank #{userRank - 1}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Points</span>
                    <span>{userEntries.find((e: any) => e.userId === currentUserId)?.totalPoints || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Rank Points</span>
                    <span>{userEntries[userRank - 2]?.totalPoints || 0}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((userEntries.find((e: any) => e.userId === currentUserId)?.totalPoints || 0) /
                            (userEntries[userRank - 2]?.totalPoints || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {((userEntries[userRank - 2]?.totalPoints || 0) -
                      (userEntries.find((e: any) => e.userId === currentUserId)?.totalPoints || 0))}{' '}
                    points needed
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </DashboardPage>
  )
}
