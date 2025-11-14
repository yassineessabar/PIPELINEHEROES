import { prisma } from '@/lib/db/prisma'
import { XPEngine } from './xpEngine'

export interface CallAnalysisData {
  customer?: string
  duration?: number
  callType?: string
  pipelineValue?: number
  transcript?: string
}

export interface AnalysisResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  xpEarned: number
  coinsEarned: number
  suggestions: string[]
}

export class AnalysisEngine {
  /**
   * Analyze a sales call and provide feedback
   */
  static async analyzeCall(
    playerId: string,
    callData: CallAnalysisData
  ): Promise<AnalysisResult> {
    // For now, we'll generate mock analysis
    // In production, this would integrate with AI services like OpenAI
    const analysis = await this.generateMockAnalysis(callData)

    // Calculate XP based on score and call type
    const baseXP = Math.floor(analysis.score * 10) // 0-100 XP based on score
    const typeMultiplier = this.getCallTypeMultiplier(callData.callType)
    const xpEarned = Math.floor(baseXP * typeMultiplier)

    // Calculate coins (10% of XP)
    const coinsEarned = Math.floor(xpEarned / 10)

    // Store analysis in database
    await prisma.callAnalysis.create({
      data: {
        playerId,
        customer: callData.customer,
        duration: callData.duration,
        score: analysis.score,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        xpEarned,
        coinsEarned,
        callType: callData.callType,
        pipelineValue: callData.pipelineValue
      }
    })

    // Award XP to player
    await XPEngine.awardXP(playerId, {
      amount: xpEarned,
      reason: `Call analysis: ${analysis.score}/10 score`,
      coins: coinsEarned
    })

    // Update player stats
    await prisma.player.update({
      where: { id: playerId },
      data: {
        callsCompleted: { increment: 1 }
      }
    })

    // Update quest progress
    const { QuestEngine } = await import('./questEngine')
    await QuestEngine.updateProgress(playerId, 'CALL_COMPLETED')

    if (callData.pipelineValue && callData.pipelineValue > 0) {
      await QuestEngine.updateProgress(playerId, 'PIPELINE_CREATED', callData.pipelineValue)
    }

    return {
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      xpEarned,
      coinsEarned,
      suggestions: analysis.suggestions
    }
  }

  /**
   * Generate mock analysis (replace with AI integration in production)
   */
  private static async generateMockAnalysis(callData: CallAnalysisData): Promise<{
    score: number
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
  }> {
    // Mock scoring based on call duration and type
    let baseScore = 7 // Default decent score

    // Duration scoring
    if (callData.duration) {
      if (callData.duration < 5) baseScore -= 1 // Too short
      else if (callData.duration > 60) baseScore -= 0.5 // Possibly too long
      else if (callData.duration >= 15 && callData.duration <= 30) baseScore += 0.5 // Sweet spot
    }

    // Call type scoring
    if (callData.callType === 'demo' || callData.callType === 'closing') {
      baseScore += 0.5 // Higher stakes calls
    }

    // Pipeline value bonus
    if (callData.pipelineValue && callData.pipelineValue > 10000) {
      baseScore += 1 // Good deal size
    }

    // Add some randomness (±1.5 points)
    const finalScore = Math.max(0, Math.min(10, baseScore + (Math.random() * 3 - 1.5)))

    // Generate strengths and weaknesses based on score
    const allStrengths = [
      'Strong opening that captured attention',
      'Excellent questioning to uncover pain points',
      'Clear value proposition presentation',
      'Good handling of objections',
      'Professional tone throughout the call',
      'Effective use of social proof',
      'Strong closing technique',
      'Good discovery of budget and timeline',
      'Excellent active listening skills'
    ]

    const allWeaknesses = [
      'Could have asked more qualifying questions',
      'Missed opportunity to present case studies',
      'Could have been more assertive with next steps',
      'Pricing discussion came up too early',
      'Could have better qualified the decision-making process',
      'Missed some buying signals',
      'Could have created more urgency',
      'Follow-up plan could be more specific'
    ]

    const allSuggestions = [
      'Try using the SPIN selling methodology',
      'Practice handling the pricing objection more smoothly',
      'Always confirm next steps before ending the call',
      'Use more discovery questions to uncover pain',
      'Share relevant case studies earlier in the conversation',
      'Create urgency by discussing timeline implications',
      'Ask about the decision-making process upfront'
    ]

    // Select strengths and weaknesses based on score
    const numStrengths = finalScore >= 8 ? 4 : finalScore >= 6 ? 3 : 2
    const numWeaknesses = finalScore <= 5 ? 3 : finalScore <= 7 ? 2 : 1

    const strengths = this.selectRandomItems(allStrengths, numStrengths)
    const weaknesses = this.selectRandomItems(allWeaknesses, numWeaknesses)
    const suggestions = this.selectRandomItems(allSuggestions, Math.min(3, numWeaknesses + 1))

    return {
      score: Math.round(finalScore * 10) / 10, // Round to 1 decimal
      strengths,
      weaknesses,
      suggestions
    }
  }

  /**
   * Get call type multiplier for XP calculation
   */
  private static getCallTypeMultiplier(callType?: string): number {
    switch (callType?.toLowerCase()) {
      case 'discovery': return 1.0
      case 'demo': return 1.3
      case 'closing': return 1.5
      case 'follow-up': return 0.8
      default: return 1.0
    }
  }

  /**
   * Select random items from an array
   */
  private static selectRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Get recent call analyses for a player
   */
  static async getRecentAnalyses(playerId: string, limit: number = 10) {
    return await prisma.callAnalysis.findMany({
      where: { playerId },
      orderBy: { timestamp: 'desc' },
      take: limit
    })
  }

  /**
   * Get call analysis statistics for a player
   */
  static async getCallStats(playerId: string) {
    const analyses = await prisma.callAnalysis.findMany({
      where: { playerId }
    })

    if (analyses.length === 0) {
      return {
        totalCalls: 0,
        averageScore: 0,
        bestScore: 0,
        totalXPEarned: 0,
        totalPipeline: 0,
        callTypeBreakdown: {},
        improvementTrend: []
      }
    }

    const totalCalls = analyses.length
    const averageScore = analyses.reduce((sum, a) => sum + a.score, 0) / totalCalls
    const bestScore = Math.max(...analyses.map(a => a.score))
    const totalXPEarned = analyses.reduce((sum, a) => sum + a.xpEarned, 0)
    const totalPipeline = analyses.reduce((sum, a) => sum + (a.pipelineValue || 0), 0)

    // Call type breakdown
    const callTypeBreakdown: Record<string, number> = {}
    analyses.forEach(a => {
      const type = a.callType || 'unknown'
      callTypeBreakdown[type] = (callTypeBreakdown[type] || 0) + 1
    })

    // Improvement trend (last 10 calls vs previous 10)
    const recent10 = analyses.slice(0, 10)
    const previous10 = analyses.slice(10, 20)

    const recentAvg = recent10.length > 0
      ? recent10.reduce((sum, a) => sum + a.score, 0) / recent10.length
      : 0

    const previousAvg = previous10.length > 0
      ? previous10.reduce((sum, a) => sum + a.score, 0) / previous10.length
      : recentAvg

    const improvementTrend = recentAvg - previousAvg

    return {
      totalCalls,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore: Math.round(bestScore * 10) / 10,
      totalXPEarned,
      totalPipeline,
      callTypeBreakdown,
      improvementTrend: Math.round(improvementTrend * 10) / 10
    }
  }

  /**
   * Get insights and recommendations for a player
   */
  static async getInsights(playerId: string): Promise<{
    topStrengths: string[]
    topWeaknesses: string[]
    recommendations: string[]
  }> {
    const analyses = await prisma.callAnalysis.findMany({
      where: { playerId },
      orderBy: { timestamp: 'desc' },
      take: 20 // Last 20 calls
    })

    if (analyses.length === 0) {
      return {
        topStrengths: [],
        topWeaknesses: [],
        recommendations: []
      }
    }

    // Count frequency of strengths and weaknesses
    const strengthCounts: Record<string, number> = {}
    const weaknessCounts: Record<string, number> = {}

    analyses.forEach(analysis => {
      analysis.strengths.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1
      })

      analysis.weaknesses.forEach(weakness => {
        weaknessCounts[weakness] = (weaknessCounts[weakness] || 0) + 1
      })
    })

    // Get top 3 strengths and weaknesses
    const topStrengths = Object.entries(strengthCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([strength]) => strength)

    const topWeaknesses = Object.entries(weaknessCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([weakness]) => weakness)

    // Generate recommendations based on top weaknesses
    const recommendations = topWeaknesses.map(weakness => {
      if (weakness.includes('qualifying questions')) {
        return 'Focus on discovery: Use SPIN selling to uncover deeper pain points'
      } else if (weakness.includes('objections')) {
        return 'Practice objection handling: Prepare responses for common concerns'
      } else if (weakness.includes('next steps')) {
        return 'Always end with clear next steps and mutual commitment'
      } else if (weakness.includes('urgency')) {
        return 'Create urgency by discussing timeline and consequences of inaction'
      } else {
        return `Work on: ${weakness.toLowerCase()}`
      }
    })

    return {
      topStrengths,
      topWeaknesses,
      recommendations
    }
  }
}