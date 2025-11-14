import { PrismaClient, QuestType, AchievementCategory, AchievementRarity, RewardCategory, RewardRarity } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample quests
  console.log('📋 Creating quests...')

  const dailyQuests = [
    {
      name: 'Morning Warrior',
      description: 'Complete 5 calls today',
      targetAmount: 5,
      xpReward: 150,
      coinsReward: 25,
      difficulty: 2,
      type: QuestType.DAILY
    },
    {
      name: 'Discovery Champion',
      description: 'Ask 20 discovery questions',
      targetAmount: 20,
      xpReward: 100,
      coinsReward: 20,
      difficulty: 3,
      type: QuestType.DAILY
    },
    {
      name: 'Meeting Maker',
      description: 'Book 2 meetings today',
      targetAmount: 2,
      xpReward: 200,
      coinsReward: 40,
      difficulty: 4,
      type: QuestType.DAILY
    }
  ]

  const weeklyQuests = [
    {
      name: 'Weekly Warrior',
      description: 'Complete 25 calls this week',
      targetAmount: 25,
      xpReward: 500,
      coinsReward: 100,
      difficulty: 3,
      type: QuestType.WEEKLY,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Pipeline Builder',
      description: 'Generate $50K in pipeline this week',
      targetAmount: 50000,
      xpReward: 750,
      coinsReward: 150,
      difficulty: 4,
      type: QuestType.WEEKLY,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]

  const milestoneQuests = [
    {
      name: 'Century Club',
      description: 'Complete 100 total calls',
      targetAmount: 100,
      xpReward: 1000,
      coinsReward: 200,
      difficulty: 5,
      type: QuestType.MILESTONE
    },
    {
      name: 'Pipeline Master',
      description: 'Generate $1M in total pipeline',
      targetAmount: 1000000,
      xpReward: 5000,
      coinsReward: 1000,
      difficulty: 5,
      type: QuestType.MILESTONE
    }
  ]

  for (const quest of [...dailyQuests, ...weeklyQuests, ...milestoneQuests]) {
    await prisma.quest.create({ data: quest })
  }

  // Create achievements
  console.log('🏆 Creating achievements...')

  const achievements = [
    // Call-based achievements
    {
      name: 'First Call',
      icon: '📞',
      description: 'Complete your first sales call',
      category: AchievementCategory.CALLS,
      condition: JSON.stringify({ type: 'total_calls', value: 1 }),
      xpReward: 50,
      coinsReward: 10,
      rarity: AchievementRarity.COMMON
    },
    {
      name: 'Call Veteran',
      icon: '🎯',
      description: 'Complete 50 sales calls',
      category: AchievementCategory.CALLS,
      condition: JSON.stringify({ type: 'total_calls', value: 50 }),
      xpReward: 250,
      coinsReward: 50,
      rarity: AchievementRarity.UNCOMMON
    },
    {
      name: 'Call Master',
      icon: '👑',
      description: 'Complete 100 sales calls',
      category: AchievementCategory.CALLS,
      condition: JSON.stringify({ type: 'total_calls', value: 100 }),
      xpReward: 500,
      coinsReward: 100,
      rarity: AchievementRarity.RARE
    },
    {
      name: 'Perfect Score',
      icon: '⭐',
      description: 'Get a perfect 10/10 call score',
      category: AchievementCategory.CALLS,
      condition: JSON.stringify({ type: 'perfect_score', value: 10 }),
      xpReward: 200,
      coinsReward: 50,
      rarity: AchievementRarity.EPIC
    },

    // Meeting achievements
    {
      name: 'Meeting Starter',
      icon: '🤝',
      description: 'Book your first meeting',
      category: AchievementCategory.MEETINGS,
      condition: JSON.stringify({ type: 'total_meetings', value: 1 }),
      xpReward: 75,
      coinsReward: 15,
      rarity: AchievementRarity.COMMON
    },
    {
      name: 'Meeting Machine',
      icon: '⚡',
      description: 'Book 25 meetings',
      category: AchievementCategory.MEETINGS,
      condition: JSON.stringify({ type: 'total_meetings', value: 25 }),
      xpReward: 400,
      coinsReward: 80,
      rarity: AchievementRarity.RARE
    },

    // Streak achievements
    {
      name: 'Consistency King',
      icon: '🔥',
      description: 'Maintain a 7-day activity streak',
      category: AchievementCategory.STREAK,
      condition: JSON.stringify({ type: 'streak_days', value: 7 }),
      xpReward: 300,
      coinsReward: 75,
      rarity: AchievementRarity.UNCOMMON
    },
    {
      name: 'Unstoppable',
      icon: '💪',
      description: 'Maintain a 30-day activity streak',
      category: AchievementCategory.STREAK,
      condition: JSON.stringify({ type: 'streak_days', value: 30 }),
      xpReward: 1000,
      coinsReward: 250,
      rarity: AchievementRarity.LEGENDARY
    },

    // Level achievements
    {
      name: 'Level 5 Hero',
      icon: '🌟',
      description: 'Reach level 5',
      category: AchievementCategory.MILESTONE,
      condition: JSON.stringify({ type: 'level', value: 5 }),
      xpReward: 200,
      coinsReward: 50,
      rarity: AchievementRarity.COMMON
    },
    {
      name: 'Level 10 Champion',
      icon: '💎',
      description: 'Reach level 10',
      category: AchievementCategory.MILESTONE,
      condition: JSON.stringify({ type: 'level', value: 10 }),
      xpReward: 500,
      coinsReward: 125,
      rarity: AchievementRarity.UNCOMMON
    },
    {
      name: 'Level 25 Legend',
      icon: '👑',
      description: 'Reach level 25',
      category: AchievementCategory.MILESTONE,
      condition: JSON.stringify({ type: 'level', value: 25 }),
      xpReward: 1000,
      coinsReward: 300,
      rarity: AchievementRarity.EPIC
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement })
  }

  // Create rewards
  console.log('🛒 Creating shop rewards...')

  const rewards = [
    // Cosmetic rewards
    {
      name: 'Golden Avatar Frame',
      icon: '🖼️',
      description: 'Show off with a shiny golden frame',
      cost: 100,
      category: RewardCategory.COSMETIC,
      rarity: RewardRarity.UNCOMMON
    },
    {
      name: 'Diamond Badge',
      icon: '💎',
      description: 'Exclusive diamond badge for your profile',
      cost: 500,
      category: RewardCategory.COSMETIC,
      rarity: RewardRarity.EPIC
    },
    {
      name: 'Legendary Title',
      icon: '👑',
      description: 'Unlock the "Sales Legend" title',
      cost: 1000,
      category: RewardCategory.COSMETIC,
      rarity: RewardRarity.LEGENDARY
    },

    // Boost rewards
    {
      name: 'XP Boost (24h)',
      icon: '⚡',
      description: 'Double XP for 24 hours',
      cost: 200,
      category: RewardCategory.BOOST,
      rarity: RewardRarity.COMMON
    },
    {
      name: 'Coin Multiplier (7d)',
      icon: '💰',
      description: '1.5x coins for 7 days',
      cost: 350,
      category: RewardCategory.BOOST,
      rarity: RewardRarity.UNCOMMON
    },

    // Unlocks
    {
      name: 'Custom Call Templates',
      icon: '📝',
      description: 'Unlock custom call script templates',
      cost: 150,
      category: RewardCategory.UNLOCK,
      rarity: RewardRarity.COMMON
    },
    {
      name: 'Advanced Analytics',
      icon: '📊',
      description: 'Unlock detailed performance analytics',
      cost: 400,
      category: RewardCategory.UNLOCK,
      rarity: RewardRarity.RARE
    }
  ]

  for (const reward of rewards) {
    await prisma.reward.create({ data: reward })
  }

  // Create training questions
  console.log('⚔️ Creating training questions...')

  const trainingQuestions = [
    {
      bossName: 'Price Objection Dragon',
      difficulty: 2,
      prompt: 'The prospect says: "Your price is too high compared to your competitors."',
      category: 'pricing',
      choices: [
        {
          text: 'You\'re right, let me see if I can get you a discount.',
          xpReward: 10,
          isBest: false,
          feedback: 'Immediately giving discounts shows weakness and devalues your product.'
        },
        {
          text: 'I understand price is important. Can you help me understand what specific value you\'re looking for?',
          xpReward: 25,
          isBest: true,
          feedback: 'Perfect! You\'re focusing on value rather than just price, and gathering more information.'
        },
        {
          text: 'Our competitors can\'t match our quality and service.',
          xpReward: 15,
          isBest: false,
          feedback: 'While defending your product is good, this sounds defensive without backing it up.'
        },
        {
          text: 'Price shouldn\'t be your main concern here.',
          xpReward: 5,
          isBest: false,
          feedback: 'This dismisses the prospect\'s concern and can damage rapport.'
        }
      ]
    },
    {
      bossName: 'Timeline Troll',
      difficulty: 3,
      prompt: 'The prospect says: "We\'re not looking to make a decision for at least 6 months."',
      category: 'timeline',
      choices: [
        {
          text: 'No problem, I\'ll follow up with you in 6 months.',
          xpReward: 5,
          isBest: false,
          feedback: 'You\'re giving up too easily without understanding why they need to wait.'
        },
        {
          text: 'I understand timing is important. What would need to happen for you to move faster?',
          xpReward: 20,
          isBest: false,
          feedback: 'Good question, but you could dig deeper into the implications of waiting.'
        },
        {
          text: 'What\'s driving that timeline? And what might be the cost of waiting 6 months?',
          xpReward: 30,
          isBest: true,
          feedback: 'Excellent! You\'re understanding their constraints while creating urgency around the cost of inaction.'
        },
        {
          text: 'That seems like a long time. Are you sure you can\'t decide sooner?',
          xpReward: 8,
          isBest: false,
          feedback: 'This sounds pushy without understanding their reasoning.'
        }
      ]
    },
    {
      bossName: 'Decision Maker Demon',
      difficulty: 4,
      prompt: 'You\'ve been talking to someone for 30 minutes and they say: "I\'ll need to run this by my boss."',
      category: 'decision-making',
      choices: [
        {
          text: 'Great, when can we schedule a call with your boss?',
          xpReward: 20,
          isBest: false,
          feedback: 'Direct but you should have qualified decision-making authority earlier.'
        },
        {
          text: 'I should have asked earlier - what\'s your role in the decision-making process?',
          xpReward: 25,
          isBest: true,
          feedback: 'Perfect! You\'re acknowledging your mistake and getting clarity on the process.'
        },
        {
          text: 'What do you think your boss will say?',
          xpReward: 15,
          isBest: false,
          feedback: 'This helps gauge their opinion but doesn\'t move the process forward effectively.'
        },
        {
          text: 'Why don\'t you have the authority to make this decision?',
          xpReward: 5,
          isBest: false,
          feedback: 'This sounds confrontational and could offend the prospect.'
        }
      ]
    }
  ]

  for (const question of trainingQuestions) {
    const { choices, ...questionData } = question
    const createdQuestion = await prisma.trainingQuestion.create({
      data: questionData
    })

    for (const choice of choices) {
      await prisma.trainingChoice.create({
        data: {
          ...choice,
          questionId: createdQuestion.id
        }
      })
    }
  }

  // Create a demo player
  console.log('👤 Creating demo player...')

  const demoPlayer = await prisma.player.create({
    data: {
      name: 'Demo Hero',
      email: 'demo@pipelineheroes.com',
      level: 5,
      xp: 3250,
      coins: 150,
      callsCompleted: 24,
      meetings: 8,
      streakDays: 3
    }
  })

  // Add some sample call analyses
  console.log('📞 Creating sample call analyses...')

  const callAnalyses = [
    {
      playerId: demoPlayer.id,
      customer: 'Acme Corp',
      duration: 28,
      score: 8.5,
      strengths: ['Strong opening that captured attention', 'Excellent discovery questions', 'Clear value proposition'],
      weaknesses: ['Could have created more urgency', 'Pricing discussion came up too early'],
      xpEarned: 85,
      coinsEarned: 8,
      callType: 'demo',
      pipelineValue: 75000
    },
    {
      playerId: demoPlayer.id,
      customer: 'TechStart Inc',
      duration: 15,
      score: 6.2,
      strengths: ['Professional tone', 'Good listening skills'],
      weaknesses: ['Missed qualifying questions', 'No clear next steps', 'Could have handled objections better'],
      xpEarned: 62,
      coinsEarned: 6,
      callType: 'discovery',
      pipelineValue: 25000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]

  for (const analysis of callAnalyses) {
    await prisma.callAnalysis.create({ data: analysis })
  }

  // Assign some quests to the demo player
  console.log('📋 Assigning quests to demo player...')

  const availableQuests = await prisma.quest.findMany({
    where: { type: QuestType.DAILY },
    take: 3
  })

  for (const quest of availableQuests) {
    await prisma.playerQuest.create({
      data: {
        playerId: demoPlayer.id,
        questId: quest.id,
        progress: Math.floor(Math.random() * quest.targetAmount),
        isCompleted: false
      }
    })
  }

  // Unlock some achievements for demo player
  console.log('🏆 Unlocking achievements for demo player...')

  const basicAchievements = await prisma.achievement.findMany({
    where: {
      name: { in: ['First Call', 'Meeting Starter', 'Level 5 Hero'] }
    }
  })

  for (const achievement of basicAchievements) {
    await prisma.playerAchievement.create({
      data: {
        playerId: demoPlayer.id,
        achievementId: achievement.id
      }
    })
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })