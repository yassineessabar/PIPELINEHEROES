import { prisma } from './prisma'

const mockUsers = [
  { name: 'Sophie Martin', email: 'sophie.martin@example.com', level: 12, xp: 24500, calls: 85, meetings: 32, streak: 14 },
  { name: 'Lucas Bernard', email: 'lucas.bernard@example.com', level: 11, xp: 22100, calls: 78, meetings: 28, streak: 8 },
  { name: 'Emma Dubois', email: 'emma.dubois@example.com', level: 10, xp: 19800, calls: 71, meetings: 25, streak: 12 },
  { name: 'Marc Fontaine', email: 'marc.fontaine@example.com', level: 9, xp: 17200, calls: 64, meetings: 22, streak: 6 },
  { name: 'Julie Mercier', email: 'julie.mercier@example.com', level: 9, xp: 16500, calls: 59, meetings: 21, streak: 3 },
  { name: 'Pierre Leclerc', email: 'pierre.leclerc@example.com', level: 8, xp: 14800, calls: 52, meetings: 18, streak: 7 },
  { name: 'Claire Dupont', email: 'claire.dupont@example.com', level: 8, xp: 14200, calls: 48, meetings: 17, streak: 2 },
  { name: 'Thomas Girard', email: 'thomas.girard@example.com', level: 7, xp: 12500, calls: 43, meetings: 15, streak: 5 },
  { name: 'Amélie Rousseau', email: 'amelie.rousseau@example.com', level: 7, xp: 12100, calls: 39, meetings: 14, streak: 1 }
]

export async function seedLeaderboardData() {
  console.log('🏆 Seeding leaderboard data...')

  try {
    // Get the test workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: 'test-workspace' }
    })

    if (!workspace) {
      throw new Error('Test workspace not found. Run seedTestUser first.')
    }

    // Create mock users
    const createdUsers = []
    for (const userData of mockUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name
        },
        create: {
          workspaceId: workspace.id,
          email: userData.email,
          name: userData.name,
          emailVerified: true,
          role: 'member',
          permissions: [],
          playerClass: 'neural_operative'
        }
      })

      // Create/update player stats
      await prisma.playerStats.upsert({
        where: { userId: user.id },
        update: {
          level: userData.level,
          xp: BigInt(userData.xp),
          callsCompleted: userData.calls,
          meetingsCompleted: userData.meetings,
          currentStreak: userData.streak,
          longestStreak: Math.max(userData.streak, userData.streak + 5)
        },
        create: {
          userId: user.id,
          level: userData.level,
          xp: BigInt(userData.xp),
          callsCompleted: userData.calls,
          meetingsCompleted: userData.meetings,
          currentStreak: userData.streak,
          longestStreak: Math.max(userData.streak, userData.streak + 5),
          trainingSessionsCompleted: Math.floor(userData.calls / 5),
          questsCompleted: Math.floor(userData.level / 3),
          totalPipelineValue: userData.meetings * 12500.00,
          dealsClosed: Math.floor(userData.meetings / 3),
          avgDealSize: 12500.00,
          objectionHandlingScore: 70 + Math.floor(Math.random() * 20),
          rapportBuildingScore: 70 + Math.floor(Math.random() * 20),
          discoveryScore: 70 + Math.floor(Math.random() * 20),
          closingScore: 70 + Math.floor(Math.random() * 20),
          valuePropositionScore: 70 + Math.floor(Math.random() * 20)
        }
      })

      createdUsers.push({ ...user, ...userData })
    }

    // Create daily stats for the past week for all users
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      for (const userData of createdUsers) {
        const user = await prisma.user.findUnique({
          where: { email: userData.email }
        })

        if (user) {
          // Generate some realistic daily activity
          const dailyCalls = Math.floor(Math.random() * 8) + 2 // 2-10 calls per day
          const dailyMeetings = Math.floor(Math.random() * 3) + 1 // 1-4 meetings per day
          const dailyXp = dailyCalls * 25 + dailyMeetings * 75 + Math.floor(Math.random() * 100)

          await prisma.dailyUserStats.upsert({
            where: {
              userId_date: {
                userId: user.id,
                date: date
              }
            },
            update: {
              callsMade: dailyCalls,
              meetingsHeld: dailyMeetings,
              xpGained: dailyXp,
              avgCallScore: 7.5 + Math.random() * 2.5, // 7.5-10.0
              totalCallDuration: dailyCalls * (15 + Math.floor(Math.random() * 30)), // 15-45 min per call
              pipelineAdded: dailyMeetings * (5000 + Math.floor(Math.random() * 10000)) // 5k-15k per meeting
            },
            create: {
              userId: user.id,
              date: date,
              callsMade: dailyCalls,
              meetingsHeld: dailyMeetings,
              xpGained: dailyXp,
              avgCallScore: 7.5 + Math.random() * 2.5,
              totalCallDuration: dailyCalls * (15 + Math.floor(Math.random() * 30)),
              pipelineAdded: dailyMeetings * (5000 + Math.floor(Math.random() * 10000))
            }
          })
        }
      }
    }

    // Create daily stats for the test user too
    const testUser = await prisma.user.findUnique({
      where: { id: '550e8400-e29b-41d4-a716-446655440000' }
    })

    if (testUser) {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        const dailyCalls = Math.floor(Math.random() * 6) + 1 // 1-7 calls per day (less than others)
        const dailyMeetings = Math.floor(Math.random() * 2) + 1 // 1-3 meetings per day
        const dailyXp = dailyCalls * 25 + dailyMeetings * 75 + Math.floor(Math.random() * 50)

        await prisma.dailyUserStats.upsert({
          where: {
            userId_date: {
              userId: testUser.id,
              date: date
            }
          },
          update: {
            callsMade: dailyCalls,
            meetingsHeld: dailyMeetings,
            xpGained: dailyXp,
            avgCallScore: 6.5 + Math.random() * 2, // 6.5-8.5 (slightly lower)
            totalCallDuration: dailyCalls * (10 + Math.floor(Math.random() * 25)),
            pipelineAdded: dailyMeetings * (3000 + Math.floor(Math.random() * 7000))
          },
          create: {
            userId: testUser.id,
            date: date,
            callsMade: dailyCalls,
            meetingsHeld: dailyMeetings,
            xpGained: dailyXp,
            avgCallScore: 6.5 + Math.random() * 2,
            totalCallDuration: dailyCalls * (10 + Math.floor(Math.random() * 25)),
            pipelineAdded: dailyMeetings * (3000 + Math.floor(Math.random() * 7000))
          }
        })
      }
    }

    console.log(`✅ Created ${createdUsers.length} leaderboard users`)
    console.log('✅ Created 7 days of activity data for all users')

    return { users: createdUsers.length, days: 7 }
  } catch (error) {
    console.error('❌ Error seeding leaderboard data:', error)
    throw error
  }
}

if (require.main === module) {
  seedLeaderboardData()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}