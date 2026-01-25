'use client'

import { useState, useEffect, useMemo } from 'react'
import { getUserTeams } from '../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { TeamCard } from '@/components/gamified-campaigns'
import { Button } from '@/components/ui/button'
import { Plus, Users, Trophy } from 'lucide-react'
import { TeamsMutateDrawer } from './components/teams-mutate-drawer'

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      try {
        const teamsData = await getUserTeams()
        setTeams(teamsData)
      } catch (error) {
        console.error('Error fetching teams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const summaryItems = useMemo(() => {
    const totalMembers = teams.reduce((sum, team) => sum + (team.memberCount || 0), 0)
    const activeTeams = teams.filter((t) => t.status === 'ACTIVE').length

    return [
      {
        title: 'My Teams',
        value: teams.length.toString(),
        description: 'Teams you belong to',
        icon: Users,
      },
      {
        title: 'Active Teams',
        value: activeTeams.toString(),
        description: 'Currently active',
        icon: Trophy,
      },
      {
        title: 'Total Members',
        value: totalMembers.toString(),
        description: 'Across all teams',
        icon: Users,
      },
      {
        title: 'Team Captain',
        value: teams.filter((t) => t.captainId).length.toString(),
        description: 'Teams you lead',
        icon: Trophy,
      },
    ]
  }, [teams])

  return (
    <>
      <DashboardPage
        icon={Users}
        title="Teams"
        description="Create or join teams to compete in campaigns together"
        actions={[
          {
            label: 'Create Team',
            icon: Plus,
            onClick: () => setDrawerOpen(true),
            variant: 'default',
          },
          {
            label: 'Browse Teams',
            icon: Users,
            href: '/dashboard/campaigns/teams/browse',
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

        {/* Teams Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <EmptyStateCard
            icon={Users}
            title="No teams yet"
            description="Join or create a team to participate in campaigns together"
            action={{
              label: 'Create Team',
              onClick: () => setDrawerOpen(true),
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team: any) => (
              <TeamCard
                key={team.id}
                team={team}
                isMember={true}
                isCaptain={team.captainId === 'current-user'}
                onView={() => {
                  window.location.href = `/dashboard/campaigns/teams/${team.id}`
                }}
              />
            ))}
          </div>
        )}
      </DashboardPage>

      <TeamsMutateDrawer
        open={drawerOpen}
        onOpenChange={(open) => setDrawerOpen(open)}
        onSuccess={() => {
          // Refresh teams after successful creation
          getUserTeams().then((teamsData) => {
            setTeams(teamsData)
          })
        }}
      />
    </>
  )
}
