import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const playerStats = await prisma.playerStats.findUnique({
      where: { userId },
      select: {
        coins: true,
        level: true,
        xp: true
      }
    })

    if (!playerStats) {
      return NextResponse.json({
        success: false,
        error: 'Player stats not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        coins: Number(playerStats.coins),
        level: playerStats.level,
        xp: Number(playerStats.xp)
      }
    })
  } catch (error) {
    console.error('Failed to fetch user coins:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user coins'
    }, { status: 500 })
  }
}