'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CallAnalysisForm } from '@/components/game/CallAnalysisForm'

// Mock data - replace with real data fetching
const mockCallAnalyses = [
  {
    id: '1',
    customer: 'Acme Corp',
    duration: 28,
    score: 8.5,
    xpEarned: 85,
    timestamp: '2024-01-15T10:30:00Z',
    strengths: ['Strong opening', 'Good discovery questions', 'Clear value prop'],
    weaknesses: ['Could have created more urgency', 'Pricing came up too early'],
    callType: 'demo'
  },
  {
    id: '2',
    customer: 'TechStart Inc',
    duration: 15,
    score: 6.2,
    xpEarned: 62,
    timestamp: '2024-01-15T14:15:00Z',
    strengths: ['Professional tone', 'Good listening skills'],
    weaknesses: ['Missed qualifying questions', 'No clear next steps', 'Could have handled objections better'],
    callType: 'discovery'
  }
]

export default function TownCenterPage() {
  const [isAddingCall, setIsAddingCall] = useState(false)

  const averageScore = mockCallAnalyses.reduce((sum, call) => sum + call.score, 0) / mockCallAnalyses.length
  const totalXP = mockCallAnalyses.reduce((sum, call) => sum + call.xpEarned, 0)

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
            <h1 className="text-3xl font-bold text-gold">Town Center</h1>
            <p className="text-gray-300">AI-powered call analysis and feedback</p>
          </div>
        </div>

        <Dialog open={isAddingCall} onOpenChange={setIsAddingCall}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Call
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-obsidian border-gold/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gold">Add New Call Analysis</DialogTitle>
              <DialogDescription className="text-gray-300">
                Upload your call recording or enter details manually for AI analysis
              </DialogDescription>
            </DialogHeader>
            <CallAnalysisForm onClose={() => setIsAddingCall(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-obsidian/50 border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-gold text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{averageScore.toFixed(1)}</span>
              <span className="text-gray-400">/10</span>
              {averageScore >= 7 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-obsidian/50 border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-gold text-sm font-medium">Total XP Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{totalXP}</span>
              <Star className="w-4 h-4 text-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-obsidian/50 border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-gold text-sm font-medium">Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{mockCallAnalyses.length}</span>
              <Clock className="w-4 h-4 text-game-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Call Analyses */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Recent Call Analyses</h2>

        {mockCallAnalyses.map((call, index) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-obsidian/30 border-gold/10 hover:border-gold/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <CardTitle className="text-white">{call.customer}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>{call.duration} min</span>
                        <Badge variant="outline" className="text-xs">
                          {call.callType}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(call.timestamp).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        call.score >= 8 ? 'text-green-400' :
                        call.score >= 6 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {call.score}/10
                      </div>
                      <div className="text-sm text-gold">+{call.xpEarned} XP</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">✓ Strengths</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    {call.strengths.map((strength, i) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">⚠ Areas for Improvement</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    {call.weaknesses.map((weakness, i) => (
                      <li key={i}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}