'use client'

import { useState } from 'react'
import { GameHUD } from '@/components/game/GameHUD'

// Mock player data - replace with real auth/data
const mockPlayer = {
  id: '1',
  name: 'Demo Hero',
  level: 5,
  xp: 3250,
  coins: 150,
  callsCompleted: 24,
  meetings: 8,
  streakDays: 3
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [player] = useState(mockPlayer)

  return (
    <div className="game-background min-h-screen">
      <GameHUD player={player} />
      <div className="pt-20">
        {children}
      </div>
    </div>
  )
}