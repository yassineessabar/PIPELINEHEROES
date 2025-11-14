'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  Sword,
  ShoppingBag,
  ScrollText,
  Crown,
  Trophy,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Zone {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  position: { x: number; y: number }
  isUnlocked: boolean
  hasNotification?: boolean
}

export function GameMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const zones: Zone[] = [
    {
      id: 'town',
      name: 'Town Center',
      description: 'View your latest call analysis and AI feedback',
      icon: <Home className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      position: { x: 20, y: 30 },
      isUnlocked: true,
      hasNotification: true
    },
    {
      id: 'training',
      name: 'Training Grounds',
      description: 'Battle objection bosses and improve your skills',
      icon: <Sword className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      position: { x: 70, y: 20 },
      isUnlocked: true
    },
    {
      id: 'shop',
      name: 'Trading Post',
      description: 'Spend coins on perks and upgrades',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'from-yellow-500 to-yellow-600',
      position: { x: 15, y: 70 },
      isUnlocked: true
    },
    {
      id: 'quests',
      name: 'Quest Board',
      description: 'Track your daily and weekly missions',
      icon: <ScrollText className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      position: { x: 50, y: 60 },
      isUnlocked: true,
      hasNotification: true
    },
    {
      id: 'arena',
      name: 'Arena',
      description: 'Compete on the team leaderboard',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      position: { x: 75, y: 70 },
      isUnlocked: true
    },
    {
      id: 'achievements',
      name: 'Vault',
      description: 'View your achievements and trophies',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-amber-500 to-amber-600',
      position: { x: 45, y: 15 },
      isUnlocked: true
    }
  ]

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId === selectedZone ? null : zoneId)
  }

  const handleEnterZone = (zoneId: string) => {
    // Navigate to zone
    window.location.href = `/game/zones/${zoneId}`
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 border-gold/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_theme(colors.gold/20)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_theme(colors.game-blue/20)_0%,_transparent_50%)]" />
      </div>

      {/* Zones */}
      <div className="relative w-full h-full">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            className="absolute cursor-pointer"
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleZoneClick(zone.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: zones.indexOf(zone) * 0.1 }}
          >
            {/* Zone Icon */}
            <div
              className={`
                relative w-20 h-20 rounded-full bg-gradient-to-br ${zone.color}
                flex items-center justify-center text-white shadow-lg
                zone-glow transition-all duration-300
                ${selectedZone === zone.id ? 'ring-4 ring-gold' : ''}
                ${!zone.isUnlocked ? 'grayscale opacity-50' : ''}
              `}
            >
              {zone.icon}

              {/* Notification Badge */}
              {zone.hasNotification && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              )}

              {/* Level Lock */}
              {!zone.isUnlocked && (
                <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">L5</span>
                </div>
              )}
            </div>

            {/* Zone Name */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
              <Badge variant="outline" className="bg-obsidian/90 text-gold border-gold/50 whitespace-nowrap">
                {zone.name}
              </Badge>
            </div>
          </motion.div>
        ))}

        {/* Zone Details Panel */}
        {selectedZone && (
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-obsidian/95 border-gold/30">
              <CardContent className="p-6">
                {(() => {
                  const zone = zones.find(z => z.id === selectedZone)!
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${zone.color} flex items-center justify-center text-white`}>
                          {zone.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gold">{zone.name}</h3>
                          <p className="text-gray-300 text-sm">{zone.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEnterZone(zone.id)}
                        variant="gold"
                        disabled={!zone.isUnlocked}
                      >
                        Enter <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}