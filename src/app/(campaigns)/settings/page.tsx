'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    User,
    Settings as SettingsIcon,
    Palette,
    Bell,
    Activity,
    ChevronRight,
    Shield,
    Globe,
    Sparkles,
    Link as LinkIcon,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    UserSettings,
    AccountSettings,
    ConnectedAccountsSettings,
    AppearanceSettings,
    NotificationSettings,
    ActivitySettings,
} from './settings-components'

const settingsSections = [
    {
        id: 'profile',
        title: 'Profile',
        description: 'Manage your public profile and personal information',
        icon: User,
        color: 'from-cyan-500 to-blue-600',
    },
    {
        id: 'account',
        title: 'Account',
        description: 'Update your account settings and preferences',
        icon: Shield,
        color: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'connected-accounts',
        title: 'Connected Accounts',
        description: 'Manage your social login accounts',
        icon: LinkIcon,
        color: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'appearance',
        title: 'Appearance',
        description: 'Customize themes and display settings',
        icon: Palette,
        color: 'from-violet-500 to-purple-600',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description: 'Configure how you receive notifications',
        icon: Bell,
        color: 'from-amber-500 to-orange-600',
    },
    {
        id: 'activity',
        title: 'Activity',
        description: 'View your recent activity history',
        icon: Activity,
        color: 'from-pink-500 to-rose-600',
    },
]

export default function SettingsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [activeSection, setActiveSection] = useState('profile')

    // Redirect admins and unauthenticated users
    if (!user) {
        router.push('/auth/sign-in')
        return null
    }

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/dashboard/admin/campaigns')
        return null
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'profile':
                return <UserSettings />
            case 'account':
                return <AccountSettings />
            case 'connected-accounts':
                return <ConnectedAccountsSettings />
            case 'appearance':
                return <AppearanceSettings />
            case 'notifications':
                return <NotificationSettings />
            case 'activity':
                return <ActivitySettings />
            default:
                return <UserSettings />
        }
    }

    return (
        <>
            {/* Hero Section */}
            <div className="relative border-b border-white/5 bg-neutral-950">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Geometric Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(30deg, #ffffff08 12%, transparent 12.5%, transparent 87%, #ffffff08 87.5%, #ffffff08),
                                linear-gradient(150deg, #ffffff08 12%, transparent 12.5%, transparent 87%, #ffffff08 87.5%, #ffffff08),
                                linear-gradient(30deg, #ffffff08 12%, transparent 12.5%, transparent 87%, #ffffff08 87.5%, #ffffff08),
                                linear-gradient(150deg, #ffffff08 12%, transparent 12.5%, transparent 87%, #ffffff08 87.5%, #ffffff08),
                                linear-gradient(60deg, #ffffff03 25%, transparent 25.5%, transparent 75%, #ffffff03 75%, #ffffff03),
                                linear-gradient(60deg, #ffffff03 25%, transparent 25.5%, transparent 75%, #ffffff03 75%, #ffffff03)
                            `,
                            backgroundSize: '80px 140px',
                            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
                        }} />
                    </div>

                    {/* Gradient Orbs */}
                    <div className="absolute w-[900px] h-[900px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-teal-600/20 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/3 animate-pulse" />
                    <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-rose-600/15 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 bottom-0 right-1/4 animate-pulse delay-700" />
                </div>

                <div className="relative container mx-auto max-w-7xl px-6 py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 mb-6">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-cyan-300 font-medium">Personalize Your Experience</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-4xl font-black tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 bg-clip-text text-transparent">
                                My Settings
                            </span>
                        </h1>

                        <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl">
                            Customize your profile, manage preferences, and control your experience
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-neutral-950">
                <div className="container mx-auto max-w-7xl px-6 py-12">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-4">
                                {settingsSections.map((section) => {
                                    const Icon = section.icon
                                    const isActive = activeSection === section.id

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`
                                                w-full group relative overflow-hidden rounded-xl p-4
                                                transition-all duration-300 text-left
                                                ${isActive
                                                    ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-lg shadow-cyan-500/20'
                                                    : 'bg-neutral-900/40 border border-white/10 hover:border-white/20 hover:bg-neutral-900/60'
                                                }
                                            `}
                                        >
                                            <div className="relative flex items-center gap-4">
                                                <div className={`
                                                    flex-shrink-0 p-2.5 rounded-lg transition-all duration-300
                                                    ${isActive ? 'bg-white/20' : 'bg-neutral-800/50 group-hover:bg-neutral-700/50'}
                                                `}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`font-semibold text-sm mb-0.5 ${isActive ? 'text-white' : 'text-white'}`}>
                                                        {section.title}
                                                    </div>
                                                    <div className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral-400'}`}>
                                                        {section.description}
                                                    </div>
                                                </div>
                                                <ChevronRight className={`
                                                    w-4 h-4 transition-all duration-300 flex-shrink-0
                                                    ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50'}
                                                `} />
                                            </div>

                                            {/* Active indicator line */}
                                            {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/50 to-white/20" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Main Settings Panel */}
                        <div className="lg:col-span-8">
                            <div className="relative">
                                {/* Decorative background elements */}
                                <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

                                <Card className="relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 overflow-hidden">
                                    {/* Header with active section title */}
                                    <div className="border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                p-3 rounded-xl
                                                ${activeSection === 'profile' && 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20'}
                                                ${activeSection === 'account' && 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20'}
                                                ${activeSection === 'connected-accounts' && 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'}
                                                ${activeSection === 'appearance' && 'bg-gradient-to-br from-violet-500/20 to-purple-600/20'}
                                                ${activeSection === 'notifications' && 'bg-gradient-to-br from-amber-500/20 to-orange-600/20'}
                                                ${activeSection === 'activity' && 'bg-gradient-to-br from-pink-500/20 to-rose-600/20'}
                                            `}>
                                                {(() => {
                                                    const Icon = settingsSections.find(s => s.id === activeSection)?.icon || SettingsIcon
                                                    return <Icon className="w-6 h-6 text-white" />
                                                })()}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-white">
                                                    {settingsSections.find(s => s.id === activeSection)?.title}
                                                </h2>
                                                <p className="text-sm text-neutral-400">
                                                    {settingsSections.find(s => s.id === activeSection)?.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8">
                                        {renderActiveSection()}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
