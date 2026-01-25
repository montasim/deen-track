'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Layers, Clock, Star, Trophy, Calendar } from 'lucide-react'
import { CampaignTemplate } from '@prisma/client'

interface TemplateCardProps {
  template: CampaignTemplate & {
    _count?: {
      templateTasks: number
    }
  }
  onUse?: () => void
  onDuplicate?: () => void
  showActions?: boolean
}

export function TemplateCard({ template, onUse, onDuplicate, showActions = true }: TemplateCardProps) {
  const difficultyColors = {
    BEGINNER: 'bg-green-500',
    INTERMEDIATE: 'bg-blue-500',
    ADVANCED: 'bg-orange-500',
    EXPERT: 'bg-red-500',
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {template.name}
              {template.isSystemTemplate && <Star className="h-4 w-4 text-yellow-500" />}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {template.description || 'No description provided'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={difficultyColors[template.difficulty]}>
            {template.difficulty}
          </Badge>
          {template.category && <Badge variant="outline">{template.category}</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>{template._count?.templateTasks || 0} tasks</span>
          </div>
          {template.estimatedDuration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{template.estimatedDuration}h</span>
            </div>
          )}
          {template.minPointsToQualify !== undefined && template.minPointsToQualify > 0 && (
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{template.minPointsToQualify} pts to qualify</span>
            </div>
          )}
        </div>

        {(template.startDate || template.endDate) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {template.startDate && new Date(template.startDate).toLocaleDateString()}
              {template.startDate && template.endDate && ' - '}
              {template.endDate && new Date(template.endDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="gap-2">
          <Button onClick={onUse} className="flex-1">
            Use Template
          </Button>
          {onDuplicate && (
            <Button onClick={onDuplicate} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
