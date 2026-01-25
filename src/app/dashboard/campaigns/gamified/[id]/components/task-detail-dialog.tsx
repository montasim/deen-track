'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Clock, Lock, Target } from 'lucide-react'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
}

export function TaskDetailDialog({ open, onOpenChange, task }: Props) {
  if (!task) return null

  const totalPoints = task.achievements?.reduce((sum: number, a: any) => sum + (a.points || 0), 0) || 0
  const isActive = task.isActive && new Date() >= new Date(task.startDate) && new Date() <= new Date(task.endDate)
  const isExpired = new Date() > new Date(task.endDate)
  const isUpcoming = new Date() < new Date(task.startDate)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto border-0 shadow-none">
        <SheetHeader>
          <SheetTitle className="text-xl pr-8">{task.name}</SheetTitle>
          <div className="flex gap-2 mt-2">
            {isUpcoming && <Badge variant="outline">Upcoming</Badge>}
            {isExpired && <Badge variant="secondary">Ended</Badge>}
            {isActive && <Badge className="bg-green-500">Active</Badge>}
            {totalPoints > 0 && (
              <Badge className="bg-yellow-500 text-white">
                {totalPoints} pts
              </Badge>
            )}
          </div>
          <SheetDescription className="text-base mt-4">{task.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Task Dates */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(task.startDate), 'MMM d, yyyy')} - {format(new Date(task.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          <Separator />

          {/* Task Rules */}
          {task.rules && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Rules
              </h3>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.rules}</p>
              </div>
            </div>
          )}

          {/* Disqualification Rules */}
          {task.disqualificationRules && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-orange-500" />
                Disqualification Rules
              </h3>
              <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4">
                <p className="text-sm text-orange-800 whitespace-pre-wrap">{task.disqualificationRules}</p>
              </div>
            </div>
          )}

          {/* Achievements */}
          {task.achievements && task.achievements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Achievements & Rewards
                </h3>
                <div className="space-y-2">
                  {task.achievements.map((achievement: any, idx: number) => (
                    <Card key={idx} className="bg-muted/30">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              <span className="font-medium">How to achieve:</span> {achievement.howToAchieve}
                            </p>
                          </div>
                          <Badge className="bg-yellow-500 text-white ml-2">
                            +{achievement.points} pts
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
