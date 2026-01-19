import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  params?: {
    unreadOnly?: boolean
    limit?: number
    skip?: number
  }
) {
  const { unreadOnly = false, limit = 20, skip = 0 } = params || {}

  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(unreadOnly && { isRead: false }),
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.notification.count({ where }),
  ])

  return { notifications, total }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  })
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

/**
 * Mark all notifications as read for user
 */
export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string, userId: string) {
  return prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId,
    },
  })
}

/**
 * Delete all notifications for user
 */
export async function deleteAllNotifications(userId: string) {
  return prisma.notification.deleteMany({
    where: { userId },
  })
}

/**
 * Create notification
 */
export async function createNotification(data: {
  userId: string
  type: string
  title: string
  message: string
  linkUrl?: string
}) {
  return prisma.notification.create({
    data: {
      ...data,
      type: data.type as any, // Cast to any to bypass strict type checking for dynamic types
    },
  })
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
  notifications: Array<{
    userId: string
    type: string
    title: string
    message: string
    linkUrl?: string
  }>
) {
  return prisma.notification.createMany({
    data: notifications.map(n => ({
      ...n,
      type: n.type as any, // Cast to any to bypass strict type checking for dynamic types
    })),
  })
}
