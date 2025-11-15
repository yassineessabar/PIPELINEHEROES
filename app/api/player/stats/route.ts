import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get user and their stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        playerStats: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    if (!user.playerStats) {
      return NextResponse.json({
        success: false,
        error: 'Player stats not found'
      }, { status: 404 })
    }

    const stats = user.playerStats

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.displayName || user.name,
        level: stats.level,
        xp: Number(stats.xp),
        coins: Number(stats.coins),
        callsCompleted: stats.callsCompleted,
        meetings: stats.meetingsCompleted,
        streakDays: stats.currentStreak,
        // Additional stats for completeness
        totalPipelineValue: Number(stats.totalPipelineValue),
        dealsClosed: stats.dealsClosed,
        trainingSessionsCompleted: stats.trainingSessionsCompleted,
        questsCompleted: stats.questsCompleted,
        longestStreak: stats.longestStreak
      }
    })
  } catch (error) {
    console.error('Failed to fetch player stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch player stats'
    }, { status: 500 })
  }
}