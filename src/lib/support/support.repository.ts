import { prisma } from '@/lib/prisma'
import type { Prisma, TicketStatus, TicketPriority } from '@prisma/client'

// ============================================================================
// SUPPORT TICKETS
// ============================================================================

/**
 * Get support tickets
 */
export async function getTickets(params?: {
  skip?: number
  take?: number
  offset?: number
  limit?: number
  status?: string
  assignedToId?: string
  userId?: string
  where?: Prisma.SupportTicketWhereInput
  orderBy?: Prisma.SupportTicketOrderByWithRelationInput
}) {
  const {
    skip = 0,
    take,
    offset = 0,
    limit,
    status,
    assignedToId,
    userId,
    where,
    orderBy,
  } = params || {}

  // Build the where clause from either direct params or the where object
  const whereClause: Prisma.SupportTicketWhereInput = {
    ...where,
    ...(status && { status: status as any }),
    ...(assignedToId && { assignedToId }),
    ...(userId && { userId }),
  }

  const finalSkip = offset || skip
  const finalTake = limit || take || 100

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      skip: finalSkip,
      take: finalTake,
      where: whereClause,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        responses: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    }),
    prisma.supportTicket.count({ where: whereClause }),
  ])

  return { tickets, total }
}

/**
 * Get ticket by ID
 */
export async function getTicketById(ticketId: string) {
  return prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      responses: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })
}

/**
 * Create support ticket
 */
export async function createTicket(data: {
  userId: string
  userEmail: string
  userName: string
  subject: string
  description: string
  category: string
  priority?: TicketPriority
}) {
  return prisma.supportTicket.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Update support ticket
 */
export async function updateTicket(
  ticketId: string,
  data: {
    status?: TicketStatus
    priority?: TicketPriority
    assignedToId?: string | null
    resolution?: string | null
    resolvedAt?: Date | null
    closedAt?: Date | null
  }
) {
  return prisma.supportTicket.update({
    where: { id: ticketId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Add response to ticket
 */
export async function addResponse(data: {
  ticketId: string
  senderId: string
  senderRole: string
  isFromAdmin?: boolean
  message: string
  attachments?: any
}) {
  return prisma.ticketResponse.create({
    data: {
      ...data,
      senderRole: data.senderRole as any, // Cast to bypass strict type checking
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })
}

/**
 * Get ticket statistics
 */
export async function getTicketStats(params?: { assignedToId?: string }) {
  const { assignedToId } = params || {}

  const where: Prisma.SupportTicketWhereInput = assignedToId
    ? { assignedToId }
    : {}

  const [open, inProgress, resolved, closed, total] = await Promise.all([
    prisma.supportTicket.count({ where: { ...where, status: 'OPEN' } }),
    prisma.supportTicket.count({ where: { ...where, status: 'IN_PROGRESS' } }),
    prisma.supportTicket.count({ where: { ...where, status: 'RESOLVED' } }),
    prisma.supportTicket.count({ where: { ...where, status: 'CLOSED' } }),
    prisma.supportTicket.count({ where }),
  ])

  return {
    open,
    inProgress,
    resolved,
    closed,
    total,
  }
}

// ============================================================================
// FAQs
// ============================================================================

/**
 * Get active FAQs
 */
export async function getFaqs(params?: {
  category?: string
  limit?: number
}) {
  const { category, limit } = params || {}

  return prisma.fAQ.findMany({
    where: {
      isActive: true,
      ...(category && { category }),
    },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
    take: limit,
  })
}

/**
 * Get FAQ by ID
 */
export async function getFaqById(faqId: string) {
  return prisma.fAQ.findUnique({
    where: { id: faqId },
  })
}

/**
 * Increment FAQ views
 */
export async function incrementFaqViews(faqId: string) {
  return prisma.fAQ.update({
    where: { id: faqId },
    data: {
      views: {
        increment: 1,
      },
    },
  })
}

/**
 * Submit FAQ feedback
 */
export async function submitFaqFeedback(faqId: string, helpful: boolean) {
  return prisma.fAQ.update({
    where: { id: faqId },
    data: helpful
      ? {
          helpfulCount: {
            increment: 1,
          },
        }
      : {
          notHelpfulCount: {
            increment: 1,
          },
        },
  })
}

/**
 * Get all FAQs (admin)
 */
export async function getAllFaqs(params?: {
  skip?: number
  take?: number
  where?: Prisma.FAQWhereInput
}) {
  const { skip = 0, take = 100, where } = params || {}

  const [faqs, total] = await Promise.all([
    prisma.fAQ.findMany({
      skip,
      take,
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }),
    prisma.fAQ.count({ where }),
  ])

  return { faqs, total }
}

/**
 * Create or update FAQ
 */
export async function upsertFaq(data: {
  id?: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}) {
  if (data.id) {
    return prisma.fAQ.update({
      where: { id: data.id },
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
        isActive: data.isActive,
      },
    })
  }

  return prisma.fAQ.create({
    data,
  })
}

/**
 * Bulk upsert FAQs
 */
export async function bulkUpsertFAQs(
  faqs: Array<{
    id?: string
    question: string
    answer: string
    category: string
    order: number
    isActive: boolean
  }>
) {
  const operations = faqs.map((faq) =>
    prisma.fAQ.upsert({
      where: { id: faq.id || '' },
      create: faq,
      update: faq,
    })
  )

  return prisma.$transaction(operations)
}

/**
 * Delete FAQ
 */
export async function deleteFaq(faqId: string) {
  return prisma.fAQ.delete({
    where: { id: faqId },
  })
}
