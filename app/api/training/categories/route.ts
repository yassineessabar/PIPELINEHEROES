import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const categories = await prisma.trainingCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            questions: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Failed to fetch training categories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch training categories'
    }, { status: 500 })
  }
}