import { prisma } from '@/lib/prisma'

export async function createTeam(data: {
  name: string
  description?: string
  imageUrl?: string
  directImageUrl?: string
  captainId: string
  maxMembers?: number
}) {
  return await prisma.team.create({
    data: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      directImageUrl: data.directImageUrl,
      captainId: data.captainId,
      maxMembers: data.maxMembers,
      status: 'ACTIVE',
    },
    include: {
      captain: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  })
}

export async function getTeamById(id: string) {
  return await prisma.team.findUnique({
    where: { id },
    include: {
      captain: {
        select: {
          id: true,
          name: true,
          avatar: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          joinedAt: 'asc',
        },
      },
      campaignProgress: {
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          campaignProgress: true,
        },
      },
    },
  })
}

export async function getAllTeams(filters?: {
  status?: string
  captainId?: string
  page?: number
  limit?: number
}) {
  const { page = 1, limit = 20, status, captainId } = filters || {}
  const skip = (page - 1) * limit

  const where: any = {}
  if (status) where.status = status
  if (captainId) where.captainId = captainId

  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where,
      include: {
        captain: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            campaignProgress: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.team.count({ where }),
  ])

  return { teams, total, pages: Math.ceil(total / limit) }
}

export async function updateTeam(
  id: string,
  data: {
    name?: string
    description?: string
    imageUrl?: string
    directImageUrl?: string
    maxMembers?: number
    captainId?: string
    status?: string
  }
) {
  return await prisma.team.update({
    where: { id },
    data,
    include: {
      captain: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
}

export async function deleteTeam(id: string) {
  return await prisma.team.delete({
    where: { id },
  })
}

// Team Memberships
export async function addTeamMember(data: {
  teamId: string
  userId: string
  role?: string
}) {
  return await prisma.teamMembership.create({
    data: {
      teamId: data.teamId,
      userId: data.userId,
      role: (data.role as any) || 'MEMBER',
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
}

export async function removeTeamMember(teamId: string, userId: string) {
  return await prisma.teamMembership.deleteMany({
    where: {
      teamId,
      userId,
    },
  })
}

export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: string
) {
  return await prisma.teamMembership.updateMany({
    where: {
      teamId,
      userId,
    },
    data: {
      role: role as any,
    },
  })
}

export async function getTeamMembers(teamId: string) {
  return await prisma.teamMembership.findMany({
    where: { teamId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          email: true,
        },
      },
    },
    orderBy: {
      joinedAt: 'asc',
    },
  })
}

export async function getUserTeams(userId: string) {
  return await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
      status: 'ACTIVE',
    },
    include: {
      captain: {
        select: {
          id: true,
          name: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          campaignProgress: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function isTeamMember(teamId: string, userId: string): Promise<boolean> {
  const membership = await prisma.teamMembership.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  })

  return !!membership
}

export async function getTeamMemberCount(teamId: string): Promise<number> {
  return await prisma.teamMembership.count({
    where: { teamId },
  })
}

// Team Campaign Progress
export async function joinCampaignAsTeam(teamId: string, campaignId: string) {
  return await prisma.teamCampaignProgress.create({
    data: {
      teamId,
      campaignId,
      status: 'JOINED',
    },
    include: {
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function getTeamCampaignProgress(
  teamId: string,
  campaignId: string
) {
  return await prisma.teamCampaignProgress.findUnique({
    where: {
      teamId_campaignId: {
        teamId,
        campaignId,
      },
    },
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
    },
  })
}

export async function updateTeamProgress(
  teamId: string,
  campaignId: string,
  data: {
    status?: string
    totalPoints?: number
    totalTasksCompleted?: number
    completedAt?: Date
  }
) {
  return await prisma.teamCampaignProgress.update({
    where: {
      teamId_campaignId: {
        teamId,
        campaignId,
      },
    },
    data,
  })
}

export async function addPointsToTeamProgress(
  teamId: string,
  campaignId: string,
  points: number
) {
  return await prisma.teamCampaignProgress.update({
    where: {
      teamId_campaignId: {
        teamId,
        campaignId,
      },
    },
    data: {
      totalPoints: {
        increment: points,
      },
    },
  })
}

export async function getTeamCampaigns(teamId: string) {
  return await prisma.teamCampaignProgress.findMany({
    where: { teamId },
    include: {
      campaign: {
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          imageUrl: true,
          directImageUrl: true,
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  })
}
