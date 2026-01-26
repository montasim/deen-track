import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const campaigns = await prisma.gamifiedCampaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
      },
      include: {
        entryBy: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: {
          include: {
            task: {
              include: {
                achievements: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        participations: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    })

    // Add _count for participations and filter by end date (using end of day)
    const campaignsWithCounts = campaigns
      .filter((campaign) => {
        const endDate = new Date(campaign.endDate)
        endDate.setHours(23, 59, 59, 999)
        return now <= endDate
      })
      .map((campaign) => ({
        ...campaign,
        _count: {
          participations: campaign.participations.length,
        },
      }))

    return NextResponse.json(campaignsWithCounts)
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}
