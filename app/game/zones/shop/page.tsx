'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Coins, ShoppingCart, Star, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface ShopItem {
  id: string
  name: string
  icon?: string
  description: string
  coinPrice: number
  category: string
  isLimited: boolean
  stockQuantity?: number
  maxPerUser: number
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export default function ShopPage() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [playerCoins, setPlayerCoins] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = '550e8400-e29b-41d4-a716-446655440000'

  // Fetch shop items
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await fetch(`/api/shop/items?category=${selectedCategory}`)
        const result = await response.json()

        if (result.success) {
          setShopItems(result.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load shop items",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Failed to fetch shop items:', error)
        toast({
          title: "Error",
          description: "Failed to load shop items",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchShopItems()
  }, [selectedCategory, toast])

  // Fetch user coins
  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        const response = await fetch(`/api/user/coins?userId=${currentUserId}`)
        const result = await response.json()

        if (result.success) {
          setPlayerCoins(result.data.coins)
        }
      } catch (error) {
        console.error('Failed to fetch user coins:', error)
      }
    }

    fetchUserCoins()
  }, [currentUserId])

  const handlePurchase = async (item: ShopItem) => {
    if (purchasing) return // Prevent double purchases

    if (playerCoins < item.coinPrice) {
      toast({
        title: "Insufficient Coins 💰",
        description: `You need ${item.coinPrice - playerCoins} more coins to buy this item.`,
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setPurchasing(item.id)

    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUserId,
          itemId: item.id
        })
      })

      const result = await response.json()

      if (result.success) {
        setPlayerCoins(result.data.newCoinBalance)
        toast({
          title: "Purchase Successful! 🎉",
          description: result.message,
          duration: 3000,
        })
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error,
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      toast({
        title: "Purchase Failed",
        description: "An error occurred while processing your purchase",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setPurchasing(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reward': return 'border-gold bg-gold/10'
      case 'power_up': return 'border-blue-400 bg-blue-400/10'
      case 'cosmetic': return 'border-purple-400 bg-purple-400/10'
      case 'subscription': return 'border-green-400 bg-green-400/10'
      default: return 'border-gray-400 bg-gray-400/10'
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'reward': return 'bg-gold text-obsidian'
      case 'power_up': return 'bg-blue-400 text-blue-900'
      case 'cosmetic': return 'bg-purple-400 text-purple-900'
      case 'subscription': return 'bg-green-400 text-green-900'
      default: return 'bg-gray-400 text-gray-900'
    }
  }

  const getPriceRarity = (price: number) => {
    if (price >= 4000) return 'legendary'
    if (price >= 2000) return 'epic'
    if (price >= 1000) return 'rare'
    return 'common'
  }

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛒' },
    { id: 'reward', name: 'Rewards', icon: '🎁' },
    { id: 'power_up', name: 'Power-ups', icon: '⚡' },
    { id: 'cosmetic', name: 'Cosmetics', icon: '✨' },
    { id: 'subscription', name: 'Subscriptions', icon: '📺' }
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
            <p className="text-gray-400">Loading shop items...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="text-gold hover:bg-gold/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gold">Trading Post</h1>
            <p className="text-gray-300">Spend your hard-earned coins on rewards</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Card className="bg-gold/10 border-gold/30">
            <CardContent className="p-4 flex items-center space-x-3">
              <Coins className="w-6 h-6 text-gold" />
              <div>
                <p className="text-gold font-bold text-lg">{playerCoins.toLocaleString()}</p>
                <p className="text-xs text-gold/70">Available Coins</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "gold" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center space-x-2"
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shopItems.map((item, index) => {
          const rarity = getPriceRarity(item.coinPrice)
          const isItemPurchasing = purchasing === item.id

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full transition-all duration-300 hover:scale-105 hover:shadow-xl ${getCategoryColor(item.category)}`}>
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    <div className="text-5xl mb-3">{item.icon || '🎁'}</div>
                    <Badge className={`absolute -top-2 -right-2 text-xs ${getCategoryBadgeColor(item.category)}`}>
                      {item.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {item.isLimited && (
                      <Badge className="absolute -top-2 -left-2 text-xs bg-red-500 text-white">
                        LIMITED
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-gold text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm min-h-[40px]">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-gold font-bold">
                    <Coins className="w-4 h-4" />
                    <span>{item.coinPrice.toLocaleString()}</span>
                  </div>

                  {item.isLimited && item.stockQuantity !== null && (
                    <div className="text-center text-xs text-orange-400">
                      📦 Only {item.stockQuantity} left in stock
                    </div>
                  )}

                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={playerCoins < item.coinPrice || isItemPurchasing}
                    className={`w-full ${
                      playerCoins >= item.coinPrice && !isItemPurchasing
                        ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-obsidian'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isItemPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {playerCoins >= item.coinPrice ? 'Purchase' : 'Not Enough Coins'}
                      </>
                    )}
                  </Button>

                  {item.category === 'power_up' && (
                    <div className="flex items-center justify-center text-xs text-game-blue">
                      <Zap className="w-3 h-3 mr-1" />
                      Limited Time Effect
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {shopItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-bold text-gold mb-2">No items found</h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}

      {/* Info Section */}
      <Card className="bg-obsidian/30 border-gold/20 mt-12">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Star className="w-5 h-5 mr-2" />
            How to Earn More Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📞</div>
              <h4 className="font-semibold text-white mb-1">Complete Calls</h4>
              <p className="text-gray-400 text-sm">Earn coins from every sales call</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-white mb-1">Finish Quests</h4>
              <p className="text-gray-400 text-sm">Complete daily and weekly missions</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⬆️</div>
              <h4 className="font-semibold text-white mb-1">Level Up</h4>
              <p className="text-gray-400 text-sm">Get bonus coins when leveling up</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}