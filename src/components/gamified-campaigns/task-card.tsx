'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, Trophy, Clock, CheckCircle2 } from 'lucide-react'
import { CampaignTask } from '@prisma/client'

interface TaskCardProps {
  task: CampaignTask & {
    achievements: Array<{
      id: string
      name: string
      points: number
    }>
  }
  isLocked?: boolean
  isCompleted?: boolean
  isInProgress?: boolean
  onViewDetails?: () => void
  onSubmit?: () => void
}

export function TaskCard({
  task,
  isLocked = false,
  isCompleted = false,
  isInProgress = false,
  onViewDetails,
  onSubmit,
}: TaskCardProps) {
  const totalPoints = task.achievements.reduce((sum, a) => sum + a.points, 0)
  const isActive = task.isActive && new Date() >= new Date(task.startDate) && new Date() <= new Date(task.endDate)
  const isExpired = new Date() > new Date(task.endDate)

  return (
    <Card className={`transition-all ${isLocked ? 'opacity-60' : ''} ${isCompleted ? 'border-green-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{task.name}</CardTitle>
              {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {isInProgress && !isCompleted && <Badge variant="secondary">In Progress</Badge>}
            </div>
            <CardDescription className="line-clamp-2">{task.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{totalPoints} Points</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {task.achievements.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Achievements:</p>
            <div className="space-y-1">
              {task.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{achievement.name}</span>
                  <span className="font-medium">+{achievement.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
            View Details
          </Button>
          {!isLocked && !isCompleted && isActive && (
            <Button size="sm" onClick={onSubmit} className="flex-1">
              Submit Proof
            </Button>
          )}
          {isCompleted && (
            <Button size="sm" disabled className="flex-1">
              Completed
            </Button>
          )}
        </div>

        {isLocked && (
          <p className="text-xs text-muted-foreground text-center">
            Complete prerequisite tasks to unlock
          </p>
        )}
      </CardContent>
    </Card>
  )
}
