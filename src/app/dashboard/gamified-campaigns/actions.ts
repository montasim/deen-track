'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/session'
import { logActivity } from '@/lib/activity/repositories/activity-log.repository'
import * as repositories from '@/lib/gamified-campaign/repositories'

// ============================================================================
// USER ACTIONS
// ============================================================================

// Get all active campaigns
export async function getActiveGamifiedCampaigns() {
  try {
    return await repositories.getActiveGamifiedCampaigns()
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }
}

// Get all campaigns (admin only)
export async function getAllGamifiedCampaigns() {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    return await repositories.getAllGamifiedCampaigns()
  } catch (error) {
    console.error('Error fetching all campaigns:', error)
    return []
  }
}

// Get campaign by ID
export async function getGamifiedCampaign(campaignId: string) {
  try {
    console.log('Fetching campaign with ID:', campaignId)
    const campaign = await repositories.getGamifiedCampaignById(campaignId)
    console.log('Campaign found:', campaign ? campaign.name : 'null')
    return campaign
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return null
  }
}

// Debug: List all campaigns (remove this later)
export async function debugListAllCampaigns() {
  try {
    const campaigns = await prisma.gamifiedCampaign.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        startDate: true,
        endDate: true,
      },
    })
    console.log('All campaigns:', campaigns)
    return campaigns
  } catch (error) {
    console.error('Error listing campaigns:', error)
    return []
  }
}

// Join a campaign
export async function joinCampaign(campaignId: string) {
  const session = await requireAuth()

  try {
    // Check if already joined
    const existing = await prisma.userCampaignProgress.findUnique({
      where: {
        userId_campaignId: {
          userId: session.userId,
          campaignId,
        },
      },
    })

    if (existing) {
      return { success: false, message: 'Already joined this campaign' }
    }

    // Check if campaign exists and is active
    const campaign = await prisma.gamifiedCampaign.findUnique({
      where: { id: campaignId },
      include: {
        participations: {
          select: { id: true },
        },
      },
    })

    if (!campaign) {
      return { success: false, message: 'Campaign not found' }
    }

    if (!campaign.isActive) {
      return { success: false, message: 'Campaign is not active' }
    }

    if (campaign.maxParticipants && campaign.participations.length >= campaign.maxParticipants) {
      return { success: false, message: 'Campaign is full' }
    }

    // Create progress record
    const progress = await prisma.userCampaignProgress.create({
      data: {
        userId: session.userId,
        campaignId,
        status: 'JOINED',
      },
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'CAMPAIGN_GAMIFIED_JOINED',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: campaignId,
      description: `Joined campaign: ${campaign.name}`,
    }).catch(console.error)

    revalidatePath('/dashboard/campaigns/gamified')
    return { success: true, progressId: progress.id }
  } catch (error) {
    console.error('Error joining campaign:', error)
    return { success: false, message: 'Failed to join campaign' }
  }
}

// Submit task proof
export async function submitTaskProof(data: {
  taskId: string
  campaignId: string
  proofType: string
  file?: File
  url?: string
  text?: string
  notes?: string
}) {
  const session = await requireAuth()

  try {
    // Verify task belongs to campaign
    const task = await prisma.campaignTask.findFirst({
      where: {
        id: data.taskId,
        campaignTasks: {
          some: {
            campaignId: data.campaignId,
          },
        },
      },
    })

    if (!task) {
      throw new Error('Task not found in this campaign')
    }

    // Check dependencies
    const dependencyCheck = await repositories.checkTaskDependencies(session.userId, task.id)
    if (!dependencyCheck.unlocked) {
      throw new Error(
        `Task is locked. Complete prerequisites first: ${dependencyCheck.missingDependencies.join(', ')}`
      )
    }

    // Get or create progress
    let progress = await prisma.userCampaignProgress.findUnique({
      where: {
        userId_campaignId: {
          userId: session.userId,
          campaignId: data.campaignId,
        },
      },
    })

    if (!progress) {
      progress = await prisma.userCampaignProgress.create({
        data: {
          userId: session.userId,
          campaignId: data.campaignId,
          status: 'IN_PROGRESS',
        },
      })
    }

    // Upload file if provided
    let fileUrl: string | null = null
    let directFileUrl: string | null = null

    if (data.file) {
      const { uploadFile } = await import('@/lib/google-drive')
      const folderId = process.env.GOOGLE_DRIVE_PROOF_FOLDER_ID
      const result = await uploadFile(data.file, folderId)
      fileUrl = result.previewUrl
      directFileUrl = result.directUrl
    }

    // Create or update submission with proofs
    const submission = await prisma.userTaskSubmission.upsert({
      where: {
        userId_taskId_campaignId: {
          userId: session.userId,
          taskId: data.taskId,
          campaignId: data.campaignId,
        },
      },
      create: {
        userId: session.userId,
        taskId: data.taskId,
        campaignId: data.campaignId,
        progressId: progress.id,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        feedback: data.notes,
        proofs: {
          create: {
            type: data.proofType,
            fileUrl,
            directFileUrl,
            url: data.url || null,
            text: data.text || null,
            validationStatus: 'PENDING',
          },
        },
      },
      update: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        feedback: data.notes,
        proofs: {
          create: {
            type: data.proofType,
            fileUrl,
            directFileUrl,
            url: data.url || null,
            text: data.text || null,
            validationStatus: 'PENDING',
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'TASK_SUBMITTED',
      resourceType: 'TASK_SUBMISSION',
      resourceId: submission.id,
      description: `Submitted task "${task.name}"`,
    }).catch(console.error)

    revalidatePath('/dashboard/campaigns/my-progress')
    return { success: true, submissionId: submission.id }
  } catch (error) {
    console.error('Error submitting task:', error)
    throw error
  }
}

// Get user's campaign progress
export async function getUserCampaignProgress() {
  const session = await requireAuth()

  try {
    return await repositories.getUserCampaignProgress(session.userId)
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return []
  }
}

// Get user's submissions
export async function getUserSubmissions(campaignId?: string) {
  const session = await requireAuth()

  try {
    return await repositories.getUserSubmissions(session.userId, campaignId)
  } catch (error) {
    console.error('Error fetching user submissions:', error)
    return []
  }
}

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

// Admin: Approve proof
export async function approveProof(proofId: string, adminNotes?: string) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const proof = await repositories.getProofById(proofId)

    if (!proof) {
      throw new Error('Proof not found')
    }

    // Update proof status
    await prisma.proofSubmission.update({
      where: { id: proofId },
      data: {
        validationStatus: 'APPROVED',
        validatedAt: new Date(),
        validatedById: session.userId,
        adminNotes,
      },
    })

    // Update submission status
    await prisma.userTaskSubmission.update({
      where: { id: proof.submissionId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedById: session.userId,
      },
    })

    // Award points
    const totalPoints = proof.submission.task.achievements.reduce(
      (sum: number, a: any) => sum + a.points,
      0
    )

    await prisma.userCampaignProgress.update({
      where: { id: proof.submission.progressId },
      data: {
        totalPoints: { increment: totalPoints },
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: proof.submission.userId,
        type: 'TASK_APPROVED',
        title: 'Task Approved! 🎉',
        message: `Your submission for "${proof.submission.task.name}" has been approved. You earned ${totalPoints} points!`,
        linkUrl: `/dashboard/campaigns/my-progress`,
      },
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'TASK_APPROVED',
      resourceType: 'TASK_SUBMISSION',
      resourceId: proof.submissionId,
      description: `Approved task submission`,
    }).catch(console.error)

    revalidatePath('/dashboard/admin/proof-verification')
    return { success: true, pointsAwarded: totalPoints }
  } catch (error) {
    console.error('Error approving proof:', error)
    throw error
  }
}

// Admin: Reject proof
export async function rejectProof(proofId: string, reason: string) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const proof = await repositories.getProofById(proofId)

    if (!proof) {
      throw new Error('Proof not found')
    }

    // Update proof status
    await prisma.proofSubmission.update({
      where: { id: proofId },
      data: {
        validationStatus: 'REJECTED',
        validatedAt: new Date(),
        validatedById: session.userId,
        adminNotes: reason,
      },
    })

    // Update submission status
    await prisma.userTaskSubmission.update({
      where: { id: proof.submissionId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedById: session.userId,
        feedback: reason,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: proof.submission.userId,
        type: 'TASK_REJECTED',
        title: 'Task Needs Revision',
        message: `Your submission for "${proof.submission.task.name}" needs revision. Reason: ${reason}`,
        linkUrl: `/dashboard/campaigns/my-progress`,
      },
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'TASK_REJECTED',
      resourceType: 'TASK_SUBMISSION',
      resourceId: proof.submissionId,
      description: `Rejected task submission: ${reason}`,
    }).catch(console.error)

    revalidatePath('/dashboard/admin/proof-verification')
    return { success: true }
  } catch (error) {
    console.error('Error rejecting proof:', error)
    throw error
  }
}

// Admin: Get pending submissions
export async function getPendingSubmissions(filters: {
  campaignId?: string
  taskId?: string
  page?: number
  limit?: number
}) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    return await repositories.getPendingSubmissions(filters)
  } catch (error) {
    console.error('Error fetching pending submissions:', error)
    return { submissions: [], total: 0, pages: 0 }
  }
}

// Admin: Get pending proofs
export async function getPendingProofs(page: number = 1, limit: number = 20) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    return await repositories.getPendingProofs(page, limit)
  } catch (error) {
    console.error('Error fetching pending proofs:', error)
    return { proofs: [], total: 0, pages: 0 }
  }
}

// ============================================================================
// TEAM ACTIONS
// ============================================================================

// Get user's teams
export async function getUserTeams() {
  const session = await requireAuth()

  try {
    return await repositories.getUserTeams(session.userId)
  } catch (error) {
    console.error('Error fetching user teams:', error)
    return []
  }
}

// Get team by ID
export async function getTeamById(teamId: string) {
  try {
    return await repositories.getTeamById(teamId)
  } catch (error) {
    console.error('Error fetching team:', error)
    return null
  }
}

// Create a team
export async function createTeam(data: {
  name: string
  description?: string
  maxMembers?: number
}) {
  const session = await requireAuth()

  try {
    const team = await repositories.createTeam({
      name: data.name,
      description: data.description,
      captainId: session.userId,
      maxMembers: data.maxMembers,
    })

    // Add captain as a member
    await repositories.addTeamMember({
      teamId: team.id,
      userId: session.userId,
      role: 'CAPTAIN',
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'CREATE',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: team.id,
      description: `Created team: ${team.name}`,
    }).catch(console.error)

    revalidatePath('/dashboard/campaigns/teams')
    return { success: true, team }
  } catch (error) {
    console.error('Error creating team:', error)
    return { success: false, message: 'Failed to create team' }
  }
}

// Join a team
export async function joinTeam(teamId: string) {
  const session = await requireAuth()

  try {
    const team = await repositories.getTeamById(teamId)
    if (!team) {
      return { success: false, message: 'Team not found' }
    }

    if (team.status !== 'ACTIVE') {
      return { success: false, message: 'Team is not active' }
    }

    const memberCount = await repositories.getTeamMemberCount(teamId)
    if (team.maxMembers && memberCount >= team.maxMembers) {
      return { success: false, message: 'Team is full' }
    }

    await repositories.addTeamMember({
      teamId,
      userId: session.userId,
      role: 'MEMBER',
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'CREATE',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: teamId,
      description: `Joined team: ${team.name}`,
    }).catch(console.error)

    revalidatePath('/dashboard/campaigns/teams')
    return { success: true }
  } catch (error) {
    console.error('Error joining team:', error)
    return { success: false, message: 'Failed to join team' }
  }
}

// Leave a team
export async function leaveTeam(teamId: string) {
  const session = await requireAuth()

  try {
    await repositories.removeTeamMember(teamId, session.userId)

    revalidatePath('/dashboard/campaigns/teams')
    return { success: true }
  } catch (error) {
    console.error('Error leaving team:', error)
    return { success: false, message: 'Failed to leave team' }
  }
}

// Join campaign as team
export async function joinCampaignAsTeam(campaignId: string, teamId: string) {
  const session = await requireAuth()

  try {
    const team = await repositories.getTeamById(teamId)
    if (!team) {
      return { success: false, message: 'Team not found' }
    }

    // Check if user is captain
    const isCaptain = team.captainId === session.userId
    if (!isCaptain) {
      return { success: false, message: 'Only team captains can join campaigns' }
    }

    await repositories.joinCampaignAsTeam(teamId, campaignId)

    revalidatePath('/dashboard/campaigns/teams')
    return { success: true }
  } catch (error) {
    console.error('Error joining campaign as team:', error)
    return { success: false, message: 'Failed to join campaign' }
  }
}

// ============================================================================
// LEADERBOARD ACTIONS
// ============================================================================

export async function getGlobalLeaderboard(filters: {
  timePeriod?: 'all' | 'weekly' | 'monthly'
  limit?: number
  page?: number
}) {
  try {
    return await repositories.getGlobalLeaderboard(filters)
  } catch (error) {
    console.error('Error fetching global leaderboard:', error)
    return { leaderboard: [], total: 0, pages: 0 }
  }
}

export async function getCampaignLeaderboard(campaignId: string, filters?: {
  limit?: number
  page?: number
}) {
  try {
    return await repositories.getCampaignLeaderboard(campaignId, filters)
  } catch (error) {
    console.error('Error fetching campaign leaderboard:', error)
    return { leaderboard: [], total: 0, pages: 0 }
  }
}

export async function getTeamLeaderboard(campaignId?: string, filters?: {
  limit?: number
  page?: number
}) {
  try {
    return await repositories.getTeamLeaderboard(campaignId, filters)
  } catch (error) {
    console.error('Error fetching team leaderboard:', error)
    return { leaderboard: [], total: 0, pages: 0 }
  }
}

export async function getUserRank(userId?: string, campaignId?: string) {
  const session = await requireAuth()

  try {
    const targetUserId = userId || session.userId

    if (campaignId) {
      return await repositories.getUserCampaignRank(targetUserId, campaignId)
    } else {
      return await repositories.getUserGlobalRank(targetUserId)
    }
  } catch (error) {
    console.error('Error fetching user rank:', error)
    return -1
  }
}

export async function getTopPerformers(
  type: 'user' | 'team',
  campaignId?: string,
  limit: number = 3
) {
  try {
    return await repositories.getTopPerformers(type, campaignId, limit)
  } catch (error) {
    console.error('Error fetching top performers:', error)
    return []
  }
}

// ============================================================================
// TEMPLATE ACTIONS
// ============================================================================

export async function createCampaignTemplate(data: {
  name: string
  description?: string
  category?: string
  estimatedDuration?: number
  difficulty?: string
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
}) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const template = await repositories.createCampaignTemplate({
      ...data,
      entryById: session.userId,
      isPublic: true,
    })

    revalidatePath('/dashboard/admin/campaign-templates')
    return { success: true, template }
  } catch (error) {
    console.error('Error creating template:', error)
    return { success: false, message: 'Failed to create template' }
  }
}

export async function updateCampaignTemplate(data: {
  templateId: string
  name?: string
  description?: string
  category?: string
  estimatedDuration?: number
  difficulty?: string
  rules?: string
  disqualificationRules?: string
  termsOfService?: string
  startDate?: Date
  endDate?: Date
  minPointsToQualify?: number
  sponsorId?: string
}) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const { templateId, ...updateData } = data
    const template = await repositories.updateTemplate(templateId, updateData)

    revalidatePath('/dashboard/admin/campaign-templates')
    return { success: true, template }
  } catch (error) {
    console.error('Error updating template:', error)
    return { success: false, message: 'Failed to update template' }
  }
}

export async function getTemplateById(templateId: string) {
  try {
    return await repositories.getTemplateById(templateId)
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

export async function getCampaignTemplates(filters?: {
  category?: string
  difficulty?: string
  page?: number
  limit?: number
}) {
  try {
    return await repositories.getPublicTemplates(filters)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return { templates: [], total: 0, pages: 0 }
  }
}

export async function createCampaignFromTemplate(
  templateId: string,
  campaignData: {
    name: string
    description?: string
    startDate: Date
    endDate: Date
    maxParticipants?: number
    rewards?: any
  }
) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const campaign = await repositories.createCampaignFromTemplate(templateId, {
      ...campaignData,
      entryById: session.userId,
    })

    // Log activity
    await logActivity({
      userId: session.userId,
      action: 'CAMPAIGN_GAMIFIED_CREATED',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: campaign.id,
      description: `Created campaign from template: ${campaign.name}`,
    }).catch(console.error)

    revalidatePath('/dashboard/campaigns/gamified')
    return { success: true, campaign }
  } catch (error) {
    console.error('Error creating campaign from template:', error)
    return { success: false, message: 'Failed to create campaign' }
  }
}

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

export async function updateGamifiedCampaign(campaignId: string, data: {
  name?: string
  description?: string
  rules?: string
  disqualificationRules?: string
  startDate?: Date
  endDate?: Date
  maxParticipants?: number
  isActive?: boolean
}) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const campaign = await repositories.updateGamifiedCampaign(campaignId, data)

    await logActivity({
      userId: session.userId,
      action: 'CAMPAIGN_GAMIFIED_UPDATED',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: campaignId,
      description: `Updated campaign: ${campaign.name}`,
    }).catch(console.error)

    revalidatePath('/dashboard/campaigns/gamified')
    return { success: true, campaign }
  } catch (error) {
    console.error('Error updating campaign:', error)
    return { success: false, message: 'Failed to update campaign' }
  }
}

export async function toggleCampaignActive(campaignId: string) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const campaign = await repositories.getGamifiedCampaignById(campaignId)

    if (!campaign) {
      return { success: false, message: 'Campaign not found' }
    }

    const updatedCampaign = await repositories.updateGamifiedCampaign(campaignId, {
      isActive: !campaign.isActive,
    })

    await logActivity({
      userId: session.userId,
      action: updatedCampaign.isActive ? 'CAMPAIGN_GAMIFIED_UPDATED' : 'CAMPAIGN_GAMIFIED_UPDATED',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: campaignId,
      description: `${updatedCampaign.isActive ? 'Activated' : 'Deactivated'} campaign: ${campaign.name}`,
    }).catch(console.error)

    revalidatePath('/dashboard/admin/campaigns')
    revalidatePath('/dashboard/campaigns/gamified')
    return { success: true, campaign: updatedCampaign }
  } catch (error) {
    console.error('Error toggling campaign active status:', error)
    return { success: false, message: 'Failed to toggle campaign status' }
  }
}

export async function deleteGamifiedCampaign(campaignId: string) {
  const session = await requireAuth()

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    await repositories.deleteGamifiedCampaign(campaignId)

    await logActivity({
      userId: session.userId,
      action: 'CAMPAIGN_GAMIFIED_DELETED',
      resourceType: 'GAMIFIED_CAMPAIGN',
      resourceId: campaignId,
      description: 'Deleted gamified campaign',
    }).catch(console.error)

    revalidatePath('/dashboard/admin/campaigns')
    revalidatePath('/dashboard/campaigns/gamified')
    return { success: true }
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return { success: false, message: 'Failed to delete campaign' }
  }
}
