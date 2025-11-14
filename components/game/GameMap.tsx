'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Zap,
  ShoppingCart,
  Target,
  Crown,
  Trophy,
  Play,
  Activity,
  Brain,
  Coins,
  Swords,
  Award
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
  cyberpunkTitle: string
}

export function GameMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const zones: Zone[] = [
    {
      id: 'town',
      name: 'Neural Nexus',
      cyberpunkTitle: 'NEURAL NEXUS',
      description: 'Real-time performance analysis and AI feedback systems',
      icon: <Database className="w-8 h-8" />,
      color: 'from-[#00F0FF] to-[#0099CC]',
      position: { x: 50, y: 50 },
      isUnlocked: true,
      hasNotification: true
    },
    {
      id: 'training',
      name: 'Combat Sim',
      cyberpunkTitle: 'COMBAT SIMULATION',
      description: 'Advanced objection handling training protocols',
      icon: <Swords className="w-8 h-8" />,
      color: 'from-[#FF00FF] to-[#CC0099]',
      position: { x: 20, y: 30 },
      isUnlocked: true
    },
    {
      id: 'shop',
      name: 'Market Grid',
      cyberpunkTitle: 'MARKET GRID',
      description: 'Acquire performance enhancers and system upgrades',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'from-[#FFD700] to-[#CC9900]',
      position: { x: 20, y: 70 },
      isUnlocked: true
    },
    {
      id: 'quests',
      name: 'Mission Control',
      cyberpunkTitle: 'MISSION CONTROL',
      description: 'Strategic objectives and contract management',
      icon: <Target className="w-8 h-8" />,
      color: 'from-[#00FF88] to-[#00CC66]',
      position: { x: 50, y: 15 },
      isUnlocked: true,
      hasNotification: true
    },
    {
      id: 'arena',
      name: 'Data Arena',
      cyberpunkTitle: 'DATA ARENA',
      description: 'Competitive performance rankings and team stats',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      position: { x: 80, y: 30 },
      isUnlocked: true
    },
    {
      id: 'achievements',
      name: 'Archive Vault',
      cyberpunkTitle: 'ARCHIVE VAULT',
      description: 'Digital trophy collection and achievement matrix',
      icon: <Award className="w-8 h-8" />,
      color: 'from-[#F59E0B] to-[#D97706]',
      position: { x: 80, y: 70 },
      isUnlocked: true
    }
  ]

  const handleZoneClick = (zoneId: string) => {
    handleEnterZone(zoneId)
  }

  const handleEnterZone = (zoneId: string) => {
    // Navigate to zone
    window.location.href = `/game/zones/${zoneId}`
  }

  return (
    <div className="relative w-full h-[700px] holographic rounded-2xl overflow-hidden border-2 border-[#00F0FF]/30 animate-wireframe-pulse">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      {/* Ambient Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(0,240,255,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(255,0,255,0.15)_0%,_transparent_50%)]" />
      </div>

      {/* Central Command Interface */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="holographic px-6 py-3 border border-[#00F0FF]/50 rounded-lg">
          <h2 className="font-display text-2xl font-bold text-[#00F0FF] text-shadow-neon uppercase tracking-widest animate-glitch">
            THE NEXUS
          </h2>
          <p className="text-[#E0E0E0]/80 text-sm font-body text-center">
            SELECT SYSTEM MODULE
          </p>
        </div>
      </div>

      {/* Zones */}
      <div className="relative w-full h-full">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            className="absolute cursor-pointer group"
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
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Zone Node */}
            <div
              className={`
                relative w-24 h-24 rounded-lg bg-gradient-to-br ${zone.color}
                flex items-center justify-center text-white shadow-lg
                zone-glow transition-all duration-300
                border-2 border-[#00F0FF]/30
                ${selectedZone === zone.id ? 'ring-4 ring-[#FF00FF] animate-neon-pulse' : ''}
                ${!zone.isUnlocked ? 'grayscale opacity-50' : ''}
                group-hover:border-[#FF00FF]/50
              `}
            >
              {zone.icon}

              {/* Data Stream Effect */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-data-stream"></div>
              </div>

              {/* Notification Indicator */}
              {zone.hasNotification && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF00FF] rounded-full flex items-center justify-center animate-neon-pulse border border-[#00F0FF]/50">
                  <Activity className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Level Lock */}
              {!zone.isUnlocked && (
                <div className="absolute inset-0 rounded-lg bg-black/70 flex items-center justify-center">
                  <span className="text-xs text-white font-bold font-display">
                    LVL 5
                  </span>
                </div>
              )}

              {/* Connection Lines */}
              {index < zones.length - 1 && (
                <div className="absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-[#00F0FF] to-transparent opacity-50"></div>
              )}
            </div>

            {/* Zone Label */}
            <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-center">
              <Badge
                variant="outline"
                className="bg-[#1F1E3A]/90 text-[#00F0FF] border-[#00F0FF]/50 whitespace-nowrap font-display uppercase tracking-wider"
              >
                {zone.cyberpunkTitle}
              </Badge>
            </div>
          </motion.div>
        ))}

        {/* Central Avatar */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#FF00FF] flex items-center justify-center text-2xl font-bold text-[#0D0C1D] border-4 border-[#00F0FF]/50 zone-glow animate-neon-pulse">
              🧙
            </div>
            <div className="level-indicator">
              12
            </div>
          </div>
        </motion.div>

        {/* Zone Details Panel */}
        {selectedZone && (
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="holographic border-[#00F0FF]/50">
              <CardContent className="p-6">
                {(() => {
                  const zone = zones.find(z => z.id === selectedZone)!
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${zone.color} flex items-center justify-center text-white border border-[#00F0FF]/30`}>
                          {zone.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#00F0FF] font-display uppercase tracking-wider text-shadow-neon">
                            {zone.cyberpunkTitle}
                          </h3>
                          <p className="text-[#E0E0E0]/80 text-sm font-body">{zone.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEnterZone(zone.id)}
                        disabled={!zone.isUnlocked}
                        className="bg-gradient-to-r from-[#00F0FF] to-[#FF00FF] hover:shadow-neon-glow text-[#0D0C1D] font-display font-bold uppercase tracking-wider border-0"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        INITIATE
                      </Button>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Instruction Text */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-[#E0E0E0]/60 text-sm font-body text-center uppercase tracking-wider">
            Click on a module to interface
          </p>
        </div>
      </div>
    </div>
  )
}