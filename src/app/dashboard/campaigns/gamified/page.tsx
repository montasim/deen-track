'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Plus, RefreshCw, Edit2, Trash2, CheckCircle2, XCircle, Users, Calendar, Clock, Eye, Filter } from 'lucide-react'
import { getActiveGamifiedCampaigns, getAllGamifiedCampaigns, updateGamifiedCampaign, toggleCampaignActive, deleteGamifiedCampaign } from '../../gamified-campaigns/actions'
import { CampaignMutateDrawer } from './components/campaign-mutate-drawer'
import { useAuth } from '@/context/auth-context'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type FilterType = 'all' | 'active' | 'inactive' | 'ended'

export default function GamifiedCampaignsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [allCampaigns, setAllCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCampaign, setEditingCampaign] = useState<any>(undefined)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard/admin/campaign-templates')
    }
  }, [user, router])

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      try {
        const result = await getAllGamifiedCampaigns()
        setAllCampaigns(result)
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

  const handleToggleActive = async (campaignId: string) => {
    try {
      const result = await toggleCampaignActive(campaignId)
      if (result.success && result.campaign) {
        toast({
          title: 'Campaign updated',
          description: `Campaign has been ${result.campaign.isActive ? 'activated' : 'deactivated'}.`,
        })
        const refreshed = await getAllGamifiedCampaigns()
        setAllCampaigns(refreshed)
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

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return
    }

    try {
      const result = await deleteGamifiedCampaign(campaignId)
      if (result.success) {
        toast({
          title: 'Campaign deleted',
          description: 'Campaign has been deleted successfully.',
        })
        const refreshed = await getAllGamifiedCampaigns()
        setAllCampaigns(refreshed)
      }
    } catch (error: any) {
      console.error('Error deleting campaign:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete campaign',
      })
    }
  }

  const getStatusBadge = (campaign: any) => {
    const now = new Date()
    const endDate = new Date(campaign.endDate)
    endDate.setHours(23, 59, 59, 999)
    const startDate = new Date(campaign.startDate)
    startDate.setHours(0, 0, 0, 0)

    if (!campaign.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }

    if (now < startDate) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (now > endDate) {
      return <Badge variant="secondary">Ended</Badge>
    } else {
      return <Badge className="bg-green-500">Active</Badge>
    }
  }

  // Filter campaigns based on selected filter
  const filteredCampaigns = useMemo(() => {
    const now = new Date()

    return allCampaigns.filter((campaign) => {
      if (filter === 'all') return true

      if (filter === 'active') {
        const endDate = new Date(campaign.endDate)
        endDate.setHours(23, 59, 59, 999)
        const startDate = new Date(campaign.startDate)
        startDate.setHours(0, 0, 0, 0)
        return campaign.isActive && now >= startDate && now <= endDate
      }

      if (filter === 'inactive') {
        return !campaign.isActive
      }

      if (filter === 'ended') {
        const endDate = new Date(campaign.endDate)
        endDate.setHours(23, 59, 59, 999)
        return now > endDate
      }

      return true
    })
  }, [allCampaigns, filter])

  const summaryItems = useMemo(() => {
    const now = new Date()
    const activeCampaigns = allCampaigns.filter((c) => {
      const endDate = new Date(c.endDate)
      endDate.setHours(23, 59, 59, 999)
      const startDate = new Date(c.startDate)
      startDate.setHours(0, 0, 0, 0)
      return c.isActive && now >= startDate && now <= endDate
    })

    const endedCampaigns = allCampaigns.filter((c) => {
      const endDate = new Date(c.endDate)
      endDate.setHours(23, 59, 59, 999)
      return now > endDate
    })

    return [
      {
        title: 'All Campaigns',
        value: allCampaigns.length.toString(),
        description: 'Total campaigns',
        icon: Target,
      },
      {
        title: 'Active',
        value: activeCampaigns.length.toString(),
        description: 'Currently running',
        icon: CheckCircle2,
      },
      {
        title: 'Inactive',
        value: allCampaigns.filter((c) => !c.isActive).length.toString(),
        description: 'Not active',
        icon: XCircle,
      },
      {
        title: 'Ended',
        value: endedCampaigns.length.toString(),
        description: 'Completed',
        icon: Clock,
      },
    ]
  }, [allCampaigns])

  return (
    <>
      <DashboardPage
        icon={Target}
        title="Campaign Management"
        description="Manage all gamified campaigns"
        actions={[
          {
            label: 'Create from Template',
            icon: Plus,
            href: '/dashboard/admin/campaign-templates',
          },
          {
            label: 'Refresh',
            icon: RefreshCw,
            onClick: async () => {
              setLoading(true)
              const result = await getAllGamifiedCampaigns()
              setAllCampaigns(result)
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

        {/* Filter Tabs */}
        {!loading && (
          <div className="flex items-center gap-2 mt-6">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              {(['all', 'active', 'inactive', 'ended'] as FilterType[]).map((filterType) => (
                <Button
                  key={filterType}
                  size="sm"
                  variant={filter === filterType ? 'default' : 'outline'}
                  onClick={() => setFilter(filterType)}
                  className="capitalize"
                >
                  {filterType}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <EmptyStateCard
            icon={Target}
            title={`No ${filter} campaigns`}
            description={
              filter === 'all'
                ? 'There are no campaigns yet. Create one from a template!'
                : `No ${filter} campaigns found.`
            }
            action={
              filter === 'all'
                ? {
                    label: 'Browse Templates',
                    onClick: () => router.push('/dashboard/admin/campaign-templates'),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {filteredCampaigns.map((campaign) => {
              const taskCount = campaign.tasks?.length || 0
              const participantCount = campaign._count?.participations || campaign.participations?.length || 0

              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {campaign.description}
                        </CardDescription>
                      </div>
                      {getStatusBadge(campaign)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="font-semibold text-lg">{taskCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold text-lg">{participantCount}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/dashboard/campaigns/gamified/${campaign.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
          const refreshed = await getAllGamifiedCampaigns()
          setAllCampaigns(refreshed)
        }}
      />
    </>
  )
}

