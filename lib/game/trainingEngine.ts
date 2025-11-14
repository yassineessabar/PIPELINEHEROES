import { prisma } from '@/lib/db/prisma'
import { XPEngine } from './xpEngine'

export interface TrainingQuestion {
  id: string
  bossName: string
  difficulty: number
  prompt: string
  category: string
  choices: TrainingChoice[]
}

export interface TrainingChoice {
  id: string
  text: string
  xpReward: number
  isBest: boolean
  feedback?: string
}

export interface TrainingResult {
  correct: boolean
  xpEarned: number
  feedback: string
  bestChoice?: TrainingChoice
}

export class TrainingEngine {
  /**
   * Get a random training question by difficulty
   */
  static async getRandomQuestion(difficulty?: number): Promise<TrainingQuestion | null> {
    const whereClause: any = { isActive: true }
    if (difficulty) {
      whereClause.difficulty = difficulty
    }

    const questions = await prisma.trainingQuestion.findMany({
      where: whereClause,
      include: {
        choices: true
      }
    })

    if (questions.length === 0) return null

    const randomIndex = Math.floor(Math.random() * questions.length)
    return questions[randomIndex]
  }

  /**
   * Get questions by category
   */
  static async getQuestionsByCategory(category: string): Promise<TrainingQuestion[]> {
    return await prisma.trainingQuestion.findMany({
      where: {
        category,
        isActive: true
      },
      include: {
        choices: true
      },
      orderBy: { difficulty: 'asc' }
    })
  }

  /**
   * Submit an answer and get result
   */
  static async submitAnswer(
    playerId: string,
    questionId: string,
    choiceId: string
  ): Promise<TrainingResult> {
    const question = await prisma.trainingQuestion.findUnique({
      where: { id: questionId },
      include: {
        choices: true
      }
    })

    if (!question) {
      throw new Error('Question not found')
    }

    const selectedChoice = question.choices.find(c => c.id === choiceId)
    if (!selectedChoice) {
      throw new Error('Choice not found')
    }

    const bestChoice = question.choices.find(c => c.isBest)

    // Award XP
    const xpEarned = selectedChoice.xpReward
    await XPEngine.awardXP(playerId, {
      amount: xpEarned,
      reason: `Training: ${question.bossName}`
    })

    // Record progress
    await prisma.trainingProgress.create({
      data: {
        playerId,
        questionId,
        choiceId,
        xpEarned
      }
    })

    // Update quest progress
    const { QuestEngine } = await import('./questEngine')
    await QuestEngine.updateProgress(playerId, 'TRAINING_COMPLETED')

    return {
      correct: selectedChoice.isBest,
      xpEarned,
      feedback: selectedChoice.feedback || (selectedChoice.isBest
        ? 'Excellent response! This is exactly what a top performer would say.'
        : 'Good attempt, but there might be a better approach.'),
      bestChoice: bestChoice || undefined
    }
  }

  /**
   * Get player's training history
   */
  static async getTrainingHistory(playerId: string, limit: number = 20) {
    return await prisma.trainingProgress.findMany({
      where: { playerId },
      include: {
        question: {
          include: {
            choices: true
          }
        }
      },
      orderBy: { answeredAt: 'desc' },
      take: limit
    })
  }

  /**
   * Get training stats for a player
   */
  static async getTrainingStats(playerId: string) {
    const history = await this.getTrainingHistory(playerId, 1000)

    const totalQuestions = history.length
    const correctAnswers = history.filter(h =>
      h.question.choices.find(c => c.id === h.choiceId)?.isBest
    ).length

    const categoryStats: Record<string, { total: number, correct: number }> = {}

    for (const item of history) {
      const category = item.question.category
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0 }
      }
      categoryStats[category].total++

      const choice = item.question.choices.find(c => c.id === item.choiceId)
      if (choice?.isBest) {
        categoryStats[category].correct++
      }
    }

    const difficultyStats: Record<number, { total: number, correct: number }> = {}

    for (const item of history) {
      const difficulty = item.question.difficulty
      if (!difficultyStats[difficulty]) {
        difficultyStats[difficulty] = { total: 0, correct: 0 }
      }
      difficultyStats[difficulty].total++

      const choice = item.question.choices.find(c => c.id === item.choiceId)
      if (choice?.isBest) {
        difficultyStats[difficulty].correct++
      }
    }

    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      totalXPEarned: history.reduce((sum, item) => sum + item.xpEarned, 0),
      categoryStats,
      difficultyStats
    }
  }

  /**
   * Get boss battle (series of questions by difficulty)
   */
  static async getBossBattle(bossName: string): Promise<TrainingQuestion[]> {
    return await prisma.trainingQuestion.findMany({
      where: {
        bossName,
        isActive: true
      },
      include: {
        choices: true
      },
      orderBy: { difficulty: 'asc' }
    })
  }

  /**
   * Create a new training question
   */
  static async createQuestion(data: {
    bossName: string
    difficulty: number
    prompt: string
    category: string
    choices: Array<{
      text: string
      xpReward: number
      isBest: boolean
      feedback?: string
    }>
  }) {
    return await prisma.trainingQuestion.create({
      data: {
        bossName: data.bossName,
        difficulty: data.difficulty,
        prompt: data.prompt,
        category: data.category,
        choices: {
          create: data.choices
        }
      },
      include: {
        choices: true
      }
    })
  }

  /**
   * Get recommended next question based on player performance
   */
  static async getRecommendedQuestion(playerId: string): Promise<TrainingQuestion | null> {
    const stats = await this.getTrainingStats(playerId)

    // Find weakest category
    let weakestCategory = 'pricing' // default
    let lowestAccuracy = 100

    for (const [category, stat] of Object.entries(stats.categoryStats)) {
      if (stat.total >= 3) { // Only consider categories with at least 3 attempts
        const accuracy = (stat.correct / stat.total) * 100
        if (accuracy < lowestAccuracy) {
          lowestAccuracy = accuracy
          weakestCategory = category
        }
      }
    }

    // Get question from weakest category
    const questions = await this.getQuestionsByCategory(weakestCategory)
    if (questions.length === 0) return null

    // Get a question they haven't answered recently
    const recentQuestionIds = (await this.getTrainingHistory(playerId, 10))
      .map(h => h.questionId)

    const availableQuestions = questions.filter(q => !recentQuestionIds.includes(q.id))

    if (availableQuestions.length === 0) {
      return questions[Math.floor(Math.random() * questions.length)]
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
  }
}