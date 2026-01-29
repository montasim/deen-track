'use client'

import {Trophy, Target, Users, Clock, Calendar} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface QuickStatsBarProps {
  totalPoints: number
  totalTasks: number
  participants: number
  estimatedDuration?: number
}

export function QuickStatsBar({
  totalPoints,
  totalTasks,
  participants,
  estimatedDuration,
}: QuickStatsBarProps) {
  return (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
      <CardContent className="p-6">
          <div className="grid grid-cols-4">
              <div>
                  <p className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      মোট পয়েন্ট
                  </p>
                  <p className="text-white font-semibold">
                      {totalPoints.toLocaleString()}
                  </p>
              </div>

              <div>
                  <p className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                      <Target className="w-4 h-4 text-cyan-400" />
                      মোট চ্যালেঞ্জ
                  </p>
                  <p className="text-white font-semibold">
                      {totalTasks}
                  </p>
              </div>

              <div>
                  <p className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                      <Users className="w-4 h-4 text-violet-400" />
                      খেলছে
                  </p>
                  <p className="text-white font-semibold">
                      {participants.toLocaleString()}
                  </p>
              </div>

              {
                  estimatedDuration ? <div>
                      <p className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          সময় লাগবে
                      </p>
                      <p className="text-white font-semibold">
                          {estimatedDuration} ঘণ্টা
                      </p>
                  </div> : <div>
                      <p className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                          <Target className="w-4 h-4 text-emerald-400" />
                          টাস্ক
                      </p>
                      <p className="text-white font-semibold">
                          {totalTasks}টি
                      </p>
                  </div>
              }
          </div>
      </CardContent>
    </Card>
  )
}
