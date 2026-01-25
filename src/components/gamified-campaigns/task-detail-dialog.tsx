'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Trophy, Clock, AlertTriangle, CheckCircle2, Lock } from 'lucide-react'
import { CampaignTask } from '@prisma/client'

interface TaskDetailDialogProps {
  task: CampaignTask & {
    achievements: Array<{
      id: string
      name: string
      description: string
      points: number
      howToAchieve: string
      icon?: string
    }>
    dependencies?: Array<{
      id: string
      dependsOn: {
        id: string
        name: string
        description?: string
      }
      dependencyType: string
    }>
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: () => void
  isLocked?: boolean
  isCompleted?: boolean
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onSubmit,
  isLocked = false,
  isCompleted = false,
}: TaskDetailDialogProps) {
  const totalPoints = task.achievements.reduce((sum, a) => sum + a.points, 0)
  const isActive = task.isActive && new Date() >= new Date(task.startDate) && new Date() <= new Date(task.endDate)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                {task.name}
                {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
                {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {task.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-1">
          <div className="space-y-6 pr-4">
            {/* Task Status & Timing */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className={isActive ? 'bg-green-500' : 'bg-gray-500'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{totalPoints} points available</span>
              </div>
            </div>

            {/* Task Rules */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Task Rules</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{task.rules}</p>
              </div>
            </div>

            {/* Disqualification Rules */}
            {task.disqualificationRules && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Disqualification Rules
                </h3>
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{task.disqualificationRules}</p>
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {task.dependencies && task.dependencies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Prerequisites
                </h3>
                <div className="space-y-2">
                  {task.dependencies.map((dep) => (
                    <div
                      key={dep.id}
                      className="bg-muted p-3 rounded-lg flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{dep.dependsOn.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {dep.dependsOn.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {dep.dependencyType === 'ALL' ? 'Must complete' : 'Complete any'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  You must complete these tasks before you can submit this one
                </p>
              </div>
            )}

            <Separator />

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <div className="space-y-3">
                {task.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {achievement.icon && (
                            <span className="text-2xl">{achievement.icon}</span>
                          )}
                          <h4 className="font-semibold">{achievement.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="bg-background/50 p-2 rounded text-xs">
                          <p className="font-medium mb-1">How to achieve:</p>
                          <p className="whitespace-pre-wrap">{achievement.howToAchieve}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center ml-4">
                        <Trophy className="h-8 w-8 text-yellow-500 mb-1" />
                        <Badge className="bg-yellow-500 text-white">
                          +{achievement.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Validation Process</p>
              <p className="text-xs text-muted-foreground">
                Your submission will be reviewed by an admin. You'll receive a notification once
                it's been approved or if any changes are needed.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!isLocked && !isCompleted && isActive && onSubmit && (
            <Button onClick={onSubmit}>Submit Proof</Button>
          )}
          {isCompleted && (
            <Button disabled>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </Button>
          )}
          {isLocked && (
            <Button disabled variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
