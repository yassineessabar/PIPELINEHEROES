'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Trophy, Medal, TrendingUp, Users, Target, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

interface LeaderboardEntry {
  id: string
  name: string
  displayName?: string
  level: number
  xp: number
  meetings: number
  calls: number
  rank: number
  streak: number
  isCurrentPlayer?: boolean
}

interface ProgressData {
  current: number
  max: number
  scoreNeeded: number
  nextPlayer: {
    name: string
    rank: number
  }
}

interface TopPerformers {
  calls: LeaderboardEntry[]
  meetings: LeaderboardEntry[]
  streak: LeaderboardEntry[]
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  currentPlayer: LeaderboardEntry
  progressData: ProgressData | null
  topPerformers: TopPerformers
  period: string
}

export default function ArenaPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = '550e8400-e29b-41d4-a716-446655440000'

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?userId=${currentUserId}&period=${selectedPeriod}`)
        const result = await response.json()

        if (result.success) {
          setLeaderboardData(result.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load leaderboard",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        toast({
          title: "Error",
          description: "Failed to load leaderboard",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [selectedPeriod, toast])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-gold" />
      case 2: return <Medal className="w-6 h-6 text-gray-300" />
      case 3: return <Trophy className="w-6 h-6 text-amber-600" />
      default: return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gold text-obsidian'
      case 2: return 'bg-gray-300 text-gray-900'
      case 3: return 'bg-amber-600 text-white'
      default: return 'bg-gray-600 text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
            <p className="text-gray-400">Loading arena...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!leaderboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gold mb-2">Arena temporarily unavailable</h3>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    )
  }

  const { leaderboard, currentPlayer, progressData, topPerformers } = leaderboardData

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
            <h1 className="text-3xl font-bold text-gold">Arena</h1>
            <p className="text-gray-300">Compete with your team and climb the ranks</p>
          </div>
        </div>

        <Badge variant="outline" className="text-gold border-gold/50">
          <Users className="w-4 h-4 mr-2" />
          Team Competition
        </Badge>
      </div>

      {/* Player Rank Card */}
      <Card className="bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30 mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center text-obsidian font-bold text-xl">
                {(currentPlayer.displayName || currentPlayer.name).charAt(0)}
              </div>
              <div>
                <CardTitle className="text-gold text-xl">{currentPlayer.displayName || currentPlayer.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  Level {currentPlayer.level} • {currentPlayer.xp.toLocaleString()} XP
                </CardDescription>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">#{currentPlayer.rank}</div>
              <Badge className={getRankBadgeColor(currentPlayer.rank)}>
                Current Rank
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {progressData && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to #{progressData.nextPlayer.rank}</span>
                <span className="text-gold">
                  {progressData.scoreNeeded} points needed to surpass {progressData.nextPlayer.name}
                </span>
              </div>
              <Progress
                value={(progressData.current / progressData.max) * 100}
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-obsidian/50">
          <TabsTrigger value="daily" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">
            📅 Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">
            📊 Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">
            📈 Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6">
          {/* Main Leaderboard */}
          <Card className="bg-obsidian/30 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Team Leaderboard - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 hover:bg-obsidian/50 transition-colors ${
                      player.isCurrentPlayer ? 'bg-gold/10 border-l-4 border-l-gold' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 flex justify-center">
                        {getRankIcon(player.rank)}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-game-blue to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {(player.displayName || player.name).charAt(0)}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${player.isCurrentPlayer ? 'text-gold' : 'text-white'}`}>
                          {player.displayName || player.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Level {player.level} • {player.streak > 0 ? `🔥 ${player.streak} day streak` : 'No streak'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-white">{player.xp.toLocaleString()}</div>
                        <div className="text-gray-400">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-400">{player.meetings}</div>
                        <div className="text-gray-400">Meetings</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-game-blue">{player.calls}</div>
                        <div className="text-gray-400">Calls</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-obsidian/30 border-game-blue/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-game-blue text-lg flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Most Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.calls.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gold font-bold">#{index + 1}</span>
                      <span className="text-white text-sm">{player.displayName || player.name}</span>
                    </div>
                    <span className="text-game-blue font-semibold">{player.calls}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-obsidian/30 border-green-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 text-lg flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Most Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.meetings.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gold font-bold">#{index + 1}</span>
                      <span className="text-white text-sm">{player.displayName || player.name}</span>
                    </div>
                    <span className="text-green-400 font-semibold">{player.meetings}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-obsidian/30 border-orange-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-400 text-lg flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Longest Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.streak.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gold font-bold">#{index + 1}</span>
                      <span className="text-white text-sm">{player.displayName || player.name}</span>
                    </div>
                    <span className="text-orange-400 font-semibold">{player.streak} days</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Competition Info */}
      <Card className="bg-obsidian/30 border-gold/20 mt-8">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            How Rankings Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-semibold text-white mb-1">Activity Score</h4>
              <p className="text-gray-400 text-sm">Based on XP gained, meetings booked, and calls made</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold text-white mb-1">Meeting Bonus</h4>
              <p className="text-gray-400 text-sm">100 points per meeting - the highest impact activity</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📞</div>
              <h4 className="font-semibold text-white mb-1">Call Points</h4>
              <p className="text-gray-400 text-sm">50 points per call - consistency matters</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}