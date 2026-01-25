import { prisma } from '@/lib/prisma'

// Global Leaderboard
export async function getGlobalLeaderboard(filters: {
  timePeriod?: 'all' | 'weekly' | 'monthly'
  limit?: number
  page?: number
}) {
  const { timePeriod = 'all', limit = 50, page = 1 } = filters
  const skip = (page - 1) * limit

  // Calculate date filter based on time period
  let dateFilter: any = {}
  if (timePeriod === 'weekly') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    dateFilter = { gte: weekAgo }
  } else if (timePeriod === 'monthly') {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    dateFilter = { gte: monthAgo }
  }

  // Aggregate user points across all campaigns
  const userPoints = await prisma.userCampaignProgress.groupBy({
    by: ['userId'],
    where: Object.keys(dateFilter).length > 0
      ? {
          joinedAt: dateFilter,
        }
      : undefined,
    _sum: {
      totalPoints: true,
    },
    _count: {
      userId: true,
    },
    orderBy: {
      _sum: {
        totalPoints: 'desc',
      },
    },
    take: limit,
    skip,
  })

  // Get user details for each entry
  const userIds = userPoints.map((u) => u.userId)
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  })

  // Combine data
  const leaderboard = userPoints.map((entry, index) => {
    const user = users.find((u) => u.id === entry.userId)!
    return {
      rank: skip + index + 1,
      user,
      totalPoints: entry._sum.totalPoints || 0,
      campaignsParticipated: entry._count.userId,
    }
  })

  const total = await prisma.userCampaignProgress.groupBy({
    by: ['userId'],
    _count: true,
  })

  return {
    leaderboard,
    total: total.length,
    pages: Math.ceil(total.length / limit),
  }
}

export async function getUserGlobalRank(userId: string): Promise<number> {
  const userPoints = await prisma.userCampaignProgress.aggregate({
    where: { userId },
    _sum: {
      totalPoints: true,
    },
  })

  const userTotalPoints = userPoints._sum.totalPoints || 0

  // Count users with more points
  const usersWithMorePoints = await prisma.userCampaignProgress.groupBy({
    by: ['userId'],
    _sum: {
      totalPoints: true,
    },
    having: {
      totalPoints: {
        _sum: {
          gt: userTotalPoints,
        },
      },
    },
  })

  return usersWithMorePoints.length + 1
}

// Campaign Leaderboard
export async function getCampaignLeaderboard(
  campaignId: string,
  filters: {
    limit?: number
    page?: number
  } = {}
) {
  const { limit = 20, page = 1 } = filters
  const skip = (page - 1) * limit

  const [leaderboard, total] = await Promise.all([
    prisma.userCampaignProgress.findMany({
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
        submissions: {
          where: {
            status: 'APPROVED',
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: { totalPoints: 'desc' },
      skip,
      take: limit,
    }),
    prisma.userCampaignProgress.count({
      where: {
        campaignId,
        status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
      },
    }),
  ])

  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,
    userId: entry.userId,
    userName: entry.user.name,
    userAvatar: entry.user.avatar,
    totalPoints: entry.totalPoints,
    tasksCompleted: entry.submissions.length,
    status: entry.status,
    joinedAt: entry.joinedAt,
  }))

  return {
    leaderboard: leaderboardWithRank,
    total,
    pages: Math.ceil(total / limit),
  }
}

export async function getUserCampaignRank(
  userId: string,
  campaignId: string
): Promise<number> {
  const userProgress = await prisma.userCampaignProgress.findUnique({
    where: {
      userId_campaignId: {
        userId,
        campaignId,
      },
    },
    select: {
      totalPoints: true,
    },
  })

  if (!userProgress) return -1

  const userPoints = userProgress.totalPoints

  // Count users with more points in this campaign
  const usersWithMorePoints = await prisma.userCampaignProgress.count({
    where: {
      campaignId,
      totalPoints: {
        gt: userPoints,
      },
      status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
    },
  })

  return usersWithMorePoints + 1
}

// Team Leaderboard
export async function getTeamLeaderboard(
  campaignId?: string,
  filters: {
    limit?: number
    page?: number
  } = {}
) {
  const { limit = 20, page = 1 } = filters
  const skip = (page - 1) * limit

  if (campaignId) {
    // Per-campaign team leaderboard
    const [leaderboard, total] = await Promise.all([
      prisma.teamCampaignProgress.findMany({
        where: {
          campaignId,
          status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
              directImageUrl: true,
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
            },
          },
        },
        orderBy: { totalPoints: 'desc' },
        skip,
        take: limit,
      }),
      prisma.teamCampaignProgress.count({
        where: {
          campaignId,
          status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
        },
      }),
    ])

    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      rank: skip + index + 1,
      teamId: entry.team.id,
      teamName: entry.team.name,
      teamDescription: entry.team.description,
      teamImage: entry.team.imageUrl,
      teamDirectImage: entry.team.directImageUrl,
      captain: entry.team.captain,
      memberCount: entry.team.members.length,
      members: entry.team.members,
      totalPoints: entry.totalPoints,
      totalTasksCompleted: entry.totalTasksCompleted,
      status: entry.status,
    }))

    return {
      leaderboard: leaderboardWithRank,
      total,
      pages: Math.ceil(total / limit),
    }
  } else {
    // Global team leaderboard (aggregate across all campaigns)
    const teamPoints = await prisma.teamCampaignProgress.groupBy({
      by: ['teamId'],
      _sum: {
        totalPoints: true,
        totalTasksCompleted: true,
      },
      _count: {
        teamId: true,
      },
      orderBy: {
        _sum: {
          totalPoints: 'desc',
        },
      },
      take: limit,
      skip,
    })

    const teamIds = teamPoints.map((t) => t.teamId)
    const teams = await prisma.team.findMany({
      where: {
        id: { in: teamIds },
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
      },
    })

    const leaderboard = teamPoints.map((entry, index) => {
      const team = teams.find((t) => t.id === entry.teamId)!
      return {
        rank: skip + index + 1,
        teamId: team.id,
        teamName: team.name,
        teamDescription: team.description,
        teamImage: team.imageUrl,
        captain: team.captain,
        memberCount: team.members.length,
        members: team.members,
        totalPoints: entry._sum.totalPoints || 0,
        totalTasksCompleted: entry._sum.totalTasksCompleted || 0,
        campaignsParticipated: entry._count.teamId,
      }
    })

    const total = await prisma.teamCampaignProgress.groupBy({
      by: ['teamId'],
    })

    return {
      leaderboard,
      total: total.length,
      pages: Math.ceil(total.length / limit),
    }
  }
}

export async function getTeamRank(
  teamId: string,
  campaignId?: string
): Promise<number> {
  if (campaignId) {
    const teamProgress = await prisma.teamCampaignProgress.findUnique({
      where: {
        teamId_campaignId: {
          teamId,
          campaignId,
        },
      },
      select: {
        totalPoints: true,
      },
    })

    if (!teamProgress) return -1

    const teamPoints = teamProgress.totalPoints

    const teamsWithMorePoints = await prisma.teamCampaignProgress.count({
      where: {
        campaignId,
        totalPoints: {
          gt: teamPoints,
        },
        status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
      },
    })

    return teamsWithMorePoints + 1
  } else {
    // Global team rank
    const teamPoints = await prisma.teamCampaignProgress.aggregate({
      where: { teamId },
      _sum: {
        totalPoints: true,
      },
    })

    const totalPoints = teamPoints._sum.totalPoints || 0

    const teamsWithMorePoints = await prisma.teamCampaignProgress.groupBy({
      by: ['teamId'],
      _sum: {
        totalPoints: true,
      },
      having: {
        totalPoints: {
          _sum: {
            gt: totalPoints,
          },
        },
      },
    })

    return teamsWithMorePoints.length + 1
  }
}

// Top Performers (Podium)
export async function getTopPerformers(
  type: 'user' | 'team',
  campaignId?: string,
  limit: number = 3
) {
  if (type === 'user') {
    if (campaignId) {
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
    } else {
      const userPoints = await prisma.userCampaignProgress.groupBy({
        by: ['userId'],
        _sum: {
          totalPoints: true,
        },
        orderBy: {
          _sum: {
            totalPoints: 'desc',
          },
        },
        take: limit,
      })

      const userIds = userPoints.map((u) => u.userId)
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      })

      return userPoints.map((entry) => ({
        user: users.find((u) => u.id === entry.userId)!,
        totalPoints: entry._sum.totalPoints || 0,
      }))
    }
  } else {
    // Team top performers
    if (campaignId) {
      return await prisma.teamCampaignProgress.findMany({
        where: {
          campaignId,
          status: { in: ['JOINED', 'IN_PROGRESS', 'COMPLETED'] },
        },
        include: {
          team: {
            include: {
              captain: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { totalPoints: 'desc' },
        take: limit,
      })
    } else {
      const teamPoints = await prisma.teamCampaignProgress.groupBy({
        by: ['teamId'],
        _sum: {
          totalPoints: true,
        },
        orderBy: {
          _sum: {
            totalPoints: 'desc',
          },
        },
        take: limit,
      })

      const teamIds = teamPoints.map((t) => t.teamId)
      const teams = await prisma.team.findMany({
        where: { id: { in: teamIds } },
        include: {
          captain: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return teamPoints.map((entry) => ({
        team: teams.find((t) => t.id === entry.teamId)!,
        totalPoints: entry._sum.totalPoints || 0,
      }))
    }
  }
}
