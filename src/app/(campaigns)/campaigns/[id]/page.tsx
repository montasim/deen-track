'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  Target,
  Sparkles,
  Star,
  Zap,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  TrendingUp,
  ArrowRight,
  Gamepad2,
  Send,
  FileCheck,
  Eye,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { toast } from '@/hooks/use-toast'
import { getGamifiedCampaign, joinCampaign } from "@/app/dashboard/gamified-campaigns/actions";
import { ProofSubmissionSheet } from './components/proof-submission-sheet'
import { RewardsDisplay } from '@/components/gamified-campaigns/rewards-display'
import { PageHeader } from '@/components/layout/page-header'
import { PageBackground } from '@/components/layout/page-background'

const difficultyConfig = {
  BEGINNER: {
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'সহজ',
    glow: 'shadow-emerald-500/25',
  },
  INTERMEDIATE: {
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    label: 'মধ্যম',
    glow: 'shadow-blue-500/25',
  },
  ADVANCED: {
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/15',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    label: 'উন্নত',
    glow: 'shadow-violet-500/25',
  },
  EXPERT: {
    color: 'from-red-500 to-orange-600',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'কঠিন',
    glow: 'shadow-red-500/25',
  },
}

export default function PublicCampaignDetailPage() {
  const params = useParams()
  const { id } = params
  const { user } = useAuth()
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [proofSheetOpen, setProofSheetOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchCampaign = async () => {
      setLoading(true)
      try {
        const campaignData = await getGamifiedCampaign(id as string)
        setCampaign(campaignData)
      } catch (error) {
        console.error('Error fetching campaign:', error)
        setCampaign(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCampaign()
    }
  }, [id])

  const handleJoinCampaign = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'প্রথমে সাইন-ইন করুন 🔐',
        description: 'চ্যালেঞ্জ শুরু করতে লগইন দরকার',
      })
      return
    }

    setJoining(true)
    try {
      const result = await joinCampaign(id as string)

      if (result.success) {
        toast({
          title: 'অভিনন্দন! 🎉',
          description: 'চ্যালেঞ্জ শুরু করুন, পয়েন্ট জিনুন!',
        })
        const campaignData = await getGamifiedCampaign(id as string)
        setCampaign(campaignData)
      } else {
        toast({
          variant: 'destructive',
          title: 'যোগ দেওয়া যায়নি',
          description: result.message || 'আবার চেষ্টা করুন',
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

  const handleProofSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      // This is a placeholder - you'll need to implement the actual API call
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Refresh campaign data after submission
      const campaignData = await getGamifiedCampaign(id as string)
      setCampaign(campaignData)

      return { success: true }
    } catch (error: any) {
      console.error('Error submitting proof:', error)
      return { success: false, message: error.message || 'Failed to submit proof' }
    } finally {
      setSubmitting(false)
    }
  }

  const openProofSheet = (task: any) => {
    setSelectedTask(task.task)
    setProofSheetOpen(true)
  }

  if (loading) {
    return (
      <>
        <div className="container mx-auto max-w-7xl px-6 pt-20 pb-12">
          <div className="space-y-6">
            <div className="h-8 bg-neutral-900/40 rounded-xl animate-pulse" />
            <div className="h-64 bg-neutral-900/40 rounded-2xl animate-pulse" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48 bg-neutral-900/40 rounded-xl animate-pulse" />
              <div className="h-48 bg-neutral-900/40 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!campaign) {
    return (
      <>
        <div className="container mx-auto max-w-7xl px-6 text-center pt-20 pb-12">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex p-6 rounded-full bg-neutral-900/60 border border-white/10 mb-8">
              <Trophy className="w-16 h-16 text-neutral-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">চ্যালেঞ্জ পাওয়া যায়নি 😕</h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
              হয়তো চ্যালেঞ্জটি শেষ হয়ে গেছে বা সরিয়ে ফেলা হয়েছে। অন্য চ্যালেঞ্জ দেখুন!
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5"
            >
              <Link href="/campaigns" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                সব চ্যালেঞ্জ দেখুন
              </Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  const config = difficultyConfig[campaign.difficulty as keyof typeof difficultyConfig] || difficultyConfig.INTERMEDIATE
  const userProgress = campaign.participations?.find((p: any) => p.userId === user?.id)
  const isJoined = !!userProgress

  const totalPoints = campaign.tasks?.reduce(
    (sum: number, ct: any) =>
      sum + (ct.task.achievements?.reduce((s: number, a: any) => s + a.points, 0) || 0),
    0
  ) || 0

  const completedTasks = userProgress?.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0
  const earnedPoints = userProgress?.totalPoints || 0
  const progressPercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  return (
    <>
      <PageBackground />

      {/* Header Section */}
      <PageHeader
        badgeText={campaign.isActive ? "চলছে" : undefined}
        badgeIcon={campaign.isActive ? CheckCircle2 : undefined}
        badgeColor="emerald"
        title={campaign.name}
        description={campaign.description}
        extraContent={
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={`${config.bg} ${config.text} ${config.border} border flex items-center gap-2 px-4 py-2`}>
              <Target className="w-4 h-4" />
              {config.label}
            </Badge>
          </div>
        }
      />

      {/* Main Content */}
      <div className="relative container mx-auto max-w-7xl px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 transition-all hover:border-white/20`}>
              <div className="group">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>মোট পয়েন্ট</span>
                </div>
                <div className="inline-block py-1 text-3xl font-black bg-gradient-to-br from-white to-neutral-300 bg-clip-text text-transparent">
                  {totalPoints.toLocaleString()}
                </div>
              </div>

              <div className="group">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>মোট চ্যালেঞ্জ</span>
                </div>
                <div className="inline-block py-1 text-3xl font-black bg-gradient-to-br from-white to-neutral-300 bg-clip-text text-transparent">
                  {campaign.tasks?.length || 0}
                </div>
              </div>

              <div className="group">
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  <span>খেলছে</span>
                </div>
                <div className="inline-block py-1 text-3xl font-black bg-gradient-to-br from-white to-neutral-300 bg-clip-text text-transparent">
                  {campaign.participations?.length || campaign._count?.participations || 0}
                </div>
              </div>

              {campaign.estimatedDuration && (
                <div className="group">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>সময় লাগবে</span>
                  </div>
                  <div className="inline-block py-1 text-3xl font-black bg-gradient-to-br from-white to-neutral-300 bg-clip-text text-transparent">
                    {campaign.estimatedDuration} ঘণ্টা
                  </div>
                </div>
              )}
            </div>

            {/* Date Range */}
            {campaign.startDate && campaign.endDate && (
              <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">চ্যালেঞ্জ চলবে</p>
                      <p className="text-white font-semibold">
                        {new Date(campaign.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        —{' '}
                        {new Date(campaign.endDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks Section */}
            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Gamepad2 className="w-6 h-6 text-cyan-400" />
                    চ্যালেঞ্জ তালিকা
                  </h2>
                  <Badge variant="outline" className="border-white/20 text-neutral-300">
                    {campaign.tasks?.length || 0} টি আছে
                  </Badge>
                </div>

                {campaign.tasks && campaign.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {campaign.tasks.map((ct: any, index: number) => {
                      const taskPoints = ct.task.achievements?.reduce((sum: number, a: any) => sum + a.points, 0) || 0
                      const taskConfig = difficultyConfig[ct.task.difficulty as keyof typeof difficultyConfig] || difficultyConfig.INTERMEDIATE

                      // Check if user has submitted proof for this task
                      const submission = userProgress?.submissions?.find((s: any) => s.taskId === ct.taskId)

                      return (
                        <div
                          key={ct.id}
                          className="group relative p-6 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.01]"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${taskConfig.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />

                          <div className="relative flex items-start gap-6">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${taskConfig.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                              {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <h3 className="font-bold text-white text-lg mb-2">{ct.task.name}</h3>
                                  <p className="text-sm text-neutral-400 line-clamp-2">
                                    {ct.task.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {taskPoints > 0 && (
                                    <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {taskPoints}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {isJoined ? (
                                    <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 px-3 py-1.5">
                                      <Unlock className="w-3.5 h-3.5" />
                                      শুরু করুন!
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-neutral-500/10 text-neutral-400 border border-neutral-500/30 flex items-center gap-1.5 px-3 py-1.5">
                                      <Lock className="w-3.5 h-3.5" />
                                      যোগ দিয়ে আনলক করুন
                                    </Badge>
                                  )}
                                  {user && !isJoined && (
                                    <span className="text-xs text-neutral-500">
                                      প্রথমে লগইন করুন
                                    </span>
                                  )}
                                </div>

                                {isJoined && !submission && (
                                  <Button
                                    size="sm"
                                    onClick={() => openProofSheet(ct)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 gap-2"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    জমা দিন
                                  </Button>
                                )}
                              </div>

                              {/* Show submitted proof */}
                              {submission && (
                                <div className="mt-4 p-4 rounded-xl border border-white/10 bg-neutral-900/40">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                      {submission.status === 'APPROVED' ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 flex items-center gap-1.5">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          মিলেছে! ✅
                                        </Badge>
                                      ) : submission.status === 'REJECTED' ? (
                                        <Badge className="bg-red-500/10 text-red-300 border-red-500/30 flex items-center gap-1.5">
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          মানা হয়েছে ❌
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border-amber-500/30 flex items-center gap-1.5">
                                          <Clock className="w-3.5 h-3.5" />
                                          যাচাই হচ্ছे... ⏳
                                        </Badge>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-neutral-400 hover:text-white h-8 w-8 p-0"
                                      onClick={() => {/* TODO: Show proof details */ }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {/* Proof Type */}
                                  <div className="flex items-center gap-2 text-sm">
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
                                    <div className="mt-2 text-sm text-neutral-300 bg-neutral-900/60 p-2 rounded">
                                      {submission.text}
                                    </div>
                                  )}
                                  {submission.proofType === 'URL' && submission.url && (
                                    <div className="mt-2 text-sm text-cyan-400 truncate">
                                      {submission.url}
                                    </div>
                                  )}
                                  {submission.fileUrl && (
                                    <div className="mt-2 text-sm text-neutral-400">
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
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex p-6 rounded-full bg-neutral-900/60 border border-white/10 mb-4">
                      <Gamepad2 className="w-12 h-12 text-neutral-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">এখনো চ্যালেঞ্জ নেই</h3>
                    <p className="text-neutral-500">
                      খুব শীঘ্রই নতুন চ্যালেঞ্জ আসবে, চোখ রাখুন! 👀
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rules */}
            {campaign.rules && (
              <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    নিয়মাবলী
                  </h2>
                  <div className="prose prose-invert max-w-none text-neutral-300">
                    <p className="whitespace-pre-wrap">{campaign.rules}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Campaign Summary Card - For All Users */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10 backdrop-blur-xl border border-cyan-500/20">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2" />

              <CardContent className="relative p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">পুরস্কার জেতার সুযোগ!</h2>
                    <p className="text-sm text-neutral-400">চ্যালেঞ্জ করে পয়েন্ট জিনুন</p>
                  </div>
                </div>

                {/* Points Display */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-400">মোট পয়েন্ট</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="inline-block py-1 text-3xl font-black bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                      {totalPoints.toLocaleString()}
                    </div>
                  </div>

                  {user && isJoined && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-emerald-300">আপনার পয়েন্ট</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{earnedPoints}</span>
                        <span className="text-sm text-neutral-400">/ {totalPoints}</span>
                      </div>
                      <div className="mt-3">
                        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-1000"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="text-right text-xs text-emerald-300 mt-1">{progressPercentage}% হয়ে গেছে</div>
                      </div>
                    </div>
                  )}
                </div>

                {user && isJoined && (
                  <div className="mt-6 space-y-4">
                    {/* Detailed Progress Section */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-300">কেমন চলছে</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-emerald-400">{progressPercentage}% হয়েছে</div>
                        </div>
                      </div>
                    </div>

                    {/* Task Progress List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        আপনার চ্যালেঞ্জ
                      </h4>
                      {campaign.tasks?.map((ct: any, taskIndex: number) => {
                        const submission = userProgress?.submissions?.find((s: any) => s.taskId === ct.taskId)
                        const isSubmitted = !!submission

                        return (
                          <div
                            key={ct.id}
                            className="p-3 rounded-lg border border-white/10 bg-neutral-900/60 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                                {taskIndex + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h5 className="text-sm font-medium text-white">{ct.task.name}</h5>
                                  {isSubmitted ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      হয়ে গেছে
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-neutral-500/10 text-neutral-400 border border-neutral-500/30 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      বাকি আছে
                                    </Badge>
                                  )}
                                </div>
                                {isSubmitted && (
                                  <div className="text-xs text-neutral-400">
                                    {submission.status === 'APPROVED' && (
                                      <span className="text-emerald-400">মিলেছে! ✅</span>
                                    )}
                                    {submission.status === 'PENDING' && (
                                      <span className="text-amber-400">দেখা হচ্ছে... ⏳</span>
                                    )}
                                    {submission.status === 'REJECTED' && (
                                      <span className="text-red-400">মানা হয়েছে ❌</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rewards & Prizes Section */}
            {campaign.rewardsTemplate && campaign.rewardsTemplate.length > 0 && (
              <RewardsDisplay
                rewards={campaign.rewardsTemplate}
                showAll={true}
                className="animate-in fade-in slide-in-from-right-4 duration-700"
              />
            )}

            {/* Quick Info */}
            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  কিভাবে খেলবেন?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>চ্যালেঞ্জ দেখুন, সম্পন্ন করুন</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>প্রমাণ জমা দিন</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>পয়েন্ট জিনুন, লিডারবোর্ডে যান</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>অ্যাচিভমেন্ট আনলক করুন</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>পুরস্কার জিনুন! 🎁</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA for Non-Authenticated Users */}
            {!user && (
              <Card className="relative overflow-hidden bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

                {/* Animated Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10" />

                <CardContent className="relative p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">খেলা শুরু করুন! 🎮</h3>
                  <p className="text-neutral-400 text-sm mb-6">
                    ফ্রিয়ে সাইন-আপ করুন, চ্যালেঞ্জ করুন, পয়েন্ট জিনুন - সবই ফ্রি! 🚀
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
                  >
                    <Link href="/sign-up" className="gap-2">
                      ফ্রিয়ে শুরু করুন
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Proof Submission Sheet */}
      {selectedTask && (
        <ProofSubmissionSheet
          open={proofSheetOpen}
          onOpenChange={setProofSheetOpen}
          task={selectedTask}
          campaignId={id as string}
          onSubmit={handleProofSubmit}
        />
      )}
    </>
  )
}
