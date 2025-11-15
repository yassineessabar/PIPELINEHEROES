import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, itemId } = body

    if (!userId || !itemId) {
      return NextResponse.json({
        success: false,
        error: 'User ID and Item ID are required'
      }, { status: 400 })
    }

    // Get shop item details
    const shopItem = await prisma.shopItem.findUnique({
      where: { id: itemId }
    })

    if (!shopItem || !shopItem.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Item not found or not available'
      }, { status: 404 })
    }

    // Get user's current coin balance
    const playerStats = await prisma.playerStats.findUnique({
      where: { userId }
    })

    if (!playerStats) {
      return NextResponse.json({
        success: false,
        error: 'Player stats not found'
      }, { status: 404 })
    }

    // Check if user has enough coins
    const currentCoins = Number(playerStats.coins)
    if (currentCoins < shopItem.coinPrice) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient coins',
        coinsNeeded: shopItem.coinPrice - currentCoins
      }, { status: 400 })
    }

    // Check purchase limits
    const existingPurchases = await prisma.userPurchase.count({
      where: {
        userId,
        itemId,
        isActive: true
      }
    })

    if (existingPurchases >= shopItem.maxPerUser) {
      return NextResponse.json({
        success: false,
        error: 'Maximum purchase limit reached for this item'
      }, { status: 400 })
    }

    // Check stock if limited
    if (shopItem.isLimited && shopItem.stockQuantity !== null) {
      const totalPurchases = await prisma.userPurchase.count({
        where: {
          itemId,
          isActive: true
        }
      })

      if (totalPurchases >= shopItem.stockQuantity) {
        return NextResponse.json({
          success: false,
          error: 'Item is out of stock'
        }, { status: 400 })
      }
    }

    // Use a transaction to ensure atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coins from player
      const updatedPlayerStats = await tx.playerStats.update({
        where: { userId },
        data: {
          coins: {
            decrement: BigInt(shopItem.coinPrice)
          }
        }
      })

      // Create purchase record
      const purchase = await tx.userPurchase.create({
        data: {
          userId,
          itemId,
          coinsSpent: shopItem.coinPrice,
          quantity: 1
        }
      })

      // Create activity log
      await tx.activity.create({
        data: {
          workspaceId: playerStats.user?.workspaceId || 'default', // We'd need to get this properly
          userId,
          activityType: 'shop_purchase',
          title: 'Item Purchased',
          description: `Purchased ${shopItem.name} for ${shopItem.coinPrice} coins`,
          metadata: {
            itemId: shopItem.id,
            itemName: shopItem.name,
            coinPrice: shopItem.coinPrice
          }
        }
      })

      return {
        purchase,
        newCoinBalance: Number(updatedPlayerStats.coins)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        purchase: result.purchase,
        newCoinBalance: result.newCoinBalance,
        item: shopItem
      },
      message: `Successfully purchased ${shopItem.name}!`
    })

  } catch (error) {
    console.error('Purchase failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Purchase failed'
    }, { status: 500 })
  }
}