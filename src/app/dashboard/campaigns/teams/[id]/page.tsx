'use client'

import { useState, useEffect, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { getTeamById } from '../../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users, Trophy, Shield, Target } from 'lucide-react'
import Link from 'next/link'

export default function TeamDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [team, setTeam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId] = useState('current-user') // TODO: Get from auth

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true)
      try {
        const teamData = await getTeamById(params.id)
        if (!teamData) {
          notFound()
        }
        setTeam(teamData)
      } catch (error) {
        console.error('Error fetching team:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [params.id])

  const summaryItems = useMemo(() => {
    if (!team) return []

    const totalPoints = team.campaignProgress?.reduce(
      (sum: number, cp: any) => sum + (cp.totalPoints || 0),
      0
    ) || 0
    const completedCampaigns = team.campaignProgress?.filter(
      (cp: any) => cp.status === 'COMPLETED'
    ).length || 0

    return [
      {
        title: 'Members',
        value: team.members?.length?.toString() || '0',
        description: team.maxMembers ? `/ ${team.maxMembers} max` : 'No limit',
        icon: Users,
      },
      {
        title: 'Total Points',
        value: totalPoints.toString(),
        description: 'Team achievement',
        icon: Trophy,
      },
      {
        title: 'Campaigns',
        value: (team.campaignProgress?.length || 0).toString(),
        description: `${completedCampaigns} completed`,
        icon: Target,
      },
      {
        title: 'Status',
        value: team.status || 'UNKNOWN',
        description: 'Team status',
        icon: Shield,
      },
    ]
  }, [team])

  if (loading) {
    return (
      <DashboardPage
        icon={Users}
        title="Team Details"
        description="Loading team information..."
        actions={[
          {
            label: 'Back',
            icon: () => <span>←</span>,
            href: '/dashboard/campaigns/teams',
            variant: 'outline',
          },
        ]}
      >
        <DashboardSummarySkeleton count={4} />
        <div className="h-64 animate-pulse bg-muted rounded-lg mt-6" />
      </DashboardPage>
    )
  }

  if (!team) {
    return notFound()
  }

  const isCaptain = team.captainId === currentUserId
  const isMember = team.members?.some((m: any) => m.userId === currentUserId)

  return (
    <DashboardPage
      icon={Users}
      title={team.name}
      description={team.description || 'No description'}
      actions={[
        {
          label: 'Back to Teams',
          icon: () => <span>←</span>,
          href: '/dashboard/campaigns/teams',
          variant: 'outline',
        },
      ]}
    >
      {/* Dashboard Summary */}
      <DashboardSummary summaries={summaryItems} />

      {/* Team Header */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={team.imageUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {team.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {team.name}
                  {isCaptain && (
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      Captain
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                  <Badge className={team.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}>
                    {team.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 mt-6">
        {/* Team Members */}
        <div>
          <h2 className="text-xl font-bold mb-4">Members</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {team.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user.avatar || undefined} />
                        <AvatarFallback>
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === 'CAPTAIN' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <p className="text-sm font-medium">{member.pointsContributed} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Progress */}
        <div>
          <h2 className="text-xl font-bold mb-4">Campaign Progress</h2>
          {!team.campaignProgress || team.campaignProgress.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No campaigns joined yet
                </p>
                {isCaptain && (
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/campaigns/gamified">
                      Join Campaign
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {team.campaignProgress.map((cp: any) => (
                <Card key={cp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cp.campaign.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {cp.campaign.description}
                        </CardDescription>
                      </div>
                      <Badge>{cp.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{cp.totalPoints} points</span>
                      </div>
                      <span className="text-muted-foreground">
                        Joined {new Date(cp.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {cp.completedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Completed {new Date(cp.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions for captain */}
      {isCaptain && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Captain Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Invite Members</Button>
            <Button variant="outline">Edit Team</Button>
            <Button variant="destructive">Disband Team</Button>
          </CardContent>
        </Card>
      )}
    </DashboardPage>
  )
}
