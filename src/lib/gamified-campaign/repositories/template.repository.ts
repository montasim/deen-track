import { prisma } from '@/lib/prisma'

export async function createCampaignTemplate(data: {
  name: string
  description?: string
  category?: string
  isPublic?: boolean
  isSystemTemplate?: boolean
  estimatedDuration?: number
  difficulty?: string
  imageUrl?: string
  directImageUrl?: string
  rules?: string
  disqualificationRules?: string
  termsOfService?: string
  startDate?: Date
  endDate?: Date
  minPointsToQualify?: number
  sponsorId?: string
  entryById: string
  tasks: Array<{
    name: string
    description: string
    rules: string
    disqualificationRules?: string
    points?: number
    startDate?: Date
    endDate?: Date
    order?: number
    achievementsTemplate?: any
  }>
}) {
  return await prisma.campaignTemplate.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      isPublic: data.isPublic ?? false,
      isSystemTemplate: data.isSystemTemplate ?? false,
      estimatedDuration: data.estimatedDuration,
      difficulty: (data.difficulty as any) || 'INTERMEDIATE',
      imageUrl: data.imageUrl,
      directImageUrl: data.directImageUrl,
      rules: data.rules,
      disqualificationRules: data.disqualificationRules,
      termsOfService: data.termsOfService,
      startDate: data.startDate,
      endDate: data.endDate,
      minPointsToQualify: data.minPointsToQualify ?? 0,
      sponsorId: data.sponsorId,
      rewardsTemplate: [],
      entryById: data.entryById,
      templateTasks: {
        create: data.tasks,
      },
    },
    include: {
      templateTasks: true,
      entryBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function getTemplateById(id: string) {
  return await prisma.campaignTemplate.findUnique({
    where: { id },
    include: {
      templateTasks: {
        orderBy: { order: 'asc' },
      },
      sponsor: {
        select: {
          id: true,
          name: true,
        },
      },
      entryBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function getAllTemplates(filters?: {
  category?: string
  difficulty?: string
  isPublic?: boolean
  isSystemTemplate?: boolean
  page?: number
  limit?: number
}) {
  const { page = 1, limit = 20, category, difficulty, isPublic, isSystemTemplate } = filters || {}
  const skip = (page - 1) * limit

  const where: any = {}
  if (category) where.category = category
  if (difficulty) where.difficulty = difficulty
  if (isPublic !== undefined) where.isPublic = isPublic
  if (isSystemTemplate !== undefined) where.isSystemTemplate = isSystemTemplate

  const [templates, total] = await Promise.all([
    prisma.campaignTemplate.findMany({
      where,
      include: {
        templateTasks: {
          orderBy: { order: 'asc' },
        },
        entryBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            templateTasks: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.campaignTemplate.count({ where }),
  ])

  return { templates, total, pages: Math.ceil(total / limit) }
}

export async function getPublicTemplates(filters?: {
  category?: string
  difficulty?: string
  page?: number
  limit?: number
}) {
  return getAllTemplates({
    ...filters,
    isPublic: true,
  })
}

export async function updateTemplate(
  id: string,
  data: {
    name?: string
    description?: string
    category?: string
    isPublic?: boolean
    isSystemTemplate?: boolean
    estimatedDuration?: number
    difficulty?: string
    imageUrl?: string
    directImageUrl?: string
    rules?: string
    disqualificationRules?: string
    termsOfService?: string
    startDate?: Date
    endDate?: Date
    minPointsToQualify?: number
    sponsorId?: string
  }
) {
  return await prisma.campaignTemplate.update({
    where: { id },
    data: {
      ...data,
      difficulty: data.difficulty as any | undefined,
    },
    include: {
      templateTasks: {
        orderBy: { order: 'asc' },
      },
    },
  })
}

export async function updateTemplateWithTasks(
  id: string,
  data: {
    name?: string
    description?: string
    category?: string
    isPublic?: boolean
    isSystemTemplate?: boolean
    estimatedDuration?: number
    difficulty?: string
    imageUrl?: string
    directImageUrl?: string
    rules?: string
    disqualificationRules?: string
    termsOfService?: string
    startDate?: Date
    endDate?: Date
    minPointsToQualify?: number
    sponsorId?: string
    tasks: Array<{
      name: string
      description: string
      rules: string
      disqualificationRules?: string
      points?: number
      startDate?: Date
      endDate?: Date
      order?: number
      achievementsTemplate?: any
    }>
  }
) {
  const { tasks, ...templateData } = data

  // Update the template and its tasks in a transaction
  return await prisma.$transaction(async (tx) => {
    // Delete all existing template tasks
    await tx.templateTask.deleteMany({
      where: { templateId: id },
    })

    // Update the template
    const template = await tx.campaignTemplate.update({
      where: { id },
      data: {
        ...templateData,
        difficulty: templateData.difficulty as any | undefined,
      },
    })

    // Create new tasks
    await tx.templateTask.createMany({
      data: tasks.map((task) => ({
        templateId: id,
        ...task,
      })),
    })

    // Return the updated template with tasks
    return await tx.campaignTemplate.findUnique({
      where: { id },
      include: {
        templateTasks: {
          orderBy: { order: 'asc' },
        },
      },
    })
  })
}

export async function deleteTemplate(id: string) {
  return await prisma.campaignTemplate.delete({
    where: { id },
  })
}

export async function duplicateTemplate(id: string, entryById: string) {
  const original = await getTemplateById(id)
  if (!original) throw new Error('Template not found')

  return await prisma.campaignTemplate.create({
    data: {
      name: `${original.name} (Copy)`,
      description: original.description,
      category: original.category,
      isPublic: false, // Copies are private by default
      isSystemTemplate: false,
      estimatedDuration: original.estimatedDuration,
      difficulty: original.difficulty,
      imageUrl: original.imageUrl,
      directImageUrl: original.directImageUrl,
      rules: original.rules,
      disqualificationRules: original.disqualificationRules,
      termsOfService: original.termsOfService,
      startDate: original.startDate,
      endDate: original.endDate,
      minPointsToQualify: original.minPointsToQualify,
      sponsorId: original.sponsorId,
      entryById,
      templateTasks: {
        create: original.templateTasks.map((tt) => ({
          name: tt.name,
          description: tt.description,
          rules: tt.rules,
          disqualificationRules: tt.disqualificationRules,
          points: tt.points || undefined,
          startDate: tt.startDate || undefined,
          endDate: tt.endDate || undefined,
          order: tt.order || 0,
          achievementsTemplate: tt.achievementsTemplate,
        })) as any,
      },
    },
    include: {
      templateTasks: true,
    },
  })
}

export async function createCampaignFromTemplate(
  templateId: string,
  campaignData: {
    name: string
    description?: string
    rules?: string
    disqualificationRules?: string
    termsOfService?: string
    category?: string
    difficulty?: string
    estimatedDuration?: number
    minPointsToQualify?: number
    startDate: Date
    endDate: Date
    maxParticipants?: number
    tasks?: Array<{
      name: string
      description: string
      rules: string
      disqualificationRules?: string
      points: number
      achievements?: Array<{
        name: string
        description: string
        points: number
        icon?: string
        howToAchieve?: string
      }>
    }>
    rewards?: any
    entryById: string
  }
) {
  const template = await getTemplateById(templateId)
  if (!template) throw new Error('Template not found')

  // Create tasks from the provided data (which may be modified from template)
  const createdTasks = await Promise.all(
    (campaignData.tasks || template.templateTasks).map((taskData: any) =>
      prisma.campaignTask.create({
        data: {
          name: taskData.name,
          description: taskData.description,
          rules: taskData.rules,
          disqualificationRules: taskData.disqualificationRules,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          validationType: 'MANUAL',
          entryById: campaignData.entryById,
          achievements: {
            create: (taskData.achievements || []).map((ach: any) => ({
              name: ach.name,
              description: ach.description,
              points: ach.points,
              icon: ach.icon,
              howToAchieve: ach.howToAchieve || '',
            })),
          },
        },
      })
    )
  )

  // Then create the campaign with the tasks and rewards
  return await prisma.gamifiedCampaign.create({
    data: {
      name: campaignData.name,
      description: (campaignData.description || template.description) || '',
      rules: campaignData.rules || template.rules || undefined,
      disqualificationRules: campaignData.disqualificationRules || template.disqualificationRules || undefined,
      termsOfService: campaignData.termsOfService || template.termsOfService || undefined,
      category: campaignData.category || template.category || undefined,
      difficulty: (campaignData.difficulty || template.difficulty) as any,
      estimatedDuration: campaignData.estimatedDuration || template.estimatedDuration,
      minPointsToQualify: campaignData.minPointsToQualify || template.minPointsToQualify,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      maxParticipants: campaignData.maxParticipants,
      isActive: true,
      rewards: campaignData.rewards || template.rewardsTemplate || [],
      entryById: campaignData.entryById,
      tasks: {
        create: createdTasks.map((task, index) => ({
          taskId: task.id,
          order: index,
        })),
      },
    },
    include: {
      tasks: {
        include: {
          task: true,
        },
      },
    },
  })
}

export async function addTaskToTemplate(
  templateId: string,
  data: {
    name: string
    description: string
    rules: string
    disqualificationRules?: string
    points?: number
    startDate?: Date
    endDate?: Date
    order?: number
    achievementsTemplate?: any
  }
) {
  return await prisma.templateTask.create({
    data: {
      templateId,
      ...data,
    },
  })
}

export async function updateTemplateTask(
  id: string,
  data: {
    name?: string
    description?: string
    rules?: string
    disqualificationRules?: string
    points?: number
    startDate?: Date
    endDate?: Date
    order?: number
    achievementsTemplate?: any
  }
) {
  return await prisma.templateTask.update({
    where: { id },
    data,
  })
}

export async function removeTemplateTask(id: string) {
  return await prisma.templateTask.delete({
    where: { id },
  })
}

export async function reorderTemplateTasks(
  templateId: string,
  taskOrders: Array<{ id: string; order: number }>
) {
  return await prisma.$transaction(
    taskOrders.map(({ id, order }) =>
      prisma.templateTask.update({
        where: { id },
        data: { order },
      })
    )
  )
}

export async function getTemplateCategories(): Promise<string[]> {
  const templates = await prisma.campaignTemplate.findMany({
    where: {
      category: {
        not: null,
      },
    },
    select: {
      category: true,
    },
    distinct: ['category'],
  })

  return templates.map((t) => t.category!).filter(Boolean)
}

export async function getTemplatesByCategory(category: string) {
  return await prisma.campaignTemplate.findMany({
    where: {
      category,
      isPublic: true,
    },
    include: {
      templateTasks: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          templateTasks: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}
