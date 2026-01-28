import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/public/site/stats
 * Get public site statistics (no auth required)
 */
export async function GET(request: NextRequest) {
  try {
    const now = new Date()

    // Get active campaigns count
    const activeCampaignsCount = await prisma.gamifiedCampaign.count({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    })

    // Get total active users (users who have participated in any campaign)
    const activeUsersResult = await prisma.userCampaignProgress.groupBy({
      by: ['userId'],
    })
    const activeUsersCount = activeUsersResult.length

    // Get total tasks completed (approved submissions)
    const tasksCompletedCount = await prisma.userTaskSubmission.count({
      where: {
        status: 'APPROVED',
      },
    })

    // Get total points awarded across all users
    const totalPointsResult = await prisma.userCampaignProgress.aggregate({
      _sum: {
        totalPoints: true,
      },
    })
    const totalPoints = totalPointsResult._sum.totalPoints || 0

    return NextResponse.json({
      success: true,
      data: {
        activeUsers: activeUsersCount,
        activeCampaigns: activeCampaignsCount,
        tasksCompleted: tasksCompletedCount,
        totalPoints: totalPoints,
      },
    })
  } catch (error: any) {
    console.error('Get site stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch site statistics' },
      { status: 500 }
    )
  }
}
