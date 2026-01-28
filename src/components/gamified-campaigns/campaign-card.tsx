'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Trophy, Lock, Edit2, Clock } from 'lucide-react'
import { GamifiedCampaign } from '@prisma/client'
import { useAuth } from '@/context/auth-context'
import { RewardsDisplay } from './rewards-display'

interface CampaignCardProps {
  campaign: GamifiedCampaign & {
    tasks: any[]
    _count?: { participations: number }
    rewards?: any[]
  }
  userProgress?: any
  onJoin?: () => void
  onEdit?: () => void
  showJoinButton?: boolean
  showRewards?: boolean
}

export function CampaignCard({ campaign, userProgress, onJoin, onEdit }: CampaignCardProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  const [timeLeft, setTimeLeft] = useState<string>('')

  const totalPoints = campaign.tasks.reduce(
    (sum: number, ct: any) =>
      sum + ct.task.achievements.reduce((s: number, a: any) => s + a.points, 0),
    0
  )

  const isJoined = !!userProgress

  // Get end of day for endDate (23:59:59.999)
  const endDate = new Date(campaign.endDate)
  endDate.setHours(23, 59, 59, 999)

  // Get start of day for startDate (00:00:00)
  const startDate = new Date(campaign.startDate)
  startDate.setHours(0, 0, 0, 0)

  const now = new Date()
  const isActive = campaign.isActive && now <= endDate
  const isUpcoming = now < startDate

  // Countdown timer effect
  useEffect(() => {
    if (!isActive) return

    const updateCountdown = () => {
      const currentTime = new Date()
      const timeRemaining = endDate.getTime() - currentTime.getTime()
      const twoHoursInMs = 2 * 60 * 60 * 1000

      if (timeRemaining <= twoHoursInMs && timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft('')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [endDate, isActive])

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{campaign.name}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {campaign.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isActive && !isUpcoming && <Badge variant="secondary">Ended</Badge>}
            {isUpcoming && <Badge variant="outline">Upcoming</Badge>}
            {isActive && !timeLeft && <Badge className="bg-green-500">Active</Badge>}
            {timeLeft && (
              <Badge className="bg-red-500 animate-pulse flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ending in {timeLeft}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{campaign.tasks.length} Tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{totalPoints} Points</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{campaign._count?.participations || 0} Participants</span>
          </div>
        </div>

        {/* Rewards Display - Compact Badges */}
        {campaign.rewards && campaign.rewards.length > 0 && showRewards !== false && (
          <div className="pt-2 border-t">
            <RewardsDisplay
              rewards={campaign.rewards}
              variant="badges"
              compact
              className="flex-wrap"
            />
          </div>
        )}

        {userProgress && (
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="font-medium">{userProgress.totalPoints} pts</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    ((userProgress.submissions?.length || 0) / campaign.tasks.length) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {campaign.maxParticipants && (
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">
                {campaign._count?.participations || 0} / {campaign.maxParticipants}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    ((campaign._count?.participations || 0) / campaign.maxParticipants) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1">
          {onJoin && !isJoined ? (
            <Button
              onClick={onJoin}
              disabled={!isActive || isUpcoming}
              className="w-full"
            >
              {isUpcoming ? 'Coming Soon' : isActive ? 'View Details' : 'Campaign Ended'}
            </Button>
          ) : onJoin && isJoined ? (
            <Button variant="outline" className="w-full" asChild>
              <a href={`/dashboard/campaigns/gamified/${campaign.id}`}>
                View Campaign
              </a>
            </Button>
          ) : (
            <Button variant="outline" className="w-full" asChild>
              <a href={`/dashboard/campaigns/gamified/${campaign.id}`}>
                View Details
              </a>
            </Button>
          )}
        </div>
        {onEdit && (
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            title="Edit Campaign"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
