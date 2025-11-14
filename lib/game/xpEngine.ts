import { prisma } from '@/lib/db/prisma'
import { calculateLevel, getXPForNextLevel } from '@/lib/utils'

export interface XPReward {
  amount: number
  reason: string
  coins?: number
}

export class XPEngine {
  /**
   * Award XP to a player and handle level-ups
   */
  static async awardXP(playerId: string, reward: XPReward): Promise<{
    newXP: number
    newLevel: number
    leveledUp: boolean
    coinsEarned: number
  }> {
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw new Error('Player not found')
    }

    const oldLevel = player.level
    const newXP = player.xp + reward.amount
    const newLevel = calculateLevel(newXP)
    const leveledUp = newLevel > oldLevel

    // Calculate coins earned (base reward + level bonus)
    let coinsEarned = reward.coins || Math.floor(reward.amount / 10)
    if (leveledUp) {
      coinsEarned += newLevel * 50 // Bonus coins for leveling up
    }

    // Update player
    await prisma.player.update({
      where: { id: playerId },
      data: {
        xp: newXP,
        level: newLevel,
        coins: player.coins + coinsEarned
      }
    })

    // Check for achievements if leveled up
    if (leveledUp) {
      await this.checkLevelAchievements(playerId, newLevel)
    }

    return {
      newXP,
      newLevel,
      leveledUp,
      coinsEarned
    }
  }

  /**
   * Check and unlock level-based achievements
   */
  static async checkLevelAchievements(playerId: string, level: number) {
    const levelMilestones = [5, 10, 25, 50, 100]

    for (const milestone of levelMilestones) {
      if (level >= milestone) {
        const achievementName = `Level ${milestone} Hero`

        // Check if player already has this achievement
        const existingAchievement = await prisma.playerAchievement.findFirst({
          where: {
            playerId,
            achievement: {
              name: achievementName
            }
          }
        })

        if (!existingAchievement) {
          // Find the achievement
          const achievement = await prisma.achievement.findUnique({
            where: { name: achievementName }
          })

          if (achievement) {
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
          }
        }
      }
    }
  }

  /**
   * Get XP rewards for different actions
   */
  static getXPRewards() {
    return {
      CALL_COMPLETED: { amount: 50, reason: 'Call completed' },
      MEETING_BOOKED: { amount: 100, reason: 'Meeting booked' },
      DEMO_COMPLETED: { amount: 150, reason: 'Demo completed' },
      DEAL_CLOSED: { amount: 500, reason: 'Deal closed' },
      OBJECTION_HANDLED: { amount: 25, reason: 'Objection handled well' },
      TRAINING_COMPLETED: { amount: 75, reason: 'Training module completed' },
      STREAK_MAINTAINED: { amount: 30, reason: 'Daily streak maintained' },
      PIPELINE_CREATED: (value: number) => ({
        amount: Math.floor(value / 1000), // 1 XP per $1000 pipeline
        reason: `$${value.toLocaleString()} pipeline created`
      })
    }
  }

  /**
   * Calculate multipliers based on player stats
   */
  static calculateMultiplier(player: { level: number, streakDays: number }): number {
    let multiplier = 1.0

    // Level bonus (2% per level, capped at 100%)
    multiplier += Math.min(player.level * 0.02, 1.0)

    // Streak bonus (5% per day, capped at 50%)
    multiplier += Math.min(player.streakDays * 0.05, 0.5)

    return multiplier
  }
}