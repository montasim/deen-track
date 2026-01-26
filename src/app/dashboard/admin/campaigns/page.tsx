'use client'

import { useState, useEffect } from 'react'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, RefreshCw, Edit2, Users, Calendar, Clock, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'
import { getAllGamifiedCampaigns, toggleCampaignActive } from '../../gamified-campaigns/actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const result = await getAllGamifiedCampaigns()
        setCampaigns(result)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const handleToggleActive = async (campaignId: string) => {
    try {
      const result = await toggleCampaignActive(campaignId)

      if (result.success) {
        toast({
          title: 'Campaign updated',
          description: `Campaign has been ${result.campaign.isActive ? 'activated' : 'deactivated'}.`,
        })

        const refreshed = await getAllGamifiedCampaigns()
        setCampaigns(refreshed)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update campaign',
        })
      }
    } catch (error: any) {
      console.error('Error toggling campaign:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update campaign',
      })
    }
  }

  const summaryItems = [
    {
      title: 'Total Campaigns',
      value: campaigns.length.toString(),
      description: 'All campaigns',
      icon: Target,
    },
    {
      title: 'Active Campaigns',
      value: campaigns.filter((c) => c.isActive).length.toString(),
      description: 'Currently running',
      icon: CheckCircle,
    },
    {
      title: 'Inactive Campaigns',
      value: campaigns.filter((c) => !c.isActive).length.toString(),
      description: 'Not active',
      icon: XCircle,
    },
    {
      title: 'Total Participants',
      value: campaigns.reduce((sum, c) => sum + (c._count?.participations || 0), 0).toString(),
      description: 'Across all campaigns',
      icon: Users,
    },
  ]

  const getStatusBadge = (campaign: any) => {
    const now = new Date()
    const startDate = new Date(campaign.startDate)
    const endDate = new Date(campaign.endDate)

    if (!campaign.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }

    if (now < startDate) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (now > endDate) {
      return <Badge variant="secondary">Ended</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  return (
    <DashboardPage
      icon={Target}
      title="All Campaigns"
      description="Manage all gamified campaigns"
      actions={[
        {
          label: 'Refresh',
          icon: RefreshCw,
          onClick: async () => {
            setLoading(true)
            const result = await getAllGamifiedCampaigns()
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

      {/* Campaigns List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyStateCard
          icon={Target}
          title="No campaigns found"
          description="There are no campaigns yet. Create one from a template to get started!"
        />
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{campaign.name}</CardTitle>
                      {getStatusBadge(campaign)}
                    </div>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/campaigns/gamified/${campaign.id}`}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(campaign.id)}
                      >
                        {campaign.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Participants:</span>
                    <span className="font-medium">{campaign._count?.participations || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-medium">{campaign._count?.tasks || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPage>
  )
}
