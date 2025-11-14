'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Coins, ShoppingCart, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface ShopItem {
  id: string
  name: string
  icon: string
  description: string
  cost: number
  category: 'reward' | 'boost' | 'cosmetic'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const mockShopItems: ShopItem[] = [
  {
    id: '1',
    name: 'Half Day Off',
    icon: '☕',
    description: 'Friday afternoon off - perfect for early weekend start',
    cost: 500,
    category: 'reward',
    rarity: 'common'
  },
  {
    id: '2',
    name: 'Team Lunch',
    icon: '🍽️',
    description: 'Treat your team to a nice lunch',
    cost: 800,
    category: 'reward',
    rarity: 'common'
  },
  {
    id: '3',
    name: 'Amazon €50',
    icon: '🎁',
    description: 'Amazon gift card for your shopping needs',
    cost: 1000,
    category: 'reward',
    rarity: 'rare'
  },
  {
    id: '4',
    name: 'Full Day Off',
    icon: '🏖️',
    description: 'Extra vacation day - enjoy a long weekend',
    cost: 2000,
    category: 'reward',
    rarity: 'epic'
  },
  {
    id: '5',
    name: 'XP Boost (24h)',
    icon: '⚡',
    description: 'Double XP for 24 hours',
    cost: 300,
    category: 'boost',
    rarity: 'common'
  },
  {
    id: '6',
    name: 'Gym Pass',
    icon: '💪',
    description: '1 month premium gym membership',
    cost: 1500,
    category: 'reward',
    rarity: 'rare'
  },
  {
    id: '7',
    name: 'Netflix +3mo',
    icon: '🎬',
    description: 'Netflix premium subscription for 3 months',
    cost: 700,
    category: 'reward',
    rarity: 'common'
  },
  {
    id: '8',
    name: 'Spotify +3mo',
    icon: '🎵',
    description: 'Spotify premium subscription for 3 months',
    cost: 600,
    category: 'reward',
    rarity: 'common'
  },
  {
    id: '9',
    name: 'Golden Avatar Frame',
    icon: '🖼️',
    description: 'Show off with a shiny golden frame',
    cost: 400,
    category: 'cosmetic',
    rarity: 'rare'
  },
  {
    id: '10',
    name: 'Hotel Stay',
    icon: '🏨',
    description: '1 night at a 4-star hotel',
    cost: 3500,
    category: 'reward',
    rarity: 'legendary'
  },
  {
    id: '11',
    name: 'Tech Gadget',
    icon: '📱',
    description: 'Latest tech gadget of your choice',
    cost: 4000,
    category: 'reward',
    rarity: 'legendary'
  },
  {
    id: '12',
    name: 'Gaming Setup',
    icon: '🎮',
    description: 'Premium gaming setup upgrade',
    cost: 5000,
    category: 'reward',
    rarity: 'legendary'
  }
]

export default function ShopPage() {
  const [playerCoins, setPlayerCoins] = useState(5000)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { toast } = useToast()

  const handlePurchase = (item: ShopItem) => {
    if (playerCoins >= item.cost) {
      setPlayerCoins(prev => prev - item.cost)
      toast({
        title: "Purchase Successful! 🎉",
        description: `You bought ${item.name} for ${item.cost} coins!`,
        duration: 3000,
      })
    } else {
      toast({
        title: "Insufficient Coins 💰",
        description: `You need ${item.cost - playerCoins} more coins to buy this item.`,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10'
      case 'rare': return 'border-blue-400 bg-blue-400/10'
      case 'epic': return 'border-purple-400 bg-purple-400/10'
      case 'legendary': return 'border-gold bg-gold/10'
      default: return 'border-gray-400 bg-gray-400/10'
    }
  }

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-400 text-gray-900'
      case 'rare': return 'bg-blue-400 text-blue-900'
      case 'epic': return 'bg-purple-400 text-purple-900'
      case 'legendary': return 'bg-gold text-obsidian'
      default: return 'bg-gray-400 text-gray-900'
    }
  }

  const filteredItems = selectedCategory === 'all'
    ? mockShopItems
    : mockShopItems.filter(item => item.category === selectedCategory)

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛒' },
    { id: 'reward', name: 'Rewards', icon: '🎁' },
    { id: 'boost', name: 'Boosts', icon: '⚡' },
    { id: 'cosmetic', name: 'Cosmetics', icon: '✨' }
  ]

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
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full transition-all duration-300 hover:scale-105 hover:shadow-xl ${getRarityColor(item.rarity)}`}>
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <Badge className={`absolute -top-2 -right-2 text-xs ${getRarityBadgeColor(item.rarity)}`}>
                    {item.rarity.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-gold text-lg">{item.name}</CardTitle>
                <CardDescription className="text-gray-300 text-sm min-h-[40px]">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-center space-x-2 text-gold font-bold">
                  <Coins className="w-4 h-4" />
                  <span>{item.cost.toLocaleString()}</span>
                </div>

                <Button
                  onClick={() => handlePurchase(item)}
                  disabled={playerCoins < item.cost}
                  className={`w-full ${
                    playerCoins >= item.cost
                      ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-obsidian'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {playerCoins >= item.cost ? 'Purchase' : 'Not Enough Coins'}
                </Button>

                {item.category === 'boost' && (
                  <div className="flex items-center justify-center text-xs text-game-blue">
                    <Zap className="w-3 h-3 mr-1" />
                    Limited Time Effect
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
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