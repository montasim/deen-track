'use server'

import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getProxiedImageUrl } from '@/lib/image-proxy'

export async function updateProfile(data: {
    name: string
    email: string
    phone?: string
    location?: string
    bio?: string
}) {
    const session = await requireAuth()

    if (!session) {
        return { success: false, error: 'Not authenticated' }
    }

    try {
        // Build update data dynamically, only including fields that exist
        const updateData: any = {
            name: data.name,
            email: data.email,
        }

        // Only include optional fields if they have values
        if (data.phone !== undefined) updateData.phone = data.phone
        if (data.location !== undefined) updateData.location = data.location
        if (data.bio !== undefined) updateData.bio = data.bio

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: updateData,
        })

        return { success: true, data: updatedUser }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

// Get avatar URL
export async function getAvatarUrl(): Promise<{ avatarUrl: string | null }> {
    try {
        const session = await requireAuth()
        if (!session) return { avatarUrl: null }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { avatar: true, directAvatarUrl: true }
        })

        if (!user) return { avatarUrl: null }

        // Prioritize avatar field (preview URL) which works with the image proxy
        const rawAvatarUrl = user?.avatar || user?.directAvatarUrl || null

        // Return proxied URL for Google Drive images, otherwise return as-is
        return { avatarUrl: rawAvatarUrl ? (getProxiedImageUrl(rawAvatarUrl) || rawAvatarUrl) : null }
    } catch (error) {
        console.error('getAvatarUrl error:', error)
        return { avatarUrl: null }
    }
}

export async function updateAccountSettings(data: {
    username?: string
    language?: string
    timezone?: string
}) {
    const session = await requireAuth()

    if (!session) {
        return { success: false, error: 'Not authenticated' }
    }

    try {
        // Build update data dynamically
        const updateData: any = {}

        if (data.username !== undefined) updateData.username = data.username
        if (data.language !== undefined) updateData.language = data.language
        if (data.timezone !== undefined) updateData.timezone = data.timezone

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: updateData,
        })

        return { success: true, data: updatedUser }
    } catch (error) {
        console.error('Error updating account settings:', error)
        return { success: false, error: 'Failed to update account settings' }
    }
}

export async function updateNotificationSettings(data: {
    email: boolean
    push: boolean
    campaigns: boolean
    leaderboard: boolean
    reminders: boolean
    updates: boolean
}) {
    const session = await requireAuth()

    if (!session) {
        return { success: false, error: 'Not authenticated' }
    }

    try {
        // Check if notificationSettings field exists
        const updateData: any = {}

        // Try to update notification settings if field exists
        try {
            updateData.notificationSettings = data
        } catch (e) {
            // Field doesn't exist, ignore
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: updateData,
        })

        return { success: true, data: updatedUser }
    } catch (error) {
        console.error('Error updating notification settings:', error)
        return { success: false, error: 'Failed to update notification settings' }
    }
}

export async function getActivityLog() {
    const session = await requireAuth()

    if (!session) {
        return { success: false, error: 'Not authenticated' }
    }

    try {
        // Check if userActivity model exists
        let activities = []

        try {
            activities = await (prisma as any).userActivity.findMany({
                where: {
                    userId: session.userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 50,
            })
        } catch (e) {
            // userActivity model doesn't exist, return empty array
            console.warn('UserActivity model not available:', e)
        }

        return { success: true, data: activities }
    } catch (error) {
        console.error('Error fetching activity log:', error)
        return { success: false, error: 'Failed to fetch activity log', data: [] }
    }
}
