interface PlayerBehaviorPattern {
  userId: string
  sessionId: string
  questionId: number
  timeSpent: number
  attempts: number
  hintsUsed: number
  successRate: number
  averageTime: number
  difficultyLevel: number
  timestamp: number
  behaviorType: 'speed_demon' | 'careful' | 'struggler' | 'explorer' | 'perfectionist' | 'casual'
}

interface DifficultyAdjustment {
  userId: string
  currentDifficulty: number
  recommendedDifficulty: number
  adjustmentReason: string
  adjustments: {
    timeLimit: number
    hintsAvailable: number
    questionComplexity: number
    skipPenalty: number
  }
  pattern: string
  confidence: number
}

interface BehaviorAnalysis {
  userId: string
  overallPattern: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  engagementLevel: 'low' | 'medium' | 'high'
}

export class DynamicDifficultyManager {
  private behaviorPatterns: Map<string, PlayerBehaviorPattern[]> = new Map()
  private difficultyHistory: Map<string, DifficultyAdjustment[]> = new Map()
  private analysisCache: Map<string, BehaviorAnalysis> = new Map()
  private behaviorWeights: Record<string, number> = {
    speed_demon: 0.8,
    careful: 0.3,
    struggler: -0.5,
    explorer: 0.1,
    perfectionist: 0.4,
    casual: 0.0
  }

  // Track player behavior
  trackPlayerBehavior(
    userId: string,
    sessionId: string,
    questionId: number,
    timeSpent: number,
    attempts: number,
    hintsUsed: number,
    success: boolean,
    currentDifficulty: number
  ): void {
    const pattern: PlayerBehaviorPattern = {
      userId,
      sessionId,
      questionId,
      timeSpent,
      attempts,
      hintsUsed,
      successRate: success ? 1 : 0,
      averageTime: timeSpent,
      difficultyLevel: currentDifficulty,
      timestamp: Date.now(),
      behaviorType: this.classifyBehavior(timeSpent, attempts, hintsUsed, success)
    }

    if (!this.behaviorPatterns.has(userId)) {
      this.behaviorPatterns.set(userId, [])
    }

    const userPatterns = this.behaviorPatterns.get(userId)!
    userPatterns.push(pattern)

    // Keep only last 50 patterns per user
    if (userPatterns.length > 50) {
      userPatterns.shift()
    }

    // Analyze and adjust difficulty
    this.analyzeAndAdjustDifficulty(userId)
  }

  // Classify player behavior type
  private classifyBehavior(
    timeSpent: number,
    attempts: number,
    hintsUsed: number,
    success: boolean
  ): PlayerBehaviorPattern['behaviorType'] {
    if (timeSpent < 10000 && attempts === 1 && !hintsUsed && success) {
      return 'speed_demon'
    } else if (timeSpent > 60000 && attempts <= 3 && hintsUsed === 0) {
      return 'careful'
    } else if (attempts > 5 || hintsUsed > 2) {
      return 'struggler'
    } else if (attempts >= 2 && hintsUsed >= 1 && timeSpent > 30000) {
      return 'explorer'
    } else if (timeSpent > 30000 && attempts === 1 && hintsUsed === 0 && success) {
      return 'perfectionist'
    } else {
      return 'casual'
    }
  }

  // Analyze behavior and adjust difficulty
  private analyzeAndAdjustDifficulty(userId: string): void {
    const patterns = this.behaviorPatterns.get(userId) || []
    if (patterns.length < 5) return // Need sufficient data

    const recentPatterns = patterns.slice(-10) // Last 10 interactions
    const analysis = this.analyzePlayerBehavior(userId, recentPatterns)
    const adjustment = this.calculateDifficultyAdjustment(analysis)

    // Store adjustment history
    if (!this.difficultyHistory.has(userId)) {
      this.difficultyHistory.set(userId, [])
    }
    this.difficultyHistory.get(userId)!.push(adjustment)

    // Keep only last 20 adjustments
    const history = this.difficultyHistory.get(userId)!
    if (history.length > 20) {
      history.shift()
    }

    // Cache analysis
    this.analysisCache.set(userId, analysis)
  }

  // Analyze player behavior
  private analyzePlayerBehavior(
    userId: string,
    patterns: PlayerBehaviorPattern[]
  ): BehaviorAnalysis {
    // Calculate metrics
    const avgTimeSpent = patterns.reduce((sum, p) => sum + p.timeSpent, 0) / patterns.length
    const avgAttempts = patterns.reduce((sum, p) => sum + p.attempts, 0) / patterns.length
    const avgHintsUsed = patterns.reduce((sum, p) => sum + p.hintsUsed, 0) / patterns.length
    const successRate = patterns.reduce((sum, p) => sum + p.successRate, 0) / patterns.length

    // Determine behavior type distribution
    const behaviorCounts = patterns.reduce(
      (counts, p) => {
        counts[p.behaviorType] = (counts[p.behaviorType] || 0) + 1
        return counts
      },
      {} as Record<string, number>
    )

    const dominantBehavior =
      Object.entries(behaviorCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'casual'

    // Determine skill level
    let skillLevel: BehaviorAnalysis['skillLevel'] = 'beginner'
    if (successRate > 0.8 && avgAttempts < 2 && avgHintsUsed < 1) {
      skillLevel = 'expert'
    } else if (successRate > 0.6 && avgAttempts < 3 && avgHintsUsed < 2) {
      skillLevel = 'advanced'
    } else if (successRate > 0.4 && avgAttempts < 4) {
      skillLevel = 'intermediate'
    }

    // Determine engagement level
    let engagementLevel: BehaviorAnalysis['engagementLevel'] = 'low'
    if (avgTimeSpent > 30000 && avgAttempts > 2) {
      engagementLevel = 'high'
    } else if (avgTimeSpent > 15000 && avgAttempts > 1) {
      engagementLevel = 'medium'
    }

    // Generate strengths and weaknesses
    const strengths: string[] = []
    const weaknesses: string[] = []

    if (successRate > 0.7) strengths.push('High success rate')
    if (avgTimeSpent < 20000) strengths.push('Quick problem solving')
    if (avgHintsUsed < 1) strengths.push('Independent thinking')
    if (avgAttempts < 2) strengths.push('Accurate responses')

    if (successRate < 0.3) weaknesses.push('Low success rate')
    if (avgTimeSpent > 60000) weaknesses.push('Slow completion')
    if (avgHintsUsed > 2) weaknesses.push('Relies on hints')
    if (avgAttempts > 4) weaknesses.push('Multiple attempts needed')

    // Generate recommendations
    const recommendations: string[] = []
    if (dominantBehavior === 'speed_demon') {
      recommendations.push('Consider harder time-limited challenges')
    } else if (dominantBehavior === 'struggler') {
      recommendations.push('Provide more hints and easier content')
    } else if (dominantBehavior === 'explorer') {
      recommendations.push('Offer complex puzzles with multiple solutions')
    } else if (dominantBehavior === 'perfectionist') {
      recommendations.push('Provide precision-based challenges')
    }

    return {
      userId,
      overallPattern: dominantBehavior,
      strengths,
      weaknesses,
      recommendations,
      skillLevel,
      engagementLevel
    }
  }

  // Calculate difficulty adjustment
  private calculateDifficultyAdjustment(analysis: BehaviorAnalysis): DifficultyAdjustment {
    const baseDifficulty = this.getBaseDifficulty(analysis.skillLevel)
    let adjustment = 0
    const reasons: string[] = []

    // Adjust based on success rate
    if (analysis.engagementLevel === 'high' && analysis.overallPattern === 'struggler') {
      adjustment -= 0.2
      reasons.push('High engagement but struggling - reduce difficulty')
    } else if (analysis.engagementLevel === 'low' && analysis.overallPattern === 'speed_demon') {
      adjustment += 0.3
      reasons.push('Low engagement for speed demon - increase difficulty')
    }

    // Adjust based on skill level
    if (analysis.skillLevel === 'expert' && analysis.engagementLevel === 'medium') {
      adjustment += 0.2
      reasons.push('Expert player with medium engagement - increase challenge')
    } else if (analysis.skillLevel === 'beginner' && analysis.engagementLevel === 'high') {
      adjustment -= 0.1
      reasons.push('Beginner with high engagement - ensure success')
    }

    // Apply behavior-based adjustment
    adjustment += this.behaviorWeights[analysis.overallPattern] || 0

    const recommendedDifficulty = Math.max(0.1, Math.min(1.0, baseDifficulty + adjustment))

    return {
      userId: analysis.userId,
      currentDifficulty: baseDifficulty,
      recommendedDifficulty,
      adjustmentReason: reasons.join('; ') || 'Behavior-based adjustment',
      adjustments: {
        timeLimit: this.calculateTimeLimit(recommendedDifficulty),
        hintsAvailable: this.calculateHintsAvailable(recommendedDifficulty),
        questionComplexity: recommendedDifficulty,
        skipPenalty: this.calculateSkipPenalty(recommendedDifficulty)
      },
      pattern: analysis.overallPattern,
      confidence: this.calculateConfidence(analysis)
    }
  }

  // Get base difficulty for skill level
  private getBaseDifficulty(skillLevel: BehaviorAnalysis['skillLevel']): number {
    const difficultyMap = {
      beginner: 0.3,
      intermediate: 0.5,
      advanced: 0.7,
      expert: 0.9
    }
    return difficultyMap[skillLevel] || 0.5
  }

  // Calculate time limit based on difficulty
  private calculateTimeLimit(difficulty: number): number {
    return Math.max(5000, 60000 - difficulty * 50000) // 5s to 60s
  }

  // Calculate hints available based on difficulty
  private calculateHintsAvailable(difficulty: number): number {
    return Math.max(0, Math.floor(5 - difficulty * 4)) // 0 to 5 hints
  }

  // Calculate skip penalty based on difficulty
  private calculateSkipPenalty(difficulty: number): number {
    return Math.floor(1 + difficulty * 2) // 1 to 3 skips penalty
  }

  // Calculate confidence in adjustment
  private calculateConfidence(analysis: BehaviorAnalysis): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence with more data points
    const patterns = this.behaviorPatterns.get(analysis.userId) || []
    if (patterns.length >= 20) confidence += 0.2
    else if (patterns.length >= 10) confidence += 0.1

    // Increase confidence with consistent behavior
    const behaviorCounts = patterns.reduce(
      (counts, p) => {
        counts[p.behaviorType] = (counts[p.behaviorType] || 0) + 1
        return counts
      },
      {} as Record<string, number>
    )

    const dominantCount = Math.max(...Object.values(behaviorCounts))
    const totalCount = patterns.length
    if (dominantCount / totalCount > 0.7) confidence += 0.2
    else if (dominantCount / totalCount > 0.5) confidence += 0.1

    return Math.min(1.0, confidence)
  }

  // Get current difficulty adjustment for user
  getDifficultyAdjustment(userId: string): DifficultyAdjustment | null {
    const history = this.difficultyHistory.get(userId) || []
    return history.length > 0 ? history[history.length - 1] : null
  }

  // Get behavior analysis for user
  getBehaviorAnalysis(userId: string): BehaviorAnalysis | null {
    return this.analysisCache.get(userId) || null
  }

  // Get personalized question parameters
  getPersonalizedParameters(userId: string): {
    timeLimit: number
    hintsAvailable: number
    difficulty: number
    skipPenalty: number
    recommendedCategories: string[]
  } | null {
    const adjustment = this.getDifficultyAdjustment(userId)
    if (!adjustment) return null

    const analysis = this.getBehaviorAnalysis(userId)
    if (!analysis) return null

    const recommendedCategories = this.getRecommendedCategories(analysis)

    return {
      timeLimit: adjustment.adjustments.timeLimit,
      hintsAvailable: adjustment.adjustments.hintsAvailable,
      difficulty: adjustment.recommendedDifficulty,
      skipPenalty: adjustment.adjustments.skipPenalty,
      recommendedCategories
    }
  }

  // Get recommended categories based on behavior
  private getRecommendedCategories(analysis: BehaviorAnalysis): string[] {
    const categories: string[] = []

    if (analysis.overallPattern === 'speed_demon') {
      categories.push('time-bomb', 'speed')
    } else if (analysis.overallPattern === 'explorer') {
      categories.push('secret', 'trick', 'interactive')
    } else if (analysis.overallPattern === 'perfectionist') {
      categories.push('knowledge', 'precision')
    } else if (analysis.overallPattern === 'struggler') {
      categories.push('basic', 'tutorial')
    }

    // Add skill-level appropriate categories
    if (analysis.skillLevel === 'beginner') {
      categories.push('constitution', 'basic')
    } else if (analysis.skillLevel === 'expert') {
      categories.push('secret', 'advanced')
    }

    return categories.length > 0 ? categories : ['mixed']
  }

  // Clear user data (for privacy)
  clearUserData(userId: string): void {
    this.behaviorPatterns.delete(userId)
    this.difficultyHistory.delete(userId)
    this.analysisCache.delete(userId)
  }

  // Get system-wide analytics
  getSystemAnalytics(): {
    totalUsers: number
    behaviorDistribution: Record<string, number>
    skillLevelDistribution: Record<string, number>
    averageDifficulty: number
    engagementMetrics: {
      high: number
      medium: number
      low: number
    }
  } {
    const allAnalyses = Array.from(this.analysisCache.values())

    const behaviorDistribution = allAnalyses.reduce(
      (dist, analysis) => {
        dist[analysis.overallPattern] = (dist[analysis.overallPattern] || 0) + 1
        return dist
      },
      {} as Record<string, number>
    )

    const skillLevelDistribution = allAnalyses.reduce(
      (dist, analysis) => {
        dist[analysis.skillLevel] = (dist[analysis.skillLevel] || 0) + 1
        return dist
      },
      {} as Record<string, number>
    )

    const engagementMetrics = allAnalyses.reduce(
      (metrics, analysis) => {
        metrics.high = (metrics.high || 0) + (analysis.engagementLevel === 'high' ? 1 : 0)
        metrics.medium = (metrics.medium || 0) + (analysis.engagementLevel === 'medium' ? 1 : 0)
        metrics.low = (metrics.low || 0) + (analysis.engagementLevel === 'low' ? 1 : 0)
        return metrics
      },
      {} as { high: number; medium: number; low: number }
    )

    const allAdjustments = Array.from(this.difficultyHistory.values()).flat()
    const averageDifficulty =
      allAdjustments.length > 0
        ? allAdjustments.reduce((sum, adj) => sum + adj.recommendedDifficulty, 0) /
          allAdjustments.length
        : 0.5

    return {
      totalUsers: this.behaviorPatterns.size,
      behaviorDistribution,
      skillLevelDistribution,
      averageDifficulty,
      engagementMetrics
    }
  }
}

export const dynamicDifficultyManager = new DynamicDifficultyManager()
