'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Trophy, Target, Clock, Lock, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: any
  onJoin: (campaignId: string) => Promise<{ success: boolean; message?: string }>
  userProgress?: any
}

export function CampaignDetailDialog({ open, onOpenChange, campaign, onJoin, userProgress }: Props) {
  const [joining, setJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(!!userProgress)

  // Safely calculate total points
  const totalPoints = campaign?.tasks?.reduce((sum: number, ct: any) => {
    if (!ct?.task) return sum
    const taskPoints = ct.task.achievements?.reduce((s: number, a: any) => s + (a.points || 0), 0) || 0
    return sum + taskPoints
  }, 0) || 0

  const isActive = campaign?.isActive && new Date() <= new Date(campaign?.endDate)
  const isUpcoming = campaign && new Date() < new Date(campaign?.startDate)

  const handleJoin = async () => {
    if (!campaign?.id) return

    setJoining(true)
    try {
      const result = await onJoin(campaign.id)
      if (result.success) {
        setHasJoined(true)
        toast({
          title: 'Success!',
          description: 'You have joined the campaign.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Cannot join campaign',
          description: result.message || 'Failed to join campaign',
        })
      }
    } catch (error: any) {
      console.error('Error joining campaign:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to join campaign',
      })
    } finally {
      setJoining(false)
    }
  }

  if (!campaign) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Campaign not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{campaign.name}</span>
            <div className="flex gap-2">
              {!isActive && !isUpcoming && <Badge variant="secondary">Ended</Badge>}
              {isUpcoming && <Badge variant="outline">Upcoming</Badge>}
              {isActive && <Badge className="bg-green-500">Active</Badge>}
            </div>
          </DialogTitle>
          <DialogDescription className="text-base">
            {campaign.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Campaign Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dates</p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(campaign.startDate), 'MMM d')} - {format(new Date(campaign.endDate), 'MMM d')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tasks</p>
                  <p className="text-muted-foreground text-xs">{campaign.tasks?.length || 0} tasks</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Points</p>
                  <p className="text-muted-foreground text-xs">{totalPoints} points</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-muted-foreground text-xs">{campaign._count?.participations || 0} joined</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Campaign Rules */}
            {campaign.rules && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Campaign Rules</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.rules}</p>
              </div>
            )}

            {/* Tasks */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tasks
              </h3>

              {campaign.tasks?.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">No tasks available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaign.tasks.map((ct: any, index: number) => {
                    const task = ct.task
                    const taskPoints = task?.achievements?.reduce((s: number, a: any) => s + (a.points || 0), 0) || 0

                    return (
                      <Card key={ct.id} className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base">
                                  Task {index + 1}: {task.name}
                                </CardTitle>
                                {taskPoints > 0 && (
                                  <Badge className="bg-yellow-500 text-white">
                                    {taskPoints} pts
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="mt-1">
                                {task.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {/* Task Dates */}
                          {(task.startDate || task.endDate) && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {task.startDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Start: {format(new Date(task.startDate), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                              {task.endDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>End: {format(new Date(task.endDate), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Task Rules */}
                          {task.rules && (
                            <div>
                              <p className="text-xs font-semibold mb-1">Rules:</p>
                              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{task.rules}</p>
                            </div>
                          )}

                          {/* Disqualification Rules */}
                          {task.disqualificationRules && (
                            <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-3">
                              <p className="text-xs font-semibold mb-1 text-orange-800 flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Disqualification Rules:
                              </p>
                              <p className="text-xs text-orange-700 whitespace-pre-wrap">{task.disqualificationRules}</p>
                            </div>
                          )}

                          {/* Achievements */}
                          {task.achievements && task.achievements.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold mb-2">Achievements:</p>
                              <div className="space-y-2">
                                {task.achievements.map((achievement: any, idx: number) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs rounded-lg border p-2 bg-background">
                                    <div className="flex-1">
                                      <p className="font-medium">{achievement.name}</p>
                                      <p className="text-muted-foreground">{achievement.description}</p>
                                      <p className="text-yellow-600 font-medium">+{achievement.points} points</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Campaign Disqualification Rules */}
            {campaign.disqualificationRules && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <h4 className="text-sm font-semibold mb-2 text-destructive flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Disqualification Rules
                </h4>
                <p className="text-sm text-destructive whitespace-pre-wrap">{campaign.disqualificationRules}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {!hasJoined ? (
            <Button
              onClick={handleJoin}
              disabled={joining || !isActive || isUpcoming}
              className="min-w-[120px]"
            >
              {joining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : isUpcoming ? (
                'Coming Soon'
              ) : isActive ? (
                'Join Campaign'
              ) : (
                'Campaign Ended'
              )}
            </Button>
          ) : (
            <Button asChild className="min-w-[120px]">
              <a href={`/dashboard/campaigns/gamified/${campaign.id}`}>
                View Campaign
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
