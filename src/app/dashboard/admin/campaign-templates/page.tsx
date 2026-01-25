'use client'

import { useState, useEffect, useMemo } from 'react'
import { getCampaignTemplates } from '../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { TemplateCard } from '@/components/gamified-campaigns'
import { Button } from '@/components/ui/button'
import { Plus, Files, RefreshCw } from 'lucide-react'
import { TemplatesMutateDrawer } from './components/templates-mutate-drawer'

export default function CampaignTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(undefined)

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const { templates: templatesData } = await getCampaignTemplates()
        setTemplates(templatesData)
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const summaryItems = useMemo(() => {
    const beginnerCount = templates.filter((t) => t.difficulty === 'BEGINNER').length
    const intermediateCount = templates.filter((t) => t.difficulty === 'INTERMEDIATE').length
    const advancedCount = templates.filter((t) => t.difficulty === 'ADVANCED').length

    return [
      {
        title: 'Total Templates',
        value: templates.length.toString(),
        description: 'Available templates',
        icon: Files,
      },
      {
        title: 'Beginner',
        value: beginnerCount.toString(),
        description: 'Easy difficulty',
        icon: Files,
      },
      {
        title: 'Intermediate',
        value: intermediateCount.toString(),
        description: 'Medium difficulty',
        icon: Files,
      },
      {
        title: 'Advanced',
        value: advancedCount.toString(),
        description: 'Hard difficulty',
        icon: Files,
      },
    ]
  }, [templates])

  return (
    <>
    <DashboardPage
      icon={Files}
      title="Campaign Templates"
      description="Create and manage reusable campaign templates"
      actions={[
        {
          label: 'Create Template',
          icon: Plus,
          onClick: () => {
            setEditingTemplate(undefined)
            setDrawerOpen(true)
          },
          variant: 'default',
        },
        {
          label: 'Refresh',
          icon: RefreshCw,
          onClick: async () => {
            setLoading(true)
            const { templates: templatesData } = await getCampaignTemplates()
            setTemplates(templatesData)
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

      {/* Category Filter */}
      <div className="mb-6 flex gap-2">
        <Button variant="outline" size="sm">All</Button>
        <Button variant="ghost" size="sm">Beginner</Button>
        <Button variant="ghost" size="sm">Intermediate</Button>
        <Button variant="ghost" size="sm">Advanced</Button>
        <Button variant="ghost" size="sm">Expert</Button>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <EmptyStateCard
          icon={Files}
          title="No templates yet"
          description="Create reusable campaign templates to quickly set up new campaigns"
          action={{
            label: 'Create Template',
            onClick: () => {
              setEditingTemplate(undefined)
              setDrawerOpen(true)
            },
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: any) => (
            <div key={template.id} className="flex flex-col gap-2">
              <TemplateCard
                template={template}
                showActions={true}
                onUse={async () => {
                  // Navigate to user-facing templates page or open use dialog
                  window.location.href = `/dashboard/campaigns/templates`
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingTemplate(template)
                  setDrawerOpen(true)
                }}
              >
                Edit Template
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardPage>

    <TemplatesMutateDrawer
      open={drawerOpen}
      onOpenChange={(open) => {
        setDrawerOpen(open)
        if (!open) setEditingTemplate(undefined)
      }}
      template={editingTemplate}
      onSuccess={() => {
        // Refresh templates after successful creation/update
        getCampaignTemplates().then(({ templates: templatesData }) => {
          setTemplates(templatesData)
        })
      }}
    />
  </>
  )
}
