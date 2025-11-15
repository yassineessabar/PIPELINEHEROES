import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'weekly' // daily, weekly, monthly

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get user's workspace to filter leaderboard
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { workspaceId: true, name: true }
    })

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'weekly':
      default:
        // Get start of current week (Monday)
        const dayOfWeek = now.getDay()
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        startDate = new Date(now.getTime() - daysFromMonday * 24 * 60 * 60 * 1000)
        startDate.setHours(0, 0, 0, 0)
    }

    // Get all users in the same workspace with their stats
    const users = await prisma.user.findMany({
      where: { workspaceId: currentUser.workspaceId },
      include: {
        playerStats: true
      },
      orderBy: { name: 'asc' }
    })

    // Create leaderboard entries
    const leaderboardEntries = await Promise.all(
      users.map(async (user) => {
        const stats = user.playerStats

        // Get period-specific stats from daily stats or activities
        const periodStats = await prisma.dailyUserStats.aggregate({
          where: {
            userId: user.id,
            date: {
              gte: startDate
            }
          },
          _sum: {
            callsMade: true,
            meetingsHeld: true,
            xpGained: true
          }
        })

        const periodCalls = periodStats._sum.callsMade || 0
        const periodMeetings = periodStats._sum.meetingsHeld || 0
        const periodXp = periodStats._sum.xpGained || 0

        // For total XP, use the user's actual XP (not just period XP)
        const totalXp = Number(stats?.xp || 0)

        return {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
          level: stats?.level || 1,
          xp: totalXp,
          periodXp: periodXp,
          meetings: periodMeetings,
          calls: periodCalls,
          streak: stats?.currentStreak || 0,
          isCurrentPlayer: user.id === userId
        }
      })
    )

    // Sort by period XP (for period leaderboards) or total XP
    const sortedEntries = leaderboardEntries
      .sort((a, b) => {
        // Primary sort: period XP + total meetings + total calls
        const scoreA = (a.periodXp * 1) + (a.meetings * 100) + (a.calls * 50)
        const scoreB = (b.periodXp * 1) + (b.meetings * 100) + (b.calls * 50)

        if (scoreB !== scoreA) return scoreB - scoreA

        // Secondary sort: total XP
        return b.xp - a.xp
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

    // Get current player for progress calculation
    const currentPlayer = sortedEntries.find(p => p.isCurrentPlayer)

    // Calculate progress to next rank
    let progressData = null
    if (currentPlayer && currentPlayer.rank > 1) {
      const nextPlayer = sortedEntries.find(p => p.rank === currentPlayer.rank - 1)
      if (nextPlayer) {
        const currentScore = (currentPlayer.periodXp * 1) + (currentPlayer.meetings * 100) + (currentPlayer.calls * 50)
        const nextScore = (nextPlayer.periodXp * 1) + (nextPlayer.meetings * 100) + (nextPlayer.calls * 50)

        progressData = {
          current: currentScore,
          max: nextScore,
          scoreNeeded: nextScore - currentScore + 1,
          nextPlayer: {
            name: nextPlayer.name,
            rank: nextPlayer.rank
          }
        }
      }
    }

    // Create top performers
    const topPerformers = {
      calls: [...sortedEntries].sort((a, b) => b.calls - a.calls).slice(0, 3),
      meetings: [...sortedEntries].sort((a, b) => b.meetings - a.meetings).slice(0, 3),
      streak: [...sortedEntries].sort((a, b) => b.streak - a.streak).slice(0, 3)
    }

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: sortedEntries,
        currentPlayer,
        progressData,
        topPerformers,
        period,
        periodStart: startDate.toISOString()
      }
    })
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leaderboard'
    }, { status: 500 })
  }
}