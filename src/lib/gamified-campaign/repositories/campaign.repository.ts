import { prisma } from '@/lib/prisma'

export async function createGamifiedCampaign(data: {
  name: string
  description: string
  startDate: Date
  endDate: Date
  maxParticipants?: number
  imageUrl?: string
  directImageUrl?: string
  entryById: string
  taskIds: string[]
}) {
  const campaign = await prisma.gamifiedCampaign.create({
    data: {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      maxParticipants: data.maxParticipants,
      imageUrl: data.imageUrl,
      directImageUrl: data.directImageUrl,
      entryById: data.entryById,
      tasks: {
        create: data.taskIds.map((taskId, index) => ({
          taskId,
          order: index,
        })),
      },
    },
    include: {
      tasks: {
        include: {
          task: {
            include: {
              achievements: true,
            },
          },
        },
      },
    },
  })

  return campaign
}

export async function getActiveGamifiedCampaigns() {
  return await prisma.gamifiedCampaign.findMany({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: {
      entryBy: { select: { id: true, name: true } },
      tasks: {
        include: {
          task: {
            include: {
              achievements: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      participations: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: { startDate: 'desc' },
  })
}

export async function getGamifiedCampaignById(id: string) {
  const campaign = await prisma.gamifiedCampaign.findUnique({
    where: { id },
    include: {
      entryBy: { select: { id: true, name: true, email: true } },
      _count: {
        select: {
          participations: true,
        },
      },
      tasks: {
        include: {
          task: {
            include: {
              achievements: true,
              entryBy: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      participations: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          submissions: {
            include: {
              task: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { totalPoints: 'desc' },
      },
    },
  })

  return campaign
}

export async function updateGamifiedCampaign(
  id: string,
  data: {
    name?: string
    description?: string
    rules?: string
    disqualificationRules?: string
    startDate?: Date
    endDate?: Date
    maxParticipants?: number
    imageUrl?: string
    directImageUrl?: string
    isActive?: boolean
  }
) {
  return await prisma.gamifiedCampaign.update({
    where: { id },
    data,
  })
}

export async function deleteGamifiedCampaign(id: string) {
  return await prisma.gamifiedCampaign.delete({
    where: { id },
  })
}

export async function getCampaignsByUserId(userId: string) {
  return await prisma.gamifiedCampaign.findMany({
    where: {
      participations: {
        some: {
          userId,
        },
      },
    },
    include: {
      tasks: {
        include: {
          task: {
            include: {
              achievements: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      participations: {
        where: { userId },
        take: 1,
      },
    },
    orderBy: { startDate: 'desc' },
  })
}

export async function addTaskToCampaign(
  campaignId: string,
  taskId: string,
  order?: number
) {
  // Get the current max order if not provided
  if (order === undefined) {
    const maxOrder = await prisma.campaignToTask.findFirst({
      where: { campaignId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    order = (maxOrder?.order ?? -1) + 1
  }

  return await prisma.campaignToTask.create({
    data: {
      campaignId,
      taskId,
      order,
    },
  })
}

export async function removeTaskFromCampaign(campaignId: string, taskId: string) {
  return await prisma.campaignToTask.deleteMany({
    where: {
      campaignId,
      taskId,
    },
  })
}

export async function reorderCampaignTasks(
  campaignId: string,
  taskOrders: Array<{ taskId: string; order: number }>
) {
  // Use a transaction to update all orders
  return await prisma.$transaction(
    taskOrders.map(({ taskId, order }) =>
      prisma.campaignToTask.updateMany({
        where: {
          campaignId,
          taskId,
        },
        data: { order },
      })
    )
  )
}

export async function getCampaignParticipantCount(campaignId: string) {
  return await prisma.userCampaignProgress.count({
    where: { campaignId },
  })
}

export async function getCampaignLeaderboard(
  campaignId: string,
  limit: number = 10
) {
  return await prisma.userCampaignProgress.findMany({
    where: {
      campaignId,
      status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { totalPoints: 'desc' },
    take: limit,
  })
}

export async function getUserCampaignProgress(
  userId: string,
  campaignId: string
) {
  return await prisma.userCampaignProgress.findUnique({
    where: {
      userId_campaignId: {
        userId,
        campaignId,
      },
    },
    include: {
      campaign: {
        include: {
          tasks: {
            include: {
              task: {
                include: {
                  achievements: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      },
      submissions: true,
    },
  })
}
