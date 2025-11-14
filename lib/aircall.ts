import {
  AircallCall,
  AircallCallsResponse,
  AircallSearchParams,
  AircallTranscription,
  AircallSentiment,
  AircallTopic,
  AircallSummary,
  AircallActionItem,
  AircallPlaybookResult,
  CallAnalysis,
  CallInsight
} from '@/types/aircall'

class AircallService {
  private baseUrl = 'https://api.aircall.io/v1'
  private apiId: string
  private apiToken: string

  constructor() {
    this.apiId = process.env.AIRCALL_API_ID || ''
    this.apiToken = process.env.AIRCALL_API_TOKEN || ''

    if (!this.apiId || !this.apiToken) {
      console.warn('Aircall credentials not found in environment variables')
    }
  }

  private getAuthHeaders() {
    const credentials = Buffer.from(`${this.apiId}:${this.apiToken}`).toString('base64')
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Aircall API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Aircall API request failed:', error)
      throw error
    }
  }

  async searchCalls(params: AircallSearchParams = {}): Promise<AircallCallsResponse> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const endpoint = `/calls/search?${searchParams.toString()}`
    return this.makeRequest<AircallCallsResponse>(endpoint)
  }

  async getCalls(params: AircallSearchParams = {}): Promise<AircallCallsResponse> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const endpoint = `/calls?${searchParams.toString()}`
    return this.makeRequest<AircallCallsResponse>(endpoint)
  }

  async getCall(callId: number): Promise<AircallCall> {
    return this.makeRequest<AircallCall>(`/calls/${callId}`)
  }

  async getTranscription(callId: number): Promise<AircallTranscription | null> {
    try {
      return await this.makeRequest<AircallTranscription>(`/calls/${callId}/transcription`)
    } catch (error) {
      console.warn(`No transcription available for call ${callId}:`, error)
      return null
    }
  }

  async getSentiments(callId: number): Promise<AircallSentiment | null> {
    try {
      return await this.makeRequest<AircallSentiment>(`/calls/${callId}/sentiments`)
    } catch (error) {
      console.warn(`No sentiment analysis available for call ${callId}:`, error)
      return null
    }
  }

  async getTopics(callId: number): Promise<AircallTopic | null> {
    try {
      return await this.makeRequest<AircallTopic>(`/calls/${callId}/topics`)
    } catch (error) {
      console.warn(`No topics available for call ${callId}:`, error)
      return null
    }
  }

  async getSummary(callId: number): Promise<AircallSummary | null> {
    try {
      return await this.makeRequest<AircallSummary>(`/calls/${callId}/summary`)
    } catch (error) {
      console.warn(`No summary available for call ${callId}:`, error)
      return null
    }
  }

  async getActionItems(callId: number): Promise<AircallActionItem | null> {
    try {
      return await this.makeRequest<AircallActionItem>(`/calls/${callId}/action_items`)
    } catch (error) {
      console.warn(`No action items available for call ${callId}:`, error)
      return null
    }
  }

  async getPlaybookResult(callId: number): Promise<AircallPlaybookResult | null> {
    try {
      return await this.makeRequest<AircallPlaybookResult>(`/calls/${callId}/playbook_result`)
    } catch (error) {
      console.warn(`No playbook results available for call ${callId}:`, error)
      return null
    }
  }

  async analyzeCall(callId: number): Promise<CallAnalysis> {
    try {
      const [
        call,
        transcription,
        sentiment,
        topics,
        summary,
        actionItems,
        playbookResults
      ] = await Promise.allSettled([
        this.getCall(callId),
        this.getTranscription(callId),
        this.getSentiments(callId),
        this.getTopics(callId),
        this.getSummary(callId),
        this.getActionItems(callId),
        this.getPlaybookResult(callId)
      ])

      const analysis: CallAnalysis = {
        call: call.status === 'fulfilled' ? call.value : {} as AircallCall,
        transcription: transcription.status === 'fulfilled' ? transcription.value || undefined : undefined,
        sentiment: sentiment.status === 'fulfilled' ? sentiment.value || undefined : undefined,
        topics: topics.status === 'fulfilled' ? topics.value || undefined : undefined,
        summary: summary.status === 'fulfilled' ? summary.value || undefined : undefined,
        actionItems: actionItems.status === 'fulfilled' ? actionItems.value || undefined : undefined,
        playbookResults: playbookResults.status === 'fulfilled' && playbookResults.value
          ? [playbookResults.value] : undefined
      }

      // Generate game insights and score
      analysis.insights = this.generateGameInsights(analysis)
      analysis.gameScore = this.calculateGameScore(analysis)

      return analysis
    } catch (error) {
      console.error(`Failed to analyze call ${callId}:`, error)
      throw error
    }
  }

  private generateGameInsights(analysis: CallAnalysis): CallInsight[] {
    const insights: CallInsight[] = []

    // Sentiment-based insights
    if (analysis.sentiment) {
      const positiveRatio = this.calculatePositiveSentimentRatio(analysis.sentiment)

      if (positiveRatio > 0.7) {
        insights.push({
          type: 'rapport_building',
          title: 'Excellent Rapport',
          description: 'Maintained positive sentiment throughout the call',
          score: 85 + Math.round(positiveRatio * 15),
          xp_earned: 50
        })
      } else if (positiveRatio < 0.3) {
        insights.push({
          type: 'rapport_building',
          title: 'Rapport Challenge',
          description: 'Consider working on relationship building techniques',
          score: Math.round(positiveRatio * 100),
          improvement_tip: 'Focus on active listening and empathy',
          xp_earned: 10
        })
      }
    }

    // Topic-based insights
    if (analysis.topics) {
      const salesTopics = analysis.topics.topics.filter(topic =>
        topic.name.toLowerCase().includes('price') ||
        topic.name.toLowerCase().includes('budget') ||
        topic.name.toLowerCase().includes('objection')
      )

      if (salesTopics.length > 0) {
        insights.push({
          type: 'objection_handling',
          title: 'Objection Handling',
          description: `Handled ${salesTopics.length} pricing/budget discussions`,
          score: Math.min(100, salesTopics.length * 25),
          xp_earned: salesTopics.length * 15
        })
      }
    }

    // Call duration insights
    if (analysis.call.duration) {
      const durationMinutes = analysis.call.duration / 60

      if (durationMinutes > 30) {
        insights.push({
          type: 'discovery',
          title: 'Deep Discovery',
          description: 'Extended call duration indicates thorough discovery',
          score: 75,
          xp_earned: 30
        })
      } else if (durationMinutes < 5) {
        insights.push({
          type: 'closing_technique',
          title: 'Quick Close Opportunity',
          description: 'Short call - was this a missed opportunity?',
          score: 40,
          improvement_tip: 'Consider asking more discovery questions',
          xp_earned: 5
        })
      }
    }

    // Action items insights
    if (analysis.actionItems && analysis.actionItems.action_items.length > 0) {
      insights.push({
        type: 'closing_technique',
        title: 'Clear Next Steps',
        description: `Defined ${analysis.actionItems.action_items.length} action items`,
        score: 80,
        xp_earned: 25
      })
    }

    return insights
  }

  private calculateGameScore(analysis: CallAnalysis): number {
    let score = 0
    let maxScore = 0

    // Base score for completed call
    if (analysis.call.status === 'answered') {
      score += 20
    }
    maxScore += 20

    // Sentiment score
    if (analysis.sentiment) {
      const sentimentScore = this.calculatePositiveSentimentRatio(analysis.sentiment) * 30
      score += sentimentScore
    }
    maxScore += 30

    // Duration score
    if (analysis.call.duration) {
      const durationMinutes = analysis.call.duration / 60
      const durationScore = Math.min(20, durationMinutes * 0.5)
      score += durationScore
    }
    maxScore += 20

    // Action items score
    if (analysis.actionItems) {
      const actionScore = Math.min(15, analysis.actionItems.action_items.length * 5)
      score += actionScore
    }
    maxScore += 15

    // Topics coverage score
    if (analysis.topics && analysis.topics.topics.length > 0) {
      score += Math.min(15, analysis.topics.topics.length * 3)
    }
    maxScore += 15

    return Math.round((score / maxScore) * 100)
  }

  private calculatePositiveSentimentRatio(sentiment: AircallSentiment): number {
    if (!sentiment.segments || sentiment.segments.length === 0) {
      return sentiment.sentiment === 'POSITIVE' ? 1 : sentiment.sentiment === 'NEGATIVE' ? 0 : 0.5
    }

    const positiveSegments = sentiment.segments.filter(seg => seg.sentiment === 'POSITIVE')
    return positiveSegments.length / sentiment.segments.length
  }

  async getRecentCallsForAnalysis(days: number = 7, userId?: number): Promise<CallAnalysis[]> {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const params: AircallSearchParams = {
      from: Math.floor(fromDate.getTime() / 1000).toString(),
      status: 'answered',
      order: 'desc',
      per_page: 20
    }

    if (userId) {
      params.user_id = userId
    }

    try {
      const callsResponse = await this.getCalls(params)
      const analyses = await Promise.all(
        callsResponse.calls.map(call => this.analyzeCall(call.id))
      )

      return analyses.filter(analysis => analysis.call.id)
    } catch (error) {
      console.error('Failed to get recent calls for analysis:', error)
      return []
    }
  }
}

export const aircallService = new AircallService()
export default aircallService