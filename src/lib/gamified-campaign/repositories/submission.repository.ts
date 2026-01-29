import { prisma } from '@/lib/prisma'

export async function createTaskSubmission(data: {
  userId: string
  taskId: string
  campaignId: string
  progressId: string
  status: string
  feedback?: string
}) {
  return await prisma.userTaskSubmission.create({
    data: {
      userId: data.userId,
      taskId: data.taskId,
      campaignId: data.campaignId,
      progressId: data.progressId,
      status: data.status as any,
      feedback: data.feedback,
    },
    include: {
      task: {
        include: {
          achievements: true,
        },
      },
      progress: {
        include: {
          campaign: true,
        },
      },
    },
  })
}

export async function getUserSubmissions(userId: string, campaignId?: string) {
  return await prisma.userTaskSubmission.findMany({
    where: {
      userId,
      ...(campaignId && { campaignId }),
    },
    include: {
      task: {
        include: {
          achievements: true,
        },
      },
      progress: {
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      proofs: true,
    },
    orderBy: { submittedAt: 'desc' },
  })
}

export async function getSubmissionById(id: string) {
  return await prisma.userTaskSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      task: {
        select: {
          id: true,
          name: true,
          description: true,
          achievements: true,
        },
      },
      progress: {
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      proofs: true,
    },
  })
}

export async function getPendingSubmissions(filters: {
  campaignId?: string
  taskId?: string
  page?: number
  limit?: number
}) {
  const { page = 1, limit = 20, campaignId, taskId } = filters
  const skip = (page - 1) * limit

  const where: any = {
    status: 'SUBMITTED',
    ...(campaignId && { campaignId }),
    ...(taskId && { taskId }),
  }

  const [submissions, total] = await Promise.all([
    prisma.userTaskSubmission.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        task: { select: { id: true, name: true } },
        progress: {
          include: {
            campaign: { select: { id: true, name: true } },
          },
        },
        proofs: true,
      },
      skip,
      take: limit,
      orderBy: { submittedAt: 'asc' },
    }),
    prisma.userTaskSubmission.count({ where }),
  ])

  return { submissions, total, pages: Math.ceil(total / limit) }
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
  reviewedById: string,
  feedback?: string
) {
  return await prisma.userTaskSubmission.update({
    where: { id },
    data: {
      status: status as any,
      reviewedAt: new Date(),
      reviewedById,
      feedback,
    },
    include: {
      task: {
        include: {
          achievements: true,
        },
      },
    },
  })
}

export async function getUserCampaignProgress(userId: string) {
  return await prisma.userCampaignProgress.findMany({
    where: { userId },
    include: {
      campaign: {
        include: {
          tasks: {
            include: {
              task: true,
            },
          },
        },
      },
      submissions: true,
    },
    orderBy: { joinedAt: 'desc' },
  })
}

export async function getOrCreateCampaignProgress(
  userId: string,
  campaignId: string
) {
  let progress = await prisma.userCampaignProgress.findUnique({
    where: {
      userId_campaignId: {
        userId,
        campaignId,
      },
    },
  })

  if (!progress) {
    progress = await prisma.userCampaignProgress.create({
      data: {
        userId,
        campaignId,
        status: 'JOINED',
      },
    })
  }

  return progress
}

export async function updateCampaignProgress(
  progressId: string,
  data: {
    status?: string
    totalPoints?: number
    completedAt?: Date
  }
) {
  return await prisma.userCampaignProgress.update({
    where: { id: progressId },
    data: {
      ...data,
      status: data.status as any | undefined,
    },
  })
}

export async function addPointsToProgress(
  progressId: string,
  points: number
) {
  return await prisma.userCampaignProgress.update({
    where: { id: progressId },
    data: {
      totalPoints: {
        increment: points,
      },
    },
  })
}

export async function getSubmissionStats(campaignId: string) {
  const [total, submitted, approved, rejected] = await Promise.all([
    prisma.userTaskSubmission.count({
      where: { campaignId },
    }),
    prisma.userTaskSubmission.count({
      where: { campaignId, status: 'SUBMITTED' },
    }),
    prisma.userTaskSubmission.count({
      where: { campaignId, status: 'APPROVED' },
    }),
    prisma.userTaskSubmission.count({
      where: { campaignId, status: 'REJECTED' },
    }),
  ])

  return {
    total,
    submitted,
    approved,
    rejected,
    pending: submitted,
  }
}

export async function getUserTaskSubmission(
  userId: string,
  taskId: string,
  campaignId: string
) {
  return await prisma.userTaskSubmission.findUnique({
    where: {
      userId_taskId_campaignId: {
        userId,
        taskId,
        campaignId,
      },
    },
    include: {
      proofs: true,
      task: {
        include: {
          achievements: true,
        },
      },
    },
  })
}

export async function createOrUpdateSubmission(data: {
  userId: string
  taskId: string
  campaignId: string
  progressId: string
  status: string
  submittedAt?: Date
  feedback?: string
}) {
  return await prisma.userTaskSubmission.upsert({
    where: {
      userId_taskId_campaignId: {
        userId: data.userId,
        taskId: data.taskId,
        campaignId: data.campaignId,
      },
    },
    create: {
      userId: data.userId,
      taskId: data.taskId,
      campaignId: data.campaignId,
      progressId: data.progressId,
      status: data.status as any,
      submittedAt: data.submittedAt,
      feedback: data.feedback,
    },
    update: {
      status: data.status as any,
      submittedAt: data.submittedAt,
      feedback: data.feedback,
    },
    include: {
      task: {
        include: {
          achievements: true,
        },
      },
      proofs: true,
    },
  })
}
