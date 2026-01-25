'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Crown } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  userId?: string
  teamId?: string
  userName?: string
  teamName?: string
  userAvatar?: string | null
  totalPoints: number
  tasksCompleted?: number
  memberCount?: number
}

interface LeaderboardTableProps {
  title: string
  description?: string
  entries: LeaderboardEntry[]
  type: 'user' | 'team'
  currentUserId?: string
}

export function LeaderboardTable({
  title,
  description,
  entries,
  type,
  currentUserId,
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <span className="text-sm font-medium">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500">1st</Badge>
      case 2:
        return <Badge className="bg-gray-400">2nd</Badge>
      case 3:
        return <Badge className="bg-amber-700">3rd</Badge>
      default:
        return <Badge variant="outline">{rank}th</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No entries yet</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.userId || entry.teamId}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  (type === 'user' && entry.userId === currentUserId) ||
                  (type === 'team' && entry.teamId === currentUserId)
                    ? 'bg-primary/10 border border-primary'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="h-10 w-10">
                  {type === 'user' ? (
                    <>
                      <AvatarImage src={entry.userAvatar || undefined} />
                      <AvatarFallback>
                        {entry.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback>
                      {entry.teamName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {type === 'user' ? entry.userName : entry.teamName}
                  </p>
                  {type === 'team' && entry.memberCount !== undefined && (
                    <p className="text-xs text-muted-foreground">{entry.memberCount} members</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{entry.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>

                {entry.tasksCompleted !== undefined && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{entry.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">tasks</p>
                  </div>
                )}

                <div>{getRankBadge(entry.rank)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Top 3 podium component
export function TopPerformersPodium({
  entries,
  type,
}: {
  entries: LeaderboardEntry[]
  type: 'user' | 'team'
}) {
  if (entries.length === 0) return null

  const sortedEntries = [...entries].sort((a, b) => a.rank - b.rank)
  const first = sortedEntries.find((e) => e.rank === 1)
  const second = sortedEntries.find((e) => e.rank === 2)
  const third = sortedEntries.find((e) => e.rank === 3)

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {/* Second Place */}
      {second && (
        <div className="flex flex-col items-center">
          <Avatar className="h-16 w-16 border-4 border-gray-400">
            <AvatarImage src={type === 'user' ? second.userAvatar || undefined : undefined} />
            <AvatarFallback>
              {(type === 'user' ? second.userName : second.teamName)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-sm font-medium text-center max-w-[100px] truncate">
            {type === 'user' ? second.userName : second.teamName}
          </p>
          <div className="mt-2 bg-gray-400 text-white px-4 py-8 rounded-t-lg text-center">
            <p className="text-2xl font-bold">{second.totalPoints}</p>
            <p className="text-xs">2nd</p>
          </div>
        </div>
      )}

      {/* First Place */}
      {first && (
        <div className="flex flex-col items-center">
          <Crown className="h-8 w-8 text-yellow-500 mb-2" />
          <Avatar className="h-20 w-20 border-4 border-yellow-500">
            <AvatarImage src={type === 'user' ? first.userAvatar || undefined : undefined} />
            <AvatarFallback>
              {(type === 'user' ? first.userName : first.teamName)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-sm font-bold text-center max-w-[120px] truncate">
            {type === 'user' ? first.userName : first.teamName}
          </p>
          <div className="mt-2 bg-yellow-500 text-white px-6 py-12 rounded-t-lg text-center">
            <p className="text-3xl font-bold">{first.totalPoints}</p>
            <p className="text-sm">1st</p>
          </div>
        </div>
      )}

      {/* Third Place */}
      {third && (
        <div className="flex flex-col items-center">
          <Avatar className="h-16 w-16 border-4 border-amber-700">
            <AvatarImage src={type === 'user' ? third.userAvatar || undefined : undefined} />
            <AvatarFallback>
              {(type === 'user' ? third.userName : third.teamName)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-sm font-medium text-center max-w-[100px] truncate">
            {type === 'user' ? third.userName : third.teamName}
          </p>
          <div className="mt-2 bg-amber-700 text-white px-4 py-6 rounded-t-lg text-center">
            <p className="text-2xl font-bold">{third.totalPoints}</p>
            <p className="text-xs">3rd</p>
          </div>
        </div>
      )}
    </div>
  )
}
