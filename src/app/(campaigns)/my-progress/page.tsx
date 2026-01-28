'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUserCampaignProgress, getUserSubmissions } from '@/app/dashboard/gamified-campaigns/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Trophy,
    Target,
    TrendingUp,
    Award,
    Calendar,
    Users,
    Star,
    CheckCircle2,
    Clock,
    XCircle,
    Flame,
    Sparkles,
    ArrowRight,
    Zap,
    RefreshCw,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts'

const gradientThemes = [
    { from: 'cyan-500', via: 'blue-600', to: 'violet-600' },
    { from: 'violet-500', via: 'purple-600', to: 'fuchsia-600' },
    { from: 'emerald-500', via: 'teal-600', to: 'cyan-600' },
]

export default function MyProgressPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [progressList, setProgressList] = useState<any[]>([])
    const [submissions, setSubmissions] = useState<any[]>([])
    const [achievements, setAchievements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

    // Redirect admins away and unauthenticated users
    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
            router.push('/dashboard/admin/campaigns')
        }
    }, [user, router])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [progressData, submissionsData] = await Promise.all([
                    getUserCampaignProgress(),
                    getUserSubmissions(),
                ])
                setProgressList((progressData || []) as any[])
                setSubmissions((submissionsData || []) as any[])

                // Fetch achievements from API
                const achievementsRes = await fetch('/api/user/achievements')
                if (achievementsRes.ok) {
                    const achievementsData = await achievementsRes.json()
                    setAchievements(achievementsData.data || [])
                }
            } catch (error) {
                console.error('Error fetching progress:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    // Filter data based on selected campaign
    const filteredProgress = useMemo(() => {
        if (!selectedCampaignId) return progressList
        return progressList.filter((p) => p.campaignId === selectedCampaignId)
    }, [progressList, selectedCampaignId])

    const filteredSubmissions = useMemo(() => {
        if (!selectedCampaignId) return submissions
        return submissions.filter((s: any) => s.progress?.campaignId === selectedCampaignId)
    }, [submissions, selectedCampaignId])

    // Calculate stats
    const stats = useMemo(() => {
        const displayProgress = filteredProgress
        const displaySubmissions = filteredSubmissions

        const totalPoints = displayProgress.reduce((sum: number, p: any) => sum + p.totalPoints, 0)
        const totalCampaigns = displayProgress.length
        const completedTasks = displaySubmissions.filter((s: any) => s.status === 'APPROVED').length
        const totalTasks = displayProgress.reduce((sum: number, p: any) => sum + p.campaign.tasks.length, 0)
        const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        return [
            { label: selectedCampaignId ? 'পয়েন্ট' : 'মোট পয়েন্ট', value: totalPoints.toLocaleString(), icon: Trophy, color: 'from-amber-500 to-yellow-600' },
            { label: selectedCampaignId ? 'টাস্ক' : 'ক্যাম্পেইন', value: selectedCampaignId ? totalTasks.toString() : totalCampaigns.toString(), icon: Target, color: 'from-cyan-500 to-blue-600' },
            { label: 'সম্পন্ন', value: `${completedTasks}${selectedCampaignId ? '' : '/' + totalTasks}`, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
            { label: 'অগ্রগতি', value: `${overallProgress}%`, icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
        ]
    }, [filteredProgress, filteredSubmissions, selectedCampaignId])

    // Chart data
    const chartData = useMemo(() => {
        const displayProgress = filteredProgress
        const displaySubmissions = filteredSubmissions

        if (displayProgress.length === 0) return { campaignProgress: [], pointsByCampaign: [], statusDistribution: [] }

        const campaignProgress = displayProgress.map((progress) => {
            const campaign = progress.campaign
            const totalTasks = campaign.tasks.length
            const completedTasks = progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0

            return {
                name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
                points: progress.totalPoints,
                completed: completedTasks,
                total: totalTasks,
                progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            }
        })

        const pointsByCampaign = progressList
            .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
            .slice(0, 6)
            .map((progress) => {
                const campaign = progress.campaign
                return {
                    name: campaign.name.length > 12 ? campaign.name.substring(0, 12) + '...' : campaign.name,
                    points: progress.totalPoints,
                    tasks: campaign.tasks.length,
                    completed: progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0,
                }
            })

        const completedTasks = displaySubmissions.filter((s: any) => s.status === 'APPROVED').length
        const pendingTasks = displaySubmissions.filter((s: any) => s.status === 'SUBMITTED').length
        const rejectedTasks = displaySubmissions.filter((s: any) => s.status === 'REJECTED').length

        const statusDistribution = [
            { name: 'সম্পন্ন', value: completedTasks, color: '#10b981' },
            { name: 'অপেক্ষমান', value: pendingTasks, color: '#f59e0b' },
            { name: 'প্রত্যাখ্যাত', value: rejectedTasks, color: '#ef4444' },
        ]

        return { campaignProgress, pointsByCampaign, statusDistribution }
    }, [filteredProgress, filteredSubmissions, progressList])

    if (!user) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Card className="max-w-md bg-neutral-900/40 backdrop-blur-xl border-white/10">
                    <CardContent className="p-12 text-center">
                        <Trophy className="w-16 h-16 text-neutral-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-3">সাইন ইন প্রয়োজন</h2>
                        <p className="text-neutral-400 mb-6">আপনার অগ্রগতি দেখতে দয়া করে সাইন ইন করুন।</p>
                        <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600">
                            <Link href="/auth/sign-in">সাইন ইন</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-neutral-400 text-lg">আপনার অগ্রগতি লোড হচ্ছে...</p>
                </div>
            </div>
        )
    }

    if (progressList.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-950">
                {/* Hero Section */}
                <div className="relative border-b border-white/5 bg-neutral-950 pt-20 pb-16">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute w-[1000px] h-[1000px] bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-violet-600/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
                    </div>

                    <div className="relative container mx-auto max-w-4xl px-6 py-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-neutral-300 font-medium">আপনার যাত্রা</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-4xl font-black tracking-tight mb-6">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                                আমার অগ্রগতি
                            </span>
                        </h1>

                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            আপনার ক্যাম্পেইন অগ্রগতি এবং অর্জন ট্র্যাক করুন
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                <div className="container mx-auto max-w-4xl px-6 py-16">
                    <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 mb-6">
                                <Target className="w-16 h-16 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">এখনো কোনো ক্যাম্পেইন নেই</h3>
                            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                                আপনি এখনো কোনো ক্যাম্পেইনে যোগ দেননি। উপলব্ধ ক্যাম্পেইনগুলো দেখুন এবং পুরস্কার অর্জন শুরু করুন!
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
                            >
                                <Link href="/campaigns" className="gap-2">
                                    ক্যাম্পেইন দেখুন
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Hero Section */}
            <div className="relative border-b border-white/5 bg-neutral-950 pt-20 pb-16">
                {/* Dynamic Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-[1000px] h-[1000px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-600/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
                    <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 bottom-0 right-0 animate-pulse delay-1000" />
                </div>

                <div className="relative container mx-auto max-w-7xl px-6 pt-16">
                    <div className="flex items-center justify-between mb-12">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm text-neutral-300 font-medium">আপনার যাত্রা</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-black tracking-tight mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                                    আমার অগ্রগতি
                                </span>
                            </h1>

                            <p className="text-xl text-neutral-400 leading-relaxed">
                                আপনার ক্যাম্পেইন অগ্রগতি এবং অর্জন ট্র্যাক করুন
                            </p>
                        </div>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/5 bg-neutral-900/40 backdrop-blur-sm"
                            onClick={async () => {
                                const [progressData, submissionsData] = await Promise.all([
                                    getUserCampaignProgress(),
                                    getUserSubmissions(),
                                ])
                                setProgressList((progressData || []) as any[])
                                setSubmissions((submissionsData || []) as any[])

                                // Fetch achievements from API
                                const achievementsRes = await fetch('/api/user/achievements')
                                if (achievementsRes.ok) {
                                    const achievementsData = await achievementsRes.json()
                                    setAchievements(achievementsData.data || [])
                                }
                            }}
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            রিফ্রেশ
                        </Button>
                    </div>

                    {/* Campaign Selector */}
                    {progressList.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-semibold text-white">
                                    {selectedCampaignId ? 'ক্যাম্পেইন বিবরণ' : 'সব ক্যাম্পেইন'}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {/* All Campaigns Button */}
                                <button
                                    onClick={() => setSelectedCampaignId(null)}
                                    className={`
                                        px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                                        ${!selectedCampaignId
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                            : 'bg-neutral-900/60 border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                                        }
                                    `}
                                >
                                    সব ক্যাম্পেইন
                                </button>

                                {/* Individual Campaign Buttons */}
                                {progressList.map((progress, index) => {
                                    const campaign = progress.campaign
                                    const isSelected = selectedCampaignId === campaign.id
                                    const theme = gradientThemes[index % gradientThemes.length]

                                    return (
                                        <button
                                            key={campaign.id}
                                            onClick={() => setSelectedCampaignId(campaign.id)}
                                            className={`
                                                px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                                                ${isSelected
                                                    ? `bg-gradient-to-r from-${theme.from} to-${theme.to} text-white shadow-lg`
                                                    : 'bg-neutral-900/60 border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                                                }
                                            `}
                                        >
                                            {campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-neutral-950">
                <div className="container mx-auto max-w-7xl px-6 py-12">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-4 mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <Card
                                    key={stat.label}
                                    className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                    <CardContent className="relative p-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
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

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {/* Campaign Progress Area Chart */}
                        <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10">
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">ক্যাম্পেইন অগ্রগতি</h3>
                                        <p className="text-sm text-neutral-400">প্রতি ক্যাম্পেইনে পয়েন্ট</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData.campaignProgress}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                                        <XAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid #374151',
                                                borderRadius: '6px',
                                            }}
                                            formatter={(value: any) => `${value} পয়েন্ট`}
                                        />
                                        <Area type="monotone" dataKey="points" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                        <Area type="monotone" dataKey="completed" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Status Distribution Donut Chart */}
                        <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10">
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
                                        <PieChart className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">জমা দেওয়ার অবস্থা</h3>
                                        <p className="text-sm text-neutral-400">টাস্ক সম্পন্নের বিস্তারিত</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            dataKey="value"
                                        >
                                            {chartData.statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid #374151',
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Points by Campaign Bar Chart */}
                    <Card className="bg-neutral-900/40 backdrop-blur-xl border-white/10 mb-12">
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20">
                                    <Award className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">ক্যাম্পেইন অনুযায়ী পয়েন্ট</h3>
                                    <p className="text-sm text-neutral-400">আপনার সেরা পারফর্মিং ক্যাম্পেইনগুলো</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.pointsByCampaign}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                                    <XAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            border: '1px solid #374151',
                                            borderRadius: '6px',
                                        }}
                                        cursor={{ fill: '#8b5cf6' }}
                                    />
                                    <Bar dataKey="points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="completed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Campaign Progress Cards */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20">
                                <Target className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedCampaignId ? 'নির্বাচিত ক্যাম্পেইন' : 'আপনার ক্যাম্পেইন'}
                                </h2>
                                <p className="text-sm text-neutral-400">
                                    {selectedCampaignId ? 'ক্যাম্পেইন বিবরণ এবং অগ্রগতি' : 'আপনার সব সক্রিয় ক্যাম্পেইন'}
                                </p>
                            </div>
                        </div>

                        {filteredProgress.length === 0 ? (
                            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                                <CardContent className="p-12 text-center">
                                    <Target className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">কোনো তথ্য পাওয়া যায়নি</h3>
                                    <p className="text-sm text-neutral-400">
                                        {selectedCampaignId ? 'এই ক্যাম্পেইনের জন্য কোনো অগ্রগতির তথ্য নেই' : 'কোনো ক্যাম্পেইন পাওয়া যায়নি'}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {filteredProgress.map((progress: any, index: number) => {
                                    const campaign = progress.campaign
                                    const totalTasks = campaign.tasks.length
                                    const completedInCampaign = progress.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0
                                    const progressPercent = totalTasks > 0 ? (completedInCampaign / totalTasks) * 100 : 0
                                    const theme = gradientThemes[index % gradientThemes.length]
                                    const statusIcons = {
                                        COMPLETED: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                                        IN_PROGRESS: <Flame className="w-4 h-4 text-orange-400" />,
                                        JOINED: <Clock className="w-4 h-4 text-blue-400" />,
                                    }

                                    const gradientOpacity = `from-${theme.from}-5 via-${theme.via}-5 to-${theme.to}-5`

                                    return (
                                        <Card
                                            key={progress.id}
                                            className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Gradient Background */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${gradientOpacity} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                            <div className="relative p-6">
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-bold text-white text-lg">{campaign.name}</h3>
                                                            {statusIcons[progress.status as keyof typeof statusIcons]}
                                                        </div>
                                                        <p className="text-sm text-neutral-400 line-clamp-2">{campaign.description}</p>
                                                    </div>
                                                    <Link href={`/campaigns/${campaign.id}`}>
                                                        <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/5">
                                                            দেখুন
                                                        </Button>
                                                    </Link>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-neutral-400">অগ্রগতি</span>
                                                        <span className="font-medium text-white">
                                                            {completedInCampaign} / {totalTasks} টাস্ক
                                                        </span>
                                                    </div>
                                                    <Progress value={progressPercent} className="h-2" />
                                                    <div className="text-right text-xs text-neutral-500 mt-1">{Math.round(progressPercent)}% সম্পন্ন</div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                                        <span className="text-sm font-medium text-white">{progress.totalPoints} পয়েন্ট</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Submissions */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-600/20">
                                <Clock className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">সাম্প্রতিক জমা</h2>
                                <p className="text-sm text-neutral-400">
                                    {selectedCampaignId ? 'ক্যাম্পেইন জমা' : 'আপনার সাম্প্রতিক টাস্ক জমা'}
                                </p>
                            </div>
                        </div>

                        {filteredSubmissions.length === 0 ? (
                            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                                <CardContent className="p-12 text-center">
                                    <XCircle className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">এখনো কোনো জমা নেই</h3>
                                    <p className="text-sm text-neutral-400">
                                        {selectedCampaignId ? 'এই ক্যাম্পেইনের জন্য কোনো জমা নেই' : 'পয়েন্ট অর্জন করতে ক্যাম্পেইনে টাস্ক সম্পন্ন করুন!'}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {filteredSubmissions.slice(0, 10).map((submission: any) => {
                                    const statusConfig = {
                                        APPROVED: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'অনুমোদিত' },
                                        REJECTED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'প্রত্যাখ্যাত' },
                                        SUBMITTED: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'অপেক্ষমান' },
                                        DRAFT: { icon: Clock, color: 'text-neutral-400', bg: 'bg-neutral-500/20', label: 'খসড়া' },
                                    }
                                    const config = statusConfig[submission.status as keyof typeof statusConfig]
                                    const Icon = config.icon

                                    return (
                                        <Card
                                            key={submission.id}
                                            className="group bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300"
                                        >
                                            <CardContent className="p-5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                                                                {submission.task.name}
                                                            </h3>
                                                            <Badge className={`${config.bg} ${config.color} border-0`}>
                                                                <Icon className="w-3 h-3 mr-1" />
                                                                {config.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-neutral-500">
                                                            {submission.progress?.campaign?.name || 'অজানা ক্যাম্পেইন'}
                                                        </p>
                                                        {submission.feedback && (
                                                            <p className="text-sm text-neutral-400 mt-2 italic">{submission.feedback}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                                                        {submission.submittedAt && (
                                                            <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Achievements Section */}
                    <div className="mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20">
                                <Award className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">আপনার অর্জন</h2>
                                <p className="text-sm text-neutral-400">প্ল্যাটফর্মে আপনার সাফল্য ট্র্যাক করুন</p>
                            </div>
                        </div>

                        {/* Achievement Stats */}
                        <div className="grid gap-4 md:grid-cols-4 mb-8">
                            {(() => {
                                const unlockedCount = achievements.filter(a => a.userUnlocked).length
                                const totalXP = achievements.filter(a => a.userUnlocked).reduce((sum, a) => sum + a.xp, 0)
                                const inProgressCount = achievements.filter(a => !a.userUnlocked && a.userProgress > 0).length

                                return [
                                    { label: 'আনলক করা', value: `${unlockedCount}/${achievements.length}`, icon: Award, color: 'from-amber-500 to-yellow-600' },
                                    { label: 'মোট XP', value: totalXP.toLocaleString(), icon: Sparkles, color: 'from-cyan-500 to-blue-600' },
                                    { label: 'চলমান', value: inProgressCount.toString(), icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
                                    { label: 'উপলব্ধ', value: (achievements.length - unlockedCount).toString(), icon: Target, color: 'from-emerald-500 to-teal-600' },
                                ]
                            })().map((stat, index) => {
                                const Icon = stat.icon
                                return (
                                    <Card
                                        key={stat.label}
                                        className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                        <CardContent className="relative p-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
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

                        {/* Achievements Grid */}
                        {achievements.length === 0 ? (
                            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                                <CardContent className="p-12 text-center">
                                    <Award className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">এখনো কোনো অর্জন নেই</h3>
                                    <p className="text-sm text-neutral-400">
                                        অর্জন অর্জন করতে টাস্ক সম্পন্ন করুন এবং প্ল্যাটফর্মের সাথে যুক্ত হন!
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {achievements.map((achievement) => {
                                    const tierColors = {
                                        BRONZE: { bg: 'from-orange-900/40 to-amber-900/40', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20' },
                                        SILVER: { bg: 'from-slate-700/40 to-gray-600/40', border: 'border-slate-400/30', text: 'text-slate-300', badge: 'bg-slate-500/20' },
                                        GOLD: { bg: 'from-yellow-900/40 to-amber-700/40', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20' },
                                        PLATINUM: { bg: 'from-cyan-900/40 to-sky-700/40', border: 'border-cyan-400/30', text: 'text-cyan-300', badge: 'bg-cyan-500/20' },
                                        DIAMOND: { bg: 'from-blue-900/40 to-indigo-800/40', border: 'border-blue-400/30', text: 'text-blue-300', badge: 'bg-blue-500/20' },
                                        LEGENDARY: { bg: 'from-purple-900/40 to-pink-800/40', border: 'border-purple-400/30', text: 'text-purple-300', badge: 'bg-purple-500/20' },
                                    }
                                    const tier = tierColors[achievement.tier as keyof typeof tierColors] || tierColors.BRONZE

                                    return (
                                        <Card
                                            key={achievement.id}
                                            className={`group relative bg-neutral-900/40 backdrop-blur-xl ${achievement.userUnlocked ? tier.border : 'border-white/10'} hover:border-white/20 transition-all duration-300 overflow-hidden`}
                                        >
                                            {/* Tier Background Gradient */}
                                            {achievement.userUnlocked && (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${tier.bg} opacity-50`} />
                                            )}

                                            <CardContent className="relative p-6">
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div className={`text-4xl ${achievement.userUnlocked ? '' : 'grayscale opacity-40'}`}>
                                                        {achievement.icon || '🏆'}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className={`font-bold ${achievement.userUnlocked ? 'text-white' : 'text-neutral-500'}`}>
                                                                {achievement.name}
                                                            </h3>
                                                            <Badge className={`${tier.badge} ${tier.text} border-0 text-xs`}>
                                                                {achievement.tier}
                                                            </Badge>
                                                        </div>
                                                        <p className={`text-sm mb-3 ${achievement.userUnlocked ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                                            {achievement.description}
                                                        </p>

                                                        {/* Progress or XP */}
                                                        {achievement.userUnlocked ? (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Sparkles className={`w-4 h-4 ${tier.text}`} />
                                                                <span className={`${tier.text} font-medium`}>+{achievement.xp} XP</span>
                                                            </div>
                                                        ) : achievement.userProgress > 0 ? (
                                                            <div>
                                                                <div className="flex justify-between text-xs mb-1">
                                                                    <span className="text-neutral-400">অগ্রগতি</span>
                                                                    <span className="text-neutral-300">
                                                                        {achievement.userProgress} / {(achievement.requirements as any)?.count || '?'}
                                                                    </span>
                                                                </div>
                                                                <Progress
                                                                    value={Math.min((achievement.userProgress / ((achievement.requirements as any)?.count || 1)) * 100, 100)}
                                                                    className="h-1.5"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                                <Lock className="w-4 h-4" />
                                                                <span>শুরু হয়নি</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
