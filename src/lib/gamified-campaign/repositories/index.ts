// Export task, proof, team, template first
export * from './task.repository'
export * from './proof.repository'
export * from './team.repository'
export * from './template.repository'

// Export leaderboard (has pagination support)
export * from './leaderboard.repository'

// Export campaign repository (excluding getUserCampaignProgress and getCampaignLeaderboard which conflict)
export {
  createGamifiedCampaign,
  getActiveGamifiedCampaigns,
  getAllGamifiedCampaigns,
  getGamifiedCampaignById,
  updateGamifiedCampaign,
  deleteGamifiedCampaign,
  getCampaignsByUserId,
  addTaskToCampaign,
  removeTaskFromCampaign,
  reorderCampaignTasks,
  getCampaignParticipantCount
} from './campaign.repository'

// Export submission repository functions
export {
  createTaskSubmission,
  getUserSubmissions,
  getSubmissionById,
  getPendingSubmissions,
  updateSubmissionStatus,
  getUserCampaignProgress as getUserCampaignProgressAll,
  getOrCreateCampaignProgress,
  updateCampaignProgress,
  addPointsToProgress,
  getSubmissionStats,
  getUserTaskSubmission,
  createOrUpdateSubmission
} from './submission.repository'
