import { redirect } from 'next/navigation'
import { createCampaignTemplate } from '../../../gamified-campaigns/actions'
import { requireAuth } from '@/lib/auth/session'
import { TemplateCreateForm } from '@/components/gamified-campaigns/template-create-form'
import Link from 'next/link'

export default async function CreateTemplatePage() {
  const session = await requireAuth()

  async function createTemplate(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const estimatedDuration = formData.get('estimatedDuration') as string
    const difficulty = formData.get('difficulty') as string

    // Parse tasks from form data
    const tasks = []
    let taskIndex = 0
    while (formData.get(`tasks[${taskIndex}][name]`)) {
      tasks.push({
        name: formData.get(`tasks[${taskIndex}][name]`) as string,
        description: formData.get(`tasks[${taskIndex}][description]`) as string,
        rules: formData.get(`tasks[${taskIndex}][rules]`) as string,
        disqualificationRules: formData.get(`tasks[${taskIndex}][disqualificationRules]`) as string,
      })
      taskIndex++
    }

    const result = await createCampaignTemplate({
      name,
      description: description || undefined,
      category: category || undefined,
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
      difficulty,
      tasks,
    })

    if (result.success) {
      redirect('/dashboard/admin/campaign-templates')
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard/admin/campaign-templates">
          <button className="text-sm text-muted-foreground hover:text-foreground mb-2">
            ← Back to Templates
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Create Campaign Template</h1>
        <p className="text-muted-foreground mt-2">
          Create a reusable template for campaigns
        </p>
      </div>

      <TemplateCreateForm onSubmit={createTemplate} />
    </div>
  )
}
