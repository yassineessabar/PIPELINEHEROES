import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const difficulty = searchParams.get('difficulty')
    const userId = searchParams.get('userId')

    let where: any = { isActive: true }

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty)
    }

    // Get questions with their choices and category
    const questions = await prisma.trainingQuestion.findMany({
      where,
      include: {
        category: true,
        choices: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // If userId provided, also get user's training progress
    let userProgress = null
    if (userId) {
      const playerStats = await prisma.playerStats.findUnique({
        where: { userId },
        select: {
          trainingSessionsCompleted: true,
          level: true,
          xp: true
        }
      })

      // Get user's training sessions for accuracy calculation
      const trainingSessions = await prisma.trainingSession.findMany({
        where: { userId },
        select: { isCorrect: true }
      })

      const correctAnswers = trainingSessions.filter(session => session.isCorrect).length
      const totalAnswers = trainingSessions.length
      const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

      const totalXpEarned = await prisma.trainingSession.aggregate({
        where: { userId },
        _sum: { xpEarned: true }
      })

      userProgress = {
        sessionsCompleted: playerStats?.trainingSessionsCompleted || 0,
        accuracy,
        totalXpEarned: totalXpEarned._sum.xpEarned || 0,
        level: playerStats?.level || 1,
        totalXp: Number(playerStats?.xp || 0)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        questions,
        userProgress
      }
    })
  } catch (error) {
    console.error('Failed to fetch training questions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch training questions'
    }, { status: 500 })
  }
}