'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Swords, Trophy, Target, Zap, Brain, Activity, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'

interface TrainingChoice {
  id: string
  text: string
  xpReward: number
  isCorrect: boolean
  feedback: string
  sortOrder: number
}

interface TrainingCategory {
  id: string
  name: string
  slug: string
  icon: string
  color: string
}

interface TrainingQuestion {
  id: string
  title: string
  bossName: string
  difficulty: number
  prompt: string
  category: TrainingCategory
  choices: TrainingChoice[]
}

interface UserProgress {
  sessionsCompleted: number
  accuracy: number
  totalXpEarned: number
  level: number
  totalXp: number
}

export default function TrainingPage() {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<TrainingQuestion | null>(null)
  const [questions, setQuestions] = useState<TrainingQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const { toast } = useToast()

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = '550e8400-e29b-41d4-a716-446655440000'
  const [startTime, setStartTime] = useState<number>(0)

  // Fetch training data
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await fetch(`/api/training/questions?userId=${currentUserId}`)
        const result = await response.json()

        if (result.success) {
          setQuestions(result.data.questions)
          setCurrentQuestion(result.data.questions[0] || null)
          setUserProgress(result.data.userProgress)
        } else {
          toast({
            title: "Error",
            description: "Failed to load training questions",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Failed to fetch training data:', error)
        toast({
          title: "Error",
          description: "Failed to load training data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTrainingData()
    setStartTime(Date.now())
  }, [toast])

  const handleChoiceSelect = async (choiceId: string) => {
    if (!currentQuestion) return

    setSelectedChoice(choiceId)
    setSubmitting(true)

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    try {
      const response = await fetch('/api/training/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUserId,
          questionId: currentQuestion.id,
          choiceId,
          timeSpent
        })
      })

      const result = await response.json()

      if (result.success) {
        setShowFeedback(true)

        // Update user progress
        if (userProgress) {
          setUserProgress({
            ...userProgress,
            sessionsCompleted: userProgress.sessionsCompleted + 1,
            totalXpEarned: userProgress.totalXpEarned + result.data.xpEarned
          })
        }

        toast({
          title: result.data.isCorrect ? "Correct! 🎉" : "Good try! 💭",
          description: `+${result.data.xpEarned} XP earned`,
          duration: 3000
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
      setCurrentQuestion(questions[nextIndex])
      setSelectedChoice(null)
      setShowFeedback(false)
      setStartTime(Date.now())
    } else {
      // No more questions
      toast({
        title: "Training Complete! 🎉",
        description: "You've completed all available questions",
        duration: 5000
      })
    }
  }

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
  }

  const getChoiceColor = (choice: TrainingChoice) => {
    if (!showFeedback || selectedChoice !== choice.id) return 'border-[#00F0FF]/30 bg-[#00F0FF]/10 hover:border-[#00F0FF]/50'
    return choice.isCorrect ? 'border-[#00FF88]/50 bg-[#00FF88]/20' : 'border-[#FFD700]/50 bg-[#FFD700]/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen game-background relative">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#00F0FF] mx-auto mb-4" />
            <p className="text-gray-400">Loading training scenarios...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen game-background relative">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-[#00F0FF] mb-2">No training scenarios available</h3>
            <p className="text-gray-400">Check back later for new challenges</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen game-background relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      {/* Ambient Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(0,240,255,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(255,0,255,0.15)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="text-[#00F0FF] hover:bg-[#00F0FF]/10 border border-[#00F0FF]/30 hover:border-[#00F0FF]/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-display text-[#00F0FF] text-shadow-neon uppercase tracking-widest animate-glitch">COMBAT SIMULATION</h1>
              <p className="text-[#E0E0E0]/80 font-body uppercase tracking-wider">Neural objection handling protocols</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-[#FF00FF] border-[#FF00FF]/50 bg-[#FF00FF]/10 font-display uppercase tracking-wider animate-neon-pulse">
              <Swords className="w-4 h-4 mr-2" />
              Question {questionIndex + 1}/{questions.length}
            </Badge>
          </div>
        </div>

        {/* Boss Info Card */}
        <Card className="holographic border-[#FF00FF]/50 mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-[#FF00FF] to-[#00F0FF] rounded-lg flex items-center justify-center text-4xl mb-4 zone-glow animate-neon-pulse">
              {currentQuestion.category.icon}
            </div>
            <CardTitle className="text-[#00F0FF] text-3xl font-display uppercase tracking-widest text-shadow-neon">{currentQuestion.bossName}</CardTitle>
            <CardDescription className="text-[#E0E0E0]/80 font-body text-center mt-4">
              <span className="text-[#FFD700]">THREAT LEVEL: {getDifficultyStars(currentQuestion.difficulty)} ({currentQuestion.difficulty}/5)</span>
              <span className="text-[#00F0FF] mx-6">•</span>
              <span className="text-[#FF00FF] uppercase tracking-wider">{currentQuestion.category.name}</span>
            </CardDescription>
          </CardHeader>
        </Card>

      <div className="max-w-4xl mx-auto">
        {/* Scenario */}
        <Card className="bg-game-blue/10 border-game-blue/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-game-blue rounded-full flex items-center justify-center text-xl flex-shrink-0">
                🤖
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-game-blue">Client:</strong> "{currentQuestion.prompt}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Choices */}
        {!showFeedback && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gold mb-4">Choose your response:</h3>

            {currentQuestion.choices
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((choice, index) => (
              <motion.button
                key={choice.id}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:transform hover:translate-x-2 ${getChoiceColor(choice)} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleChoiceSelect(choice.id)}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-gold font-bold text-lg flex-shrink-0">
                    {String.fromCharCode(65 + index)}:
                  </span>
                  <span className="text-gray-300">{choice.text}</span>
                  {submitting && selectedChoice === choice.id && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF] ml-auto" />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Feedback */}
        {showFeedback && selectedChoice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(() => {
              const choice = currentQuestion.choices.find(c => c.id === selectedChoice)!
              const bestChoice = currentQuestion.choices.find(c => c.isCorrect)

              return (
                <Card className={`border-2 ${choice.isCorrect ? 'border-green-400 bg-green-400/10' : 'border-yellow-400 bg-yellow-400/10'}`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-2">
                        {choice.isCorrect ? '🎉' : '💭'}
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${choice.isCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
                        +{choice.xpReward} XP Earned!
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-gold font-semibold mb-2">Your Response:</h4>
                        <p className="text-gray-300 bg-obsidian/50 p-3 rounded-lg">
                          "{choice.text}"
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gold font-semibold mb-2">Feedback:</h4>
                        <p className={`p-3 rounded-lg ${choice.isCorrect ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                          {choice.feedback}
                        </p>
                      </div>

                      {!choice.isCorrect && bestChoice && (
                        <div>
                          <h4 className="text-green-400 font-semibold mb-2">Best Response:</h4>
                          <p className="text-gray-300 bg-green-400/10 p-3 rounded-lg border border-green-400/30">
                            "{bestChoice.text}"
                          </p>
                          <p className="text-green-400 text-sm mt-2">
                            {bestChoice.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleNextQuestion}
                        variant="gold"
                        size="lg"
                        className="px-8"
                        disabled={questionIndex >= questions.length - 1}
                      >
                        {questionIndex >= questions.length - 1 ? 'Training Complete' : 'Next Challenge'}
                        <Target className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })()}
          </motion.div>
        )}

        {/* Training Stats */}
        <Card className="bg-obsidian/30 border-gold/20 mt-8">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Challenges Completed</p>
                <p className="text-2xl font-bold text-white">{userProgress?.sessionsCompleted || 0}/{questions.length}</p>
                <Progress value={questions.length > 0 ? ((userProgress?.sessionsCompleted || 0) / questions.length) * 100 : 0} className="mt-2" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Accuracy Rate</p>
                <p className="text-2xl font-bold text-white">{userProgress?.accuracy || 0}%</p>
                <Progress value={userProgress?.accuracy || 0} className="mt-2" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total XP Earned</p>
                <p className="text-2xl font-bold text-gold">{userProgress?.totalXpEarned || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}