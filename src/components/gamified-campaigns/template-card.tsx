'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Layers, Clock, Star, Trophy, Calendar, Eye, Award, TrendingUp, Zap, Edit } from 'lucide-react'
import { CampaignTemplate } from '@prisma/client'
import { cn } from '@/lib/utils'

interface TemplateCardProps {
  template: CampaignTemplate & {
    _count?: {
      templateTasks: number
    }
  }
  onUse?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  showActions?: boolean
}

export function TemplateCard({ template, onUse, onEdit, onDuplicate, showActions = true }: TemplateCardProps) {
  const difficultyConfig = {
    BEGINNER: {
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      label: 'Beginner',
      color: 'emerald'
    },
    INTERMEDIATE: {
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800/50',
      label: 'Intermediate',
      color: 'blue'
    },
    ADVANCED: {
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/50',
      label: 'Advanced',
      color: 'amber'
    },
    EXPERT: {
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/50',
      label: 'Expert',
      color: 'rose'
    },
  }

  const config = difficultyConfig[template.difficulty]

  // Calculate engagement score
  const calculateEngagementScore = () => {
    const taskCount = template._count?.templateTasks || 0
    const duration = template.estimatedDuration || 1
    const points = template.minPointsToQualify || 0

    // Simple engagement formula: (tasks * points) / duration
    const score = taskCount > 0 ? Math.round((taskCount * points) / duration) : 0
    return score
  }

  const engagementScore = calculateEngagementScore()
  const taskCount = template._count?.templateTasks || 0

  // Format date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className="group overflow-hidden border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
      {/* Status Bar - Top accent */}
      <div className={cn('h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-40', config.text)} />

      <CardContent className="p-0">
        {/* Header Section with Image overlay effect */}
        <div className={cn('p-5 pb-4 border-b border-border/50')}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Title with decorative badge */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold tracking-tight leading-tight line-clamp-1">
                  {template.name}
                </h3>
                {template.isSystemTemplate && (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
                {template.isPublic && (
                  <Eye className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </div>

              {/* Description with line clamp */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {template.description || 'No description provided'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
              {/* Category Badge */}
              {template.category && (
                  <Badge
                      variant="secondary"
                      className="mt-3 text-xs font-medium"
                  >
                      {template.category}
                  </Badge>
              )}

              {/* Category Badge */}
              {template.difficulty && (
                  <Badge
                      variant="secondary"
                      className={`mt-3 text-xs font-medium ${config.border} ${config.text}`}
                  >
                      {template.difficulty}
                  </Badge>
              )}
          </div>
        </div>

        {/* Insights Grid - Key metrics at a glance */}
        <div className="p-5 space-y-4">
          {/* Primary Metrics Row - Hero numbers */}
          <div className="grid grid-cols-3 gap-3">
            {/* Task Count - Primary metric */}
            <div className="text-center p-3 rounded-lg border border-border/30">
              <div className="flex items-center justify-center mb-1">
                <Layers className={cn('h-4 w-4 mr-1.5', config.text)} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tasks
                </span>
              </div>
              <div className="text-2xl font-bold tracking-tight tabular-nums">
                {taskCount}
              </div>
            </div>

            {/* Duration - Secondary metric */}
            {template.estimatedDuration && (
              <div className="text-center p-3 rounded-lg border border-border/30">
                <div className="flex items-center justify-center mb-1">
                  <Clock className={cn('h-4 w-4 mr-1.5', config.text)} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Hours
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight tabular-nums">
                  {template.estimatedDuration}
                </div>
              </div>
            )}

            {/* Points to Qualify - Tertiary metric */}
            {template.minPointsToQualify !== null && template.minPointsToQualify !== undefined && template.minPointsToQualify > 0 && (
              <div className="text-center p-3 rounded-lg border border-border/30">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className={cn('h-4 w-4 mr-1.5', config.text)} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Min Pts
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight tabular-nums">
                  {template.minPointsToQualify}
                </div>
              </div>
            )}
          </div>

          {/* Engagement Insights - Secondary row */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Engagement Score */}
            <div className="flex items-center gap-2 p-2 rounded border border-border/30">
              <Zap className={cn('h-3.5 w-3.5 flex-shrink-0', config.text)} />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-muted-foreground">Engagement</div>
                <div className="text-sm font-bold tabular-nums">{engagementScore}</div>
              </div>
            </div>

            {/* Date Range */}
            {(template.startDate || template.endDate) && (
              <div className="flex items-center gap-2 p-2 rounded border border-border/30">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-muted-foreground truncate">
                    {formatDate(template.startDate)} {template.endDate && `→ ${formatDate(template.endDate)}`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full animate-pulse', config.text.replace('text-', 'bg-').replace('-600', '-500').replace('-400', '-500'))} />
              <span className="font-medium">
                {template.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            {template.rewardsTemplate && Array.isArray(template.rewardsTemplate) && template.rewardsTemplate.length > 0 && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center gap-1.5">
                  <Award className="h-3 w-3" />
                  <span className="font-medium">{template.rewardsTemplate.length} Rewards</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        {showActions && (
          <div className="p-4 pt-0 flex gap-2">
            <Button
              onClick={onUse}
              className="flex-1"
              variant="outline"
            >
              Use Template
            </Button>
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Template
              </Button>
            )}
            {onDuplicate && (
              <Button
                onClick={onDuplicate}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
