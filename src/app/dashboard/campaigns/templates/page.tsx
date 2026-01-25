'use client'

import { useState, useEffect } from 'react'
import { getCampaignTemplates, createCampaignFromTemplate } from '../../gamified-campaigns/actions'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { TemplateCard } from '@/components/gamified-campaigns'
import { Button } from '@/components/ui/button'
import { Plus, Files, RefreshCw } from 'lucide-react'
import { UseTemplateDrawer } from './components/use-template-drawer'

export default function CampaignTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

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

  const summaryItems = [
    {
      title: 'Total Templates',
      value: templates.length.toString(),
      description: 'Available templates',
      icon: Files,
    },
    {
      title: 'Beginner',
      value: templates.filter((t) => t.difficulty === 'BEGINNER').length.toString(),
      description: 'Easy difficulty',
      icon: Files,
    },
    {
      title: 'Intermediate',
      value: templates.filter((t) => t.difficulty === 'INTERMEDIATE').length.toString(),
      description: 'Medium difficulty',
      icon: Files,
    },
    {
      title: 'Advanced',
      value: templates.filter((t) => t.difficulty === 'ADVANCED').length.toString(),
      description: 'Hard difficulty',
      icon: Files,
    },
  ]

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template)
    setDrawerOpen(true)
  }

  const handleCreateCampaign = async (data: {
    name: string
    description?: string
    startDate: Date
    endDate: Date
    maxParticipants?: number
  }) => {
    return await createCampaignFromTemplate(selectedTemplate.id, data)
  }

  return (
    <>
      <DashboardPage
        icon={Files}
        title="Campaign Templates"
        description="Browse and use pre-built campaign templates to quickly set up new campaigns"
        actions={[
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
            title="No templates available"
            description="Check back later for new campaign templates"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template: any) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={() => handleUseTemplate(template)}
                showActions={true}
              />
            ))}
          </div>
        )}
      </DashboardPage>

      <UseTemplateDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        template={selectedTemplate}
        onSubmit={handleCreateCampaign}
      />
    </>
  )
}
