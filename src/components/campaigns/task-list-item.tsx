'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, Eye, Send, Star, ChevronUp, ChevronDown, ChevronRight, AlertTriangle, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TaskListItemProps {
  task: any
  index: number
  isJoined: boolean
  submission?: any
  points: number
  difficulty: string
  onSubmit: () => void
  difficultyConfig: any
}

export function TaskListItem({
  task,
  index,
  isJoined,
  submission,
  points,
  difficulty,
  onSubmit,
  difficultyConfig,
}: TaskListItemProps) {
  const taskConfig = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.INTERMEDIATE
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="group relative rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-all duration-500">
      <div className={`absolute inset-0 bg-gradient-to-br ${taskConfig.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />

      <div className="relative p-6">
        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center gap-2">
            {/* Task Number Badge */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${taskConfig.color} flex items-center justify-center font-bold text-white shadow-lg`}>
              {index + 1}
            </div>

            {/* Difficulty Badge */}
            <Badge className={`${taskConfig.bg} ${taskConfig.text} ${taskConfig.border} border text-xs`}>
              {taskConfig.label}
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                {/* Task Name */}
                <h3 className="font-bold text-white text-md mb-2">{task.name}</h3>

                {/* Task Description */}
                <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
                  {task.description}
                </p>

                {/* Task Dates */}
                {task.startDate && task.endDate && (
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(task.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      —{' '}
                      {new Date(task.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {/* Task Meta */}
                <div className="flex items-center gap-3">
                  {/* Points Display */}
                  {points > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {points} পয়েন্ট
                      </Badge>
                      {/* My Points - Show if user has submission */}
                      {submission?.earnedPoints > 0 && (
                        <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {submission.earnedPoints} পয়েন্ট অর্জিত
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge & Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Expand/Collapse Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-neutral-400 hover:text-white h-8 px-2 gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      বিস্তারিত লুকান
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      বিস্তারিত দেখুন
                    </>
                  )}
                </Button>

                {/* Submission Status for Joined Users */}
                {isJoined && submission && (
                  <>
                    {submission.status === 'APPROVED' ? (
                      <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        মিলেছে!
                      </Badge>
                    ) : submission.status === 'REJECTED' ? (
                      <Badge className="bg-red-500/10 text-red-300 border-red-500/30 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        মানা হয়েছে
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        যাচাই হচ্ছে...
                      </Badge>
                    )}

                    {/* View Proof Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-neutral-400 hover:text-white h-8 px-3 gap-2"
                      onClick={() => {/* TODO: Show proof details */}}
                    >
                      <Eye className="w-4 h-4" />
                      প্রমাণ দেখুন
                    </Button>

                    {/* Resubmit Button if Rejected */}
                    {submission.status === 'REJECTED' && (
                      <Button
                        size="sm"
                        onClick={onSubmit}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        আবার জমা দিন
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Submit Button for Joined Users without submission */}
              {isJoined && !submission && (
                <Button
                  size="sm"
                  onClick={onSubmit}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  জমা দিন
                </Button>
              )}
            </div>

            {/* Expanded Details Section */}
            {isExpanded && (
              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="border-t border-white/10 pt-4 space-y-4">
                  {/* Rules Section */}
                  {task.rules && (
                    <div className="bg-neutral-900/40 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-semibold text-white">নিয়মাবলী</h4>
                      </div>
                      <p className="text-xs text-neutral-400 whitespace-pre-wrap">{task.rules}</p>
                    </div>
                  )}

                  {/* Disqualification Rules Section */}
                  {task.disqualificationRules && (
                    <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h4 className="text-sm font-semibold text-red-400">বাতিলের কারণ</h4>
                      </div>
                      <p className="text-sm text-neutral-400 whitespace-pre-wrap">{task.disqualificationRules}</p>
                    </div>
                  )}

                  {/* Points Breakdown */}
                  {task.achievements && task.achievements.length > 0 && (
                    <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-semibold text-amber-400">অ্যাচিভমেন্ট ও পয়েন্ট</h4>
                      </div>
                      <div className="space-y-2">
                        {task.achievements.map((achievement: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {achievement.icon && <span className="text-base">{achievement.icon}</span>}
                              <span className="text-neutral-300">{achievement.name}</span>
                            </div>
                            <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              {achievement.points} পয়েন্ট
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submission Preview */}
            {submission && !isExpanded && (
              <div className="mt-4 p-4 rounded-xl border border-white/10 bg-neutral-900/40">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-neutral-500">জমা দেওয়া হয়েছে:</span>
                  <span className="text-white font-medium">
                    {submission.proofType === 'IMAGE' && 'ছবি'}
                    {submission.proofType === 'AUDIO' && 'অডিও'}
                    {submission.proofType === 'URL' && 'লিংক'}
                    {submission.proofType === 'TEXT' && 'টেক্সট'}
                  </span>
                </div>

                {/* Proof Content Preview */}
                {submission.proofType === 'TEXT' && submission.text && (
                  <div className="text-sm text-neutral-300 bg-neutral-900/60 p-2 rounded">
                    {submission.text}
                  </div>
                )}
                {submission.proofType === 'URL' && submission.url && (
                  <div className="text-sm text-cyan-400 truncate">
                    {submission.url}
                  </div>
                )}
                {submission.fileUrl && (
                  <div className="text-sm text-neutral-400">
                    ফাইল সংযুক্ত আছে
                  </div>
                )}

                {/* Admin Feedback */}
                {submission.feedback && (
                  <div className="mt-3 text-sm text-neutral-400 bg-white/5 p-2 rounded">
                    <span className="font-medium">মন্তব্য:</span> {submission.feedback}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
