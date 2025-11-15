import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    let where = {
      isActive: true
    }

    // Add category filter if specified
    if (category && category !== 'all') {
      where = {
        ...where,
        category: category
      }
    }

    const shopItems = await prisma.shopItem.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: shopItems
    })
  } catch (error) {
    console.error('Failed to fetch shop items:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch shop items'
    }, { status: 500 })
  }
}