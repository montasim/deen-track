'use client'

import { useState, useEffect, useMemo } from 'react'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { CampaignCard } from '@/components/gamified-campaigns'
import { Target, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getActiveGamifiedCampaigns, joinCampaign, updateGamifiedCampaign, debugListAllCampaigns } from '../../gamified-campaigns/actions'
import { CampaignMutateDrawer } from './components/campaign-mutate-drawer'
import { CampaignDetailDialog } from './components/campaign-detail-dialog'
import { useAuth } from '@/context/auth-context'
import { toast } from '@/hooks/use-toast'

interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  isActive: boolean
  imageUrl?: string
  directImageUrl?: string
  maxParticipants?: number
  rules?: string
  disqualificationRules?: string
  tasks?: any[]
  _count?: { participations: number }
}

export default function GamifiedCampaignsPage() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<Record<string, any>>({})
  const [editingCampaign, setEditingCampaign] = useState<any>(undefined)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailCampaign, setDetailCampaign] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const result = await getActiveGamifiedCampaigns()
        setCampaigns(result)

        const progressMap: Record<string, any> = {}
        result.forEach((campaign: CampaignWithProgress) => {
          const userProg = campaign.participations?.find((p: any) => p.userId === user?.id)
          if (userProg) {
            progressMap[campaign.id] = userProg
          }
        })
        setUserProgress(progressMap)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [user?.id])

  const handleJoinCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    if (campaign) {
      setDetailCampaign(campaign)
      setDetailOpen(true)
    }
  }

  const handleConfirmJoin = async (campaignId: string) => {
    try {
      const result = await joinCampaign(campaignId)

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'You have joined the campaign.',
        })

        const refreshed = await getActiveGamifiedCampaigns()
        setCampaigns(refreshed)
        setDetailOpen(false)

        setUserProgress(prev => ({
          ...prev,
          [campaignId]: { status: 'JOINED' }
        }))
      } else {
        toast({
          variant: 'destructive',
          title: 'Cannot join campaign',
          description: result.message || 'Failed to join campaign',
        })
      }
    } catch (error: any) {
      console.error('Error joining campaign:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to join campaign',
      })
    }
  }

  const handleEditCampaign = (campaign: any) => {
    setEditingCampaign(campaign)
    setDrawerOpen(true)
  }

  const handleUpdateCampaign = async (data: any) => {
    return await updateGamifiedCampaign(editingCampaign.id, data)
  }

  const summaryItems = useMemo(() => {
    return [
      {
        title: 'Active Campaigns',
        value: campaigns.filter((c) => c.isActive && new Date(c.endDate) >= new Date()).length.toString(),
        description: 'Currently running',
        icon: Target,
      },
      {
        title: 'Total Campaigns',
        value: campaigns.length.toString(),
        description: 'All available campaigns',
        icon: Target,
      },
      {
        title: 'Total Tasks',
        value: campaigns.reduce((sum, c) => sum + (c.tasks?.length || 0), 0).toString(),
        description: 'Across all campaigns',
        icon: Target,
      },
      {
        title: 'Your Progress',
        value: Object.values(userProgress).filter((p) => p.status !== 'JOINED').length.toString(),
        description: 'Campaigns you\'re participating in',
        icon: Target,
      },
    ]
  }, [campaigns, userProgress])

  return (
    <>
    <DashboardPage
      icon={Target}
      title="Campaigns"
      description="Join campaigns, complete tasks, and earn rewards!"
      actions={[
        {
          label: 'Refresh',
          icon: RefreshCw,
          onClick: async () => {
            setLoading(true)
            const result = await getActiveGamifiedCampaigns()
            setCampaigns(result)
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

      {/* Campaigns Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyStateCard
          icon={Target}
          title="No campaigns available"
          description="There are no active campaigns at the moment. Check back later for new opportunities!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              userProgress={userProgress[campaign.id]}
              onJoin={handleJoinCampaign}
              onEdit={() => handleEditCampaign(campaign)}
            />
          ))}
        </div>
      )}
    </DashboardPage>

      <CampaignDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        campaign={detailCampaign}
        onJoin={handleConfirmJoin}
        userProgress={detailCampaign ? userProgress[detailCampaign.id] : undefined}
      />

      <CampaignMutateDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open)
          if (!open) setEditingCampaign(undefined)
        }}
        campaign={editingCampaign}
        onSubmit={handleUpdateCampaign}
        onSuccess={async () => {
          const result = await getActiveGamifiedCampaigns()
          setCampaigns(result)
        }}
      />
    </>
  )
}
