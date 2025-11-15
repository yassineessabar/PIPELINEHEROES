import { prisma } from './prisma'

const shopItems = [
  {
    name: 'Half Day Off',
    description: 'Friday afternoon off - perfect for early weekend start',
    category: 'reward',
    coinPrice: 500,
    icon: '☕',
    isLimited: false,
    maxPerUser: 4, // Once per quarter
    sortOrder: 1
  },
  {
    name: 'Team Lunch',
    description: 'Treat your team to a nice lunch',
    category: 'reward',
    coinPrice: 800,
    icon: '🍽️',
    isLimited: false,
    maxPerUser: 2, // Twice per month
    sortOrder: 2
  },
  {
    name: 'Amazon €50',
    description: 'Amazon gift card for your shopping needs',
    category: 'reward',
    coinPrice: 1000,
    icon: '🎁',
    isLimited: false,
    maxPerUser: 3,
    sortOrder: 3
  },
  {
    name: 'Full Day Off',
    description: 'Extra vacation day - enjoy a long weekend',
    category: 'reward',
    coinPrice: 2000,
    icon: '🏖️',
    isLimited: false,
    maxPerUser: 2, // Twice per year
    sortOrder: 4
  },
  {
    name: 'XP Boost (24h)',
    description: 'Double XP for 24 hours',
    category: 'power_up',
    coinPrice: 300,
    icon: '⚡',
    isLimited: false,
    maxPerUser: 5,
    sortOrder: 5
  },
  {
    name: 'Gym Pass',
    description: '1 month premium gym membership',
    category: 'reward',
    coinPrice: 1500,
    icon: '💪',
    isLimited: false,
    maxPerUser: 2,
    sortOrder: 6
  },
  {
    name: 'Netflix +3mo',
    description: 'Netflix premium subscription for 3 months',
    category: 'subscription',
    coinPrice: 700,
    icon: '🎬',
    isLimited: false,
    maxPerUser: 2,
    sortOrder: 7
  },
  {
    name: 'Spotify +3mo',
    description: 'Spotify premium subscription for 3 months',
    category: 'subscription',
    coinPrice: 600,
    icon: '🎵',
    isLimited: false,
    maxPerUser: 2,
    sortOrder: 8
  },
  {
    name: 'Golden Avatar Frame',
    description: 'Show off with a shiny golden frame',
    category: 'cosmetic',
    coinPrice: 400,
    icon: '🖼️',
    isLimited: false,
    maxPerUser: 1,
    sortOrder: 9
  },
  {
    name: 'Hotel Stay',
    description: '1 night at a 4-star hotel',
    category: 'reward',
    coinPrice: 3500,
    icon: '🏨',
    isLimited: true,
    stockQuantity: 10,
    maxPerUser: 1,
    sortOrder: 10
  },
  {
    name: 'Tech Gadget',
    description: 'Latest tech gadget of your choice',
    category: 'reward',
    coinPrice: 4000,
    icon: '📱',
    isLimited: true,
    stockQuantity: 5,
    maxPerUser: 1,
    sortOrder: 11
  },
  {
    name: 'Gaming Setup',
    description: 'Premium gaming setup upgrade',
    category: 'reward',
    coinPrice: 5000,
    icon: '🎮',
    isLimited: true,
    stockQuantity: 3,
    maxPerUser: 1,
    sortOrder: 12
  }
]

export async function seedShopItems() {
  console.log('🛒 Seeding shop items...')

  try {
    // Clear existing items
    await prisma.shopItem.deleteMany()
    console.log('Cleared existing shop items')

    // Create shop items
    const createdItems = await prisma.shopItem.createMany({
      data: shopItems,
      skipDuplicates: true
    })

    console.log(`✅ Created ${createdItems.count} shop items`)

    // Log the items for verification
    const items = await prisma.shopItem.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    console.log('Shop items created:')
    items.forEach(item => {
      console.log(`- ${item.name} (${item.coinPrice} coins)`)
    })

    return items
  } catch (error) {
    console.error('❌ Error seeding shop items:', error)
    throw error
  }
}

if (require.main === module) {
  seedShopItems()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}