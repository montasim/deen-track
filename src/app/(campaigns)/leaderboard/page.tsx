'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Trophy,
    Crown,
    Medal,
    Star,
    Users,
    Target,
    Flame,
    ArrowRight,
    Zap,
    TrendingUp,
    Calendar,
    Award,
    ChevronDown,
    Sparkles,
} from 'lucide-react'
import { getActiveGamifiedCampaigns, getCampaignLeaderboard } from '@/app/dashboard/gamified-campaigns/actions'
import { useAuth } from '@/context/auth-context'
import { AuthPrompt } from '@/components/auth/auth-prompt'

// Skeleton Components
const CampaignSelectorSkeleton = () => (
    <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="relative px-6 py-4 rounded-2xl w-48 overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                <div className="relative bg-white/5 rounded-2xl h-full border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse" />
                    <div className="flex-1">
                        <div className="h-4 bg-white/5 rounded w-32 mb-2 animate-pulse" />
                        <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const StatsCardSkeleton = ({ index }: { index: number }) => (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <CardContent className="relative p-6">
            <div className="flex items-center gap-4">
                <div
                    className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 animate-pulse"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="w-6 h-6 bg-white/10 rounded" />
                </div>
                <div className="flex-1">
                    <div className="h-7 bg-white/5 rounded w-20 mb-2 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
                </div>
            </div>
        </CardContent>
    </Card>
)

const PodiumCardSkeleton = ({ rank }: { rank: number }) => {
    const isWinner = rank === 1
    return (
        <Card
            className={`
                relative bg-neutral-900/40 backdrop-blur-xl border-2 border-white/10 overflow-hidden
                ${isWinner ? 'md:-mt-8' : ''}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            <CardContent className="relative p-8 text-center">
                {/* Icon Badge */}
                <div className="flex justify-center mb-4">
                    <div
                        className={`
                            rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 animate-pulse
                            ${isWinner ? 'w-24 h-24' : 'w-20 h-20'}
                        `}
                    />
                </div>

                {/* Rank */}
                <div className="h-14 bg-white/5 rounded-lg w-20 mx-auto mb-4 animate-pulse" />

                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 mx-auto mb-4 animate-pulse" />

                {/* Name */}
                <div className="h-6 bg-white/5 rounded w-40 mx-auto mb-4 animate-pulse" />

                {/* Points */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-yellow-500/20 rounded animate-pulse" />
                    <div className="h-8 bg-white/5 rounded w-24 animate-pulse" />
                </div>

                {/* Label */}
                <div className="h-4 bg-white/5 rounded w-28 mx-auto animate-pulse" />
            </CardContent>
        </Card>
    )
}

const LeaderboardItemSkeleton = ({ index }: { index: number }) => (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <CardContent className="relative p-5">
            <div className="flex items-center gap-5">
                {/* Rank Badge */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 animate-pulse" />

                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 animate-pulse" />

                {/* Info */}
                <div className="flex-1">
                    <div className="h-6 bg-white/5 rounded w-48 animate-pulse" />
                </div>

                {/* Points */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <div className="w-4 h-4 bg-yellow-500/20 rounded animate-pulse" />
                    <div className="h-5 bg-white/5 rounded w-20 animate-pulse" />
                </div>
            </div>
        </CardContent>
    </Card>
)

const CampaignInfoSkeleton = () => (
    <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <CardContent className="relative p-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="h-7 bg-white/5 rounded w-64 mb-3 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-full mb-2 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-3/4 mb-4 animate-pulse" />
                    <div className="flex gap-3">
                        <div className="h-8 bg-white/5 rounded w-40 animate-pulse" />
                        <div className="h-8 bg-white/5 rounded w-24 animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                    <div className="h-14 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg w-48 animate-pulse" />
                </div>
            </div>
        </CardContent>
    </Card>
)

const LeaderboardPageSkeleton = () => (
    <div className="min-h-screen bg-neutral-950">
        {/* Hero Section */}
        <div className="relative border-b border-white/5 bg-neutral-950 overflow-hidden pt-20 pb-16">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[1000px] h-[1000px] bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
            </div>

            <div className="relative container mx-auto max-w-7xl px-6 my-16">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <div className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse" />
                        <div className="h-4 bg-white/5 rounded w-28 animate-pulse" />
                    </div>
                    <div className="h-16 bg-white/5 rounded w-96 mx-auto mb-6 animate-pulse" />
                    <div className="h-6 bg-white/5 rounded w-[500px] mx-auto animate-pulse" />
                </div>

                {/* Campaign Selector */}
                <CampaignSelectorSkeleton />
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-6 py-12">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4 mb-12">
                {[0, 1, 2, 3].map((i) => (
                    <StatsCardSkeleton key={i} index={i} />
                ))}
            </div>

            {/* Podium Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((rank) => (
                    <PodiumCardSkeleton key={rank} rank={rank} />
                ))}
            </div>

            {/* Leaderboard List Skeleton */}
            <div className="space-y-3 mb-12">
                {[1, 2, 3, 4, 5].map((i) => (
                    <LeaderboardItemSkeleton key={i} index={i} />
                ))}
            </div>

            {/* Campaign Info Skeleton */}
            <CampaignInfoSkeleton />
        </div>
    </div>
)

const campaignThemes = [
    {
        id: 'default',
        gradient: 'from-cyan-500 via-blue-600 to-violet-600',
        bgGradient: 'from-cyan-500/20 via-blue-600/10 to-violet-500/20',
        accent: 'cyan',
        icon: Trophy,
    },
    {
        id: 'purple',
        gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
        bgGradient: 'from-violet-500/20 via-purple-600/10 to-fuchsia-500/20',
        accent: 'violet',
        icon: Sparkles,
    },
    {
        id: 'orange',
        gradient: 'from-orange-500 via-red-600 to-rose-600',
        bgGradient: 'from-orange-500/20 via-red-600/10 to-rose-500/20',
        accent: 'orange',
        icon: Flame,
    },
    {
        id: 'green',
        gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
        bgGradient: 'from-emerald-500/20 via-teal-600/10 to-cyan-500/20',
        accent: 'emerald',
        icon: TrendingUp,
    },
]

const getRankConfig = (rank: number) => {
    if (rank === 1) {
        return {
            icon: Crown,
            color: 'text-amber-400',
            bg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
            glow: 'shadow-amber-500/50',
        }
    }
    if (rank === 2) {
        return {
            icon: Medal,
            color: 'text-slate-300',
            bg: 'bg-gradient-to-br from-slate-400 to-slate-500',
            glow: 'shadow-slate-400/50',
        }
    }
    if (rank === 3) {
        return {
            icon: Medal,
            color: 'text-orange-400',
            bg: 'bg-gradient-to-br from-orange-600 to-orange-700',
            glow: 'shadow-orange-500/50',
        }
    }
    return null
}

export default function PublicLeaderboardPage() {
    const { user } = useAuth()
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [leaderboardLoading, setLeaderboardLoading] = useState(false)

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await getActiveGamifiedCampaigns()
                setCampaigns(data)
                if (data.length > 0) {
                    setSelectedCampaign(data[0])
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCampaigns()
    }, [])

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!selectedCampaign) return

            setLeaderboardLoading(true)
            try {
                const data = await getCampaignLeaderboard(selectedCampaign.id, { limit: 20 })
                // Handle both array and object return types
                const leaderboardData = Array.isArray(data) ? data : (data?.leaderboard || [])
                setLeaderboard(leaderboardData)
            } catch (error) {
                console.error('Error fetching leaderboard:', error)
                setLeaderboard([])
            } finally {
                setLeaderboardLoading(false)
            }
        }

        fetchLeaderboard()
    }, [selectedCampaign])

    const theme = useMemo(() => {
        if (!selectedCampaign) return campaignThemes[0]
        const index = campaigns.findIndex((c) => c.id === selectedCampaign.id)
        return campaignThemes[index % campaignThemes.length]
    }, [selectedCampaign, campaigns])

    const stats = useMemo(() => {
        if (leaderboard.length === 0) return []
        const totalPoints = leaderboard.reduce((sum, entry) => sum + (entry.totalPoints || 0), 0)
        const topPoints = leaderboard[0]?.totalPoints || 0
        const avgPoints = Math.round(totalPoints / leaderboard.length)

        return [
            { label: 'অংশগ্রহণকারী', value: leaderboard.length.toString(), icon: Users },
            { label: 'সর্বোচ্চ স্কোর', value: topPoints.toLocaleString(), icon: Award },
            { label: 'গড় স্কোর', value: avgPoints.toLocaleString(), icon: TrendingUp },
            { label: 'মোট পয়েন্ট', value: totalPoints.toLocaleString(), icon: Star },
        ]
    }, [leaderboard])

    if (loading) {
        return <LeaderboardPageSkeleton />
    }

    if (campaigns.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Card className="max-w-md bg-neutral-900/40 backdrop-blur-xl border-white/10">
                    <CardContent className="p-12 text-center">
                        <Trophy className="w-16 h-16 text-neutral-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-3">এখন কোনো চ্যালেঞ্জ নেই</h2>
                        <p className="text-neutral-400 mb-6">পরে আবার দেখুন - নতুন চ্যালেঞ্জ আসছে শীঘ্রই!</p>
                        <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600">
                            <Link href="/campaigns">🎮 চ্যালেঞ্জ দেখুন</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Render page content
    const pageContent = (
        <>
            {/* Hero Section with Animated Background */}
            <div className="relative border-b border-white/5 bg-neutral-950 overflow-hidden pt-20 pb-16">
                {/* Dynamic Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute w-[1000px] h-[1000px] bg-gradient-to-br ${theme.gradient} opacity-20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse`} />
                    <div className={`absolute w-[700px] h-[700px] bg-gradient-to-tr ${theme.gradient} opacity-10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 bottom-0 right-0 animate-pulse delay-1000`} />
                </div>

                <div className="relative container mx-auto max-w-7xl px-6 my-16">
                    {/* Header */}
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} animate-pulse`} />
                            <span className="text-sm text-neutral-300 font-medium">লাইভ র‍্যাঙ্কিং</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-6">
                            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                                চ্যালেঞ্জ লিডারবোর্ড
                            </span>
                        </h1>

                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            সবার সাথে প্রতিযোগিতা করুন, পয়েন্ট জমান আর লিডারবোর্ডে সেরা হন!
                        </p>
                    </div>

                    {/* Campaign Selector */}
                    <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                        {campaigns.map((campaign) => {
                            const campaignTheme = campaignThemes[campaigns.indexOf(campaign) % campaignThemes.length]
                            const isSelected = selectedCampaign?.id === campaign.id
                            const Icon = campaignTheme.icon

                            return (
                                <button
                                    key={campaign.id}
                                    onClick={() => setSelectedCampaign(campaign)}
                                    className={`
                                        relative group px-6 py-4 rounded-2xl font-semibold text-base
                                        transition-all duration-500 transform
                                        ${isSelected ? 'scale-105' : 'hover:scale-102'}
                                    `}
                                    style={{
                                        background: isSelected
                                            ? `linear-gradient(135deg, ${campaignTheme.gradient.replace(/from-|via-|to-/g, '').split(' ').join(', ')})`
                                            : 'rgba(255,255,255,0.03)',
                                        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {isSelected && (
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${campaignTheme.gradient} opacity-20 blur-xl`} />
                                    )}

                                    <div className="relative flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white/5'} group-hover:bg-white/10 transition-colors`}>
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                                        </div>
                                        <div className="text-left">
                                            <div className={`${isSelected ? 'text-white' : 'text-neutral-300'} whitespace-nowrap`}>
                                                {campaign.name}
                                            </div>
                                            <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                                                {campaign._count?.participations || 0} জন অংশগ্রহণকারী
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-neutral-950">
                <div className="container mx-auto max-w-7xl px-6 py-12">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-4 mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            const delay = index * 100

                            return (
                                <Card
                                    key={stat.label}
                                    className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <CardContent className="relative p-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${theme.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                                                style={{ animationDelay: `${delay}ms` }}
                                            >
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                                <div className="text-sm text-neutral-400">{stat.label}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Leaderboard Content */}
                    {leaderboardLoading ? (
                        <>
                            {/* Podium Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {[1, 2, 3].map((rank) => (
                                    <PodiumCardSkeleton key={rank} rank={rank} />
                                ))}
                            </div>

                            {/* Leaderboard List Skeleton */}
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <LeaderboardItemSkeleton key={i} index={i} />
                                ))}
                            </div>
                        </>
                    ) : leaderboard.length === 0 ? (
                        <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10">
                            <CardContent className="p-16 text-center">
                                <Trophy className="w-20 h-20 text-neutral-700 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-3">এখনো কোনো র‍্যাঙ্কিং নেই</h3>
                                <p className="text-neutral-400 mb-8">এই ক্যাম্পেইনে অংশ নিয়ে লিডারবোর্ডে এগিয়ে থাকার সুযোগ নিন!</p>
                                <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600">
                                    <Link href={`/campaigns/${selectedCampaign.id}`}>ক্যাম্পেইনে যোগ দিন</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {/* Podium - Top 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {leaderboard.slice(0, 3).map((entry, index) => {
                                    const rank = index + 1
                                    const config = getRankConfig(rank)
                                    if (!config) return null
                                    const Icon = config.icon

                                    return (
                                        <Card
                                            key={entry.userId}
                                            className={`
                                                relative bg-gradient-to-br ${theme.bgGradient} backdrop-blur-xl border-2
                                                transition-all duration-500 hover:scale-105
                                                ${rank === 1 ? 'border-amber-500/30 md:-mt-8' : 'border-white/10'}
                                            `}
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            <CardContent className="p-8 text-center">
                                                {/* Icon Badge */}
                                                <div className="flex justify-center mb-4">
                                                    <div
                                                        className={`relative p-4 rounded-2xl ${config.bg} shadow-xl ${config.glow} ${rank === 1 ? 'w-24 h-24' : 'w-20 h-20'
                                                            }`}
                                                    >
                                                        <Icon className={`w-full h-full text-white`} />
                                                        {rank === 1 && (
                                                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl opacity-50 blur-lg animate-pulse" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Rank */}
                                                <div className={`text-5xl font-black mb-4 ${config.color} drop-shadow-lg`}>
                                                    #{rank}
                                                </div>

                                                {/* Avatar */}
                                                <div
                                                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${theme.gradient} mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white shadow-xl border-4 border-white/10`}
                                                >
                                                    {entry.user?.name?.charAt(0) || '?'}
                                                </div>

                                                {/* Name */}
                                                <h3 className="font-bold text-white text-xl mb-4">{entry.user?.name || 'অজ্ঞাত'}</h3>

                                                {/* Points */}
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-black text-white text-2xl">
                                                        {entry.totalPoints?.toLocaleString() || 0}
                                                    </span>
                                                </div>

                                                {/* Label */}
                                                <div className="text-sm text-neutral-400 font-medium">অর্জিত পয়েন্ট</div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Rest of Leaderboard */}
                            <div className="space-y-3">
                                {leaderboard.slice(3).map((entry, index) => {
                                    const rank = index + 4

                                    return (
                                        <Card
                                            key={entry.userId}
                                            className="group bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300"
                                        >
                                            <CardContent className="p-5">
                                                <div className="flex items-center gap-5">
                                                    {/* Rank Badge */}
                                                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center font-black text-neutral-400 border border-white/10 group-hover:scale-110 transition-transform">
                                                        #{rank}
                                                    </div>

                                                    {/* Avatar */}
                                                    <div
                                                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-lg font-bold text-white shadow-lg group-hover:scale-110 transition-transform`}
                                                    >
                                                        {entry.user?.name?.charAt(0) || '?'}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-white text-lg truncate group-hover:text-amber-400 transition-colors">
                                                            {entry.user?.name || 'অজ্ঞাত'}
                                                        </h3>
                                                    </div>

                                                    {/* Points */}
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/50 border border-white/10">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                            <span className="font-bold text-white text-lg">
                                                                {entry.totalPoints?.toLocaleString() || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Campaign Info Card */}
                    {selectedCampaign && (
                        <Card className="mt-12 bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">{selectedCampaign.name}</h3>
                                        <p className="text-neutral-400 mb-4 leading-relaxed">{selectedCampaign.description}</p>
                                        <div className="flex flex-wrap gap-3">
                                            <Badge className="bg-neutral-800 text-neutral-300 border-white/10">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
                                            </Badge>
                                            <Badge className="bg-neutral-800 text-neutral-300 border-white/10">
                                                <Target className="w-3 h-3 mr-1" />
                                                {selectedCampaign.tasks?.length || 0} টি চ্যালেঞ্জ
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        <Button
                                            asChild
                                            size="lg"
                                            className={`bg-gradient-to-r ${theme.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all`}
                                        >
                                            <Link href={`/campaigns/${selectedCampaign.id}`} className="gap-2">
                                                ক্যাম্পেইনের বিস্তারিত দেখুন
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    )

    // Wrap content in AuthPrompt if user is not authenticated
    return !user ? (
        <AuthPrompt
            title="লিডারবোর্ড দেখতে লগইন করুন"
            description="লিডারবোর্ড দেখার জন্য আপনাকে প্রথমে অ্যাকাউন্ট তৈরি করতে হবে অথবা লগইন করতে হবে। এটি ফ্রি!"
        >
            {pageContent}
        </AuthPrompt>
    ) : pageContent
}
