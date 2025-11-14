export interface AircallCall {
  id: number
  direct_link: string
  asset?: string
  direction: 'inbound' | 'outbound'
  missed_call_reason?: string
  status: 'initial' | 'answered' | 'done' | 'missed'
  started_at: number
  answered_at?: number
  ended_at?: number
  duration?: number
  raw_digits?: string
  voicemail?: string
  recording?: string
  user?: AircallUser
  number?: AircallNumber
  contact?: AircallContact
  tags?: AircallTag[]
  comments?: AircallComment[]
}

export interface AircallUser {
  id: number
  direct_link: string
  name: string
  email: string
  created_at: string
  time_zone: string
}

export interface AircallNumber {
  id: number
  direct_link: string
  name: string
  digits: string
  country: string
  time_zone: string
}

export interface AircallContact {
  id: number
  direct_link: string
  first_name: string
  last_name: string
  company_name?: string
  information?: string
  phone_numbers?: AircallPhoneNumber[]
  emails?: AircallEmail[]
}

export interface AircallPhoneNumber {
  id: number
  label: string
  value: string
}

export interface AircallEmail {
  id: number
  label: string
  value: string
}

export interface AircallTag {
  id: number
  name: string
  color: string
}

export interface AircallComment {
  id: number
  content: string
  posted_at: string
  user: AircallUser
}

export interface AircallTranscription {
  id: number
  call_id: number
  language: string
  confidence: number
  transcript: string
  speakers: AircallSpeaker[]
  segments: AircallSegment[]
}

export interface AircallSpeaker {
  id: string
  name: string
  type: 'agent' | 'contact'
}

export interface AircallSegment {
  id: string
  start_time: number
  end_time: number
  speaker_id: string
  text: string
  confidence: number
}

export interface AircallSentiment {
  id: number
  call_id: number
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  confidence: number
  segments: AircallSentimentSegment[]
}

export interface AircallSentimentSegment {
  start_time: number
  end_time: number
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  confidence: number
}

export interface AircallTopic {
  id: number
  call_id: number
  topics: AircallTopicItem[]
}

export interface AircallTopicItem {
  name: string
  confidence: number
  mentions: AircallTopicMention[]
}

export interface AircallTopicMention {
  start_time: number
  end_time: number
  text: string
}

export interface AircallSummary {
  id: number
  call_id: number
  summary: string
  key_points: string[]
}

export interface AircallActionItem {
  id: number
  call_id: number
  action_items: AircallActionItemDetail[]
}

export interface AircallActionItemDetail {
  description: string
  assignee?: string
  due_date?: string
  status: 'open' | 'completed'
}

export interface AircallPlaybookResult {
  id: number
  call_id: number
  playbook_name: string
  results: Record<string, any>
  score?: number
}

export interface AircallSearchParams {
  from?: string
  to?: string
  user_id?: number
  contact_id?: number
  phone_number?: string
  direction?: 'inbound' | 'outbound'
  status?: 'answered' | 'missed'
  tag?: string
  order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface AircallCallsResponse {
  calls: AircallCall[]
  meta: {
    count: number
    total: number
    current_page: number
    per_page: number
    total_pages: number
    previous_page_link?: string
    next_page_link?: string
  }
}

export interface CallAnalysis {
  call: AircallCall
  transcription?: AircallTranscription
  sentiment?: AircallSentiment
  topics?: AircallTopic
  summary?: AircallSummary
  actionItems?: AircallActionItem
  playbookResults?: AircallPlaybookResult[]
  gameScore?: number
  insights?: CallInsight[]
}

export interface CallInsight {
  type: 'objection_handling' | 'rapport_building' | 'closing_technique' | 'discovery' | 'value_proposition'
  title: string
  description: string
  score: number
  improvement_tip?: string
  xp_earned?: number
}