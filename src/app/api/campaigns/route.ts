import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const campaigns = await prisma.gamifiedCampaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
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

    // Add _count for participations
    const campaignsWithCounts = campaigns.map((campaign) => ({
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
