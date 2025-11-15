import { prisma } from './prisma'

export async function seedTestUser() {
  console.log('👤 Seeding test user...')

  try {
    // Create or update workspace
    const workspace = await prisma.workspace.upsert({
      where: { slug: 'test-workspace' },
      update: {},
      create: {
        name: 'Test Workspace',
        slug: 'test-workspace',
        description: 'Test workspace for development',
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        timezone: 'UTC',
        settings: {}
      }
    })

    console.log('✅ Created/updated workspace:', workspace.name)

    // Create or update test user with a proper UUID
    const testUserId = '550e8400-e29b-41d4-a716-446655440000' // Fixed UUID for testing
    const user = await prisma.user.upsert({
      where: { id: testUserId },
      update: {
        name: 'Test User',
        email: 'test@example.com'
      },
      create: {
        id: testUserId,
        workspaceId: workspace.id,
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: true,
        role: 'member',
        permissions: [],
        playerClass: 'neural_operative'
      }
    })

    console.log('✅ Created/updated user:', user.name)

    // Create or update player stats
    const playerStats = await prisma.playerStats.upsert({
      where: { userId: user.id },
      update: {
        coins: BigInt(5000), // Give them 5000 coins to test with
        xp: BigInt(2847),
        level: 12
      },
      create: {
        userId: user.id,
        level: 12,
        xp: BigInt(2847),
        coins: BigInt(5000),
        callsCompleted: 45,
        meetingsCompleted: 23,
        trainingSessionsCompleted: 15,
        questsCompleted: 3,
        currentStreak: 5,
        longestStreak: 12,
        lastActivityDate: new Date(),
        totalPipelineValue: 125000.00,
        dealsClosed: 8,
        avgDealSize: 15625.00,
        objectionHandlingScore: 75,
        rapportBuildingScore: 82,
        discoveryScore: 70,
        closingScore: 68,
        valuePropositionScore: 78
      }
    })

    console.log('✅ Created/updated player stats - Coins:', Number(playerStats.coins))

    return { workspace, user, playerStats }
  } catch (error) {
    console.error('❌ Error seeding test user:', error)
    throw error
  }
}

if (require.main === module) {
  seedTestUser()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}