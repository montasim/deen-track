'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ActivityAction, ActivityResourceType } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare, ShoppingCart, User } from 'lucide-react'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { cn } from '@/lib/utils'
import { DashboardSummary } from '@/components/dashboard/dashboard-summary'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { DashboardSummarySkeleton } from '@/components/dashboard/dashboard-summary-skeleton'
import {
  ActivityPageSkeleton,
  ActivityPageHeaderSkeleton,
  ActivityFilterCardSkeleton,
  ActivityTimelineGroupSkeleton
} from '@/components/activity/activity-skeleton'
import { useAuth } from '@/context/auth-context'
import ContentSection from '../components/content-section'
import ActivityContent from './activity-content'
import { ActivitySettingsSkeleton } from './activity-settings-skeleton'

type UserActivity = {
  id: string
  action: ActivityAction
  resourceType: ActivityResourceType
  resourceId: string | null
  resourceName: string | null
  description: string | null
  success: boolean
  createdAt: string
  metadata: any
  endpoint?: string | null
}

export default function SettingsActivity() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [allActivities, setAllActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedAction !== 'all') params.append('action', selectedAction)
      if (selectedResourceType !== 'all') params.append('resourceType', selectedResourceType)

      const response = await fetch(`/api/user/activities?${params}`)
      if (!response.ok) throw new Error('Failed to fetch activities')

      const result = await response.json()
      setAllActivities(result.data.activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [selectedAction, selectedResourceType])

  // Filter activities by date range (client-side filtering)
  const filteredActivities = useMemo(() => {
    let filtered = allActivities

    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter(a => new Date(a.createdAt) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter(a => new Date(a.createdAt) <= end)
    }

    return filtered
  }, [allActivities, startDate, endDate])

  const stats = {
    total: filteredActivities.length,
    success: filteredActivities.filter(a => a.success).length,
    failed: filteredActivities.filter(a => !a.success).length,
    thisWeek: filteredActivities.filter(a => {
      const date = new Date(a.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date > weekAgo
    }).length,
  }

  const successRate = filteredActivities.length > 0
    ? Math.round((stats.success / filteredActivities.length) * 100)
    : 0

  const clearDateFilters = () => {
    setStartDate('')
    setEndDate('')
  }

  return (
    <ContentSection
      title='Activity'
      desc="Track your recent activities on the platform."
    >
      <ActivityContent
        activities={filteredActivities}
        loading={loading}
        isAdmin={isAdmin}
        stats={stats}
        successRate={successRate}
        selectedAction={selectedAction}
        selectedResourceType={selectedResourceType}
        setSelectedAction={setSelectedAction}
        setSelectedResourceType={setSelectedResourceType}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        clearDateFilters={clearDateFilters}
      />
    </ContentSection>
  )
}
