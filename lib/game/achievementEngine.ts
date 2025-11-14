import { prisma } from '@/lib/db/prisma'
import { AchievementCategory } from '@prisma/client'

export interface AchievementCheck {
  category: AchievementCategory
  condition: any
  playerId: string
}

export class AchievementEngine {
  /**
   * Check and unlock achievements for a player based on their stats
   */
  static async checkAchievements(playerId: string): Promise<string[]> {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        achievements: {
          include: {
            achievement: true
          }
        },
        callAnalyses: true,
        quests: {
          where: { isCompleted: true },
          include: { quest: true }
        }
      }
    })

    if (!player) return []

    const unlockedAchievements: string[] = []
    const existingAchievementIds = player.achievements.map(pa => pa.achievement.id)

    // Get all active achievements player doesn't have
    const availableAchievements = await prisma.achievement.findMany({
      where: {
        isActive: true,
        id: { notIn: existingAchievementIds }
      }
    })

    for (const achievement of availableAchievements) {
      const condition = JSON.parse(achievement.condition)
      let shouldUnlock = false

      switch (achievement.category) {
        case AchievementCategory.CALLS:
          shouldUnlock = this.checkCallsAchievement(player, condition)
          break
        case AchievementCategory.MEETINGS:
          shouldUnlock = this.checkMeetingsAchievement(player, condition)
          break
        case AchievementCategory.PIPELINE:
          shouldUnlock = this.checkPipelineAchievement(player, condition)
          break
        case AchievementCategory.STREAK:
          shouldUnlock = this.checkStreakAchievement(player, condition)
          break
        case AchievementCategory.TRAINING:
          shouldUnlock = this.checkTrainingAchievement(player, condition)
          break
        case AchievementCategory.MILESTONE:
          shouldUnlock = this.checkMilestoneAchievement(player, condition)
          break
        default:
          shouldUnlock = false
      }

      if (shouldUnlock) {
        await prisma.playerAchievement.create({
          data: {
            playerId,
            achievementId: achievement.id
          }
        })

        // Award achievement rewards
        if (achievement.xpReward > 0 || achievement.coinsReward > 0) {
          await prisma.player.update({
            where: { id: playerId },
            data: {
              xp: { increment: achievement.xpReward },
              coins: { increment: achievement.coinsReward }
            }
          })
        }

        unlockedAchievements.push(achievement.name)
      }
    }

    return unlockedAchievements
  }

  private static checkCallsAchievement(player: any, condition: any): boolean {
    switch (condition.type) {
      case 'total_calls':
        return player.callsCompleted >= condition.value
      case 'daily_calls':
        // Check if player made X calls in a single day
        const callsToday = player.callAnalyses.filter((call: any) => {
          const today = new Date()
          const callDate = new Date(call.timestamp)
          return callDate.toDateString() === today.toDateString()
        }).length
        return callsToday >= condition.value
      case 'perfect_score':
        return player.callAnalyses.some((call: any) => call.score === 10)
      default:
        return false
    }
  }

  private static checkMeetingsAchievement(player: any, condition: any): boolean {
    switch (condition.type) {
      case 'total_meetings':
        return player.meetings >= condition.value
      case 'weekly_meetings':
        // This would need more complex logic to track weekly stats
        return false
      default:
        return false
    }
  }

  private static checkPipelineAchievement(player: any, condition: any): boolean {
    switch (condition.type) {
      case 'total_pipeline':
        const totalPipeline = player.callAnalyses
          .reduce((sum: number, call: any) => sum + (call.pipelineValue || 0), 0)
        return totalPipeline >= condition.value
      case 'single_deal':
        const maxDeal = Math.max(...player.callAnalyses.map((call: any) => call.pipelineValue || 0))
        return maxDeal >= condition.value
      default:
        return false
    }
  }

  private static checkStreakAchievement(player: any, condition: any): boolean {
    switch (condition.type) {
      case 'streak_days':
        return player.streakDays >= condition.value
      default:
        return false
    }
  }

  private static checkTrainingAchievement(player: any, condition: any): boolean {
    switch (condition.type) {
      case 'training_sessions':
        // This would need training progress data
        return false
      case 'perfect_training':
        // This would need training score data
        return false
      default:
        return false
    }
  }

  private static checkMilestoneAchievement(player: any, condition: any): boolean {
    switch (condition.type) {
      case 'level':
        return player.level >= condition.value
      case 'xp':
        return player.xp >= condition.value
      case 'quests_completed':
        return player.quests.length >= condition.value
      default:
        return false
    }
  }

  /**
   * Get player's achievements
   */
  static async getPlayerAchievements(playerId: string) {
    return await prisma.playerAchievement.findMany({
      where: { playerId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    })
  }

  /**
   * Get achievement progress for a player
   */
  static async getAchievementProgress(playerId: string) {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        achievements: true,
        callAnalyses: true,
        quests: { where: { isCompleted: true } }
      }
    })

    if (!player) return []

    const allAchievements = await prisma.achievement.findMany({
      where: { isActive: true }
    })

    const progress = []

    for (const achievement of allAchievements) {
      const hasAchievement = player.achievements.some(pa => pa.achievementId === achievement.id)
      const condition = JSON.parse(achievement.condition)

      let currentProgress = 0
      let maxProgress = condition.value || 1

      if (!hasAchievement) {
        switch (achievement.category) {
          case AchievementCategory.CALLS:
            if (condition.type === 'total_calls') {
              currentProgress = player.callsCompleted
            }
            break
          case AchievementCategory.MEETINGS:
            if (condition.type === 'total_meetings') {
              currentProgress = player.meetings
            }
            break
          case AchievementCategory.STREAK:
            if (condition.type === 'streak_days') {
              currentProgress = player.streakDays
            }
            break
          case AchievementCategory.MILESTONE:
            if (condition.type === 'level') {
              currentProgress = player.level
            } else if (condition.type === 'xp') {
              currentProgress = player.xp
            } else if (condition.type === 'quests_completed') {
              currentProgress = player.quests.length
            }
            break
        }
      }

      progress.push({
        achievement,
        unlocked: hasAchievement,
        progress: hasAchievement ? maxProgress : Math.min(currentProgress, maxProgress),
        maxProgress
      })
    }

    return progress
  }
}