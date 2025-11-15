import { prisma } from './prisma'

const trainingData = [
  {
    categoryData: {
      name: 'Neural Negotiation',
      slug: 'neural_negotiation',
      description: 'Master the art of overcoming objections and closing deals',
      icon: '🧠',
      color: '#00F0FF',
      sortOrder: 1
    },
    questions: [
      {
        title: 'Budget Objection Protocol',
        bossName: 'BUDGET.EXE PROTOCOL',
        difficulty: 4,
        prompt: 'INCOMING TRANSMISSION: "Your solution looks interesting, but honestly the budget is just not there right now. We\'re already paying for 3 other tools. How can you justify the cost?"',
        tags: ['budget', 'objection', 'roi'],
        choices: [
          {
            text: 'Let me show you the ROI. On average, our customers see 3x return within 6 months...',
            isCorrect: true,
            xpReward: 75,
            feedback: '⚡ NEURAL SYNC COMPLETE! ROI Matrix - Quantified value protocols activated. Financial justification subroutine executed.',
            sortOrder: 1
          },
          {
            text: 'I understand. What if we revisit this conversation next quarter when...',
            isCorrect: false,
            xpReward: 25,
            feedback: '⚠️ TEMPORAL DELAY DETECTED. Strategy incomplete - Missed urgency optimization. Opportunity stasis achieved.',
            sortOrder: 2
          },
          {
            text: 'The budget concern is valid. But consider the hidden cost of NOT having this...',
            isCorrect: false,
            xpReward: 70,
            feedback: '⚡ VALUE REFRAME PROTOCOL. Cognitive shift engaged - Cost-benefit analysis redirected to consequence matrix.',
            sortOrder: 3
          },
          {
            text: 'What if we start with just the core module at 50% of the price?',
            isCorrect: false,
            xpReward: 65,
            feedback: '⚡ ADAPTIVE SOLUTION ENGINE. Flexibility subroutine - Alternative pathway computation successful.',
            sortOrder: 4
          }
        ]
      },
      {
        title: 'Authority Challenge Matrix',
        bossName: 'HIERARCHY.EXE GUARDIAN',
        difficulty: 3,
        prompt: 'INCOMING TRANSMISSION: "This looks good, but I need to run it by my boss first. They handle all the big decisions around here."',
        tags: ['authority', 'decision-maker', 'hierarchy'],
        choices: [
          {
            text: 'I understand the approval process. Would it help if I prepared a summary for your boss?',
            isCorrect: false,
            xpReward: 45,
            feedback: '⚡ PREPARATION PROTOCOL. Support mechanism activated - Documentation assistance engaged.',
            sortOrder: 1
          },
          {
            text: 'That makes sense. Who else would be involved in evaluating this decision?',
            isCorrect: true,
            xpReward: 80,
            feedback: '⚡ NEURAL SYNC COMPLETE! Authority mapping protocol - Decision tree analysis successful. Stakeholder identification matrix activated.',
            sortOrder: 2
          },
          {
            text: 'No problem. How long does that approval process usually take?',
            isCorrect: false,
            xpReward: 35,
            feedback: '⚠️ TEMPORAL FOCUS DETECTED. Timeline inquiry registered - Missing stakeholder analysis optimization.',
            sortOrder: 3
          },
          {
            text: 'Would you be comfortable making a recommendation to them?',
            isCorrect: false,
            xpReward: 55,
            feedback: '⚡ INFLUENCE AMPLIFICATION. Champion development subroutine - Advocacy protocol partially engaged.',
            sortOrder: 4
          }
        ]
      }
    ]
  },
  {
    categoryData: {
      name: 'Rapport Algorithms',
      slug: 'rapport_algorithms',
      description: 'Build authentic connections and trust with prospects',
      icon: '🤝',
      color: '#FF00FF',
      sortOrder: 2
    },
    questions: [
      {
        title: 'Connection Initialization',
        bossName: 'TRUST.EXE FIREWALL',
        difficulty: 2,
        prompt: 'INCOMING TRANSMISSION: "I\'ve been burned by software vendors before. How do I know you\'re not just trying to sell me something I don\'t need?"',
        tags: ['trust', 'skepticism', 'rapport'],
        choices: [
          {
            text: 'I completely understand your concern. Can you tell me about that experience?',
            isCorrect: true,
            xpReward: 70,
            feedback: '⚡ NEURAL SYNC COMPLETE! Empathy matrix activated - Trust protocol initialization successful. Vulnerability sharing channel opened.',
            sortOrder: 1
          },
          {
            text: 'We have a 30-day money-back guarantee, so there\'s no risk to you.',
            isCorrect: false,
            xpReward: 30,
            feedback: '⚠️ DEFENSIVE BARRIER DETECTED. Risk mitigation mentioned - Missing emotional connection protocol.',
            sortOrder: 2
          },
          {
            text: 'I\'m not here to sell you anything you don\'t need. Let me ask a few questions first.',
            isCorrect: false,
            xpReward: 50,
            feedback: '⚡ INTENTION DECLARATION. Consultative approach registered - Needs assessment preparation engaged.',
            sortOrder: 3
          },
          {
            text: 'That\'s exactly why I want to make sure this is the right fit before we move forward.',
            isCorrect: false,
            xpReward: 60,
            feedback: '⚡ ALIGNMENT PROTOCOL. Qualification intent expressed - Partnership mindset partially activated.',
            sortOrder: 4
          }
        ]
      }
    ]
  },
  {
    categoryData: {
      name: 'Discovery Protocols',
      slug: 'discovery_protocols',
      description: 'Uncover pain points and needs through strategic questioning',
      icon: '🔍',
      color: '#00FF88',
      sortOrder: 3
    },
    questions: [
      {
        title: 'Pain Point Excavation',
        bossName: 'SURFACE.EXE SCANNER',
        difficulty: 3,
        prompt: 'INCOMING TRANSMISSION: "Everything is fine with our current process. We\'re not really looking to change anything right now."',
        tags: ['discovery', 'pain-points', 'status-quo'],
        choices: [
          {
            text: 'That\'s great to hear. What\'s working well about your current process?',
            isCorrect: true,
            xpReward: 75,
            feedback: '⚡ NEURAL SYNC COMPLETE! Validation protocol - Current state analysis initiated. Strength identification matrix activated.',
            sortOrder: 1
          },
          {
            text: 'I understand. Let me show you what we\'ve helped similar companies achieve.',
            isCorrect: false,
            xpReward: 40,
            feedback: '⚠️ PRESENTATION MODE DETECTED. Solution focus premature - Discovery phase incomplete.',
            sortOrder: 2
          },
          {
            text: 'That makes sense. What would need to happen for you to consider a change?',
            isCorrect: false,
            xpReward: 65,
            feedback: '⚡ THRESHOLD ANALYSIS. Change catalyst inquiry - Trigger event identification protocol engaged.',
            sortOrder: 3
          },
          {
            text: 'How do you measure success with your current approach?',
            isCorrect: false,
            xpReward: 60,
            feedback: '⚡ METRICS MAPPING. Performance measurement protocol - Success criteria analysis activated.',
            sortOrder: 4
          }
        ]
      }
    ]
  }
]

export async function seedTrainingData() {
  console.log('🎯 Seeding training data...')

  try {
    // Clear existing training data
    await prisma.trainingSession.deleteMany()
    await prisma.trainingChoice.deleteMany()
    await prisma.trainingQuestion.deleteMany()
    await prisma.trainingCategory.deleteMany()
    console.log('Cleared existing training data')

    let totalQuestions = 0
    let totalChoices = 0

    for (const { categoryData, questions } of trainingData) {
      // Create category
      const category = await prisma.trainingCategory.create({
        data: categoryData
      })
      console.log(`✅ Created category: ${category.name}`)

      // Create questions for this category
      for (const questionData of questions) {
        const { choices, ...questionFields } = questionData

        const question = await prisma.trainingQuestion.create({
          data: {
            ...questionFields,
            categoryId: category.id
          }
        })

        totalQuestions++
        console.log(`  📝 Created question: ${question.title}`)

        // Create choices for this question
        for (const choiceData of choices) {
          await prisma.trainingChoice.create({
            data: {
              ...choiceData,
              questionId: question.id
            }
          })
          totalChoices++
        }
      }
    }

    console.log(`✅ Seeding completed:`)
    console.log(`  - ${trainingData.length} categories`)
    console.log(`  - ${totalQuestions} questions`)
    console.log(`  - ${totalChoices} choices`)

    return { categories: trainingData.length, questions: totalQuestions, choices: totalChoices }
  } catch (error) {
    console.error('❌ Error seeding training data:', error)
    throw error
  }
}

if (require.main === module) {
  seedTrainingData()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}