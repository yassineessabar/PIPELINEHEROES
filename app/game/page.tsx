'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GameMap } from '@/components/game/GameMap'
import { GameHUD } from '@/components/game/GameHUD'
import { Shield, Zap, Coins, Star } from 'lucide-react'

export default function GamePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gold font-display tracking-wider">INITIALIZING NEURAL INTERFACE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-[#0D0C1D] to-[#1A1625] overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}

        {/* Ambient Light Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF00FF]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Game HUD */}
      <GameHUD />

      {/* Main Game Interface */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl font-bold font-display text-gold mb-2 tracking-wider text-shadow-neon"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            PIPELINE
            <span className="text-[#00F0FF] ml-4">HEROES</span>
          </motion.h1>

          <motion.div
            className="flex items-center justify-center space-x-6 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 bg-obsidian/50 px-4 py-2 rounded-lg border border-gold/30">
              <Shield className="w-5 h-5 text-game-blue" />
              <span className="text-white font-semibold">Level 12</span>
            </div>
            <div className="flex items-center space-x-2 bg-obsidian/50 px-4 py-2 rounded-lg border border-gold/30">
              <Zap className="w-5 h-5 text-[#00F0FF]" />
              <span className="text-white font-semibold">2,847 XP</span>
            </div>
            <div className="flex items-center space-x-2 bg-obsidian/50 px-4 py-2 rounded-lg border border-gold/30">
              <Coins className="w-5 h-5 text-gold" />
              <span className="text-white font-semibold">1,250</span>
            </div>
            <div className="flex items-center space-x-2 bg-obsidian/50 px-4 py-2 rounded-lg border border-gold/30">
              <Star className="w-5 h-5 text-[#FF00FF]" />
              <span className="text-white font-semibold">🔥 5 Day Streak</span>
            </div>
          </motion.div>

          <motion.p
            className="text-gray-300 mt-4 text-lg font-body tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="text-[#00F0FF]">NEURAL INTERFACE ACTIVE</span> • Choose your mission protocol
          </motion.p>
        </motion.div>

        {/* Game Map Container */}
        <motion.div
          className="px-8 pb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <GameMap />
        </motion.div>

        {/* Status Bar */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-obsidian/90 border-t border-gold/30 backdrop-blur-sm"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="container mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-400">
                  <span className="text-[#00F0FF]">STATUS:</span> READY FOR DEPLOYMENT
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-[#00F0FF]">SYNC:</span> REAL-TIME
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-semibold">ONLINE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}