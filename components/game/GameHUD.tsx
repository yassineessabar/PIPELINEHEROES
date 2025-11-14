'use client'

import { Badge } from '@/components/ui/badge'
import { XPProgress } from '@/components/ui/progress'
import { getXPProgressToNextLevel } from '@/lib/utils'
import { Zap, Phone, Calendar, Flame, Trophy, Database } from 'lucide-react'

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#00F0FF]/30 px-10 py-4 holographic backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 text-[#00F0FF]">
            <Database className="w-full h-full" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-widest uppercase text-[#00F0FF] text-shadow-neon animate-glitch">
            PIPELINE HEROES
          </h1>
        </div>

        {/* Player Info */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#FF00FF] flex items-center justify-center font-bold text-lg text-[#0D0C1D] border-2 border-[#00F0FF]/50 zone-glow">
                {player.name.charAt(0)}
              </div>
              <div className="level-indicator">
                {player.level}
              </div>
            </div>
            <div>
              <h2 className="text-[#E0E0E0] font-bold font-display">{player.name}</h2>
              <div className="text-[#00F0FF] text-sm font-body tracking-wider">
                NEURAL OPERATIVE
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="min-w-[200px]">
            <div className="flex justify-between text-sm text-[#00F0FF] mb-1 font-display">
              <span>XP: {player.xp.toLocaleString()}</span>
              <span>NEXT: {xpProgress.max.toLocaleString()}</span>
            </div>
            <XPProgress value={xpProgress.percentage} className="w-full h-3 bg-[#1F1E3A]/50 border border-[#00F0FF]/30" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 text-center font-display">
            <div className="flex flex-col items-center p-2 bg-[#1F1E3A]/50 rounded border border-[#00F0FF]/20 hover:border-[#00F0FF]/50 transition-colors">
              <Zap className="w-4 h-4 text-[#00F0FF] mb-1" />
              <span className="text-[#00F0FF] font-bold text-lg">{player.coins.toLocaleString()}</span>
              <span className="text-[#E0E0E0]/70 text-xs uppercase tracking-wider">CREDITS</span>
            </div>

            <div className="flex flex-col items-center p-2 bg-[#1F1E3A]/50 rounded border border-[#00F0FF]/20 hover:border-[#00F0FF]/50 transition-colors">
              <Phone className="w-4 h-4 text-[#FF00FF] mb-1" />
              <span className="text-[#E0E0E0] font-bold text-lg">{player.callsCompleted}</span>
              <span className="text-[#E0E0E0]/70 text-xs uppercase tracking-wider">CALLS</span>
            </div>

            <div className="flex flex-col items-center p-2 bg-[#1F1E3A]/50 rounded border border-[#00F0FF]/20 hover:border-[#00F0FF]/50 transition-colors">
              <Calendar className="w-4 h-4 text-[#00F0FF] mb-1" />
              <span className="text-[#E0E0E0] font-bold text-lg">{player.meetings}</span>
              <span className="text-[#E0E0E0]/70 text-xs uppercase tracking-wider">MEETS</span>
            </div>

            <div className="flex flex-col items-center p-2 bg-[#1F1E3A]/50 rounded border border-[#00F0FF]/20 hover:border-[#00F0FF]/50 transition-colors">
              <Flame className="w-4 h-4 text-[#FF00FF] mb-1" />
              <span className="text-[#E0E0E0] font-bold text-lg">{player.streakDays}</span>
              <span className="text-[#E0E0E0]/70 text-xs uppercase tracking-wider">STREAK</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}