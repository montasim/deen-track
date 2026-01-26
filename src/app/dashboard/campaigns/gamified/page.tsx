'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { CampaignCard } from '@/components/gamified-campaigns'
import { Target, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getActiveGamifiedCampaigns, updateGamifiedCampaign } from '../../gamified-campaigns/actions'
import { CampaignMutateDrawer } from './components/campaign-mutate-drawer'
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
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCampaign, setEditingCampaign] = useState<any>(undefined)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard/campaigns/templates')
    }
  }, [user, router])

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const result = await getActiveGamifiedCampaigns()
        setCampaigns(result)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

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
        value: campaigns.filter((c) => c.isActive).length.toString(),
        description: 'Currently active',
        icon: Target,
      },
      {
        title: 'Total Campaigns',
        value: campaigns.length.toString(),
        description: 'All campaigns',
        icon: Target,
      },
      {
        title: 'Total Tasks',
        value: campaigns.reduce((sum, c) => sum + (c.tasks?.length || 0), 0).toString(),
        description: 'Across all campaigns',
        icon: Target,
      },
      {
        title: 'Total Participants',
        value: campaigns.reduce((sum, c) => sum + (c._count?.participations || 0), 0).toString(),
        description: 'Across all campaigns',
        icon: Target,
      },
    ]
  }, [campaigns])

  return (
    <>
    <DashboardPage
      icon={Target}
      title="Manage Campaigns"
      description="Manage gamified campaigns for users to participate in"
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
          description="There are no campaigns yet. Create one from a template!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => handleEditCampaign(campaign)}
            />
          ))}
        </div>
      )}
    </DashboardPage>

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
