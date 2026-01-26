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
    data,
    include: {
      templateTasks: {
        orderBy: { order: 'asc' },
      },
    },
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
          points: tt.points,
          startDate: tt.startDate,
          endDate: tt.endDate,
          order: tt.order,
          achievementsTemplate: tt.achievementsTemplate,
        })),
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
    startDate: Date
    endDate: Date
    maxParticipants?: number
    entryById: string
  }
) {
  const template = await getTemplateById(templateId)
  if (!template) throw new Error('Template not found')

  // First create the tasks from the template
  const createdTasks = await Promise.all(
    template.templateTasks.map((tt) =>
      prisma.campaignTask.create({
        data: {
          name: tt.name,
          description: tt.description,
          rules: tt.rules,
          disqualificationRules: tt.disqualificationRules,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          validationType: 'MANUAL',
          entryById: campaignData.entryById,
        },
      })
    )
  )

  // Then create the campaign with the tasks
  return await prisma.gamifiedCampaign.create({
    data: {
      name: campaignData.name,
      description: campaignData.description || template.description,
      rules: template.rules,
      disqualificationRules: template.disqualificationRules,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      maxParticipants: campaignData.maxParticipants,
      isActive: true,
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
