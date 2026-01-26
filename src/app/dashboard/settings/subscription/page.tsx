import { Metadata } from 'next'
import { SubscriptionManagement } from '@/components/subscription/subscription-management'
import { getSiteName } from '@/lib/utils/site-settings'
import { ROUTES } from '@/lib/routes/client-routes'

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()
  return {
    title: `Subscription Settings - ${siteName}`,
    description: `Manage your ${siteName} subscription and billing`,
  }
}

export default async function SubscriptionSettingsPage() {
  const siteName = await getSiteName()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing preferences
        </p>
      </div>

      <SubscriptionManagement />
    </div>
  )
}
