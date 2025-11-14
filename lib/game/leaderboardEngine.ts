import { prisma } from '@/lib/db/prisma'
import { LeaderboardPeriod } from '@prisma/client'

export interface LeaderboardEntry {
  playerId: string
  playerName: string
  rank: number
  xp: number
  level: number
  meetings: number
  calls: number
  score: number
  avatar?: string
}

export class LeaderboardEngine {
  /**
   * Calculate leaderboard score
   * Formula: XP + (meetings * 20) + (level * 200)
   */
  static calculateScore(xp: number, meetings: number, level: number): number {
    return xp + (meetings * 20) + (level * 200)
  }

  /**
   * Update leaderboard for a specific period
   */
  static async updateLeaderboard(period: LeaderboardPeriod): Promise<void> {
    const dateRange = this.getDateRange(period)

    // Get all players with their stats for the period
    const players = await prisma.player.findMany({
      where: dateRange.where ? {
        createdAt: dateRange.where
      } : undefined,
      orderBy: { xp: 'desc' }
    })

    // Calculate scores and ranks
    const leaderboardData = players.map((player, index) => ({
      playerId: player.id,
      rank: index + 1,
      xp: player.xp,
      level: player.level,
      meetings: player.meetings,
      calls: player.callsCompleted,
      score: this.calculateScore(player.xp, player.meetings, player.level),
      period
    }))

    // Sort by score descending
    leaderboardData.sort((a, b) => b.score - a.score)

    // Update ranks after sorting
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Clear existing entries for this period (keep only latest snapshot)
    if (period !== LeaderboardPeriod.ALL_TIME) {
      const cutoffDate = new Date()
      cutoffDate.setHours(cutoffDate.getHours() - 1) // Keep entries from last hour

      await prisma.leaderboardEntry.deleteMany({
        where: {
          period,
          createdAt: { lt: cutoffDate }
        }
      })
    }

    // Create new leaderboard entries
    await prisma.leaderboardEntry.createMany({
      data: leaderboardData
    })
  }

  /**
   * Get leaderboard for a specific period
   */
  static async getLeaderboard(
    period: LeaderboardPeriod,
    limit: number = 50
  ): Promise<LeaderboardEntry[]> {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { period },
      include: {
        player: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { rank: 'asc' },
      take: limit
    })

    return entries.map(entry => ({
      playerId: entry.playerId,
      playerName: entry.player.name,
      rank: entry.rank,
      xp: entry.xp,
      level: entry.level,
      meetings: entry.meetings,
      calls: entry.calls,
      score: entry.score,
      avatar: entry.player.avatar || undefined
    }))
  }

  /**
   * Get player's position in leaderboard
   */
  static async getPlayerRank(
    playerId: string,
    period: LeaderboardPeriod
  ): Promise<{
    rank: number
    score: number
    totalPlayers: number
    percentile: number
  } | null> {
    const entry = await prisma.leaderboardEntry.findFirst({
      where: {
        playerId,
        period
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!entry) return null

    const totalPlayers = await prisma.leaderboardEntry.count({
      where: { period }
    })

    const percentile = ((totalPlayers - entry.rank + 1) / totalPlayers) * 100

    return {
      rank: entry.rank,
      score: entry.score,
      totalPlayers,
      percentile: Math.round(percentile)
    }
  }

  /**
   * Get top performers for a specific metric
   */
  static async getTopPerformers(
    metric: 'xp' | 'meetings' | 'calls' | 'level',
    period: LeaderboardPeriod,
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { period },
      include: {
        player: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { [metric]: 'desc' },
      take: limit
    })

    return entries.map(entry => ({
      playerId: entry.playerId,
      playerName: entry.player.name,
      rank: entry.rank,
      xp: entry.xp,
      level: entry.level,
      meetings: entry.meetings,
      calls: entry.calls,
      score: entry.score,
      avatar: entry.player.avatar || undefined
    }))
  }

  /**
   * Get leaderboard around a specific player
   */
  static async getLeaderboardAroundPlayer(
    playerId: string,
    period: LeaderboardPeriod,
    range: number = 5
  ): Promise<LeaderboardEntry[]> {
    const playerEntry = await prisma.leaderboardEntry.findFirst({
      where: { playerId, period },
      orderBy: { createdAt: 'desc' }
    })

    if (!playerEntry) return []

    const startRank = Math.max(1, playerEntry.rank - range)
    const endRank = playerEntry.rank + range

    const entries = await prisma.leaderboardEntry.findMany({
      where: {
        period,
        rank: {
          gte: startRank,
          lte: endRank
        }
      },
      include: {
        player: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { rank: 'asc' }
    })

    return entries.map(entry => ({
      playerId: entry.playerId,
      playerName: entry.player.name,
      rank: entry.rank,
      xp: entry.xp,
      level: entry.level,
      meetings: entry.meetings,
      calls: entry.calls,
      score: entry.score,
      avatar: entry.player.avatar || undefined
    }))
  }

  /**
   * Get date range for leaderboard period
   */
  private static getDateRange(period: LeaderboardPeriod) {
    const now = new Date()

    switch (period) {
      case LeaderboardPeriod.DAILY:
        const startOfDay = new Date(now)
        startOfDay.setHours(0, 0, 0, 0)
        return {
          where: { gte: startOfDay }
        }

      case LeaderboardPeriod.WEEKLY:
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        return {
          where: { gte: startOfWeek }
        }

      case LeaderboardPeriod.MONTHLY:
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          where: { gte: startOfMonth }
        }

      case LeaderboardPeriod.ALL_TIME:
      default:
        return {}
    }
  }

  /**
   * Schedule leaderboard updates
   */
  static async scheduleUpdates(): Promise<void> {
    // This would typically be called by a cron job
    await Promise.all([
      this.updateLeaderboard(LeaderboardPeriod.DAILY),
      this.updateLeaderboard(LeaderboardPeriod.WEEKLY),
      this.updateLeaderboard(LeaderboardPeriod.MONTHLY),
      this.updateLeaderboard(LeaderboardPeriod.ALL_TIME)
    ])
  }
}