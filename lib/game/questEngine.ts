import { prisma } from '@/lib/db/prisma'
import { XPEngine } from './xpEngine'
import { QuestType } from '@prisma/client'

export interface QuestProgress {
  questId: string
  progress: number
  isCompleted: boolean
}

export class QuestEngine {
  /**
   * Update quest progress for a player
   */
  static async updateProgress(
    playerId: string,
    action: string,
    amount: number = 1
  ): Promise<QuestProgress[]> {
    // Get active quests for this player that match the action
    const activeQuests = await prisma.playerQuest.findMany({
      where: {
        playerId,
        isCompleted: false,
        quest: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        }
      },
      include: {
        quest: true
      }
    })

    const updatedQuests: QuestProgress[] = []

    for (const playerQuest of activeQuests) {
      const quest = playerQuest.quest
      let shouldUpdate = false

      // Check if this action applies to this quest
      switch (action) {
        case 'CALL_COMPLETED':
          shouldUpdate = quest.name.toLowerCase().includes('call')
          break
        case 'MEETING_BOOKED':
          shouldUpdate = quest.name.toLowerCase().includes('meeting')
          break
        case 'OBJECTION_HANDLED':
          shouldUpdate = quest.name.toLowerCase().includes('objection')
          break
        case 'PIPELINE_CREATED':
          shouldUpdate = quest.name.toLowerCase().includes('pipeline')
          break
        case 'STREAK_DAY':
          shouldUpdate = quest.name.toLowerCase().includes('streak')
          break
        case 'TRAINING_COMPLETED':
          shouldUpdate = quest.name.toLowerCase().includes('training')
          break
        default:
          shouldUpdate = false
      }

      if (shouldUpdate) {
        const newProgress = Math.min(playerQuest.progress + amount, quest.targetAmount)
        const isCompleted = newProgress >= quest.targetAmount

        // Update quest progress
        const updated = await prisma.playerQuest.update({
          where: { id: playerQuest.id },
          data: {
            progress: newProgress,
            isCompleted,
            completedAt: isCompleted ? new Date() : null
          }
        })

        // Award XP and coins if quest is completed
        if (isCompleted && !playerQuest.isCompleted) {
          await XPEngine.awardXP(playerId, {
            amount: quest.xpReward,
            reason: `Quest completed: ${quest.name}`,
            coins: quest.coinsReward
          })
        }

        updatedQuests.push({
          questId: quest.id,
          progress: newProgress,
          isCompleted
        })
      }
    }

    return updatedQuests
  }

  /**
   * Assign daily quests to a player
   */
  static async assignDailyQuests(playerId: string): Promise<void> {
    // Check if player already has today's quests
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingDailyQuests = await prisma.playerQuest.findMany({
      where: {
        playerId,
        quest: {
          type: QuestType.DAILY
        },
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingDailyQuests.length > 0) {
      return // Player already has today's quests
    }

    // Get available daily quests
    const dailyQuests = await prisma.quest.findMany({
      where: {
        type: QuestType.DAILY,
        isActive: true
      },
      take: 3 // Assign 3 daily quests
    })

    // Create player quest entries
    for (const quest of dailyQuests) {
      await prisma.playerQuest.create({
        data: {
          playerId,
          questId: quest.id,
          progress: 0,
          isCompleted: false
        }
      })
    }
  }

  /**
   * Get active quests for a player
   */
  static async getActiveQuests(playerId: string) {
    return await prisma.playerQuest.findMany({
      where: {
        playerId,
        isCompleted: false,
        quest: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        }
      },
      include: {
        quest: true
      },
      orderBy: [
        { quest: { difficulty: 'asc' } },
        { createdAt: 'desc' }
      ]
    })
  }

  /**
   * Get completed quests for a player
   */
  static async getCompletedQuests(playerId: string, limit: number = 10) {
    return await prisma.playerQuest.findMany({
      where: {
        playerId,
        isCompleted: true
      },
      include: {
        quest: true
      },
      orderBy: { completedAt: 'desc' },
      take: limit
    })
  }

  /**
   * Create a custom quest
   */
  static async createQuest(data: {
    name: string
    description: string
    targetAmount: number
    xpReward: number
    coinsReward?: number
    difficulty: number
    type: QuestType
    expiresAt?: Date
  }) {
    return await prisma.quest.create({
      data: {
        ...data,
        coinsReward: data.coinsReward || Math.floor(data.xpReward / 2)
      }
    })
  }

  /**
   * Reset expired quests and create new ones
   */
  static async resetExpiredQuests(): Promise<void> {
    const now = new Date()

    // Mark expired quests as inactive
    await prisma.quest.updateMany({
      where: {
        expiresAt: { lt: now },
        isActive: true
      },
      data: { isActive: false }
    })

    // Create new weekly quests if it's Monday
    if (now.getDay() === 1) { // Monday
      await this.createWeeklyQuests()
    }

    // Create new monthly quests if it's the 1st
    if (now.getDate() === 1) {
      await this.createMonthlyQuests()
    }
  }

  /**
   * Create weekly quests
   */
  static async createWeeklyQuests(): Promise<void> {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const weeklyQuests = [
      {
        name: 'Weekly Warrior',
        description: 'Complete 25 calls this week',
        targetAmount: 25,
        xpReward: 500,
        difficulty: 3,
        type: QuestType.WEEKLY,
        expiresAt: nextWeek
      },
      {
        name: 'Meeting Master',
        description: 'Book 5 meetings this week',
        targetAmount: 5,
        xpReward: 750,
        difficulty: 4,
        type: QuestType.WEEKLY,
        expiresAt: nextWeek
      }
    ]

    for (const quest of weeklyQuests) {
      await this.createQuest(quest)
    }
  }

  /**
   * Create monthly quests
   */
  static async createMonthlyQuests(): Promise<void> {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const monthlyQuests = [
      {
        name: 'Pipeline Pioneer',
        description: 'Generate $100K in pipeline this month',
        targetAmount: 100000,
        xpReward: 2000,
        difficulty: 5,
        type: QuestType.MONTHLY,
        expiresAt: nextMonth
      }
    ]

    for (const quest of monthlyQuests) {
      await this.createQuest(quest)
    }
  }
}