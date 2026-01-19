import { prisma } from '@/lib/prisma'
import type { Notice, Prisma } from '@prisma/client'

export type NoticeWithEntryBy = Prisma.NoticeGetPayload<{
  include: {
    entryBy: {
      select: {
        id: true
        name: true
        email: true
        firstName: true
        lastName: true
      }
    }
  }
}>

/**
 * Get all notices
 */
export async function getNotices(params?: {
  skip?: number
  take?: number
  includeInactive?: boolean
  where?: Prisma.NoticeWhereInput
  orderBy?: Prisma.NoticeOrderByWithRelationInput
}): Promise<{ notices: NoticeWithEntryBy[]; total: number }> {
  const { skip = 0, take = 100, includeInactive = false, where, orderBy } = params || {}

  const whereClause: Prisma.NoticeWhereInput = {
    ...where,
    ...(includeInactive ? {} : { isActive: true }),
  }

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      skip,
      take,
      where: whereClause,
      orderBy: orderBy || { order: 'asc' },
      include: {
        entryBy: {
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.notice.count({ where: whereClause }),
  ])

  return { notices: notices as NoticeWithEntryBy[], total }
}

/**
 * Get notice by ID
 */
export async function getNoticeById(id: string): Promise<NoticeWithEntryBy | null> {
  return prisma.notice.findUnique({
    where: { id },
    include: {
      entryBy: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  }) as Promise<NoticeWithEntryBy | null>
}

/**
 * Get active notices (for public display)
 */
export async function getActiveNotices(): Promise<Array<{
  id: string
  title: string
  content: string
  order: number
}>> {
  const now = new Date()

  return prisma.notice.findMany({
    where: {
      isActive: true,
      OR: [
        { validFrom: null },
        { validFrom: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { validTo: null },
            { validTo: { gte: now } },
          ],
        },
      ],
    },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      content: true,
      order: true,
    },
  })
}

/**
 * Count notices
 */
export async function countNotices(where?: Prisma.NoticeWhereInput): Promise<number> {
  return prisma.notice.count({ where })
}

/**
 * Create notice
 */
export async function createNotice(
  data: Prisma.NoticeCreateInput
): Promise<NoticeWithEntryBy> {
  return prisma.notice.create({
    data,
    include: {
      entryBy: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  }) as Promise<NoticeWithEntryBy>
}

/**
 * Update notice
 */
export async function updateNotice(
  id: string,
  data: Prisma.NoticeUpdateInput
): Promise<NoticeWithEntryBy> {
  return prisma.notice.update({
    where: { id },
    data,
    include: {
      entryBy: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  }) as Promise<NoticeWithEntryBy>
}

/**
 * Delete notice
 */
export async function deleteNotice(id: string): Promise<Notice> {
  return prisma.notice.delete({
    where: { id },
  })
}
