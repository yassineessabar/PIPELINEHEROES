'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  PhoneCall,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Trophy,
  Zap,
  Brain,
  Heart,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star,
  Upload,
  Search,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CallAnalysis, CallInsight } from '@/types/aircall'
import aircallService from '@/lib/aircall'

interface CallAnalysisFormProps {
  onAnalysisComplete?: (analysis: CallAnalysis) => void
}

export function CallAnalysisForm({ onAnalysisComplete }: CallAnalysisFormProps) {
  const [callId, setCallId] = useState('')
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<CallAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('analyze')

  useEffect(() => {
    loadRecentAnalyses()
  }, [])

  const loadRecentAnalyses = async () => {
    try {
      const recent = await aircallService.getRecentCallsForAnalysis(7)
      setRecentAnalyses(recent)
    } catch (error) {
      console.error('Failed to load recent analyses:', error)
    }
  }

  const handleAnalyzeCall = async () => {
    if (!callId.trim()) {
      setError('Please enter a call ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await aircallService.analyzeCall(parseInt(callId))
      setAnalysis(result)
      onAnalysisComplete?.(result)
      await loadRecentAnalyses()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze call')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'POSITIVE': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'NEGATIVE': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-yellow-400" />
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'text-green-400'
      case 'NEGATIVE': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getInsightIcon = (type: CallInsight['type']) => {
    switch (type) {
      case 'objection_handling': return <Target className="w-4 h-4" />
      case 'rapport_building': return <Heart className="w-4 h-4" />
      case 'closing_technique': return <CheckCircle className="w-4 h-4" />
      case 'discovery': return <Brain className="w-4 h-4" />
      case 'value_proposition': return <Zap className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1F1E3A]/50 border border-[#00F0FF]/20">
          <TabsTrigger
            value="analyze"
            className="data-[state=active]:bg-[#00F0FF]/20 data-[state=active]:text-[#00F0FF] text-[#E0E0E0]/70"
          >
            <Phone className="w-4 h-4 mr-2" />
            Analyze Call
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-[#00F0FF]/20 data-[state=active]:text-[#00F0FF] text-[#E0E0E0]/70"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Recent Calls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          {/* Call Input */}
          <Card className="holographic border-[#00F0FF]/30">
            <CardHeader>
              <CardTitle className="text-[#00F0FF] font-display uppercase tracking-wider flex items-center">
                <PhoneCall className="w-5 h-5 mr-2" />
                Call Analysis Terminal
              </CardTitle>
              <CardDescription className="text-[#E0E0E0]/80">
                Enter an Aircall ID to analyze performance and earn XP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter Call ID (e.g., 123456789)"
                  value={callId}
                  onChange={(e) => setCallId(e.target.value)}
                  className="bg-[#1F1E3A]/50 border-[#00F0FF]/30 text-[#E0E0E0] placeholder-[#E0E0E0]/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeCall()}
                />
                <Button
                  onClick={handleAnalyzeCall}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00F0FF] to-[#FF00FF] hover:shadow-neon-glow text-[#0D0C1D] font-display font-bold uppercase tracking-wider"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4"
                    >
                      <Search className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/30"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Overall Score */}
                <Card className="holographic border-[#FFD700]/50">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] text-3xl font-bold text-[#0D0C1D] mb-4"
                      >
                        {analysis.gameScore}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#FFD700] font-display uppercase tracking-wider mb-2">
                        Performance Score
                      </h3>
                      <p className="text-[#E0E0E0]/80">
                        Total XP Earned: <span className="text-[#00FF88] font-bold">
                          {analysis.insights?.reduce((total, insight) => total + (insight.xp_earned || 0), 0) || 0}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Call Details */}
                <Card className="holographic border-[#00F0FF]/30">
                  <CardHeader>
                    <CardTitle className="text-[#00F0FF] font-display uppercase tracking-wider">
                      Call Intel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#00F0FF]" />
                          <span className="text-[#E0E0E0]/80 text-sm">Duration</span>
                        </div>
                        <p className="text-[#E0E0E0] font-bold">{formatDuration(analysis.call.duration)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(analysis.sentiment?.sentiment)}
                          <span className="text-[#E0E0E0]/80 text-sm">Sentiment</span>
                        </div>
                        <p className={`font-bold ${getSentimentColor(analysis.sentiment?.sentiment)}`}>
                          {analysis.sentiment?.sentiment || 'Unknown'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                          <span className="text-[#E0E0E0]/80 text-sm">Topics</span>
                        </div>
                        <p className="text-[#E0E0E0] font-bold">
                          {analysis.topics?.topics.length || 0} identified
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                {analysis.insights && analysis.insights.length > 0 && (
                  <Card className="holographic border-[#FF00FF]/30">
                    <CardHeader>
                      <CardTitle className="text-[#FF00FF] font-display uppercase tracking-wider flex items-center">
                        <Trophy className="w-5 h-5 mr-2" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysis.insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="holographic p-4 rounded-lg border border-[#00F0FF]/20"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#FF00FF] flex items-center justify-center text-white">
                                {getInsightIcon(insight.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-[#00F0FF] mb-1">{insight.title}</h4>
                                <p className="text-[#E0E0E0]/80 text-sm mb-2">{insight.description}</p>
                                {insight.improvement_tip && (
                                  <p className="text-[#FFD700] text-sm italic">💡 {insight.improvement_tip}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-[#00FF88] border-[#00FF88]/50 bg-[#00FF88]/10 mb-1">
                                +{insight.xp_earned || 0} XP
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-[#FFD700]" />
                                <span className="text-[#FFD700] font-bold text-sm">{insight.score}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Action Items */}
                {analysis.actionItems && analysis.actionItems.action_items.length > 0 && (
                  <Card className="holographic border-[#00FF88]/30">
                    <CardHeader>
                      <CardTitle className="text-[#00FF88] font-display uppercase tracking-wider flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Action Items Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.actionItems.action_items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-[#00FF88]" />
                            <span className="text-[#E0E0E0]">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="holographic border-[#00F0FF]/30">
            <CardHeader>
              <CardTitle className="text-[#00F0FF] font-display uppercase tracking-wider">
                Recent Performance History
              </CardTitle>
              <CardDescription className="text-[#E0E0E0]/80">
                Last 7 days of analyzed calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length > 0 ? (
                <div className="space-y-3">
                  {recentAnalyses.map((recentAnalysis) => (
                    <div
                      key={recentAnalysis.call.id}
                      className="flex items-center justify-between p-3 holographic rounded-lg border border-[#00F0FF]/20 cursor-pointer hover:border-[#FF00FF]/30 transition-colors"
                      onClick={() => setAnalysis(recentAnalysis)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#FF00FF] flex items-center justify-center text-white text-sm font-bold">
                          {recentAnalysis.gameScore}
                        </div>
                        <div>
                          <p className="text-[#E0E0E0] font-medium">Call #{recentAnalysis.call.id}</p>
                          <p className="text-[#E0E0E0]/60 text-sm">
                            {formatDuration(recentAnalysis.call.duration)} • {recentAnalysis.sentiment?.sentiment || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#00FF88] font-bold">
                          +{recentAnalysis.insights?.reduce((total, insight) => total + (insight.xp_earned || 0), 0) || 0} XP
                        </p>
                        <p className="text-[#E0E0E0]/60 text-sm">
                          {new Date(recentAnalysis.call.started_at * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Phone className="w-12 h-12 text-[#E0E0E0]/30 mx-auto mb-4" />
                  <p className="text-[#E0E0E0]/60">No recent call analyses found</p>
                  <p className="text-[#E0E0E0]/40 text-sm">Analyze your first call to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}