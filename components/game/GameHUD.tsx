'use client'

import { Badge } from '@/components/ui/badge'
import { XPProgress } from '@/components/ui/progress'
import { getXPProgressToNextLevel } from '@/lib/utils'
import { Coins, Phone, Calendar, Flame, Trophy } from 'lucide-react'

interface Player {
  id: string
  name: string
  level: number
  xp: number
  coins: number
  callsCompleted: number
  meetings: number
  streakDays: number
}

interface GameHUDProps {
  player: Player
}

export function GameHUD({ player }: GameHUDProps) {
  const xpProgress = getXPProgressToNextLevel(player.xp)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-obsidian/95 backdrop-blur-md border-b border-gold/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Player Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-obsidian font-bold text-lg">
                {player.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-white font-bold">{player.name}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-gold border-gold/50">
                    Level {player.level}
                  </Badge>
                  <Trophy className="w-4 h-4 text-gold" />
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="flex items-center space-x-3">
              <div className="min-w-[200px]">
                <div className="flex justify-between text-sm text-gold mb-1">
                  <span>XP: {player.xp.toLocaleString()}</span>
                  <span>Next: {xpProgress.max.toLocaleString()}</span>
                </div>
                <XPProgress value={xpProgress.percentage} className="w-full" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6">
            {/* Coins */}
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold">{player.coins.toLocaleString()}</span>
            </div>

            {/* Calls */}
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-game-blue" />
              <span className="text-white">{player.callsCompleted}</span>
            </div>

            {/* Meetings */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-white">{player.meetings}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-white">{player.streakDays}</span>
              <span className="text-xs text-gray-400">day streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}