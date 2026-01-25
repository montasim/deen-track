import { prisma } from '@/lib/prisma'

export async function createProofSubmission(data: {
  submissionId: string
  type: string
  fileUrl?: string
  directFileUrl?: string
  url?: string
  text?: string
}) {
  return await prisma.proofSubmission.create({
    data,
  })
}

export async function createMultipleProofs(
  proofs: Array<{
    submissionId: string
    type: string
    fileUrl?: string
    directFileUrl?: string
    url?: string
    text?: string
  }>
) {
  return await prisma.proofSubmission.createMany({
    data: proofs,
  })
}

export async function getProofById(id: string) {
  return await prisma.proofSubmission.findUnique({
    where: { id },
    include: {
      submission: {
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
            },
          },
          campaign: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      validatedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function validateProof(
  id: string,
  validationStatus: string,
  validatedById: string,
  adminNotes?: string
) {
  return await prisma.proofSubmission.update({
    where: { id },
    data: {
      validationStatus,
      validatedAt: new Date(),
      validatedById,
      adminNotes,
    },
    include: {
      submission: {
        include: {
          task: {
            include: {
              achievements: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })
}

export async function validateMultipleProofs(
  proofIds: string[],
  validationStatus: string,
  validatedById: string,
  adminNotes?: string
) {
  return await prisma.proofSubmission.updateMany({
    where: {
      id: { in: proofIds },
    },
    data: {
      validationStatus,
      validatedAt: new Date(),
      validatedById,
      adminNotes,
    },
  })
}

export async function getPendingProofs(
  page: number = 1,
  limit: number = 20,
  filters?: {
    campaignId?: string
    taskId?: string
    type?: string
  }
) {
  const skip = (page - 1) * limit

  const where: any = {
    validationStatus: 'PENDING',
    ...(filters?.campaignId && {
      submission: {
        campaignId: filters.campaignId,
      },
    }),
    ...(filters?.taskId && {
      submission: {
        taskId: filters.taskId,
      },
    }),
    ...(filters?.type && {
      type: filters.type,
    }),
  }

  const [proofs, total] = await Promise.all([
    prisma.proofSubmission.findMany({
      where,
      include: {
        submission: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
            task: { select: { id: true, name: true } },
            progress: {
              include: {
                campaign: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    prisma.proofSubmission.count({
      where,
    }),
  ])

  return { proofs, total, pages: Math.ceil(total / limit) }
}

export async function getProofsBySubmissionId(submissionId: string) {
  return await prisma.proofSubmission.findMany({
    where: {
      submissionId,
    },
    orderBy: { id: 'asc' },
  })
}

export async function updateProof(
  id: string,
  data: {
    type?: string
    fileUrl?: string
    directFileUrl?: string
    url?: string
    text?: string
  }
) {
  return await prisma.proofSubmission.update({
    where: { id },
    data,
  })
}

export async function deleteProof(id: string) {
  return await prisma.proofSubmission.delete({
    where: { id },
  })
}

export async function getProofStats(campaignId?: string) {
  const where = campaignId
    ? {
        submission: {
          campaignId,
        },
      }
    : {}

  const [total, pending, approved, rejected, needsInfo] = await Promise.all([
    prisma.proofSubmission.count({ where }),
    prisma.proofSubmission.count({
      where: { ...where, validationStatus: 'PENDING' },
    }),
    prisma.proofSubmission.count({
      where: { ...where, validationStatus: 'APPROVED' },
    }),
    prisma.proofSubmission.count({
      where: { ...where, validationStatus: 'REJECTED' },
    }),
    prisma.proofSubmission.count({
      where: { ...where, validationStatus: 'NEEDS_INFO' },
    }),
  ])

  return {
    total,
    pending,
    approved,
    rejected,
    needsInfo,
  }
}
