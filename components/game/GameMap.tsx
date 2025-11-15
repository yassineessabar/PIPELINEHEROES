'use client'

import { useState, useEffect } from 'react'
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
  requiredLevel?: number
}

interface PlayerData {
  name: string
  level: number
  hasNewAchievements?: boolean
  hasNewQuests?: boolean
}

interface GameMapProps {
  userId?: string
}

export function GameMap({ userId = '550e8400-e29b-41d4-a716-446655440000' }: GameMapProps = {}) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [playerData, setPlayerData] = useState<PlayerData>({ name: 'Agent Zero', level: 12 })
  const [loading, setLoading] = useState(true)

  // Fetch player data
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`/api/player/stats?userId=${userId}`)
        const result = await response.json()

        if (result.success) {
          setPlayerData({
            name: result.data.name,
            level: result.data.level,
            // You could add logic here to check for new achievements/quests
            hasNewAchievements: result.data.level > 10, // Example logic
            hasNewQuests: result.data.questsCompleted < 3 // Example logic
          })
        }
      } catch (error) {
        console.error('Failed to fetch player data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [userId])

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
      hasNotification: true,
      requiredLevel: 1
    },
    {
      id: 'training',
      name: 'Combat Sim',
      cyberpunkTitle: 'COMBAT SIMULATION',
      description: 'Advanced objection handling training protocols',
      icon: <Swords className="w-8 h-8" />,
      color: 'from-[#FF00FF] to-[#CC0099]',
      position: { x: 20, y: 30 },
      isUnlocked: playerData.level >= 1,
      requiredLevel: 1
    },
    {
      id: 'shop',
      name: 'Market Grid',
      cyberpunkTitle: 'MARKET GRID',
      description: 'Acquire performance enhancers and system upgrades',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'from-[#FFD700] to-[#CC9900]',
      position: { x: 20, y: 70 },
      isUnlocked: playerData.level >= 3,
      requiredLevel: 3
    },
    {
      id: 'quests',
      name: 'Mission Control',
      cyberpunkTitle: 'MISSION CONTROL',
      description: 'Strategic objectives and contract management',
      icon: <Target className="w-8 h-8" />,
      color: 'from-[#00FF88] to-[#00CC66]',
      position: { x: 50, y: 15 },
      isUnlocked: playerData.level >= 2,
      hasNotification: playerData.hasNewQuests,
      requiredLevel: 2
    },
    {
      id: 'arena',
      name: 'Data Arena',
      cyberpunkTitle: 'DATA ARENA',
      description: 'Competitive performance rankings and team stats',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      position: { x: 80, y: 30 },
      isUnlocked: playerData.level >= 5,
      requiredLevel: 5
    },
    {
      id: 'achievements',
      name: 'Archive Vault',
      cyberpunkTitle: 'ARCHIVE VAULT',
      description: 'Digital trophy collection and achievement matrix',
      icon: <Award className="w-8 h-8" />,
      color: 'from-[#F59E0B] to-[#D97706]',
      position: { x: 80, y: 70 },
      isUnlocked: playerData.level >= 4,
      hasNotification: playerData.hasNewAchievements,
      requiredLevel: 4
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
    <div className="relative w-full h-[800px] holographic rounded-2xl overflow-hidden border-2 border-[#00F0FF]/30 animate-wireframe-pulse">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Hexagonal Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%2300F0FF' stroke-width='1' opacity='0.3'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Flowing Data Streams */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-data-stream" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent animate-data-stream-reverse" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent animate-data-stream" />

        {/* Pulsing Energy Cores */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#00F0FF]/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#FF00FF]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

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

      {/* Connection Lines Between Zones */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Neural Nexus to Training */}
        <motion.path
          d="M 50% 50% L 20% 30%"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1 }}
        />

        {/* Neural Nexus to Shop */}
        <motion.path
          d="M 50% 50% L 20% 70%"
          stroke="url(#connectionGradient2)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.5 }}
        />

        {/* Neural Nexus to Arena */}
        <motion.path
          d="M 50% 50% L 80% 30%"
          stroke="url(#connectionGradient3)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 2 }}
        />

        {/* Neural Nexus to Achievements */}
        <motion.path
          d="M 50% 50% L 80% 70%"
          stroke="url(#connectionGradient4)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 2.5 }}
        />

        {/* Mission Control to Neural Nexus */}
        <motion.path
          d="M 50% 15% L 50% 50%"
          stroke="url(#connectionGradient5)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="3,3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 2, delay: 3 }}
        />

        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="connectionGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="connectionGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="connectionGradient5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Zones */}
      <div className="relative w-full h-full" style={{ zIndex: 2 }}>
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleZoneClick(zone.id)}
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.3,
              type: "spring",
              stiffness: 120
            }}
          >
            {/* Zone Node */}
            <div
              className={`
                relative w-28 h-28 rounded-xl bg-gradient-to-br ${zone.color}
                flex items-center justify-center text-white shadow-2xl
                zone-glow transition-all duration-500
                border-2 border-[#00F0FF]/40
                ${selectedZone === zone.id ? 'ring-4 ring-[#FF00FF] animate-neon-pulse shadow-neon-glow' : ''}
                ${!zone.isUnlocked ? 'grayscale opacity-50' : ''}
                group-hover:border-[#FF00FF]/70 group-hover:shadow-neon-glow
                before:content-[''] before:absolute before:inset-0 before:rounded-xl
                before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0
                group-hover:before:opacity-100 before:transition-opacity before:duration-300
              `}
            >
              <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
                {zone.icon}
              </div>

              {/* Orbiting Energy Ring */}
              <div className="absolute inset-0 rounded-xl">
                <div className="absolute top-1/2 left-1/2 w-32 h-32 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 rounded-full border border-[#00F0FF]/30 animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#00F0FF] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-[#FF00FF] rounded-full transform translate-x-1/2 translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Data Stream Effect */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-data-stream"></div>
                <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent animate-data-stream-reverse"></div>
              </div>

              {/* Energy Pulses */}
              {zone.isUnlocked && (
                <div className="absolute inset-0 rounded-xl">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent animate-pulse" style={{ animationDuration: '3s', animationDelay: `${index * 0.5}s` }} />
                </div>
              )}

              {/* Notification Indicator */}
              {zone.hasNotification && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-[#FF00FF] to-[#FF0080] rounded-full flex items-center justify-center animate-neon-pulse border-2 border-[#00F0FF]/50 shadow-lg">
                  <Activity className="w-4 h-4 text-white" />
                  <div className="absolute inset-0 rounded-full bg-[#FF00FF]/30 animate-ping" />
                </div>
              )}

              {/* Level Lock */}
              {!zone.isUnlocked && (
                <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm flex items-center justify-center border border-gray-600">
                  <div className="text-center">
                    <div className="text-lg text-red-400 mb-1">🔒</div>
                    <span className="text-xs text-gray-400 font-bold font-display">
                      LEVEL {zone.requiredLevel || 5}
                    </span>
                  </div>
                </div>
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

        {/* Central Avatar - Player Character */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          style={{ zIndex: 10 }}
        >
          <div className="relative group cursor-pointer">
            {/* Energy Field */}
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#00F0FF]/20 to-[#FF00FF]/20 blur-xl animate-pulse" />

            {/* Outer Ring */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full border-2 border-[#00F0FF]/50 animate-spin" style={{ animationDuration: '10s' }}>
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-[#00F0FF] rounded-full transform -translate-x-1/2" />
                <div className="absolute -bottom-1 right-1/2 w-2 h-2 bg-[#FF00FF] rounded-full transform translate-x-1/2" />
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-[#FFD700] rounded-full transform -translate-y-1/2" />
                <div className="absolute top-1/2 -right-1 w-2 h-2 bg-[#00FF88] rounded-full transform -translate-y-1/2" />
              </div>
            </div>

            {/* Avatar Circle */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#00F0FF] via-[#8B5CF6] to-[#FF00FF] flex items-center justify-center text-2xl font-bold text-white border-4 border-white/30 zone-glow animate-neon-pulse shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <div className="relative z-10">🦾</div>

              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

              {/* Holographic Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
            </div>

            {/* Level Indicator */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className={`bg-gradient-to-r from-[#FFD700] to-[#FF8C00] px-3 py-1 rounded-full border border-[#FFD700]/50 shadow-lg ${loading ? 'animate-pulse' : ''}`}>
                <span className="text-xs font-bold text-[#0D0C1D] font-display">LVL {playerData.level}</span>
              </div>
            </div>

            {/* Class Badge */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-2 py-1 rounded-full border border-[#8B5CF6]/50 shadow-lg">
                <span className="text-xs font-bold text-white font-display">NEURAL OP</span>
              </div>
            </div>

            {/* Status Effects */}
            <div className="absolute -top-1 -right-1 flex space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white/50" title="Active" />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse border border-white/50" title="Enhanced" />
            </div>

            {/* Name Plate */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-obsidian/90 border border-[#00F0FF]/50 rounded-lg px-3 py-1 backdrop-blur-sm">
                <span className="text-sm font-bold text-[#00F0FF] font-display">{playerData.name.replace(' ', '_').toUpperCase()}</span>
                <div className="text-xs text-gray-300">Pipeline Hero</div>
              </div>
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