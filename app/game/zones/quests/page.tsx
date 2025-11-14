'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Target, Trophy, Clock, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Quest {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'milestone'
  target: number
  progress: number
  xpReward: number
  coinsReward: number
  difficulty: 1 | 2 | 3 | 4 | 5
  isCompleted: boolean
  expiresAt?: string
}

const mockQuests: Quest[] = [
  // Daily Quests
  {
    id: '1',
    name: '🎯 Discovery Marathon',
    description: 'Make 10 discovery calls today',
    type: 'daily',
    target: 10,
    progress: 3,
    xpReward: 500,
    coinsReward: 50,
    difficulty: 2,
    isCompleted: false,
    expiresAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '2',
    name: '⚡ Consistency Champion',
    description: 'Complete 5 calls in a row without break',
    type: 'daily',
    target: 5,
    progress: 5,
    xpReward: 300,
    coinsReward: 30,
    difficulty: 3,
    isCompleted: true,
    expiresAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    name: '🎓 BANT Master',
    description: 'Qualify 8 prospects using BANT methodology',
    type: 'daily',
    target: 8,
    progress: 2,
    xpReward: 400,
    coinsReward: 40,
    difficulty: 4,
    isCompleted: false,
    expiresAt: '2024-01-16T00:00:00Z'
  },

  // Weekly Quests
  {
    id: '4',
    name: '💰 Pipeline Architect',
    description: 'Generate €50K in pipeline value this week',
    type: 'weekly',
    target: 50000,
    progress: 15000,
    xpReward: 1000,
    coinsReward: 100,
    difficulty: 4,
    isCompleted: false,
    expiresAt: '2024-01-21T00:00:00Z'
  },
  {
    id: '5',
    name: '🛡️ Objection Handler',
    description: 'Successfully handle 20 objections',
    type: 'weekly',
    target: 20,
    progress: 8,
    xpReward: 750,
    coinsReward: 75,
    difficulty: 3,
    isCompleted: false,
    expiresAt: '2024-01-21T00:00:00Z'
  },
  {
    id: '6',
    name: '📈 Growth Hacker',
    description: 'Book 15 meetings this week',
    type: 'weekly',
    target: 15,
    progress: 6,
    xpReward: 1200,
    coinsReward: 120,
    difficulty: 5,
    isCompleted: false,
    expiresAt: '2024-01-21T00:00:00Z'
  },

  // Milestone Quests
  {
    id: '7',
    name: '🔥 On Fire',
    description: 'Score 8+/10 on 7 consecutive calls',
    type: 'milestone',
    target: 7,
    progress: 3,
    xpReward: 800,
    coinsReward: 80,
    difficulty: 4,
    isCompleted: false
  },
  {
    id: '8',
    name: '🌟 Superstar',
    description: 'Reach Level 10',
    type: 'milestone',
    target: 10,
    progress: 5,
    xpReward: 2000,
    coinsReward: 200,
    difficulty: 5,
    isCompleted: false
  }
]

export default function QuestsPage() {
  const [selectedTab, setSelectedTab] = useState('daily')

  const getQuestsByType = (type: string) => {
    return mockQuests.filter(quest => quest.type === type)
  }

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
  }

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100)
  }

  const formatTarget = (target: number, type: string) => {
    if (type === 'weekly' && target >= 1000) {
      return `€${(target / 1000).toFixed(0)}K`
    }
    return target.toLocaleString()
  }

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null

    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅'
      case 'weekly': return '📊'
      case 'milestone': return '🏆'
      default: return '🎯'
    }
  }

  const getCompletionStats = (type: string) => {
    const quests = getQuestsByType(type)
    const completed = quests.filter(q => q.isCompleted).length
    const total = quests.length
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 }
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
            <h1 className="text-3xl font-bold text-gold">Quest Board</h1>
            <p className="text-gray-300">Complete missions to earn XP and coins</p>
          </div>
        </div>

        <Badge variant="outline" className="text-gold border-gold/50">
          <Target className="w-4 h-4 mr-2" />
          Active Missions
        </Badge>
      </div>

      {/* Quest Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-obsidian/50">
          <TabsTrigger value="daily" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">
            📅 Daily ({getCompletionStats('daily').completed}/{getCompletionStats('daily').total})
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">
            📊 Weekly ({getCompletionStats('weekly').completed}/{getCompletionStats('weekly').total})
          </TabsTrigger>
          <TabsTrigger value="milestone" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">
            🏆 Milestone ({getCompletionStats('milestone').completed}/{getCompletionStats('milestone').total})
          </TabsTrigger>
        </TabsList>

        {/* Daily Quests */}
        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getQuestsByType('daily').map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all duration-300 hover:scale-105 ${
                  quest.isCompleted
                    ? 'bg-green-400/10 border-green-400/50'
                    : 'bg-obsidian/30 border-game-blue/30 hover:border-gold/50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={`text-lg ${quest.isCompleted ? 'text-green-400' : 'text-gold'}`}>
                          {quest.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-1">
                          {quest.description}
                        </CardDescription>
                      </div>
                      {quest.isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        {getDifficultyStars(quest.difficulty)}
                      </Badge>
                      {quest.expiresAt && (
                        <div className="flex items-center text-xs text-orange-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeRemaining(quest.expiresAt)}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className={quest.isCompleted ? 'text-green-400' : 'text-gold'}>
                            {quest.progress} / {formatTarget(quest.target, quest.type)}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(quest.progress, quest.target)} />
                      </div>

                      {/* Rewards */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gold">
                          <Star className="w-3 h-3 mr-1" />
                          +{quest.xpReward} XP
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Trophy className="w-3 h-3 mr-1" />
                          +{quest.coinsReward} coins
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Weekly Quests */}
        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getQuestsByType('weekly').map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all duration-300 hover:scale-105 ${
                  quest.isCompleted
                    ? 'bg-green-400/10 border-green-400/50'
                    : 'bg-obsidian/30 border-purple-400/30 hover:border-gold/50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={`text-lg ${quest.isCompleted ? 'text-green-400' : 'text-gold'}`}>
                          {quest.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-1">
                          {quest.description}
                        </CardDescription>
                      </div>
                      {quest.isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        {getDifficultyStars(quest.difficulty)}
                      </Badge>
                      {quest.expiresAt && (
                        <div className="flex items-center text-xs text-orange-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeRemaining(quest.expiresAt)}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className={quest.isCompleted ? 'text-green-400' : 'text-gold'}>
                            {quest.progress} / {formatTarget(quest.target, quest.type)}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(quest.progress, quest.target)} />
                      </div>

                      {/* Rewards */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gold">
                          <Star className="w-3 h-3 mr-1" />
                          +{quest.xpReward} XP
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Trophy className="w-3 h-3 mr-1" />
                          +{quest.coinsReward} coins
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Milestone Quests */}
        <TabsContent value="milestone" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getQuestsByType('milestone').map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all duration-300 hover:scale-105 ${
                  quest.isCompleted
                    ? 'bg-green-400/10 border-green-400/50'
                    : 'bg-obsidian/30 border-gold/30 hover:border-gold/50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={`text-lg ${quest.isCompleted ? 'text-green-400' : 'text-gold'}`}>
                          {quest.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-1">
                          {quest.description}
                        </CardDescription>
                      </div>
                      {quest.isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        {getDifficultyStars(quest.difficulty)}
                      </Badge>
                      <Badge className="bg-gold text-obsidian text-xs">
                        MILESTONE
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className={quest.isCompleted ? 'text-green-400' : 'text-gold'}>
                            {quest.progress} / {formatTarget(quest.target, quest.type)}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(quest.progress, quest.target)} />
                      </div>

                      {/* Rewards */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gold">
                          <Star className="w-3 h-3 mr-1" />
                          +{quest.xpReward} XP
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Trophy className="w-3 h-3 mr-1" />
                          +{quest.coinsReward} coins
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card className="bg-obsidian/30 border-gold/20 mt-12">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Quest Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {mockQuests.filter(q => q.isCompleted).length}
              </div>
              <p className="text-gray-400 text-sm">Completed Quests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold mb-1">
                {mockQuests.filter(q => !q.isCompleted).length}
              </div>
              <p className="text-gray-400 text-sm">Active Quests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-game-blue mb-1">
                {mockQuests.reduce((sum, q) => sum + (q.isCompleted ? q.xpReward : 0), 0)}
              </div>
              <p className="text-gray-400 text-sm">Total XP Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}