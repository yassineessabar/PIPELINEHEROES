-- ============================================================================
-- PIPELINE HEROES - COMPREHENSIVE DATABASE SCHEMA
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Workspaces (Organizations/Companies)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,

    -- Aircall Integration
    aircall_api_id VARCHAR(255),
    aircall_api_token VARCHAR(255),
    aircall_webhook_secret VARCHAR(255),

    -- Billing & Subscription
    subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
    subscription_ends_at TIMESTAMP,

    -- Settings
    settings JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'UTC',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    -- Basic Info
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,

    -- Authentication
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,

    -- Role & Permissions
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member')),
    permissions JSONB DEFAULT '[]',

    -- Game Profile
    display_name VARCHAR(100),
    player_class VARCHAR(50) DEFAULT 'neural_operative' CHECK (player_class IN ('neural_operative', 'data_commander', 'pipeline_architect')),

    -- Aircall Integration
    aircall_user_id INTEGER,
    aircall_extension VARCHAR(20),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- GAME MECHANICS TABLES
-- ============================================================================

-- Player Stats & Progress
CREATE TABLE player_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Core Game Stats
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    xp BIGINT DEFAULT 0 CHECK (xp >= 0),
    coins BIGINT DEFAULT 100 CHECK (coins >= 0),

    -- Performance Metrics
    calls_completed INTEGER DEFAULT 0,
    meetings_completed INTEGER DEFAULT 0,
    training_sessions_completed INTEGER DEFAULT 0,
    quests_completed INTEGER DEFAULT 0,

    -- Streak Tracking
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,

    -- Pipeline Metrics
    total_pipeline_value DECIMAL(15,2) DEFAULT 0,
    deals_closed INTEGER DEFAULT 0,
    avg_deal_size DECIMAL(15,2) DEFAULT 0,

    -- Skill Scores (0-100)
    objection_handling_score INTEGER DEFAULT 0 CHECK (objection_handling_score BETWEEN 0 AND 100),
    rapport_building_score INTEGER DEFAULT 0 CHECK (rapport_building_score BETWEEN 0 AND 100),
    discovery_score INTEGER DEFAULT 0 CHECK (discovery_score BETWEEN 0 AND 100),
    closing_score INTEGER DEFAULT 0 CHECK (closing_score BETWEEN 0 AND 100),
    value_proposition_score INTEGER DEFAULT 0 CHECK (value_proposition_score BETWEEN 0 AND 100),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- XP Transactions (Audit Trail)
CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'call_analysis', 'training', 'achievement', 'quest', etc.
    source_id UUID, -- Reference to the source record

    -- Metadata
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements System
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10), -- Emoji or icon code

    -- Categorization
    category VARCHAR(50) NOT NULL CHECK (category IN ('calls', 'meetings', 'pipeline', 'streak', 'training', 'milestone', 'social')),
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),

    -- Requirements
    requirement_type VARCHAR(50) NOT NULL, -- 'count', 'value', 'streak', 'score', etc.
    requirement_value DECIMAL(15,2) NOT NULL,
    requirement_field VARCHAR(100), -- Field to check against

    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    coins_reward INTEGER DEFAULT 0,

    -- Metadata
    is_hidden BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,

    progress DECIMAL(15,2) DEFAULT 0,
    max_progress DECIMAL(15,2) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- TRAINING & EDUCATION
-- ============================================================================

-- Training Categories
CREATE TABLE training_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(7), -- Hex color
    sort_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- Training Questions/Scenarios
CREATE TABLE training_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES training_categories(id) ON DELETE CASCADE,

    -- Question Details
    title VARCHAR(255) NOT NULL,
    boss_name VARCHAR(100) NOT NULL, -- e.g., "BUDGET.EXE PROTOCOL"
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    prompt TEXT NOT NULL,

    -- Metadata
    tags TEXT[], -- Array of tags
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Training Question Choices
CREATE TABLE training_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES training_questions(id) ON DELETE CASCADE,

    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    xp_reward INTEGER DEFAULT 0,
    feedback TEXT,

    sort_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- Training Sessions
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES training_questions(id) ON DELETE CASCADE,
    choice_id UUID NOT NULL REFERENCES training_choices(id) ON DELETE CASCADE,

    -- Performance
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER, -- Seconds
    xp_earned INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CALL ANALYSIS & AIRCALL INTEGRATION
-- ============================================================================

-- Call Records
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Aircall Data
    aircall_call_id BIGINT UNIQUE NOT NULL,
    aircall_direct_link TEXT,

    -- Call Details
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('initial', 'answered', 'done', 'missed')),
    started_at TIMESTAMP NOT NULL,
    answered_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration INTEGER, -- Seconds

    -- Contact Info
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_company VARCHAR(255),

    -- Recording & Transcription
    recording_url TEXT,
    has_transcription BOOLEAN DEFAULT FALSE,
    has_analysis BOOLEAN DEFAULT FALSE,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Call Analysis Results
CREATE TABLE call_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID UNIQUE NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Analysis Results
    game_score INTEGER CHECK (game_score BETWEEN 0 AND 100),
    total_xp_earned INTEGER DEFAULT 0,

    -- Sentiment Analysis
    overall_sentiment VARCHAR(20) CHECK (overall_sentiment IN ('POSITIVE', 'NEGATIVE', 'NEUTRAL')),
    sentiment_confidence DECIMAL(5,4),
    positive_segments INTEGER DEFAULT 0,
    negative_segments INTEGER DEFAULT 0,
    neutral_segments INTEGER DEFAULT 0,

    -- Topics & Keywords
    topics_identified TEXT[],
    topics_count INTEGER DEFAULT 0,

    -- Performance Scores
    objection_handling_score INTEGER CHECK (objection_handling_score BETWEEN 0 AND 100),
    rapport_building_score INTEGER CHECK (rapport_building_score BETWEEN 0 AND 100),
    discovery_score INTEGER CHECK (discovery_score BETWEEN 0 AND 100),
    closing_score INTEGER CHECK (closing_score BETWEEN 0 AND 100),
    value_proposition_score INTEGER CHECK (value_proposition_score BETWEEN 0 AND 100),

    -- Summary Data
    summary_text TEXT,
    key_points TEXT[],
    action_items JSONB DEFAULT '[]',

    -- Raw Analysis Data
    aircall_transcription JSONB,
    aircall_sentiment JSONB,
    aircall_topics JSONB,
    aircall_summary JSONB,
    aircall_action_items JSONB,

    analyzed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Call Insights (Generated by AI)
CREATE TABLE call_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES call_analyses(id) ON DELETE CASCADE,

    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('objection_handling', 'rapport_building', 'closing_technique', 'discovery', 'value_proposition')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    improvement_tip TEXT,
    xp_earned INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- QUESTS & MISSIONS
-- ============================================================================

-- Quest Templates
CREATE TABLE quest_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Quest Info
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),

    -- Requirements
    objective_type VARCHAR(50) NOT NULL, -- 'calls', 'meetings', 'pipeline', 'training', etc.
    objective_count INTEGER NOT NULL,
    time_limit_hours INTEGER, -- NULL = no time limit

    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    coins_reward INTEGER DEFAULT 0,

    -- Metadata
    is_repeatable BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Quests (Active Instances)
CREATE TABLE user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES quest_templates(id) ON DELETE CASCADE,

    -- Progress
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,

    -- Timing
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- LEADERBOARDS & COMPETITION
-- ============================================================================

-- Leaderboard Periods
CREATE TABLE leaderboard_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    is_current BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(workspace_id, period_type, start_date)
);

-- Leaderboard Entries
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_id UUID NOT NULL REFERENCES leaderboard_periods(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Rankings
    rank_position INTEGER NOT NULL,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('xp', 'calls', 'meetings', 'pipeline', 'streak')),
    metric_value DECIMAL(15,2) NOT NULL,

    -- Metadata
    rank_change INTEGER DEFAULT 0, -- +/- from previous period

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(period_id, user_id, metric_type)
);

-- ============================================================================
-- SHOP & VIRTUAL ECONOMY
-- ============================================================================

-- Shop Items
CREATE TABLE shop_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Item Info
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('cosmetic', 'power_up', 'tool', 'subscription')),

    -- Pricing
    coin_price INTEGER NOT NULL DEFAULT 0,
    real_price_cents INTEGER, -- For premium items

    -- Inventory
    is_limited BOOLEAN DEFAULT FALSE,
    stock_quantity INTEGER, -- NULL = unlimited
    max_per_user INTEGER DEFAULT 1,

    -- Metadata
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Purchases
CREATE TABLE user_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,

    -- Purchase Info
    coins_spent INTEGER DEFAULT 0,
    real_money_spent_cents INTEGER DEFAULT 0,
    quantity INTEGER DEFAULT 1,

    -- Status
    is_active BOOLEAN DEFAULT TRUE, -- For time-limited items
    expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS & ACTIVITY
-- ============================================================================

-- Activity Feed
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Activity Details
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

-- User Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Notification Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('achievement', 'quest', 'leaderboard', 'system', 'social')),

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Actions
    action_url TEXT,
    action_label VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

-- Daily User Statistics
CREATE TABLE daily_user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,

    -- Daily Metrics
    calls_made INTEGER DEFAULT 0,
    meetings_held INTEGER DEFAULT 0,
    xp_gained INTEGER DEFAULT 0,
    coins_earned INTEGER DEFAULT 0,
    training_sessions INTEGER DEFAULT 0,

    -- Performance
    avg_call_score DECIMAL(5,2),
    total_call_duration INTEGER DEFAULT 0, -- Seconds
    pipeline_added DECIMAL(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, date)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core entity indexes
CREATE INDEX idx_users_workspace_id ON users(workspace_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_aircall_user_id ON users(aircall_user_id);

-- Player stats indexes
CREATE INDEX idx_player_stats_level ON player_stats(level DESC);
CREATE INDEX idx_player_stats_xp ON player_stats(xp DESC);

-- XP transactions indexes
CREATE INDEX idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions(created_at DESC);

-- Achievement indexes
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_completed ON user_achievements(is_completed);

-- Call analysis indexes
CREATE INDEX idx_calls_user_id ON calls(user_id);
CREATE INDEX idx_calls_aircall_id ON calls(aircall_call_id);
CREATE INDEX idx_calls_started_at ON calls(started_at DESC);
CREATE INDEX idx_call_analyses_call_id ON call_analyses(call_id);
CREATE INDEX idx_call_analyses_user_id ON call_analyses(user_id);
CREATE INDEX idx_call_analyses_score ON call_analyses(game_score DESC);

-- Leaderboard indexes
CREATE INDEX idx_leaderboard_entries_period_metric ON leaderboard_entries(period_id, metric_type, rank_position);
CREATE INDEX idx_leaderboard_entries_user ON leaderboard_entries(user_id);

-- Activity and notification indexes
CREATE INDEX idx_activities_workspace_created ON activities(workspace_id, created_at DESC);
CREATE INDEX idx_activities_user_created ON activities(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- Daily stats indexes
CREATE INDEX idx_daily_stats_user_date ON daily_user_stats(user_id, date DESC);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON player_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_questions_updated_at BEFORE UPDATE ON training_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_items_updated_at BEFORE UPDATE ON shop_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA INSERTS
-- ============================================================================

-- Insert default workspace
INSERT INTO workspaces (name, slug, description) VALUES
('Pipeline Heroes Demo', 'demo', 'Demo workspace for Pipeline Heroes');

-- Insert default achievements
INSERT INTO achievements (name, slug, description, category, rarity, requirement_type, requirement_value, requirement_field, xp_reward, coins_reward, icon) VALUES
('First Call', 'first_call', 'Make your first sales call', 'calls', 'common', 'count', 1, 'calls_completed', 50, 10, '📞'),
('Call Veteran', 'call_veteran', 'Complete 50 sales calls', 'calls', 'uncommon', 'count', 50, 'calls_completed', 250, 50, '🎯'),
('Call Master', 'call_master', 'Complete 250 sales calls', 'calls', 'rare', 'count', 250, 'calls_completed', 1000, 200, '🏆'),
('Rapport Builder', 'rapport_builder', 'Achieve 80+ rapport score on 10 calls', 'calls', 'uncommon', 'score', 10, 'rapport_building_score', 200, 40, '❤️'),
('Objection Crusher', 'objection_crusher', 'Score 90+ on objection handling 5 times', 'calls', 'rare', 'score', 5, 'objection_handling_score', 300, 60, '⚡'),
('Training Rookie', 'training_rookie', 'Complete 10 training sessions', 'training', 'common', 'count', 10, 'training_sessions_completed', 100, 20, '🎓'),
('Streak Warrior', 'streak_warrior', 'Maintain a 7-day activity streak', 'streak', 'uncommon', 'streak', 7, 'current_streak', 150, 30, '🔥'),
('Pipeline Builder', 'pipeline_builder', 'Generate $100,000 in pipeline value', 'pipeline', 'rare', 'value', 100000, 'total_pipeline_value', 500, 100, '💰');

-- Insert training categories
INSERT INTO training_categories (name, slug, description, icon, color) VALUES
('Objection Handling', 'objection_handling', 'Learn to overcome customer objections', '🛡️', '#FF6B6B'),
('Discovery Questions', 'discovery', 'Master the art of asking the right questions', '🔍', '#4ECDC4'),
('Closing Techniques', 'closing', 'Close deals with confidence and skill', '🎯', '#45B7D1'),
('Rapport Building', 'rapport', 'Build strong relationships with prospects', '🤝', '#96CEB4'),
('Value Proposition', 'value_prop', 'Communicate value effectively', '💎', '#FFEAA7');