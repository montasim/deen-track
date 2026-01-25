import { prisma } from '@/lib/prisma'

export async function createCampaignTask(data: {
  name: string
  description: string
  rules: string
  disqualificationRules?: string
  startDate: Date
  endDate: Date
  validationType: string
  imageUrl?: string
  directImageUrl?: string
  entryById: string
  achievements: Array<{
    name: string
    description: string
    points: number
    howToAchieve: string
    icon?: string
    imageUrl?: string
    directImageUrl?: string
  }>
  dependencies?: Array<{
    dependsOnTaskId: string
    dependencyType: string
    order?: number
  }>
}) {
  return await prisma.campaignTask.create({
    data: {
      name: data.name,
      description: data.description,
      rules: data.rules,
      disqualificationRules: data.disqualificationRules,
      startDate: data.startDate,
      endDate: data.endDate,
      validationType: data.validationType,
      imageUrl: data.imageUrl,
      directImageUrl: data.directImageUrl,
      entryById: data.entryById,
      achievements: {
        create: data.achievements.map((a, index) => ({
          ...a,
          order: index,
        })),
      },
      dependencies: data.dependencies
        ? {
            create: data.dependencies,
          }
        : undefined,
    },
    include: {
      achievements: true,
      dependencies: {
        include: {
          dependsOn: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })
}

export async function getCampaignTaskById(id: string) {
  return await prisma.campaignTask.findUnique({
    where: { id },
    include: {
      achievements: true,
      entryBy: { select: { id: true, name: true } },
      dependencies: {
        include: {
          dependsOn: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      dependants: {
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
  })
}

export async function getTasksByCampaignId(campaignId: string) {
  const campaignTasks = await prisma.campaignToTask.findMany({
    where: { campaignId },
    include: {
      task: {
        include: {
          achievements: true,
          dependencies: {
            include: {
              dependsOn: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { order: 'asc' },
  })

  return campaignTasks.map((ct) => ct.task)
}

export async function updateCampaignTask(
  id: string,
  data: {
    name?: string
    description?: string
    rules?: string
    disqualificationRules?: string
    startDate?: Date
    endDate?: Date
    validationType?: string
    imageUrl?: string
    directImageUrl?: string
    isActive?: boolean
  }
) {
  return await prisma.campaignTask.update({
    where: { id },
    data,
    include: {
      achievements: true,
    },
  })
}

export async function deleteCampaignTask(id: string) {
  return await prisma.campaignTask.delete({
    where: { id },
  })
}

export async function getAllCampaignTasks() {
  return await prisma.campaignTask.findMany({
    where: {
      isActive: true,
    },
    include: {
      achievements: true,
      entryBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAvailableTasksForCampaign(campaignId: string) {
  // Get tasks that are not already in the campaign
  const existingTaskIds = await prisma.campaignToTask.findMany({
    where: { campaignId },
    select: { taskId: true },
  })

  const taskIds = existingTaskIds.map((ct) => ct.taskId)

  return await prisma.campaignTask.findMany({
    where: {
      isActive: true,
      id: { notIn: taskIds },
    },
    include: {
      achievements: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Task Dependencies
export async function addTaskDependency(data: {
  taskId: string
  dependsOnTaskId: string
  dependencyType: string
  order?: number
}) {
  return await prisma.taskDependency.create({
    data,
    include: {
      dependsOn: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function removeTaskDependency(taskId: string, dependsOnTaskId: string) {
  return await prisma.taskDependency.deleteMany({
    where: {
      taskId,
      dependsOnTaskId,
    },
  })
}

export async function getTaskDependencies(taskId: string) {
  return await prisma.taskDependency.findMany({
    where: { taskId },
    include: {
      dependsOn: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
    orderBy: { order: 'asc' },
  })
}

export async function getTaskDependants(taskId: string) {
  return await prisma.taskDependency.findMany({
    where: { dependsOnTaskId: taskId },
    include: {
      task: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  })
}

export async function checkTaskDependencies(
  userId: string,
  taskId: string
): Promise<{ unlocked: boolean; missingDependencies: string[] }> {
  const dependencies = await getTaskDependencies(taskId)

  if (dependencies.length === 0) {
    return { unlocked: true, missingDependencies: [] }
  }

  const missingDependencies: string[] = []

  for (const dep of dependencies) {
    const completedSubmission = await prisma.userTaskSubmission.findFirst({
      where: {
        userId,
        taskId: dep.dependsOnTaskId,
        status: 'APPROVED',
      },
    })

    if (!completedSubmission) {
      missingDependencies.push(dep.dependsOn.name)
    }
  }

  // Check if dependency type is ALL or ANY
  const firstDep = dependencies[0]
  const requiresAll = firstDep.dependencyType === 'ALL'

  if (requiresAll) {
    return {
      unlocked: missingDependencies.length === 0,
      missingDependencies,
    }
  } else {
    // ANY - unlocked if at least one dependency is met
    const allMet = missingDependencies.length < dependencies.length
    return {
      unlocked: allMet,
      missingDependencies: allMet ? [] : missingDependencies,
    }
  }
}

export async function getUnlockedTasksForUser(
  userId: string,
  campaignId: string
) {
  const campaignTasks = await getTasksByCampaignId(campaignId)

  const unlockedTasks: any[] = []

  for (const ct of campaignTasks) {
    const { unlocked } = await checkTaskDependencies(userId, ct.id)
    if (unlocked) {
      unlockedTasks.push(ct)
    }
  }

  return unlockedTasks
}
