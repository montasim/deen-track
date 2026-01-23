import { prisma } from '@/lib/prisma'

export interface NoticeFilters {
  includeInactive?: boolean
}

export interface GetNoticesResult {
  notices: Array<{
    id: string
    title: string
    content: string
    isActive: boolean
    validFrom: Date | null
    validTo: Date | null
    order: number
    entryById: string
    entryBy: {
      id: string
      firstName: string | null
      lastName: string | null
      email: string
    } | null
    createdAt: Date
    updatedAt: Date
  }>
  total: number
}

export async function getNotices(filters: NoticeFilters = {}): Promise<GetNoticesResult> {
  const { includeInactive = false } = filters

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        entryBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.notice.count({
      where: includeInactive ? undefined : { isActive: true },
    }),
  ])

  return { notices, total }
}

export async function getNoticeById(id: string) {
  return prisma.notice.findUnique({
    where: { id },
    include: {
      entryBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  })
}

export async function getActiveNotices() {
  const now = new Date()

  return prisma.notice.findMany({
    where: {
      isActive: true,
      OR: [
        { validFrom: null, validTo: null },
        { validFrom: { lte: now }, validTo: null },
        { validFrom: null, validTo: { gte: now } },
        { validFrom: { lte: now }, validTo: { gte: now } },
      ],
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      content: true,
      order: true,
    },
  })
}

export interface CreateNoticeData {
  title: string
  content: string
  isActive: boolean
  validFrom: Date | null
  validTo: Date | null
  order: number
  entryById: string
}

export async function createNotice(data: CreateNoticeData) {
  return prisma.notice.create({
    data,
    include: {
      entryBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  })
}

export interface UpdateNoticeData {
  title?: string
  content?: string
  isActive?: boolean
  validFrom?: Date | null
  validTo?: Date | null
  order?: number
}

export async function updateNotice(id: string, data: UpdateNoticeData) {
  return prisma.notice.update({
    where: { id },
    data,
  })
}

export async function deleteNotice(id: string) {
  return prisma.notice.delete({
    where: { id },
  })
}
