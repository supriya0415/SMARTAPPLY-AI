import { UserProfile, CareerAssessmentData } from '../types'
import { CareerProfile, SkillRequirement } from '../data/careerDatabase'
import { SemanticSkillAnalyzer, SkillMatchResult } from './semanticSkillAnalyzer'

export interface ScoringWeights {
  skillMatch: number
  interestAlignment: number
  experienceRelevance: number
  valueAlignment: number
  marketViability: number
  learningCurve: number
}

export interface ComponentScore {
  score: number
  weight: number
  confidence: number
  factors: ScoringFactor[]
  reasoning: string[]
}

export interface ScoringFactor {
  name: string
  value: number
  impact: number
  description: string
}

export interface DetailedFitScore {
  overallFit: number
  components: {
    skillMatch: ComponentScore
    interestAlignment: ComponentScore
    experienceRelevance: ComponentScore
    valueAlignment: ComponentScore
    marketViability: ComponentScore
    learningCurve: ComponentScore
  }
  confidence: number
  reasoning: string[]
  matchQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

export class AdvancedScoringEngine {
  private skillAnalyzer: SemanticSkillAnalyzer

  constructor() {
    this.skillAnalyzer = new SemanticSkillAnalyzer()
  }

  /**
   * Calculate dynamic weights based on user profile completeness and characteristics
   */
  calculateDynamicWeights(
    userProfile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): ScoringWeights {
    const baseWeights: ScoringWeights = {
      skillMatch: 0.30,
      interestAlignment: 0.25,
      experienceRelevance: 0.20,
      valueAlignment: 0.15,
      marketViability: 0.05,
      learningCurve: 0.05
    }

    // Adjust based on assessment data availability
    if (assessmentData) {
      baseWeights.interestAlignment += 0.10
      baseWeights.valueAlignment += 0.05
      baseWeights.skillMatch -= 0.10
      baseWeights.experienceRelevance -= 0.05
    }

    // Adjust based on experience level
    const experienceYears = this.calculateExperienceYears(userProfile)
    if (experienceYears > 5) {
      // Experienced users - weight experience and skills more heavily
      baseWeights.experienceRelevance += 0.10
      baseWeights.skillMatch += 0.05
      baseWeights.learningCurve -= 0.05
      baseWeights.interestAlignment -= 0.10
    } else if (experienceYears < 2) {
      // New graduates - weight learning curve and interests more
      baseWeights.learningCurve += 0.10
      baseWeights.interestAlignment += 0.05
      baseWeights.experienceRelevance -= 0.15
    }

    // Adjust based on profile completeness
    const profileCompleteness = this.calculateProfileCompleteness(userProfile, assessmentData)
    if (profileCompleteness < 0.5) {
      // Incomplete profile - rely more on basic matching
      baseWeights.skillMatch += 0.10
      baseWeights.interestAlignment -= 0.05
      baseWeights.valueAlignment -= 0.05
    }

    // Normalize weights to sum to 1.0
    return this.normalizeWeights(baseWeights)
  }

  /**
   * Calculate detailed fit score for a career
   */
  calculateDetailedFitScore(
    userProfile: UserProfile,
    careerProfile: CareerProfile,
    assessmentData?: CareerAssessmentData
  ): DetailedFitScore {
    const weights = this.calculateDynamicWeights(userProfile, assessmentData)
    
    // Calculate individual component scores
    const skillMatch = this.calculateSkillMatchScore(userProfile, careerProfile)
    const interestAlignment = this.calculateInterestAlignmentScore(userProfile, careerProfile, assessmentData)
    const experienceRelevance = this.calculateExperienceRelevanceScore(userProfile, careerProfile)
    const valueAlignment = this.calculateValueAlignmentScore(userProfile, careerProfile, assessmentData)
    const marketViability = this.calculateMarketViabilityScore(careerProfile)
    const learningCurve = this.calculateLearningCurveScore(userProfile, careerProfile)

    // Apply weights to calculate overall fit
    const overallFit = Math.round(
      skillMatch.score * weights.skillMatch +
      interestAlignment.score * weights.interestAlignment +
      experienceRelevance.score * weights.experienceRelevance +
      valueAlignment.score * weights.valueAlignment +
      marketViability.score * weights.marketViability +
      learningCurve.score * weights.learningCurve
    )

    // Calculate overall confidence
    const confidence = (
      skillMatch.confidence * weights.skillMatch +
      interestAlignment.confidence * weights.interestAlignment +
      experienceRelevance.confidence * weights.experienceRelevance +
      valueAlignment.confidence * weights.valueAlignment +
      marketViability.confidence * weights.marketViability +
      learningCurve.confidence * weights.learningCurve
    )

    // Generate overall reasoning
    const reasoning = this.generateOverallReasoning(
      { skillMatch, interestAlignment, experienceRelevance, valueAlignment, marketViability, learningCurve },
      weights,
      overallFit
    )

    // Determine match quality
    const matchQuality = this.determineMatchQuality(overallFit, confidence)

    return {
      overallFit: Math.min(100, Math.max(0, overallFit)),
      components: {
        skillMatch: { ...skillMatch, weight: weights.skillMatch },
        interestAlignment: { ...interestAlignment, weight: weights.interestAlignment },
        experienceRelevance: { ...experienceRelevance, weight: weights.experienceRelevance },
        valueAlignment: { ...valueAlignment, weight: weights.valueAlignment },
        marketViability: { ...marketViability, weight: weights.marketViability },
        learningCurve: { ...learningCurve, weight: weights.learningCurve }
      },
      confidence,
      reasoning,
      matchQuality
    }
  }

  /**
   * Calculate skill match score using semantic analysis
   */
  private calculateSkillMatchScore(userProfile: UserProfile, careerProfile: CareerProfile): ComponentScore {
    const userSkills = [...userProfile.skills]
    if (userProfile.resume) {
      userSkills.push(...userProfile.resume.extractedInfo.skills)
    }

    const requiredSkills = careerProfile.requiredSkills.map(s => s.skill)
    const preferredSkills = careerProfile.preferredSkills.map(s => s.skill)
    const allCareerSkills = [...requiredSkills, ...preferredSkills]

    const skillMatchResult = this.skillAnalyzer.analyzeSkillMatches(userSkills, allCareerSkills)
    
    // Calculate weighted score based on skill importance
    let totalScore = 0
    let totalWeight = 0
    const factors: ScoringFactor[] = []
    const reasoning: string[] = []

    // Score required skills
    careerProfile.requiredSkills.forEach(skillReq => {
      const match = this.findBestSkillMatch(skillMatchResult, skillReq.skill)
      const importance = this.getSkillImportanceWeight(skillReq.importance)
      
      if (match) {
        totalScore += match.similarity * importance * 100
        totalWeight += importance
        factors.push({
          name: `Required: ${skillReq.skill}`,
          value: match.similarity,
          impact: importance,
          description: `${match.matchType} match with ${match.userSkill}`
        })
        reasoning.push(`Strong match for required skill: ${skillReq.skill}`)
      } else {
        totalWeight += importance
        factors.push({
          name: `Missing: ${skillReq.skill}`,
          value: 0,
          impact: importance,
          description: `No match found for required skill`
        })
        reasoning.push(`Missing required skill: ${skillReq.skill}`)
      }
    })

    // Score preferred skills (lower weight)
    careerProfile.preferredSkills.forEach(skillReq => {
      const match = this.findBestSkillMatch(skillMatchResult, skillReq.skill)
      const importance = this.getSkillImportanceWeight(skillReq.importance) * 0.5 // Half weight for preferred
      
      if (match) {
        totalScore += match.similarity * importance * 100
        totalWeight += importance
        factors.push({
          name: `Preferred: ${skillReq.skill}`,
          value: match.similarity,
          impact: importance,
          description: `${match.matchType} match with ${match.userSkill}`
        })
      }
    })

    const score = totalWeight > 0 ? totalScore / totalWeight : 0
    const confidence = this.calculateSkillMatchConfidence(skillMatchResult, careerProfile.requiredSkills.length)

    return {
      score: Math.min(100, Math.max(0, score)),
      weight: 0, // Will be set by caller
      confidence,
      factors,
      reasoning
    }
  }

  /**
   * Calculate interest alignment score
   */
  private calculateInterestAlignmentScore(
    userProfile: UserProfile,
    careerProfile: CareerProfile,
    assessmentData?: CareerAssessmentData
  ): ComponentScore {
    const factors: ScoringFactor[] = []
    const reasoning: string[] = []
    let score = 50 // Base score

    if (assessmentData) {
      // Use assessment data for more accurate matching
      const interestKeywords = assessmentData.interests.join(' ').toLowerCase()
      const careerKeywords = careerProfile.keywords.join(' ').toLowerCase()
      const careerDescription = careerProfile.description.toLowerCase()

      // Check direct interest matches
      let interestMatches = 0
      assessmentData.interests.forEach(interest => {
        if (careerKeywords.includes(interest.toLowerCase()) || 
            careerDescription.includes(interest.toLowerCase())) {
          interestMatches++
          factors.push({
            name: `Interest: ${interest}`,
            value: 1,
            impact: 0.3,
            description: `Career aligns with your interest in ${interest}`
          })
          reasoning.push(`Career matches your interest in ${interest}`)
        }
      })

      score = Math.min(95, 50 + (interestMatches / assessmentData.interests.length) * 50)
    } else {
      // Use basic career interest from profile
      if (userProfile.careerInterest) {
        const userInterest = userProfile.careerInterest.toLowerCase()
        const careerTitle = careerProfile.title.toLowerCase()
        const careerCategory = careerProfile.category.toLowerCase()

        if (careerTitle.includes(userInterest) || careerCategory.includes(userInterest)) {
          score = 85
          factors.push({
            name: 'Career Interest Match',
            value: 0.85,
            impact: 1.0,
            description: `Career aligns with your stated interest in ${userProfile.careerInterest}`
          })
          reasoning.push(`Career matches your stated interest in ${userProfile.careerInterest}`)
        }
      }
    }

    return {
      score,
      weight: 0,
      confidence: assessmentData ? 0.9 : 0.6,
      factors,
      reasoning
    }
  }

  /**
   * Calculate experience relevance score
   */
  private calculateExperienceRelevanceScore(
    userProfile: UserProfile,
    careerProfile: CareerProfile
  ): ComponentScore {
    const factors: ScoringFactor[] = []
    const reasoning: string[] = []
    let score = 50

    if (userProfile.resume && userProfile.resume.extractedInfo.experience.length > 0) {
      const experienceYears = userProfile.resume.extractedInfo.experience.length
      const careerLevel = careerProfile.experienceLevel

      // Calculate experience alignment
      const experienceAlignment = this.calculateExperienceAlignment(experienceYears, careerLevel)
      score = experienceAlignment * 100

      factors.push({
        name: 'Experience Level',
        value: experienceAlignment,
        impact: 1.0,
        description: `${experienceYears} years experience for ${careerLevel} level role`
      })

      // Analyze experience relevance
      const relevantExperience = userProfile.resume.extractedInfo.experience.filter(exp => {
        const expDescription = exp.description.toLowerCase()
        const careerKeywords = careerProfile.keywords.join(' ').toLowerCase()
        return careerKeywords.split(' ').some(keyword => expDescription.includes(keyword))
      })

      if (relevantExperience.length > 0) {
        const relevanceBonus = Math.min(20, relevantExperience.length * 10)
        score += relevanceBonus
        factors.push({
          name: 'Relevant Experience',
          value: relevantExperience.length / userProfile.resume.extractedInfo.experience.length,
          impact: 0.5,
          description: `${relevantExperience.length} relevant work experiences`
        })
        reasoning.push(`You have ${relevantExperience.length} relevant work experiences`)
      }

      reasoning.push(`Your ${experienceYears} years of experience aligns well with this ${careerLevel} level role`)
    } else {
      // No experience - good for entry level, challenging for others
      if (careerProfile.experienceLevel === 'entry') {
        score = 80
        reasoning.push('This entry-level role is perfect for someone starting their career')
      } else {
        score = 30
        reasoning.push('This role typically requires more experience than you currently have')
      }
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      weight: 0,
      confidence: userProfile.resume ? 0.8 : 0.5,
      factors,
      reasoning
    }
  }

  /**
   * Calculate value alignment score
   */
  private calculateValueAlignmentScore(
    userProfile: UserProfile,
    careerProfile: CareerProfile,
    assessmentData?: CareerAssessmentData
  ): ComponentScore {
    const factors: ScoringFactor[] = []
    const reasoning: string[] = []
    let score = 50

    if (assessmentData && assessmentData.values.length > 0) {
      const careerValues = this.extractCareerValues(careerProfile)
      const userValues = assessmentData.values.map(v => v.toLowerCase())

      let valueMatches = 0
      careerValues.forEach(careerValue => {
        if (userValues.some(userValue => 
          userValue.includes(careerValue) || careerValue.includes(userValue)
        )) {
          valueMatches++
          factors.push({
            name: `Value: ${careerValue}`,
            value: 1,
            impact: 0.4,
            description: `Career supports your value of ${careerValue}`
          })
          reasoning.push(`Career aligns with your value of ${careerValue}`)
        }
      })

      score = Math.min(95, 40 + (valueMatches / Math.max(careerValues.length, 1)) * 60)
    }

    return {
      score,
      weight: 0,
      confidence: assessmentData ? 0.8 : 0.4,
      factors,
      reasoning
    }
  }

  /**
   * Calculate market viability score
   */
  private calculateMarketViabilityScore(careerProfile: CareerProfile): ComponentScore {
    const factors: ScoringFactor[] = []
    const reasoning: string[] = []

    const demandScore = careerProfile.industryTrends.demand === 'high' ? 90 : 
                       careerProfile.industryTrends.demand === 'medium' ? 70 : 50
    
    const growthScore = Math.min(100, 50 + careerProfile.industryTrends.growth * 2)
    
    const competitionScore = careerProfile.industryTrends.competitiveness === 'low' ? 90 :
                            careerProfile.industryTrends.competitiveness === 'medium' ? 70 : 50

    const score = (demandScore + growthScore + competitionScore) / 3

    factors.push(
      {
        name: 'Market Demand',
        value: demandScore / 100,
        impact: 0.4,
        description: `${careerProfile.industryTrends.demand} demand in job market`
      },
      {
        name: 'Industry Growth',
        value: growthScore / 100,
        impact: 0.4,
        description: `${careerProfile.industryTrends.growth}% projected growth`
      },
      {
        name: 'Competition Level',
        value: competitionScore / 100,
        impact: 0.2,
        description: `${careerProfile.industryTrends.competitiveness} competition level`
      }
    )

    reasoning.push(`Strong market outlook with ${careerProfile.industryTrends.demand} demand and ${careerProfile.industryTrends.growth}% growth`)

    return {
      score,
      weight: 0,
      confidence: 0.7,
      factors,
      reasoning
    }
  }

  /**
   * Calculate learning curve score
   */
  private calculateLearningCurveScore(
    userProfile: UserProfile,
    careerProfile: CareerProfile
  ): ComponentScore {
    const factors: ScoringFactor[] = []
    const reasoning: string[] = []

    // Calculate skill gaps
    const userSkills = [...userProfile.skills]
    if (userProfile.resume) {
      userSkills.push(...userProfile.resume.extractedInfo.skills)
    }

    const requiredSkills = careerProfile.requiredSkills
    const missingCriticalSkills = requiredSkills.filter(skill => 
      skill.importance === 'critical' && 
      !this.hasSkillMatch(userSkills, skill.skill)
    ).length

    const missingImportantSkills = requiredSkills.filter(skill => 
      skill.importance === 'important' && 
      !this.hasSkillMatch(userSkills, skill.skill)
    ).length

    // Calculate learning curve based on missing skills
    const totalCritical = requiredSkills.filter(s => s.importance === 'critical').length
    const totalImportant = requiredSkills.filter(s => s.importance === 'important').length

    const criticalGapRatio = totalCritical > 0 ? missingCriticalSkills / totalCritical : 0
    const importantGapRatio = totalImportant > 0 ? missingImportantSkills / totalImportant : 0

    // Lower score means steeper learning curve (more skills to learn)
    const score = Math.max(20, 100 - (criticalGapRatio * 60 + importantGapRatio * 30))

    factors.push({
      name: 'Skill Readiness',
      value: (totalCritical + totalImportant - missingCriticalSkills - missingImportantSkills) / 
             Math.max(1, totalCritical + totalImportant),
      impact: 1.0,
      description: `${missingCriticalSkills + missingImportantSkills} skills to develop`
    })

    if (missingCriticalSkills === 0 && missingImportantSkills === 0) {
      reasoning.push('You already have most required skills - easy transition!')
    } else if (missingCriticalSkills <= 2) {
      reasoning.push('Manageable learning curve with a few key skills to develop')
    } else {
      reasoning.push('Significant learning required but achievable with dedication')
    }

    return {
      score,
      weight: 0,
      confidence: 0.8,
      factors,
      reasoning
    }
  }

  // Helper methods
  private calculateExperienceYears(userProfile: UserProfile): number {
    if (!userProfile.resume) return 0
    return userProfile.resume.extractedInfo.experience.length
  }

  private calculateProfileCompleteness(
    userProfile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): number {
    let completeness = 0
    let totalFields = 5

    if (userProfile.skills.length > 0) completeness += 0.2
    if (userProfile.careerInterest) completeness += 0.2
    if (userProfile.educationLevel) completeness += 0.2
    if (userProfile.resume) completeness += 0.2
    if (assessmentData) completeness += 0.2

    return completeness
  }

  private normalizeWeights(weights: ScoringWeights): ScoringWeights {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0)
    return {
      skillMatch: weights.skillMatch / sum,
      interestAlignment: weights.interestAlignment / sum,
      experienceRelevance: weights.experienceRelevance / sum,
      valueAlignment: weights.valueAlignment / sum,
      marketViability: weights.marketViability / sum,
      learningCurve: weights.learningCurve / sum
    }
  }

  private getSkillImportanceWeight(importance: string): number {
    switch (importance) {
      case 'critical': return 1.0
      case 'important': return 0.7
      case 'nice-to-have': return 0.3
      default: return 0.5
    }
  }

  private findBestSkillMatch(skillMatchResult: SkillMatchResult, targetSkill: string) {
    const allMatches = [
      ...skillMatchResult.exactMatches,
      ...skillMatchResult.semanticMatches,
      ...skillMatchResult.transferableMatches,
      ...skillMatchResult.fuzzyMatches
    ]

    return allMatches.find(match => 
      match.careerSkill.toLowerCase() === targetSkill.toLowerCase()
    )
  }

  private calculateSkillMatchConfidence(
    skillMatchResult: SkillMatchResult,
    requiredSkillsCount: number
  ): number {
    const exactWeight = 1.0
    const semanticWeight = 0.9
    const transferableWeight = 0.7
    const fuzzyWeight = 0.5

    const totalConfidence = 
      skillMatchResult.exactMatches.length * exactWeight +
      skillMatchResult.semanticMatches.length * semanticWeight +
      skillMatchResult.transferableMatches.length * transferableWeight +
      skillMatchResult.fuzzyMatches.length * fuzzyWeight

    return Math.min(1.0, totalConfidence / Math.max(1, requiredSkillsCount))
  }

  private calculateExperienceAlignment(experienceYears: number, careerLevel: string): number {
    const levelRequirements = {
      entry: { min: 0, max: 2, ideal: 1 },
      mid: { min: 2, max: 7, ideal: 4 },
      senior: { min: 5, max: 15, ideal: 8 }
    }

    const req = levelRequirements[careerLevel as keyof typeof levelRequirements] || levelRequirements.mid

    if (experienceYears >= req.min && experienceYears <= req.max) {
      // Within range - calculate how close to ideal
      const distanceFromIdeal = Math.abs(experienceYears - req.ideal)
      return Math.max(0.7, 1.0 - (distanceFromIdeal / req.max) * 0.3)
    } else if (experienceYears < req.min) {
      // Under-qualified
      return Math.max(0.3, 0.7 - (req.min - experienceYears) * 0.1)
    } else {
      // Over-qualified
      return Math.max(0.5, 0.9 - (experienceYears - req.max) * 0.05)
    }
  }

  private extractCareerValues(careerProfile: CareerProfile): string[] {
    const values: string[] = []
    const title = careerProfile.title.toLowerCase()
    const description = careerProfile.description.toLowerCase()
    const workStyle = careerProfile.workEnvironment.workStyle.join(' ').toLowerCase()

    const valueMap = {
      innovation: ['developer', 'engineer', 'designer', 'architect', 'ai', 'technology'],
      leadership: ['manager', 'director', 'lead', 'head', 'leadership'],
      'helping others': ['healthcare', 'teacher', 'consultant', 'advisor', 'support', 'analyst'],
      creativity: ['designer', 'artist', 'creative', 'marketing', 'content'],
      analysis: ['analyst', 'scientist', 'researcher', 'data'],
      stability: ['administrator', 'coordinator', 'specialist', 'finance'],
      flexibility: ['remote', 'freelance', 'consultant'],
      'work-life balance': ['flexible', 'remote', 'hybrid']
    }

    Object.entries(valueMap).forEach(([value, keywords]) => {
      if (keywords.some(keyword => 
        title.includes(keyword) || 
        description.includes(keyword) || 
        workStyle.includes(keyword)
      )) {
        values.push(value)
      }
    })

    return values
  }

  private hasSkillMatch(userSkills: string[], targetSkill: string): boolean {
    const match = this.skillAnalyzer.calculateSkillSimilarity(
      userSkills.join(' '), 
      targetSkill
    )
    return match.similarity > 0.5
  }

  private generateOverallReasoning(
    components: any,
    weights: ScoringWeights,
    overallFit: number
  ): string[] {
    const reasoning: string[] = []

    // Add top contributing factors
    const sortedComponents = Object.entries(components)
      .map(([name, comp]: [string, any]) => ({
        name,
        contribution: comp.score * weights[name as keyof ScoringWeights]
      }))
      .sort((a, b) => b.contribution - a.contribution)

    reasoning.push(`Overall fit score: ${overallFit}/100`)
    reasoning.push(`Top contributing factors: ${sortedComponents.slice(0, 2).map(c => c.name).join(', ')}`)

    if (overallFit >= 80) {
      reasoning.push('Excellent match - this career aligns very well with your profile')
    } else if (overallFit >= 60) {
      reasoning.push('Good match - this career has strong potential for you')
    } else if (overallFit >= 40) {
      reasoning.push('Fair match - consider this career with some skill development')
    } else {
      reasoning.push('This career may require significant preparation and skill development')
    }

    return reasoning
  }

  private determineMatchQuality(overallFit: number, confidence: number): 'excellent' | 'good' | 'fair' | 'poor' {
    const adjustedScore = overallFit * confidence

    if (adjustedScore >= 75) return 'excellent'
    if (adjustedScore >= 60) return 'good'
    if (adjustedScore >= 40) return 'fair'
    return 'poor'
  }
}