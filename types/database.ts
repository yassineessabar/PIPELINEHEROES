// ============================================================================
// DATABASE TYPES - Generated from Prisma Schema
// ============================================================================

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string

  // Aircall Integration
  aircallApiId?: string
  aircallApiToken?: string
  aircallWebhookSecret?: string

  // Billing & Subscription
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'trialing'
  subscriptionEndsAt?: Date

  // Settings
  settings: Record<string, any>
  timezone: string

  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  workspaceId: string

  // Basic Info
  email: string
  name: string
  avatarUrl?: string

  // Authentication
  passwordHash?: string
  emailVerified: boolean
  lastLogin?: Date

  // Role & Permissions
  role: 'owner' | 'admin' | 'manager' | 'member'
  permissions: string[]

  // Game Profile
  displayName?: string
  playerClass: 'neural_operative' | 'data_commander' | 'pipeline_architect'

  // Aircall Integration
  aircallUserId?: number
  aircallExtension?: string

  createdAt: Date
  updatedAt: Date

  // Relations
  workspace?: Workspace
  playerStats?: PlayerStats
  xpTransactions?: XpTransaction[]
  userAchievements?: UserAchievement[]
  trainingSessions?: TrainingSession[]
  calls?: Call[]
  callAnalyses?: CallAnalysis[]
  userQuests?: UserQuest[]
  leaderboardEntries?: LeaderboardEntry[]
  purchases?: UserPurchase[]
  activities?: Activity[]
  notifications?: Notification[]
  dailyStats?: DailyUserStats[]
}

export interface PlayerStats {
  id: string
  userId: string

  // Core Game Stats
  level: number
  xp: bigint
  coins: bigint

  // Performance Metrics
  callsCompleted: number
  meetingsCompleted: number
  trainingSessionsCompleted: number
  questsCompleted: number

  // Streak Tracking
  currentStreak: number
  longestStreak: number
  lastActivityDate?: Date

  // Pipeline Metrics
  totalPipelineValue: number
  dealsClosed: number
  avgDealSize: number

  // Skill Scores (0-100)
  objectionHandlingScore: number
  rapportBuildingScore: number
  discoveryScore: number
  closingScore: number
  valuePropositionScore: number

  createdAt: Date
  updatedAt: Date

  // Relations
  user?: User
}

export interface XpTransaction {
  id: string
  userId: string

  amount: number
  reason: string
  source: 'call_analysis' | 'training' | 'achievement' | 'quest' | 'manual'
  sourceId?: string

  metadata: Record<string, any>

  createdAt: Date

  // Relations
  user?: User
}

export interface Achievement {
  id: string

  // Basic Info
  name: string
  slug: string
  description: string
  icon?: string

  // Categorization
  category: 'calls' | 'meetings' | 'pipeline' | 'streak' | 'training' | 'milestone' | 'social'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

  // Requirements
  requirementType: 'count' | 'value' | 'streak' | 'score'
  requirementValue: number
  requirementField?: string

  // Rewards
  xpReward: number
  coinsReward: number

  // Metadata
  isHidden: boolean
  isActive: boolean

  createdAt: Date
  updatedAt: Date

  // Relations
  userAchievements?: UserAchievement[]
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string

  progress: number
  maxProgress: number
  isCompleted: boolean
  completedAt?: Date

  createdAt: Date
  updatedAt: Date

  // Relations
  user?: User
  achievement?: Achievement
}

export interface TrainingCategory {
  id: string

  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  sortOrder: number

  createdAt: Date

  // Relations
  questions?: TrainingQuestion[]
}

export interface TrainingQuestion {
  id: string
  categoryId: string

  title: string
  bossName: string
  difficulty: number
  prompt: string

  tags: string[]
  isActive: boolean

  createdAt: Date
  updatedAt: Date

  // Relations
  category?: TrainingCategory
  choices?: TrainingChoice[]
  sessions?: TrainingSession[]
}

export interface TrainingChoice {
  id: string
  questionId: string

  text: string
  isCorrect: boolean
  xpReward: number
  feedback?: string

  sortOrder: number

  createdAt: Date

  // Relations
  question?: TrainingQuestion
  sessions?: TrainingSession[]
}

export interface TrainingSession {
  id: string
  userId: string
  questionId: string
  choiceId: string

  isCorrect: boolean
  timeSpent?: number // Seconds
  xpEarned: number

  createdAt: Date

  // Relations
  user?: User
  question?: TrainingQuestion
  choice?: TrainingChoice
}

export interface Call {
  id: string
  userId: string

  // Aircall Data
  aircallCallId: bigint
  aircallDirectLink?: string

  // Call Details
  direction: 'inbound' | 'outbound'
  status: 'initial' | 'answered' | 'done' | 'missed'
  startedAt: Date
  answeredAt?: Date
  endedAt?: Date
  duration?: number // Seconds

  // Contact Info
  contactName?: string
  contactPhone?: string
  contactCompany?: string

  // Recording & Analysis
  recordingUrl?: string
  hasTranscription: boolean
  hasAnalysis: boolean

  metadata: Record<string, any>

  createdAt: Date
  updatedAt: Date

  // Relations
  user?: User
  analysis?: CallAnalysis
}

export interface CallAnalysis {
  id: string
  callId: string
  userId: string

  // Analysis Results
  gameScore?: number
  totalXpEarned: number

  // Sentiment Analysis
  overallSentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  sentimentConfidence?: number
  positiveSegments: number
  negativeSegments: number
  neutralSegments: number

  // Topics
  topicsIdentified: string[]
  topicsCount: number

  // Performance Scores
  objectionHandlingScore?: number
  rapportBuildingScore?: number
  discoveryScore?: number
  closingScore?: number
  valuePropositionScore?: number

  // Summary
  summaryText?: string
  keyPoints: string[]
  actionItems: any[]

  // Raw Aircall Data
  aircallTranscription?: any
  aircallSentiment?: any
  aircallTopics?: any
  aircallSummary?: any
  aircallActionItems?: any

  analyzedAt: Date
  createdAt: Date

  // Relations
  call?: Call
  user?: User
  insights?: CallInsight[]
}

export interface CallInsight {
  id: string
  analysisId: string

  insightType: 'objection_handling' | 'rapport_building' | 'closing_technique' | 'discovery' | 'value_proposition'
  title: string
  description: string
  score?: number
  improvementTip?: string
  xpEarned: number

  createdAt: Date

  // Relations
  analysis?: CallAnalysis
}

export interface QuestTemplate {
  id: string

  name: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'

  objectiveType: 'calls' | 'meetings' | 'pipeline' | 'training' | 'score'
  objectiveCount: number
  timeLimitHours?: number

  xpReward: number
  coinsReward: number

  isRepeatable: boolean
  isActive: boolean

  createdAt: Date
  updatedAt: Date

  // Relations
  userQuests?: UserQuest[]
}

export interface UserQuest {
  id: string
  userId: string
  templateId: string

  currentProgress: number
  targetProgress: number
  isCompleted: boolean

  startedAt: Date
  expiresAt?: Date
  completedAt?: Date

  createdAt: Date

  // Relations
  user?: User
  template?: QuestTemplate
}

export interface LeaderboardPeriod {
  id: string
  workspaceId: string

  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: Date
  endDate: Date

  isCurrent: boolean

  createdAt: Date

  // Relations
  workspace?: Workspace
  entries?: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  id: string
  periodId: string
  userId: string

  rankPosition: number
  metricType: 'xp' | 'calls' | 'meetings' | 'pipeline' | 'streak'
  metricValue: number

  rankChange: number

  createdAt: Date

  // Relations
  period?: LeaderboardPeriod
  user?: User
}

export interface ShopItem {
  id: string

  name: string
  description: string
  category: 'cosmetic' | 'power_up' | 'tool' | 'subscription'

  coinPrice: number
  realPriceCents?: number

  isLimited: boolean
  stockQuantity?: number
  maxPerUser: number

  icon?: string
  isActive: boolean
  sortOrder: number

  createdAt: Date
  updatedAt: Date

  // Relations
  purchases?: UserPurchase[]
}

export interface UserPurchase {
  id: string
  userId: string
  itemId: string

  coinsSpent: number
  realMoneySpentCents: number
  quantity: number

  isActive: boolean
  expiresAt?: Date

  createdAt: Date

  // Relations
  user?: User
  item?: ShopItem
}

export interface Activity {
  id: string
  workspaceId: string
  userId: string

  activityType: string
  title: string
  description?: string

  metadata: Record<string, any>
  isPublic: boolean

  createdAt: Date

  // Relations
  workspace?: Workspace
  user?: User
}

export interface Notification {
  id: string
  userId: string

  title: string
  message: string
  type: 'achievement' | 'quest' | 'leaderboard' | 'system' | 'social'

  isRead: boolean
  readAt?: Date

  actionUrl?: string
  actionLabel?: string

  createdAt: Date

  // Relations
  user?: User
}

export interface DailyUserStats {
  id: string
  userId: string
  date: Date

  callsMade: number
  meetingsHeld: number
  xpGained: number
  coinsEarned: number
  trainingSessions: number

  avgCallScore?: number
  totalCallDuration: number
  pipelineAdded: number

  createdAt: Date

  // Relations
  user?: User
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Player Profile for UI Components
export interface PlayerProfile {
  id: string
  name: string
  displayName?: string
  level: number
  xp: number
  coins: number
  callsCompleted: number
  meetings: number
  streakDays: number
  playerClass: string
  avatarUrl?: string
}

// Call Analysis Summary
export interface CallAnalysisSummary {
  id: string
  gameScore: number
  totalXpEarned: number
  duration?: number
  sentiment?: string
  topicsCount: number
  insights: CallInsight[]
  createdAt: Date
}

// Achievement Progress
export interface AchievementProgress extends Achievement {
  progress: number
  maxProgress: number
  isCompleted: boolean
  completedAt?: Date
}

// Quest Progress
export interface QuestProgress extends QuestTemplate {
  currentProgress: number
  targetProgress: number
  isCompleted: boolean
  expiresAt?: Date
  completedAt?: Date
}

// Leaderboard Entry with User Info
export interface LeaderboardEntryWithUser extends Omit<LeaderboardEntry, 'user'> {
  user: {
    id: string
    name: string
    displayName?: string
    avatarUrl?: string
  }
}

// Training Progress Summary
export interface TrainingProgressSummary {
  totalSessions: number
  correctAnswers: number
  totalXpEarned: number
  averageScore: number
  categoriesCompleted: string[]
}

// Dashboard Stats
export interface DashboardStats {
  totalXp: number
  level: number
  callsThisWeek: number
  meetingsThisWeek: number
  currentStreak: number
  leaderboardRank?: number
  activeQuests: number
  completedAchievements: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Form Types
export interface CreateUserRequest {
  name: string
  email: string
  workspaceId: string
  role?: string
  aircallUserId?: number
  aircallExtension?: string
}

export interface UpdatePlayerStatsRequest {
  xp?: number
  coins?: number
  callsCompleted?: number
  meetingsCompleted?: number
  currentStreak?: number
  objectionHandlingScore?: number
  rapportBuildingScore?: number
  discoveryScore?: number
  closingScore?: number
  valuePropositionScore?: number
}

export interface CreateCallAnalysisRequest {
  aircallCallId: number
  userId: string
  autoAnalyze?: boolean
}

export interface CreateTrainingSessionRequest {
  userId: string
  questionId: string
  choiceId: string
  timeSpent?: number
}

// Webhook Types
export interface AircallWebhookPayload {
  event: string
  data: {
    call: {
      id: number
      direct_link: string
      duration?: number
      started_at: number
      ended_at?: number
      user?: {
        id: number
        name: string
      }
      contact?: {
        id: number
        first_name?: string
        last_name?: string
        phone_numbers?: Array<{
          value: string
        }>
      }
    }
  }
  timestamp: number
}