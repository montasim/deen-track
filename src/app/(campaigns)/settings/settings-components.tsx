'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Upload,
    Camera,
    Shield,
    Globe,
    Bell,
    BellRing,
    Mail as MailIcon,
    Activity,
    CheckCircle2,
    Clock,
    XCircle,
    Filter,
    Palette,
    Link as LinkIcon,
    Loader2,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/hooks/use-toast'
import { getProxiedImageUrl } from '@/lib/image-proxy'
import { getUserInitials } from '@/lib/utils/user'
import {
    updateProfile,
    updateAccountSettings,
    updateNotificationSettings,
    getActivityLog,
} from './actions'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

// ==================== USER SETTINGS COMPONENT ====================

export function UserSettings() {
    const { user } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Get proxied avatar URL for Google Drive images (same approach as topbar)
    const avatarUrl = useMemo(() => {
        const rawUrl = user?.avatar ?? (user as any)?.directAvatarUrl ?? undefined
        return rawUrl ? (getProxiedImageUrl(rawUrl) || rawUrl) : undefined
    }, [user?.avatar, (user as any)?.directAvatarUrl])

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: (user as any)?.phone || '',
        location: (user as any)?.location || '',
        bio: (user as any)?.bio || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updateProfile(formData)

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Your profile has been updated successfully.",
                    variant: "default",
                })
                router.refresh()
            } else {
                throw new Error(result.error || 'Failed to update profile')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/30 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={avatarUrl}
                            alt={user?.name || 'Profile'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-bold text-cyan-400">
                            {user ? getUserInitials(user) : 'U'}
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-white/20 hover:bg-white/5"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-neutral-400 hover:text-white"
                        >
                            Remove
                        </Button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                        Recommended: Square image, at least 400x400px
                    </p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="pl-10 bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="pl-10 bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="pl-10 bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="pl-10 bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500 min-h-[120px] resize-none"
                        placeholder="Tell us a bit about yourself..."
                        maxLength={500}
                    />
                    <div className="text-xs text-neutral-500 text-right">
                        {formData.bio.length} / 500
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 hover:bg-white/5"
                    onClick={() => setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: (user as any)?.phone || '',
                        location: (user as any)?.location || '',
                        bio: (user as any)?.bio || '',
                    })}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
                >
                    {isLoading ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

// ==================== ACCOUNT SETTINGS COMPONENT ====================

export function AccountSettings() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: (user as any)?.username || '',
        language: (user as any)?.language || 'en',
        timezone: (user as any)?.timezone || 'UTC',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updateAccountSettings(formData)

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Your account settings have been updated.",
                    variant: "default",
                })
            } else {
                throw new Error(result.error || 'Failed to update settings')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update settings",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">@</span>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="pl-8 bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500"
                            placeholder="username"
                            required
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 hover:bg-white/5"
                    >
                        Check Availability
                    </Button>
                </div>
                <p className="text-xs text-neutral-500">
                    Username can contain letters, numbers, and underscores
                </p>
            </div>

            {/* Preferences */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="language" className="text-white">Language</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                        <SelectTrigger className="bg-neutral-900/50 border-white/10 text-white">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                        <SelectTrigger className="bg-neutral-900/50 border-white/10 text-white">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10">
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">GMT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/50 border border-white/10">
                    <div>
                        <div className="font-medium text-white mb-1">Password</div>
                        <div className="text-sm text-neutral-400">Last changed 3 months ago</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5">
                        Change Password
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25"
                >
                    {isLoading ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

// ==================== CONNECTED ACCOUNTS COMPONENT ====================

interface SocialAccount {
    id: string
    provider: 'GOOGLE' | 'GITHUB'
    providerEmail: string
}

export function ConnectedAccountsSettings() {
    const { toast } = useToast()
    const [accounts, setAccounts] = useState<SocialAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [revoking, setRevoking] = useState<string | null>(null)

    useEffect(() => {
        fetchAccounts()
    }, [])

    async function fetchAccounts() {
        try {
            const response = await fetch('/api/user/social-accounts')
            const data = await response.json()

            if (response.ok) {
                setAccounts(data.accounts || [])
            }
        } catch (error) {
            console.error('Failed to fetch social accounts:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleProviderToggle(provider: 'GOOGLE' | 'GITHUB', checked: boolean) {
        if (checked) {
            // Trigger OAuth flow
            try {
                const response = await fetch(`/api/auth/oauth/${provider.toLowerCase()}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        redirect: '/settings',
                        connect: provider.toLowerCase()
                    }),
                })

                const result = await response.json()

                if (!response.ok) {
                    toast({
                        variant: 'destructive',
                        title: 'OAuth Error',
                        description: result.error || 'Failed to initiate OAuth flow',
                    })
                    return
                }

                // Redirect to OAuth provider
                window.location.href = result.url
            } catch (error) {
                console.error('OAuth error:', error)
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'An error occurred. Please try again.',
                })
            }
        } else {
            // Revoke account
            setRevoking(provider)
            try {
                const response = await fetch(`/api/user/social-accounts/${provider.toLowerCase()}`, {
                    method: 'DELETE'
                })

                const data = await response.json()

                if (!response.ok) {
                    toast({
                        variant: 'destructive',
                        title: 'Failed to disconnect',
                        description: data.error || 'Could not disconnect social account'
                    })
                    return
                }

                toast({
                    title: 'Account disconnected',
                    description: data.message || 'Social account removed successfully'
                })

                await fetchAccounts()
            } catch (error) {
                console.error('Failed to revoke social account:', error)
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to disconnect social account'
                })
            } finally {
                setRevoking(null)
            }
        }
    }

    const getProviderInfo = (provider: 'GOOGLE' | 'GITHUB') => {
        switch (provider) {
            case 'GOOGLE':
                return {
                    name: 'Google',
                    icon: 'G',
                    color: 'bg-red-500',
                    description: 'Sign in quickly with your Google account'
                }
            case 'GITHUB':
                return {
                    name: 'GitHub',
                    icon: 'GH',
                    color: 'bg-neutral-700',
                    description: 'Sign in quickly with your GitHub account'
                }
        }
    }

    const isProviderConnected = (provider: 'GOOGLE' | 'GITHUB') => {
        return accounts.some(acc => acc.provider === provider)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-neutral-400">Loading connected accounts...</p>
                </div>
            </div>
        )
    }

    const providers: Array<'GOOGLE' | 'GITHUB'> = ['GOOGLE', 'GITHUB']

    return (
        <div className="space-y-6">
            {providers.map((provider) => {
                const isConnected = isProviderConnected(provider)
                const providerInfo = getProviderInfo(provider)
                const account = accounts.find(acc => acc.provider === provider)

                return (
                    <div
                        key={provider}
                        className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${providerInfo.color} flex items-center justify-center`}>
                                <span className="text-white font-bold">{providerInfo.icon}</span>
                            </div>
                            <div>
                                <div className="font-medium text-white mb-1">{providerInfo.name}</div>
                                {isConnected && account ? (
                                    <div className="text-sm text-neutral-400">
                                        Connected as {account.providerEmail}
                                    </div>
                                ) : (
                                    <div className="text-sm text-neutral-400">
                                        {providerInfo.description}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Switch
                            checked={isConnected}
                            onCheckedChange={(checked) => handleProviderToggle(provider, checked)}
                            disabled={revoking === provider}
                            className="data-[state=checked]:bg-cyan-500"
                        />
                    </div>
                )
            })}

            <div className="p-4 rounded-xl bg-neutral-900/30 border border-dashed border-white/20">
                <p className="text-sm text-center text-neutral-400">
                    Toggle a provider to connect, then sign in with that account to complete the connection
                </p>
            </div>
        </div>
    )
}

// ==================== APPEARANCE SETTINGS COMPONENT ====================

export function AppearanceSettings() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [theme, setTheme] = useState('dark')
    const [accentColor, setAccentColor] = useState('cyan')

    const handleSave = async () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Success",
                description: "Your appearance preferences have been saved.",
                variant: "default",
            })
        }, 1000)
    }

    const themes = [
        { id: 'dark', name: 'Dark', description: 'Sleek dark theme', preview: 'bg-neutral-900' },
        { id: 'light', name: 'Light', description: 'Clean light theme', preview: 'bg-white' },
        { id: 'system', name: 'System', description: 'Follow system preference', preview: 'bg-gradient-to-r from-neutral-900 to-white' },
    ]

    const accentColors = [
        { id: 'cyan', name: 'Cyan', color: 'bg-cyan-500' },
        { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
        { id: 'violet', name: 'Violet', color: 'bg-violet-500' },
        { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
        { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
    ]

    return (
        <div className="space-y-8">
            {/* Theme Selection */}
            <Card className="bg-neutral-800/30 border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <Palette className="w-5 h-5 text-violet-400" />
                        <h3 className="text-lg font-semibold text-white">Theme</h3>
                    </div>
                    <p className="text-sm text-neutral-400">Choose your preferred color scheme</p>
                </div>
                <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTheme(t.id)}
                                className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                                    ${theme === t.id
                                        ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20'
                                        : 'border-white/10 hover:border-white/20 bg-neutral-900/50'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cn('w-12 h-12 rounded-lg', t.preview)} />
                                    <div>
                                        <div className="font-semibold text-white text-sm">{t.name}</div>
                                        <div className="text-xs text-neutral-400">{t.description}</div>
                                    </div>
                                </div>
                                {theme === t.id && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Accent Color */}
            <Card className="bg-neutral-800/30 border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <Palette className="w-5 h-5 text-violet-400" />
                        <h3 className="text-lg font-semibold text-white">Accent Color</h3>
                    </div>
                    <p className="text-sm text-neutral-400">Personalize with your favorite color</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-5 gap-4">
                        {accentColors.map((color) => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => setAccentColor(color.id)}
                                className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-300
                                    ${accentColor === color.id
                                        ? 'border-white bg-white/10'
                                        : 'border-white/10 hover:border-white/20 bg-neutral-900/50'
                                    }
                                `}
                            >
                                <div className={cn('w-full h-12 rounded-lg mb-2', color.color)} />
                                <div className="text-xs text-center text-neutral-300">{color.name}</div>
                                {accentColor === color.id && (
                                    <div className="absolute -top-2 -right-2">
                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                                            <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25"
                >
                    {isLoading ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

// ==================== NOTIFICATION SETTINGS COMPONENT ====================

export function NotificationSettings() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        campaigns: true,
        leaderboard: true,
        reminders: true,
        updates: false,
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await updateNotificationSettings(notifications)
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Your notification preferences have been saved.",
                    variant: "default",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save notification settings",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const notificationTypes = [
        { id: 'email', title: 'Email Notifications', description: 'Receive notifications via email', icon: MailIcon },
        { id: 'push', title: 'Push Notifications', description: 'Receive browser push notifications', icon: BellRing },
        { id: 'campaigns', title: 'Campaign Updates', description: 'Get notified about campaign activities', icon: Bell },
        { id: 'leaderboard', title: 'Leaderboard Changes', description: 'Updates when your ranking changes', icon: Bell },
        { id: 'reminders', title: 'Task Reminders', description: 'Reminders for upcoming deadlines', icon: Bell },
        { id: 'updates', title: 'Platform Updates', description: 'News and feature announcements', icon: Bell },
    ]

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                {notificationTypes.map((type) => {
                    const Icon = type.icon
                    return (
                        <div
                            key={type.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-amber-500/20">
                                    <Icon className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <div className="font-medium text-white">{type.title}</div>
                                    <div className="text-sm text-neutral-400">{type.description}</div>
                                </div>
                            </div>
                            <Switch
                                checked={notifications[type.id as keyof typeof notifications]}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, [type.id]: checked })}
                                className="data-[state=checked]:bg-amber-500"
                            />
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25"
                >
                    {isLoading ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

// ==================== ACTIVITY SETTINGS COMPONENT ====================

export function ActivitySettings() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [activities, setActivities] = useState<any[]>([])
    const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const result = await getActivityLog()
                if (result.success) {
                    setActivities(result.data || [])
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load activity log",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivities()
    }, [toast])

    const filteredActivities = activities.filter((activity) => {
        if (filter === 'all') return true
        if (filter === 'success') return activity.success
        if (filter === 'failed') return !activity.success
        return true
    })

    const statusConfig = {
        success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20' },
        failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/20' },
        pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/20' },
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-neutral-400">Loading activity...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-neutral-800/30 border border-white/10 p-4">
                    <div className="text-2xl font-bold text-white mb-1">{activities.length}</div>
                    <div className="text-sm text-neutral-400">Total Activities</div>
                </Card>
                <Card className="bg-neutral-800/30 border border-white/10 p-4">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">
                        {activities.filter(a => a.success).length}
                    </div>
                    <div className="text-sm text-neutral-400">Successful</div>
                </Card>
                <Card className="bg-neutral-800/30 border border-white/10 p-4">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                        {activities.filter(a => !a.success).length}
                    </div>
                    <div className="text-sm text-neutral-400">Failed</div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-neutral-800/30 border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-pink-400" />
                        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    </div>
                </div>
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-neutral-500" />
                        <div className="flex gap-2">
                            {(['all', 'success', 'failed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                                        ${filter === f
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-neutral-900/50 text-neutral-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    {filteredActivities.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                            <p className="text-neutral-400">No activity found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredActivities.slice(0, 10).map((activity) => {
                                const status = activity.success ? 'success' : 'failed'
                                const config = statusConfig[status]
                                const Icon = config.icon

                                return (
                                    <div
                                        key={activity.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${config.border} ${config.bg}`}
                                    >
                                        <div className="p-2 rounded-lg bg-neutral-900/50">
                                            <Icon className={cn('w-4 h-4', config.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-white text-sm mb-1">
                                                {activity.description || activity.action}
                                            </div>
                                            <div className="text-xs text-neutral-400">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn(config.color, config.bg, 'border-0')}>
                                            {status}
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
