'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Star, Lock, Check, Crown, Target, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  category: 'calls' | 'meetings' | 'pipeline' | 'streak' | 'training' | 'milestone'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  isUnlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  xpReward: number
  coinsReward: number
}

const mockAchievements: Achievement[] = [
  // Calls Category
  {
    id: '1',
    name: 'First Call',
    icon: '📞',
    description: 'Make your first sales call',
    category: 'calls',
    rarity: 'common',
    isUnlocked: true,
    unlockedAt: '2024-01-10T10:00:00Z',
    xpReward: 50,
    coinsReward: 10
  },
  {
    id: '2',
    name: 'Call Veteran',
    icon: '🎯',
    description: 'Complete 50 sales calls',
    category: 'calls',
    rarity: 'uncommon',
    isUnlocked: true,
    unlockedAt: '2024-01-14T15:30:00Z',
    xpReward: 250,
    coinsReward: 50
  },
  {
    id: '3',
    name: 'Call Master',
    icon: '👑',
    description: 'Complete 100 sales calls',
    category: 'calls',
    rarity: 'rare',
    isUnlocked: false,
    progress: 24,
    maxProgress: 100,
    xpReward: 500,
    coinsReward: 100
  },
  {
    id: '4',
    name: 'Perfect Score',
    icon: '⭐',
    description: 'Get a perfect 10/10 call score',
    category: 'calls',
    rarity: 'epic',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 300,
    coinsReward: 75
  },

  // Meetings Category
  {
    id: '5',
    name: 'Meeting Starter',
    icon: '🤝',
    description: 'Book your first meeting',
    category: 'meetings',
    rarity: 'common',
    isUnlocked: true,
    unlockedAt: '2024-01-11T09:15:00Z',
    xpReward: 75,
    coinsReward: 15
  },
  {
    id: '6',
    name: 'Meeting Machine',
    icon: '⚡',
    description: 'Book 25 meetings',
    category: 'meetings',
    rarity: 'rare',
    isUnlocked: false,
    progress: 8,
    maxProgress: 25,
    xpReward: 400,
    coinsReward: 80
  },

  // Streak Category
  {
    id: '7',
    name: 'Consistency King',
    icon: '🔥',
    description: 'Maintain a 7-day activity streak',
    category: 'streak',
    rarity: 'uncommon',
    isUnlocked: false,
    progress: 3,
    maxProgress: 7,
    xpReward: 300,
    coinsReward: 75
  },
  {
    id: '8',
    name: 'Unstoppable',
    icon: '💪',
    description: 'Maintain a 30-day activity streak',
    category: 'streak',
    rarity: 'legendary',
    isUnlocked: false,
    progress: 3,
    maxProgress: 30,
    xpReward: 1000,
    coinsReward: 250
  },

  // Training Category
  {
    id: '9',
    name: 'Objection Warrior',
    icon: '🛡️',
    description: 'Complete 20 objection training scenarios',
    category: 'training',
    rarity: 'uncommon',
    isUnlocked: false,
    progress: 0,
    maxProgress: 20,
    xpReward: 250,
    coinsReward: 60
  },
  {
    id: '10',
    name: 'Training Master',
    icon: '🎓',
    description: 'Achieve 90% accuracy in training',
    category: 'training',
    rarity: 'epic',
    isUnlocked: false,
    progress: 0,
    maxProgress: 90,
    xpReward: 600,
    coinsReward: 150
  },

  // Milestone Category
  {
    id: '11',
    name: 'Rising Star',
    icon: '⭐',
    description: 'Reach Level 5',
    category: 'milestone',
    rarity: 'common',
    isUnlocked: true,
    unlockedAt: '2024-01-15T12:00:00Z',
    xpReward: 200,
    coinsReward: 50
  },
  {
    id: '12',
    name: 'Sales Champion',
    icon: '🏆',
    description: 'Reach Level 25',
    category: 'milestone',
    rarity: 'legendary',
    isUnlocked: false,
    progress: 5,
    maxProgress: 25,
    xpReward: 2000,
    coinsReward: 500
  }
]

// Helper function for consistent date formatting between server and client
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
}

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getAchievementsByCategory = (category: string) => {
    if (category === 'all') return mockAchievements
    return mockAchievements.filter(achievement => achievement.category === category)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/5'
      case 'uncommon': return 'border-green-400 bg-green-400/5'
      case 'rare': return 'border-blue-400 bg-blue-400/5'
      case 'epic': return 'border-purple-400 bg-purple-400/5'
      case 'legendary': return 'border-gold bg-gold/5'
      default: return 'border-gray-400 bg-gray-400/5'
    }
  }

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-400 text-gray-900'
      case 'uncommon': return 'bg-green-400 text-green-900'
      case 'rare': return 'bg-blue-400 text-blue-900'
      case 'epic': return 'bg-purple-400 text-purple-900'
      case 'legendary': return 'bg-gold text-obsidian'
      default: return 'bg-gray-400 text-gray-900'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'calls': return '📞'
      case 'meetings': return '🤝'
      case 'pipeline': return '💰'
      case 'streak': return '🔥'
      case 'training': return '⚔️'
      case 'milestone': return '🏆'
      default: return '🎯'
    }
  }

  const getProgressPercentage = (progress?: number, maxProgress?: number) => {
    if (!progress || !maxProgress) return 0
    return (progress / maxProgress) * 100
  }

  const getStats = () => {
    const unlocked = mockAchievements.filter(a => a.isUnlocked).length
    const total = mockAchievements.length
    const totalXP = mockAchievements
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.xpReward, 0)
    const totalCoins = mockAchievements
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.coinsReward, 0)

    return { unlocked, total, totalXP, totalCoins }
  }

  const stats = getStats()
  const filteredAchievements = getAchievementsByCategory(selectedCategory)

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'calls', name: 'Calls', icon: '📞' },
    { id: 'meetings', name: 'Meetings', icon: '🤝' },
    { id: 'streak', name: 'Streaks', icon: '🔥' },
    { id: 'training', name: 'Training', icon: '⚔️' },
    { id: 'milestone', name: 'Milestones', icon: '🌟' }
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
            <h1 className="text-3xl font-bold text-gold">Treasure Vault</h1>
            <p className="text-gray-300">Your collection of achievements and trophies</p>
          </div>
        </div>

        <Badge variant="outline" className="text-gold border-gold/50">
          <Trophy className="w-4 h-4 mr-2" />
          {stats.unlocked}/{stats.total} Unlocked
        </Badge>
      </div>

      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30 mb-8">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold mb-1">{stats.unlocked}</div>
              <p className="text-gray-400 text-sm">Achievements Unlocked</p>
              <Progress value={(stats.unlocked / stats.total) * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-game-blue mb-1">{stats.totalXP}</div>
              <p className="text-gray-400 text-sm">Total XP Earned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.totalCoins}</div>
              <p className="text-gray-400 text-sm">Total Coins Earned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {Math.round((stats.unlocked / stats.total) * 100)}%
              </div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`h-full transition-all duration-300 hover:scale-105 ${
              achievement.isUnlocked
                ? `${getRarityColor(achievement.rarity)} shadow-lg`
                : 'bg-obsidian/20 border-gray-600 opacity-75'
            }`}>
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto">
                  <div className={`text-4xl mb-3 ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.isUnlocked ? achievement.icon : '🔒'}
                  </div>

                  <Badge className={`absolute -top-2 -right-8 text-xs ${getRarityBadgeColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>

                  {achievement.isUnlocked && (
                    <div className="absolute -top-1 -left-8">
                      <Check className="w-6 h-6 text-green-400 bg-green-400/20 rounded-full p-1" />
                    </div>
                  )}
                </div>

                <CardTitle className={`text-lg ${achievement.isUnlocked ? 'text-gold' : 'text-gray-500'}`}>
                  {achievement.name}
                </CardTitle>
                <CardDescription className={achievement.isUnlocked ? 'text-gray-300' : 'text-gray-600'}>
                  {achievement.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* Progress Bar (for locked achievements) */}
                {!achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-400">
                        {achievement.progress} / {achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(achievement.progress, achievement.maxProgress)} />
                  </div>
                )}

                {/* Unlock Date */}
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="text-center text-xs text-green-400">
                    ✓ Unlocked {formatDate(achievement.unlockedAt)}
                  </div>
                )}

                {/* Rewards */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-game-blue">
                    <Star className="w-3 h-3 mr-1" />
                    +{achievement.xpReward} XP
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Trophy className="w-3 h-3 mr-1" />
                    +{achievement.coinsReward} coins
                  </div>
                </div>

                {/* Category Badge */}
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon(achievement.category)} {achievement.category.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gold mb-2">No achievements found</h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}

      {/* Motivation Card */}
      <Card className="bg-obsidian/30 border-gold/20 mt-12">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Keep Going!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-semibold text-white mb-1">Stay Active</h4>
              <p className="text-gray-400 text-sm">Complete calls daily to unlock achievements</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-white mb-1">Set Goals</h4>
              <p className="text-gray-400 text-sm">Work towards specific achievement targets</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold text-white mb-1">Earn Rewards</h4>
              <p className="text-gray-400 text-sm">Each achievement brings XP and coin rewards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}