'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Trophy, UserPlus, Shield } from 'lucide-react'
import { Team } from '@prisma/client'

interface TeamCardProps {
  team: Team & {
    captain: {
      id: string
      name: string
    }
    members: Array<{
      user: {
        id: string
        name: string
        avatar?: string | null
      }
    }>
    _count?: {
      members: number
      campaignProgress: number
    }
  }
  isMember?: boolean
  isCaptain?: boolean
  onJoin?: () => void
  onLeave?: () => void
  onView?: () => void
}

export function TeamCard({ team, isMember, isCaptain, onJoin, onLeave, onView }: TeamCardProps) {
  const isFull = team.maxMembers && team._count?.members && team._count.members >= team.maxMembers
  const statusColors = {
    ACTIVE: 'bg-green-500',
    INACTIVE: 'bg-gray-500',
    DISBANDED: 'bg-red-500',
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {team.name}
              {isCaptain && <Shield className="h-4 w-4 text-blue-500" />}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {team.description || 'No description'}
            </CardDescription>
          </div>
          <Badge className={statusColors[team.status as keyof typeof statusColors]}>
            {team.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {team._count?.members || team.members.length} / {team.maxMembers || '∞'} members
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{team._count?.campaignProgress || 0} campaigns</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Captain</p>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {team.captain.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{team.captain.name}</span>
          </div>
        </div>

        {team.members.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Members</p>
            <div className="flex -space-x-2">
              {team.members.slice(0, 5).map((member) => (
                <Avatar key={member.user.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.user.avatar || undefined} />
                  <AvatarFallback>
                    {member.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(team._count?.members || team.members.length) > 5 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{(team._count?.members || team.members.length) - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {!isMember ? (
          <Button
            onClick={onJoin}
            disabled={isFull || team.status !== 'ACTIVE'}
            className="flex-1"
          >
            {isFull ? 'Team Full' : <><UserPlus className="h-4 w-4 mr-1" /> Join Team</>}
          </Button>
        ) : (
          <>
            <Button onClick={onView} variant="outline" className="flex-1">
              View Team
            </Button>
            {!isCaptain && (
              <Button onClick={onLeave} variant="ghost" className="text-red-500 hover:text-red-600">
                Leave
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
