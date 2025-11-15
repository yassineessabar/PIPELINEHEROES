import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, questionId, choiceId, timeSpent } = body

    if (!userId || !questionId || !choiceId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Get the question and choice details
    const question = await prisma.trainingQuestion.findUnique({
      where: { id: questionId },
      include: {
        choices: true,
        category: true
      }
    })

    if (!question) {
      return NextResponse.json({
        success: false,
        error: 'Question not found'
      }, { status: 404 })
    }

    const selectedChoice = question.choices.find(choice => choice.id === choiceId)
    if (!selectedChoice) {
      return NextResponse.json({
        success: false,
        error: 'Choice not found'
      }, { status: 404 })
    }

    const isCorrect = selectedChoice.isCorrect
    const xpEarned = selectedChoice.xpReward

    // Use transaction to ensure atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Create training session record
      const trainingSession = await tx.trainingSession.create({
        data: {
          userId,
          questionId,
          choiceId,
          isCorrect,
          timeSpent: timeSpent || null,
          xpEarned
        }
      })

      // Update player stats
      await tx.playerStats.update({
        where: { userId },
        data: {
          xp: { increment: BigInt(xpEarned) },
          trainingSessionsCompleted: { increment: 1 }
        }
      })

      // Create XP transaction record
      await tx.xpTransaction.create({
        data: {
          userId,
          amount: xpEarned,
          reason: `Training: ${question.title}`,
          source: 'training',
          sourceId: trainingSession.id,
          metadata: {
            questionId,
            choiceId,
            isCorrect,
            category: question.category.slug
          }
        }
      })

      return trainingSession
    })

    // Get the best choice for feedback
    const bestChoice = question.choices.find(choice => choice.isCorrect)

    return NextResponse.json({
      success: true,
      data: {
        session: result,
        isCorrect,
        xpEarned,
        selectedChoice: {
          text: selectedChoice.text,
          feedback: selectedChoice.feedback,
          xpReward: selectedChoice.xpReward
        },
        bestChoice: bestChoice ? {
          text: bestChoice.text,
          feedback: bestChoice.feedback,
          xpReward: bestChoice.xpReward
        } : null,
        question: {
          title: question.title,
          bossName: question.bossName,
          category: question.category.name
        }
      }
    })

  } catch (error) {
    console.error('Failed to submit training response:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to submit training response'
    }, { status: 500 })
  }
}