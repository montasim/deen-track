import { z } from 'zod'

// ============================================================================
// CAMPAIGN VALIDATION
// ============================================================================

export const createCampaignSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.string().optional(),
  disqualificationRules: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  maxParticipants: z.number().int().positive().optional(),
  taskIds: z.array(z.string().uuid()).min(1, 'Select at least one task'),
})

export const updateCampaignSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  rules: z.string().optional(),
  disqualificationRules: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  maxParticipants: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
})

// ============================================================================
// TASK VALIDATION
// ============================================================================

export const createTaskSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.string().min(10, 'Rules must be at least 10 characters'),
  disqualificationRules: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  validationType: z.enum(['AUTO', 'MANUAL', 'ADMIN']),
  achievements: z
    .array(
      z.object({
        name: z.string().min(3, 'Achievement name must be at least 3 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        points: z.number().int().positive('Points must be positive'),
        howToAchieve: z.string().min(10, 'Instructions must be at least 10 characters'),
        icon: z.string().optional(),
      })
    )
    .min(1, 'Add at least one achievement'),
  dependencies: z
    .array(
      z.object({
        dependsOnTaskId: z.string().uuid('Invalid task ID'),
        dependencyType: z.enum(['ALL', 'ANY']),
        order: z.number().int().optional(),
      })
    )
    .optional(),
})

export const updateTaskSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  rules: z.string().min(10).optional(),
  disqualificationRules: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  validationType: z.enum(['AUTO', 'MANUAL', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
})

export const addTaskDependencySchema = z.object({
  dependsOnTaskId: z.string().uuid('Invalid task ID'),
  dependencyType: z.enum(['ALL', 'ANY']),
  order: z.number().int().optional(),
})

// ============================================================================
// SUBMISSION VALIDATION
// ============================================================================

export const submitProofSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  campaignId: z.string().uuid('Invalid campaign ID'),
  proofType: z.enum(['IMAGE', 'AUDIO', 'URL', 'TEXT']),
  file: z.instanceof(File).optional(),
  url: z.string().url('Invalid URL').optional(),
  text: z.string().min(10, 'Text must be at least 10 characters').max(1000).optional(),
  notes: z.string().max(500).optional(),
})

export const updateSubmissionStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'RESUBMIT']),
  feedback: z.string().max(1000).optional(),
})

// ============================================================================
// PROOF VALIDATION
// ============================================================================

export const validateProofSchema = z.object({
  validationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO']),
  adminNotes: z.string().max(1000).optional(),
})

export const bulkValidateProofsSchema = z.object({
  proofIds: z.array(z.string().uuid()).min(1, 'Select at least one proof'),
  validationStatus: z.enum(['APPROVED', 'REJECTED', 'NEEDS_INFO']),
  adminNotes: z.string().max(1000).optional(),
})

// ============================================================================
// TEAM VALIDATION
// ============================================================================

export const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50),
  description: z.string().max(500).optional(),
  maxMembers: z.number().int().min(2).max(100).optional(),
})

export const updateTeamSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(500).optional(),
  maxMembers: z.number().int().min(2).max(100).optional(),
  captainId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISBANDED']).optional(),
})

export const addTeamMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['CAPTAIN', 'MEMBER']).optional(),
})

export const updateTeamMemberRoleSchema = z.object({
  role: z.enum(['CAPTAIN', 'MEMBER']),
})

// ============================================================================
// TEMPLATE VALIDATION
// ============================================================================

export const createTemplateSchema = z.object({
  name: z.string().min(3, 'Template name must be at least 3 characters').max(100),
  description: z.string().max(5000).optional(),
  rules: z.string().max(10000).optional(),
  disqualificationRules: z.string().max(5000).optional(),
  termsOfService: z.string().max(10000).optional(),
  category: z.string().optional(),
  estimatedDuration: z.coerce.number().int().positive().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minPointsToQualify: z.coerce.number().int().min(0).optional(),
  sponsorId: z.string().uuid().optional(),
  totalPoints: z.coerce.number().int().min(0).optional(),
  tasks: z
    .array(
      z.object({
        name: z.string().min(3).max(100),
        description: z.string().min(10),
        rules: z.string().min(10),
        disqualificationRules: z.string().optional(),
        points: z.coerce.number().int().positive(),
        startDate: z.coerce.date({
          required_error: "Start date is required",
          invalid_type_error: "Invalid start date",
        }),
        endDate: z.coerce.date({
          required_error: "End date is required",
          invalid_type_error: "Invalid end date",
        }).refine((data) => {
          const startDate = new Date(data.startDate)
          const endDate = new Date(data.endDate)
          return endDate > startDate
        }, {
          message: "End date must be after start date",
        }),
        order: z.coerce.number().int().optional(),
        achievements: z.array(z.object({
          name: z.string().min(3, 'Achievement name must be at least 3 characters'),
          description: z.string().min(10, 'Description must be at least 10 characters'),
          points: z.coerce.number().int().positive('Points must be positive'),
          icon: z.string().optional(),
          howToAchieve: z.string().min(10, 'Instructions must be at least 10 characters'),
        })).optional(),
      })
    )
    .min(1, 'Add at least one task'),
})

export const updateTemplateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().optional(),
  estimatedDuration: z.number().int().positive().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  isPublic: z.boolean().optional(),
})

export const createCampaignFromTemplateSchema = z.object({
  templateId: z.string().uuid('Invalid template ID'),
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  maxParticipants: z.number().int().positive().optional(),
})

// ============================================================================
// LEADERBOARD VALIDATION
// ============================================================================

export const getLeaderboardSchema = z.object({
  timePeriod: z.enum(['all', 'weekly', 'monthly']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  page: z.number().int().positive().optional(),
})

export const getCampaignLeaderboardSchema = z.object({
  campaignId: z.string().uuid('Invalid campaign ID'),
  limit: z.number().int().positive().max(100).optional(),
  page: z.number().int().positive().optional(),
})

// ============================================================================
// FILTER & SEARCH VALIDATION
// ============================================================================

export const campaignFiltersSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'ALL']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

export const submissionFiltersSchema = z.object({
  campaignId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'RESUBMIT']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

export const proofFiltersSchema = z.object({
  campaignId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
  type: z.enum(['IMAGE', 'AUDIO', 'URL', 'TEXT']).optional(),
  validationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INFO']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

export const templateFiltersSchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type SubmitProofInput = z.infer<typeof submitProofSchema>
export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>
export type CreateCampaignFromTemplateInput = z.infer<typeof createCampaignFromTemplateSchema>
export type GetLeaderboardInput = z.infer<typeof getLeaderboardSchema>
export type CampaignFiltersInput = z.infer<typeof campaignFiltersSchema>
export type SubmissionFiltersInput = z.infer<typeof submissionFiltersSchema>
export type ProofFiltersInput = z.infer<typeof proofFiltersSchema>
