'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProgressSectionProps {
  earnedPoints: number
  totalPoints: number
  progressPercentage: number
  submissions: any[]
  totalTasks: number
  userProgress?: any
}

export function ProgressSection({
  earnedPoints,
  totalPoints,
  progressPercentage,
  submissions,
  totalTasks,
}: ProgressSectionProps) {
  // Calculate submission stats
  const approvedCount = submissions.filter((s: any) => s.status === 'APPROVED').length
  const pendingCount = submissions.filter((s: any) => s.status === 'PENDING').length
  const remainingCount = totalTasks - submissions.length

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (progressPercentage === 0) return 'শুরু করুন! প্রথম চ্যালেঞ্জ সম্পন্ন করুন'
    if (progressPercentage < 25) return 'ভালো শুরু! এভাবেই এগিয়ে যান'
    if (progressPercentage < 50) return 'দারুণ চলছে! অর্ধেক পথ পার হচ্ছে'
    if (progressPercentage < 75) return 'অসাধারণ! শেষ লগ্নে এগিয়ে যান'
    if (progressPercentage < 100) return 'প্রায় শেষ! শেষ ধাক্কা দিন'
    return 'অভিনন্দন! সব সম্পন্ন করেছেন!'
  }

  return (
    <Card className="relative overflow-hidden border border-emerald-500/30 bg-neutral-900/40 backdrop-blur-xl">
      {/* Animated Background Pattern */}

      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-white">আপনার অগ্রগতি</h3>
                <p className="text-sm text-emerald-300">{getMotivationalMessage()}</p>
            </div>
          <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-300 border-emerald-500/30 text-base px-4 py-2">
            {progressPercentage}%
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Earned Points */}
          <div className="p-4 rounded-xl border border-white/10">
            <div className="text-sm text-neutral-600 mb-1">অর্জিত পয়েন্ট</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black bg-gradient-to-br from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                {earnedPoints}
              </span>
              <span className="text-sm text-white">/ {totalPoints}</span>
            </div>
          </div>

          {/* Approved */}
          <div className="p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
              <span>মিলেছে</span>
            </div>
            <div className="text-2xl font-black text-emerald-600">{approvedCount}</div>
          </div>

          {/* Pending */}
          <div className="p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
              <span>যাচাই হচ্ছে</span>
            </div>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
