'use client'

import { GameMap } from '@/components/game/GameMap'

export default function GamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gold mb-2">Pipeline Heroes</h1>
        <p className="text-gray-300">Choose your zone to begin your sales adventure</p>
      </div>
      <GameMap />
    </div>
  )
}