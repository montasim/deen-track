'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ActivityAction, ActivityResourceType } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, Filter, Clock, CheckCircle, XCircle, MessageSquare, ShoppingCart, User, X } from 'lucide-react'
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
import { Label } from "@/components"
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

interface ActivityContentProps {
  activities: UserActivity[]
  loading: boolean
  isAdmin: boolean
  stats: {
    total: number
    success: number
    failed: number
    thisWeek: number
  }
  successRate: number
  selectedAction: string
  selectedResourceType: string
  setSelectedAction: (value: string) => void
  setSelectedResourceType: (value: string) => void
  startDate: string
  endDate: string
  setStartDate: (value: string) => void
  setEndDate: (value: string) => void
  clearDateFilters: () => void
}

export default function ActivityContent({
  activities,
  loading,
  isAdmin,
  stats,
  successRate,
  selectedAction,
  selectedResourceType,
  setSelectedAction,
  setSelectedResourceType,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  clearDateFilters,
}: ActivityContentProps) {
  const getActionIcon = (action: ActivityAction) => {
    if (action === ActivityAction.MESSAGE_SENT) return <MessageSquare className='h-4 w-4' />
    if (action === ActivityAction.SELL_POST_CREATED || action === ActivityAction.OFFER_CREATED) return <ShoppingCart className='h-4 w-4' />
    if (action === ActivityAction.PROFILE_UPDATED) return <User className='h-4 w-4' />
    return <Calendar className='h-4 w-4' />
  }

  const getActionBadgeColor = (action: ActivityAction): string => {
    const createActions = ['SELL_POST_CREATED', 'OFFER_CREATED', 'MESSAGE_SENT', 'NOTICE_CREATED', 'REVIEW_POSTED', 'BLOG_POST_CREATED', 'BLOG_COMMENT_CREATED', 'TICKET_CREATED']
    const updateActions = ['SELL_POST_UPDATED', 'NOTICE_UPDATED', 'PROFILE_UPDATED', 'BLOG_POST_UPDATED', 'TICKET_RESPONDED']
    const deleteActions = ['SELL_POST_DELETED', 'NOTICE_DELETED', 'BLOG_POST_DELETED']
    const authActions = ['LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGED', 'ROLE_CHANGED']
    const successActions = ['OFFER_ACCEPTED']
    const failActions = ['OFFER_REJECTED']

    if (createActions.includes(action)) return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
    if (updateActions.includes(action)) return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'
    if (deleteActions.includes(action)) return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
    if (authActions.includes(action)) return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
    if (successActions.includes(action)) return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
    if (failActions.includes(action)) return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'

    return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
  }

  const formatActionName = (action: ActivityAction): string => {
    return action.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const formatResourceType = (resourceType: ActivityResourceType): string => {
    return resourceType.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const groupActivitiesByDate = (activities: UserActivity[]) => {
    const groups: Record<string, UserActivity[]> = {}

    activities.forEach(activity => {
      const date = new Date(activity.createdAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateKey: string
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday'
      } else {
        dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }

      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(activity)
    })

    return groups
  }

  const groupedActivities = groupActivitiesByDate(activities)

  if (loading) {
    return <ActivitySettingsSkeleton />
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <DashboardSummary
        summaries={[
          { title: 'Total Activities', value: stats.total, description: 'All your activities' },
          { title: 'Successful', value: stats.success, description: `${successRate}% success rate` },
          { title: 'Failed', value: stats.failed, description: 'Activities that failed' },
          { title: 'This Week', value: stats.thisWeek, description: 'Activities in last 7 days' },
        ]}
      />

      {/* Filters */}
      <CollapsibleSection
        title="Filter Activities"
        icon={Filter}
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Action Type</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder='All actions' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Actions</SelectItem>
                  {Object.values(ActivityAction).map((action) => (
                    <SelectItem key={action} value={action}>
                      {formatActionName(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Resource Type</label>
              <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
                <SelectTrigger>
                  <SelectValue placeholder='All types' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Resource Types</SelectItem>
                  {Object.values(ActivityResourceType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatResourceType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Date Range</label>
              {(startDate || endDate) && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={clearDateFilters}
                  className='h-7 text-xs'
                >
                  <X className='h-3 w-3 mr-1' />
                  Clear dates
                </Button>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-xs text-muted-foreground'>From</Label>
                <Input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='w-full'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-xs text-muted-foreground'>To</Label>
                <Input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='w-full'
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span>
                  {startDate && `From ${new Date(startDate).toLocaleDateString()}`}
                  {startDate && endDate && ' - '}
                  {endDate && `To ${new Date(endDate).toLocaleDateString()}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Timeline */}
      {activities.length === 0 ? (
        <EmptyStateCard
          icon={Clock}
          title='No activities found'
          description='Your activity timeline will show here once you start using the platform.'
        />
      ) : (
        <div className='space-y-6'>
          {Object.entries(groupedActivities).map(([dateLabel, dayActivities]) => (
            <div key={dateLabel}>
              <div className='flex items-center gap-4 mb-4'>
                <Label className='font-semibold'>{dateLabel}</Label>
                <div className='flex-1 h-px bg-border' />
              </div>

              <div className='space-y-3'>
                {dayActivities.map((activity) => (
                  <Card key={activity.id} className='p-4 hover:bg-accent/50 transition-colors'>
                    <div className='flex items-start gap-4'>
                      {/* Icon */}
                      <div className={cn(
                        'p-2 rounded-lg',
                        activity.success ? 'bg-green-500/10' : 'bg-red-500/10'
                      )}>
                        <div className={cn(
                          activity.success ? 'text-green-500' : 'text-red-500'
                        )}>
                          {getActionIcon(activity.action)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-4 mb-2'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1 flex-wrap'>
                              <Badge className={cn('font-normal', getActionBadgeColor(activity.action))}>
                                {formatActionName(activity.action)}
                              </Badge>
                              {activity.resourceName && (
                                <span className='text-sm font-medium'>
                                  on &quot;{activity.resourceName}&quot;
                                </span>
                              )}
                            </div>
                            {activity.description && (
                              <p className='text-sm text-muted-foreground'>
                                {activity.description}
                              </p>
                            )}
                          </div>

                          {/* Status and Time */}
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              {activity.success ? (
                                <CheckCircle className='h-3 w-3 text-green-500' />
                              ) : (
                                <XCircle className='h-3 w-3 text-red-500' />
                              )}
                              {activity.success ? 'Success' : 'Failed'}
                            </span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>

                        {/* Resource Type Badge */}
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' className='text-xs'>
                            {formatResourceType(activity.resourceType)}
                          </Badge>
                          {isAdmin && activity.endpoint && (
                            <span className='text-xs text-muted-foreground font-mono'>
                              {activity.endpoint}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
