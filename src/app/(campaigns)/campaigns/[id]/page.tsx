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
  CheckCircle2,
  Gamepad2,
  Zap,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/context/auth-context'
import { toast } from '@/hooks/use-toast'
import { getGamifiedCampaign, joinCampaign } from "@/app/dashboard/gamified-campaigns/actions";
import { ProofSubmissionSheet } from './components/proof-submission-sheet'
import { RewardsDisplay } from '@/components/gamified-campaigns/rewards-display'
import { PageHeader } from '@/components/layout/page-header'
import { PageBackground } from '@/components/layout/page-background'
import { QuickStatsBar } from '@/components/campaigns/quick-stats-bar'
import { ProgressSection } from '@/components/campaigns/progress-section'
import { TaskListItem } from '@/components/campaigns/task-list-item'

const difficultyConfig = {
  BEGINNER: {
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    label: 'সহজ',
    glow: 'shadow-emerald-500/25',
  },
  INTERMEDIATE: {
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    label: 'মধ্যম',
    glow: 'shadow-blue-500/25',
  },
  ADVANCED: {
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    label: 'উন্নত',
    glow: 'shadow-violet-500/25',
  },
  EXPERT: {
    color: 'from-red-500 to-orange-600',
    bg: 'bg-red-500/10',
    text: 'text-red-300',
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
  const [showJoinConfirm, setShowJoinConfirm] = useState(false)

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
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
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
          <div className="flex flex-wrap items-center gap-4">
            <Badge className={`${config.bg} ${config.text} ${config.border} border flex items-center gap-2 px-4 py-2`}>
              <Target className="w-4 h-4" />
              {config.label}
            </Badge>
            {campaign.startDate && campaign.endDate && (
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(campaign.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  —{' '}
                  {new Date(campaign.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        }
      />

      {/* Main Content */}
      <div className="relative container mx-auto max-w-7xl px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Bar */}
            <QuickStatsBar
              totalPoints={totalPoints}
              totalTasks={campaign.tasks?.length || 0}
              participants={campaign.participations?.length || campaign._count?.participations || 0}
              estimatedDuration={campaign.estimatedDuration}
            />

            {/* Tasks Section */}
            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
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
                      // Calculate task points - check multiple sources
                      const taskPoints = ct.points || ct.task.points || ct.task.achievements?.reduce((sum: number, a: any) => sum + a.points, 0) || 0

                      // Check if user has submitted proof for this task
                      const submission = userProgress?.submissions?.find((s: any) => s.taskId === ct.taskId)

                      return (
                        <TaskListItem
                          key={ct.id}
                          task={ct.task}
                          index={index}
                          isJoined={isJoined}
                          submission={submission}
                          points={taskPoints}
                          difficulty={ct.task.difficulty}
                          onSubmit={() => openProofSheet(ct)}
                          difficultyConfig={difficultyConfig}
                        />
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
          </div>

          {/* Right Column - Streamlined Sidebar */}
          <div className="space-y-6">
            {/* Progress Section (Conditional - Only for joined users) */}
            {isJoined && (
              <ProgressSection
                earnedPoints={earnedPoints}
                totalPoints={totalPoints}
                progressPercentage={progressPercentage}
                submissions={userProgress?.submissions || []}
                totalTasks={campaign.tasks?.length || 0}
                userProgress={userProgress}
              />
            )}

            {/* Join Campaign CTA for Authenticated Users */}
            {user && !isJoined && (
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-600/5 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-500">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

                {/* Animated Glow */}
                <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[40px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />

                <CardContent className="relative p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">যোগ দিন! 🚀</h3>
                  <p className="text-neutral-300 text-sm mb-6">
                    এই চ্যালেঞ্জে অংশ নিন, পয়েন্ট জিনুন, পুরস্কার জেতার সুযোগ পান!
                  </p>
                  <Button
                    onClick={() => setShowJoinConfirm(true)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25"
                  >
                    এখনই যোগ দিন
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Rewards & Prizes Section */}
            {campaign.rewardsTemplate && campaign.rewardsTemplate.length > 0 && (
              <RewardsDisplay
                rewards={campaign.rewardsTemplate}
                showAll={true}
                className="animate-in fade-in slide-in-from-right-4 duration-700"
              />
            )}

              {/* Rules */}
              {campaign.rules && (
                  <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                      <CardContent className="p-6">
                          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-amber-400" />
                              নিয়মাবলী
                          </h2>
                          <div className="prose prose-invert max-w-none text-neutral-300">
                              <p className="whitespace-pre-wrap">{campaign.rules}</p>
                          </div>
                      </CardContent>
                  </Card>
              )}

            {/* Quick Info - How to Play */}
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
                    <Link href="/sign-up">
                      ফ্রিয়ে শুরু করুন
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

      {/* Join Confirmation Dialog */}
      <AlertDialog open={showJoinConfirm} onOpenChange={setShowJoinConfirm}>
        <AlertDialogContent className="bg-neutral-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl">
              আপনি কি এই চ্যালেঞ্জে যোগ দিতে চান? 🚀
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              এই চ্যালেঞ্জে যোগ দেওয়ার মাধ্যমে আপনি সব চ্যালেঞ্জ সম্পন্ন করে পয়েন্ট অর্জন করতে পারবেন এবং পুরস্কার জেতার সুযোগ পাবেন!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 border-white/20 text-white hover:bg-neutral-700 hover:text-white">
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleJoinCampaign}
              disabled={joining}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25"
            >
              {joining ? 'যোগ দিচ্ছে...' : 'হ্যাঁ, যোগ দিন'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
