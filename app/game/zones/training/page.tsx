'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sword, Trophy, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface TrainingChoice {
  id: string
  text: string
  xpReward: number
  isBest: boolean
  feedback: string
}

interface TrainingQuestion {
  id: string
  bossName: string
  difficulty: number
  prompt: string
  category: string
  choices: TrainingChoice[]
}

const mockTrainingQuestion: TrainingQuestion = {
  id: '1',
  bossName: 'Budget Objection Dragon',
  difficulty: 4,
  prompt: 'The prospect says: "Your solution looks interesting, but honestly the budget is just not there right now. We\'re already paying for 3 other tools. How can you justify the cost?"',
  category: 'pricing',
  choices: [
    {
      id: 'roi',
      text: 'Let me show you the ROI. On average, our customers see 3x return within 6 months...',
      xpReward: 75,
      isBest: true,
      feedback: '✅ EXCELLENT! ROI Technique - You\'re quantifying value and showing concrete returns.'
    },
    {
      id: 'timing',
      text: 'I understand. What if we revisit this conversation next quarter when...',
      xpReward: 25,
      isBest: false,
      feedback: '⚠️ OKAY. Postpones issue - You\'re being considerate but missing the opportunity to create urgency.'
    },
    {
      id: 'value',
      text: 'The budget concern is valid. But consider the hidden cost of NOT having this...',
      xpReward: 70,
      isBest: false,
      feedback: '✅ GREAT! Value reframing - Good approach to shift focus from cost to value and consequences.'
    },
    {
      id: 'alternative',
      text: 'What if we start with just the core module at 50% of the price?',
      xpReward: 65,
      isBest: false,
      feedback: '✅ SMART! Creative solution - Offering alternatives shows flexibility and problem-solving.'
    }
  ]
}

export default function TrainingPage() {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentQuestion] = useState(mockTrainingQuestion)

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    setSelectedChoice(null)
    setShowFeedback(false)
    // In a real app, load next question here
  }

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
  }

  const getChoiceColor = (choice: TrainingChoice) => {
    if (!showFeedback || selectedChoice !== choice.id) return 'border-game-blue bg-game-blue/10'
    return choice.isBest ? 'border-green-400 bg-green-400/20' : 'border-yellow-400 bg-yellow-400/20'
  }

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
            <h1 className="text-3xl font-bold text-gold">Training Grounds</h1>
            <p className="text-gray-300">Master your objection handling skills</p>
          </div>
        </div>
        <Badge variant="outline" className="text-gold border-gold/50">
          <Sword className="w-4 h-4 mr-2" />
          Boss Battle
        </Badge>
      </div>

      {/* Boss Info Card */}
      <Card className="bg-obsidian/30 border-gold/20 mb-8">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-4xl mb-4">
            💰
          </div>
          <CardTitle className="text-gold text-2xl">{currentQuestion.bossName}</CardTitle>
          <CardDescription className="text-gray-300">
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span>Difficulty: {getDifficultyStars(currentQuestion.difficulty)} ({currentQuestion.difficulty}/5)</span>
              <span>•</span>
              <span>Category: {currentQuestion.category}</span>
            </div>
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

            {currentQuestion.choices.map((choice, index) => (
              <motion.button
                key={choice.id}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:transform hover:translate-x-2 ${getChoiceColor(choice)}`}
                onClick={() => handleChoiceSelect(choice.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-gold font-bold text-lg flex-shrink-0">
                    {String.fromCharCode(65 + index)}:
                  </span>
                  <span className="text-gray-300">{choice.text}</span>
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
              return (
                <Card className={`border-2 ${choice.isBest ? 'border-green-400 bg-green-400/10' : 'border-yellow-400 bg-yellow-400/10'}`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-2">
                        {choice.isBest ? '🎉' : '💭'}
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${choice.isBest ? 'text-green-400' : 'text-yellow-400'}`}>
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
                        <p className={`p-3 rounded-lg ${choice.isBest ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                          {choice.feedback}
                        </p>
                      </div>

                      {!choice.isBest && (
                        <div>
                          <h4 className="text-green-400 font-semibold mb-2">Best Response:</h4>
                          <p className="text-gray-300 bg-green-400/10 p-3 rounded-lg border border-green-400/30">
                            "{currentQuestion.choices.find(c => c.isBest)?.text}"
                          </p>
                          <p className="text-green-400 text-sm mt-2">
                            {currentQuestion.choices.find(c => c.isBest)?.feedback}
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
                      >
                        Next Challenge
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
                <p className="text-2xl font-bold text-white">0/10</p>
                <Progress value={0} className="mt-2" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Accuracy Rate</p>
                <p className="text-2xl font-bold text-white">0%</p>
                <Progress value={0} className="mt-2" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total XP Earned</p>
                <p className="text-2xl font-bold text-gold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}