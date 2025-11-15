import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    let whereClause = { isActive: true }
    if (category && category !== 'all') {
      whereClause = { ...whereClause, category }
    }

    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { requirementValue: 'asc' }
      ]
    })

    // Get user's achievement progress
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      }
    })

    // Get user's current stats for progress calculation
    const playerStats = await prisma.playerStats.findUnique({
      where: { userId },
      include: {
        user: true
      }
    })

    // Combine achievements with user progress
    const achievementsWithProgress = achievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id)

      // Calculate current progress based on achievement type and user stats
      let currentProgress = 0
      if (playerStats) {
        switch (achievement.requirementType) {
          case 'calls_completed':
            currentProgress = playerStats.callsCompleted
            break
          case 'meetings_completed':
            currentProgress = playerStats.meetingsCompleted
            break
          case 'training_sessions_completed':
            currentProgress = playerStats.trainingSessionsCompleted
            break
          case 'current_streak':
            currentProgress = playerStats.currentStreak
            break
          case 'level':
            currentProgress = playerStats.level
            break
          case 'deals_closed':
            currentProgress = playerStats.dealsClosed
            break
          case 'total_pipeline_value':
            currentProgress = Number(playerStats.totalPipelineValue)
            break
          default:
            currentProgress = 0
        }
      }

      const maxProgress = Number(achievement.requirementValue)
      const isUnlocked = userAchievement?.isCompleted || false
      const progress = Math.min(currentProgress, maxProgress)

      return {
        id: achievement.id,
        name: achievement.name,
        icon: achievement.icon,
        description: achievement.description,
        category: achievement.category,
        rarity: achievement.rarity,
        isUnlocked,
        unlockedAt: userAchievement?.completedAt?.toISOString(),
        progress: isUnlocked ? maxProgress : progress,
        maxProgress,
        xpReward: achievement.xpReward,
        coinsReward: achievement.coinsReward,
        requirementType: achievement.requirementType
      }
    })

    // Calculate stats
    const unlockedCount = achievementsWithProgress.filter(a => a.isUnlocked).length
    const totalCount = achievementsWithProgress.length
    const totalXpEarned = achievementsWithProgress
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.xpReward, 0)
    const totalCoinsEarned = achievementsWithProgress
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.coinsReward, 0)

    return NextResponse.json({
      success: true,
      data: {
        achievements: achievementsWithProgress,
        stats: {
          unlocked: unlockedCount,
          total: totalCount,
          totalXpEarned,
          totalCoinsEarned,
          completionRate: totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0
        }
      }
    })
  } catch (error) {
    console.error('Failed to fetch achievements:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch achievements'
    }, { status: 500 })
  }
}