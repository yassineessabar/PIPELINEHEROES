import { prisma } from './prisma'

const achievements = [
  // Call Achievements
  {
    name: 'First Call',
    slug: 'first_call',
    description: 'Make your first sales call',
    icon: '📞',
    category: 'calls',
    rarity: 'common',
    requirementType: 'calls_completed',
    requirementValue: 1,
    xpReward: 50,
    coinsReward: 10
  },
  {
    name: 'Call Veteran',
    slug: 'call_veteran',
    description: 'Complete 25 sales calls',
    icon: '🎯',
    category: 'calls',
    rarity: 'uncommon',
    requirementType: 'calls_completed',
    requirementValue: 25,
    xpReward: 150,
    coinsReward: 30
  },
  {
    name: 'Call Expert',
    slug: 'call_expert',
    description: 'Complete 50 sales calls',
    icon: '⭐',
    category: 'calls',
    rarity: 'rare',
    requirementType: 'calls_completed',
    requirementValue: 50,
    xpReward: 300,
    coinsReward: 75
  },
  {
    name: 'Call Master',
    slug: 'call_master',
    description: 'Complete 100 sales calls',
    icon: '👑',
    category: 'calls',
    rarity: 'epic',
    requirementType: 'calls_completed',
    requirementValue: 100,
    xpReward: 500,
    coinsReward: 150
  },
  {
    name: 'Call Legend',
    slug: 'call_legend',
    description: 'Complete 250 sales calls',
    icon: '🏆',
    category: 'calls',
    rarity: 'legendary',
    requirementType: 'calls_completed',
    requirementValue: 250,
    xpReward: 1000,
    coinsReward: 300
  },

  // Meeting Achievements
  {
    name: 'Meeting Starter',
    slug: 'meeting_starter',
    description: 'Book your first meeting',
    icon: '🤝',
    category: 'meetings',
    rarity: 'common',
    requirementType: 'meetings_completed',
    requirementValue: 1,
    xpReward: 75,
    coinsReward: 15
  },
  {
    name: 'Meeting Pro',
    slug: 'meeting_pro',
    description: 'Book 10 meetings',
    icon: '📅',
    category: 'meetings',
    rarity: 'uncommon',
    requirementType: 'meetings_completed',
    requirementValue: 10,
    xpReward: 200,
    coinsReward: 40
  },
  {
    name: 'Meeting Machine',
    slug: 'meeting_machine',
    description: 'Book 25 meetings',
    icon: '⚡',
    category: 'meetings',
    rarity: 'rare',
    requirementType: 'meetings_completed',
    requirementValue: 25,
    xpReward: 400,
    coinsReward: 80
  },

  // Training Achievements
  {
    name: 'Training Rookie',
    slug: 'training_rookie',
    description: 'Complete your first training session',
    icon: '🎓',
    category: 'training',
    rarity: 'common',
    requirementType: 'training_sessions_completed',
    requirementValue: 1,
    xpReward: 50,
    coinsReward: 10
  },
  {
    name: 'Objection Warrior',
    slug: 'objection_warrior',
    description: 'Complete 10 training sessions',
    icon: '🛡️',
    category: 'training',
    rarity: 'uncommon',
    requirementType: 'training_sessions_completed',
    requirementValue: 10,
    xpReward: 250,
    coinsReward: 50
  },
  {
    name: 'Training Master',
    slug: 'training_master',
    description: 'Complete 25 training sessions',
    icon: '⚔️',
    category: 'training',
    rarity: 'rare',
    requirementType: 'training_sessions_completed',
    requirementValue: 25,
    xpReward: 500,
    coinsReward: 100
  },

  // Streak Achievements
  {
    name: 'Getting Started',
    slug: 'streak_3_days',
    description: 'Maintain a 3-day activity streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    requirementType: 'current_streak',
    requirementValue: 3,
    xpReward: 100,
    coinsReward: 20
  },
  {
    name: 'Consistency King',
    slug: 'streak_7_days',
    description: 'Maintain a 7-day activity streak',
    icon: '🎯',
    category: 'streak',
    rarity: 'uncommon',
    requirementType: 'current_streak',
    requirementValue: 7,
    xpReward: 250,
    coinsReward: 50
  },
  {
    name: 'Dedication Master',
    slug: 'streak_14_days',
    description: 'Maintain a 14-day activity streak',
    icon: '💪',
    category: 'streak',
    rarity: 'rare',
    requirementType: 'current_streak',
    requirementValue: 14,
    xpReward: 500,
    coinsReward: 100
  },
  {
    name: 'Unstoppable Force',
    slug: 'streak_30_days',
    description: 'Maintain a 30-day activity streak',
    icon: '🚀',
    category: 'streak',
    rarity: 'legendary',
    requirementType: 'current_streak',
    requirementValue: 30,
    xpReward: 1000,
    coinsReward: 250
  },

  // Level Milestones
  {
    name: 'Rising Star',
    slug: 'level_5',
    description: 'Reach Level 5',
    icon: '⭐',
    category: 'milestone',
    rarity: 'common',
    requirementType: 'level',
    requirementValue: 5,
    xpReward: 200,
    coinsReward: 50
  },
  {
    name: 'Seasoned Pro',
    slug: 'level_10',
    description: 'Reach Level 10',
    icon: '🌟',
    category: 'milestone',
    rarity: 'uncommon',
    requirementType: 'level',
    requirementValue: 10,
    xpReward: 400,
    coinsReward: 100
  },
  {
    name: 'Expert Operator',
    slug: 'level_15',
    description: 'Reach Level 15',
    icon: '💫',
    category: 'milestone',
    rarity: 'rare',
    requirementType: 'level',
    requirementValue: 15,
    xpReward: 750,
    coinsReward: 200
  },
  {
    name: 'Sales Champion',
    slug: 'level_25',
    description: 'Reach Level 25',
    icon: '🏆',
    category: 'milestone',
    rarity: 'legendary',
    requirementType: 'level',
    requirementValue: 25,
    xpReward: 2000,
    coinsReward: 500
  },

  // Deal Achievements
  {
    name: 'First Victory',
    slug: 'first_deal',
    description: 'Close your first deal',
    icon: '💼',
    category: 'pipeline',
    rarity: 'common',
    requirementType: 'deals_closed',
    requirementValue: 1,
    xpReward: 100,
    coinsReward: 25
  },
  {
    name: 'Deal Closer',
    slug: 'deal_closer',
    description: 'Close 5 deals',
    icon: '🎯',
    category: 'pipeline',
    rarity: 'uncommon',
    requirementType: 'deals_closed',
    requirementValue: 5,
    xpReward: 300,
    coinsReward: 75
  },
  {
    name: 'Sales Ace',
    slug: 'sales_ace',
    description: 'Close 10 deals',
    icon: '💎',
    category: 'pipeline',
    rarity: 'rare',
    requirementType: 'deals_closed',
    requirementValue: 10,
    xpReward: 600,
    coinsReward: 150
  }
]

export async function seedAchievements() {
  console.log('🏆 Seeding achievements...')

  try {
    // Clear existing achievements and user achievements
    await prisma.userAchievement.deleteMany()
    await prisma.achievement.deleteMany()
    console.log('Cleared existing achievements')

    // Create achievements
    const createdAchievements = []
    for (const achievementData of achievements) {
      const achievement = await prisma.achievement.create({
        data: achievementData
      })
      createdAchievements.push(achievement)
    }

    console.log(`✅ Created ${createdAchievements.length} achievements`)

    // Create some user achievements for the test user (simulate some progress)
    const testUserId = '550e8400-e29b-41d4-a716-446655440000'

    // Grant some achievements to test user based on their current stats
    const testUserAchievements = [
      'first_call',
      'call_veteran', // 25 calls
      'meeting_starter',
      'training_rookie',
      'objection_warrior', // 10 training sessions
      'rising_star' // level 5+
    ]

    for (const achievementSlug of testUserAchievements) {
      const achievement = createdAchievements.find(a => a.slug === achievementSlug)
      if (achievement) {
        await prisma.userAchievement.create({
          data: {
            userId: testUserId,
            achievementId: achievement.id,
            progress: Number(achievement.requirementValue),
            maxProgress: Number(achievement.requirementValue),
            isCompleted: true,
            completedAt: new Date()
          }
        })
      }
    }

    console.log(`✅ Granted ${testUserAchievements.length} achievements to test user`)

    // Log achievements by category
    const achievementsByCategory = achievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) acc[achievement.category] = []
      acc[achievement.category].push(achievement.name)
      return acc
    }, {} as Record<string, string[]>)

    console.log('Achievements created by category:')
    Object.entries(achievementsByCategory).forEach(([category, names]) => {
      console.log(`  ${category}: ${names.length} achievements`)
    })

    return createdAchievements
  } catch (error) {
    console.error('❌ Error seeding achievements:', error)
    throw error
  }
}

if (require.main === module) {
  seedAchievements()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}