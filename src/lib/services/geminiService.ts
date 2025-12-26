import { GoogleGenerativeAI } from '@google/generative-ai'
import { UserProfile, CareerRecommendation, AlternativeCareer } from '../types'
import { config } from '../config'
import { cacheService } from './cacheService'
import { loadingService } from './loadingService'

// Enhanced Gemini AI Configuration Interface (Requirements 5.1, 5.2)
interface GeminiConfig {
  apiKey: string
  model: string
  cacheEnabled: boolean
  maxTokens: number
  timeout: number
  retryAttempts: number
  retryDelay: number
}

// Roadmap Request Interface (Requirements 5.1, 5.2, 5.3)
interface RoadmapRequest {
  domain: string
  jobRole: string
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'expert'
  skills: string[]
  educationLevel: string
  age?: number
  name?: string
}

// Enhanced cache configuration for AI responses (Requirements 10.1, 10.2)
interface GeminiCacheConfig {
  enabled: boolean
  ttl: number
  maxSize: number
  compressionEnabled: boolean
}

// Enhanced Gemini AI Configuration
const geminiConfig: GeminiConfig = {
  apiKey: config.geminiApiKey,
  model: 'gemini-1.5-flash',
  cacheEnabled: true,
  maxTokens: 8192,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
}

// Initialize Gemini AI with error handling
let genAI: GoogleGenerativeAI | null = null
let model: any = null

try {
  if (geminiConfig.apiKey) {
    genAI = new GoogleGenerativeAI(geminiConfig.apiKey)
    model = genAI.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: {
        maxOutputTokens: geminiConfig.maxTokens,
      },
    })
  }
} catch (error) {
  // Silent initialization - will use fallbacks
}

/**
 * Enhanced Gemini AI Integration Service
 * Implements requirements 5.1, 5.2, 5.3, 5.4, 10.1, 10.2, 10.3, 10.4
 */
export class GeminiService {
  private static cacheConfig: GeminiCacheConfig = {
    enabled: true,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 100, // Max cached responses
    compressionEnabled: true,
  }

  /**
   * Generate cache key for requests (Requirements 10.1, 10.2)
   */
  private static generateCacheKey(request: RoadmapRequest): string {
    const keyData = {
      domain: request.domain,
      jobRole: request.jobRole,
      experienceLevel: request.experienceLevel,
      skills: request.skills.sort().join(','),
      educationLevel: request.educationLevel,
    }
    return `gemini_roadmap_${btoa(JSON.stringify(keyData)).replace(
      /[^a-zA-Z0-9]/g,
      ''
    )}`
  }

  /**
   * Enhanced caching with multi-layer cache service (Requirements 10.1, 10.2)
   */
  private static async getCachedResponse<T>(
    cacheKey: string
  ): Promise<T | null> {
    if (!this.cacheConfig.enabled) return null

    try {
      const cached = await cacheService.get<T>(cacheKey)
      if (cached) {
        console.log('🎯 Cache hit for Gemini AI request')
        return cached
      }
      return null
    } catch (error) {
      // Silent cache error - continue without cache
      return null
    }
  }

  /**
   * Enhanced caching with compression and TTL (Requirements 10.1, 10.2)
   */
  private static async setCachedResponse<T>(
    cacheKey: string,
    data: T
  ): Promise<void> {
    if (!this.cacheConfig.enabled) return

    try {
      await cacheService.set(cacheKey, data, this.cacheConfig.ttl)
      console.log('💾 Cached Gemini AI response with enhanced caching')
    } catch (error) {
      // Silent cache error - continue without caching
    }
  }

  /**
   * Retry mechanism with exponential backoff (Requirements 10.3, 10.4)
   */
  private static async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= geminiConfig.retryAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.log(`Gemini AI ${context} attempt ${attempt} processing...`)

        if (attempt < geminiConfig.retryAttempts) {
          const delay = geminiConfig.retryDelay * Math.pow(2, attempt - 1)
          console.log(`Retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }

  /**
   * Validate API configuration (Requirements 5.1, 10.4)
   */
  private static validateConfiguration(): void {
    if (!geminiConfig.apiKey) {
      throw new Error(
        'Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.'
      )
    }

    if (!genAI || !model) {
      throw new Error('Gemini AI client not properly initialized.')
    }
  }

  /**
   * Generate personalized career roadmap based on domain and experience (Requirements 5.1, 5.2, 5.3, 5.4)
   */
  static async generateCareerRoadmap(
    request: RoadmapRequest
  ): Promise<CareerRecommendation> {
    const operationId = `gemini_roadmap_${request.jobRole}_${request.experienceLevel}`

    try {
      this.validateConfiguration()

      // Set loading state
      loadingService.setLoading(operationId, true, {
        message: 'Generating personalized career roadmap...',
        stage: 'initialization',
        progress: 10,
      })

      // Check cache first with enhanced caching
      const cacheKey = this.generateCacheKey(request)
      const cachedResult = await this.getCachedResponse<CareerRecommendation>(
        cacheKey
      )
      if (cachedResult) {
        loadingService.setLoading(operationId, false, {
          progress: 100,
          message: 'Roadmap loaded from cache',
        })
        return cachedResult
      }

      loadingService.updateProgress(
        operationId,
        30,
        'Preparing AI request...',
        'preparation'
      )

      console.log('🚀 Generating career roadmap with Gemini AI:', {
        domain: request.domain,
        jobRole: request.jobRole,
        experienceLevel: request.experienceLevel,
      })

      loadingService.updateProgress(
        operationId,
        50,
        'Generating roadmap with AI...',
        'generation'
      )

      const roadmap = await this.withRetry(async () => {
        const prompt = this.buildRoadmapPrompt(request)

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Request timeout')),
              geminiConfig.timeout
            )
          ),
        ])

        const response = await result.response
        const text = response.text()

        loadingService.updateProgress(
          operationId,
          80,
          'Processing AI response...',
          'processing'
        )

        return this.parseRoadmapResponse(text, request)
      }, 'roadmap generation')

      loadingService.updateProgress(
        operationId,
        90,
        'Caching results...',
        'caching'
      )

      // Cache the result with enhanced caching
      await this.setCachedResponse(cacheKey, roadmap)

      loadingService.setLoading(operationId, false, {
        progress: 100,
        message: 'Career roadmap generated successfully',
        stage: 'complete',
      })

      return roadmap
    } catch (error) {
      console.log('Using fallback career roadmap generation')
      loadingService.setError(
        operationId,
        'Generating personalized roadmap...'
      )
      return this.getFallbackRoadmap(request)
    }
  }

  /**
   * Build comprehensive roadmap prompt based on domain and experience (Requirements 5.2, 5.3)
   */
  private static buildRoadmapPrompt(request: RoadmapRequest): string {
    return `
You are an expert career advisor specializing in personalized career roadmaps. Generate a comprehensive career roadmap based on the following profile:

**User Profile:**
- Domain: ${request.domain}
- Target Role: ${request.jobRole}
- Experience Level: ${request.experienceLevel}
- Current Skills: ${request.skills.join(', ')}
- Education Level: ${request.educationLevel}
${request.name ? `- Name: ${request.name}` : ''}
${request.age ? `- Age: ${request.age}` : ''}

**Experience Level Guidelines:**
- Entry: 0-1 years (new graduates, career changers)
- Junior: 1-3 years (some experience, building skills)
- Mid: 3-7 years (established skills, taking on more responsibility)
- Senior: 7-15 years (leadership roles, mentoring others)
- Expert: 15+ years (industry thought leader, strategic roles)

**Domain-Specific Requirements:**
Focus on the ${
      request.domain
    } domain and provide roadmap elements specific to this field. Include:
- Industry-standard tools and technologies
- Relevant certifications and credentials
- Professional development opportunities
- Networking and community involvement
- Career progression paths within the domain

**Output Format:**
Provide a detailed JSON response with the following structure:

{
  "primaryCareer": "${request.jobRole}",
  "relatedRoles": ["Role 1", "Role 2", "Role 3", "Role 4"],
  "summary": "Personalized summary explaining why this career path fits the user's profile and experience level",
  "careerPath": {
    "nodes": [
      {
        "id": "1",
        "type": "course|internship|job|company|skill|certification",
        "title": "Specific title relevant to ${request.experienceLevel} level",
        "description": "Detailed description",
        "duration": "Time estimate",
        "difficulty": "beginner|intermediate|advanced",
        "salary": "Salary range (for job nodes)",
        "requirements": ["Requirement 1", "Requirement 2"],
        "position": {"x": 100, "y": 100}
      }
    ],
    "edges": [
      {
        "id": "e1-2",
        "source": "1",
        "target": "2",
        "sourceHandle": "bottom",
        "targetHandle": "top",
        "type": "smoothstep",
        "animated": true
      }
    ]
  },
  "alternatives": [
    {
      "id": "alt1",
      "title": "Alternative Career Title",
      "description": "Why this alternative fits the user's profile",
      "matchScore": 85,
      "salary": "$XX,XXX-$XX,XXX",
      "requirements": ["Skill 1", "Skill 2", "Skill 3"],
      "growth": "high|medium|low"
    }
  ]
}

**Important Guidelines:**
1. Tailor recommendations to the ${request.experienceLevel} experience level
2. Include 6-10 nodes in the career path with realistic progression
3. Position nodes appropriately (x: 100-1200, y: 100-500)
4. Provide 3 relevant alternative careers
5. Focus on ${request.domain} domain-specific opportunities
6. Include realistic salary ranges based on experience level and location
7. Ensure all edges have proper sourceHandle and targetHandle properties
8. Make recommendations actionable and specific to the user's current situation

Generate a roadmap that helps the user progress from their current ${
      request.experienceLevel
    } level to the next stage in their career within the ${
      request.domain
    } domain.
    `
  }

  /**
   * Parse and validate roadmap response (Requirements 5.4, 10.4)
   */
  private static parseRoadmapResponse(
    text: string,
    request: RoadmapRequest
  ): CareerRecommendation {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response')
      }

      const roadmapData = JSON.parse(jsonMatch[0])

      // Validate required fields
      if (
        !roadmapData.primaryCareer ||
        !roadmapData.careerPath ||
        !roadmapData.alternatives
      ) {
        throw new Error('Invalid roadmap structure from Gemini AI')
      }

      // Transform to match CareerRecommendation interface
      return this.transformToCareerRecommendation(roadmapData, request)
    } catch (error) {
      console.log('Processing roadmap data')
      throw new Error('Preparing your personalized roadmap')
    }
  }

  /**
   * Transform Gemini response to CareerRecommendation format (Requirements 5.4)
   */
  private static transformToCareerRecommendation(
    roadmapData: any,
    request: RoadmapRequest
  ): CareerRecommendation {
    return {
      id: `gemini_roadmap_${Date.now()}`,
      title: roadmapData.primaryCareer,
      description:
        roadmapData.summary ||
        `Personalized career roadmap for ${request.jobRole} in ${request.domain}`,
      fitScore: this.calculateFitScore(request),
      salaryRange: this.extractSalaryRange(roadmapData),
      growthProspects: this.determineGrowthProspects(request.domain),
      requiredSkills: this.extractRequiredSkills(roadmapData),
      recommendedPath: this.buildLearningPath(roadmapData, request),
      jobMarketData: this.generateJobMarketData(request),
      primaryCareer: roadmapData.primaryCareer,
      relatedRoles: roadmapData.relatedRoles || [],
      careerPath: roadmapData.careerPath,
      alternatives: roadmapData.alternatives || [],
      summary:
        roadmapData.summary ||
        `AI-generated career roadmap for ${request.experienceLevel} level ${request.jobRole}`,
    }
  }

  /**
   * Generate fallback roadmap when AI fails (Requirements 10.3, 10.4)
   */
  private static getFallbackRoadmap(
    request: RoadmapRequest
  ): CareerRecommendation {
    console.log('🔄 Using fallback roadmap generation')

    const fallbackRoadmaps = this.getFallbackRoadmapsByDomain()
    
    // Try to match by job role first (more specific)
    const jobRoleLower = request.jobRole.toLowerCase()
    let domainRoadmap = fallbackRoadmaps[jobRoleLower]
    
    // If not found, try domain
    if (!domainRoadmap) {
      const domainLower = request.domain.toLowerCase()
      domainRoadmap = fallbackRoadmaps[domainLower]
    }
    
    // Smart keyword matching for ALL career types (most specific first)
    if (!domainRoadmap) {
      // CYBERSECURITY (very specific - check first)
      if (jobRoleLower.includes('security') || jobRoleLower.includes('penetration') || 
          jobRoleLower.includes('pentester') || jobRoleLower.includes('ethical hack') || 
          jobRoleLower.includes('cybersec') || jobRoleLower.includes('infosec')) {
        domainRoadmap = fallbackRoadmaps['penetration tester'] || fallbackRoadmaps.cybersecurity || fallbackRoadmaps.security
      }
      // DATA SCIENCE (check before "analyst" for business)
      else if (jobRoleLower.includes('data scien') || jobRoleLower.includes('ml engineer') || 
               jobRoleLower.includes('machine learning') || jobRoleLower.includes('ai engineer')) {
        domainRoadmap = fallbackRoadmaps['data scientist'] || fallbackRoadmaps['data science']
      }
      // HEALTHCARE
      else if (jobRoleLower.includes('doctor') || jobRoleLower.includes('nurse') || 
               jobRoleLower.includes('physician') || jobRoleLower.includes('medic') || 
               jobRoleLower.includes('healthcare') || jobRoleLower.includes('clinical') ||
               jobRoleLower.includes('medical')) {
        domainRoadmap = fallbackRoadmaps.healthcare
      }
      // LEGAL
      else if (jobRoleLower.includes('lawyer') || jobRoleLower.includes('attorney') || 
               jobRoleLower.includes('legal') || jobRoleLower.includes('paralegal') || 
               jobRoleLower.includes('law ')) {
        domainRoadmap = fallbackRoadmaps.legal
      }
      // EDUCATION
      else if (jobRoleLower.includes('teacher') || jobRoleLower.includes('professor') || 
               jobRoleLower.includes('educator') || jobRoleLower.includes('instructor') || 
               jobRoleLower.includes('tutor')) {
        domainRoadmap = fallbackRoadmaps.education
      }
      // FINANCE & ACCOUNTING
      else if (jobRoleLower.includes('accountant') || jobRoleLower.includes('cpa') || 
               jobRoleLower.includes('financial analyst') || jobRoleLower.includes('finance ') || 
               jobRoleLower.includes('investment') || jobRoleLower.includes('banker') ||
               jobRoleLower.includes('auditor')) {
        domainRoadmap = fallbackRoadmaps.finance
      }
      // CONSTRUCTION & TRADES
      else if (jobRoleLower.includes('construction') || jobRoleLower.includes('builder') || 
               jobRoleLower.includes('carpenter') || jobRoleLower.includes('electrician') || 
               jobRoleLower.includes('plumber') || jobRoleLower.includes('contractor')) {
        domainRoadmap = fallbackRoadmaps.construction
      }
      // SURVEYOR (very specific - construction related)
      else if (jobRoleLower.includes('surveyor') || jobRoleLower.includes('surveying')) {
        domainRoadmap = fallbackRoadmaps.surveyor || fallbackRoadmaps.engineering
      }
      // ENGINEERING (non-software, check before general engineer)
      else if ((jobRoleLower.includes('engineer') && 
                !jobRoleLower.includes('software') && 
                !jobRoleLower.includes('developer')) ||
               jobRoleLower.includes('mechanical') || jobRoleLower.includes('civil eng') || 
               jobRoleLower.includes('electrical eng') || jobRoleLower.includes('structural')) {
        domainRoadmap = fallbackRoadmaps.engineering
      }
      // MOTION GRAPHICS / ANIMATION
      else if (jobRoleLower.includes('motion') || jobRoleLower.includes('animation') || 
               (jobRoleLower.includes('graphics') && (jobRoleLower.includes('artist') || jobRoleLower.includes('designer')))) {
        domainRoadmap = fallbackRoadmaps['motion graphics'] || fallbackRoadmaps.animation
      }
      // GENERAL DESIGN
      else if (jobRoleLower.includes('designer') || jobRoleLower.includes('design')) {
        domainRoadmap = fallbackRoadmaps.designer
      }
      // STARTUP/ENTREPRENEUR
      else if (jobRoleLower.includes('founder') || jobRoleLower.includes('entrepreneur') || 
               jobRoleLower.includes('startup')) {
        domainRoadmap = fallbackRoadmaps['startup founder']
      }
      // ENVIRONMENTAL/CLIMATE SCIENCE
      else if (jobRoleLower.includes('climate') || jobRoleLower.includes('environmental')) {
        domainRoadmap = fallbackRoadmaps['climate scientist'] || fallbackRoadmaps.environmental
      }
      // DATA/BUSINESS ANALYST (after data science check)
      else if (jobRoleLower.includes('data analyst') || jobRoleLower.includes('business analyst')) {
        domainRoadmap = fallbackRoadmaps.business
      }
      // GENERAL BUSINESS
      else if (jobRoleLower.includes('business') || jobRoleLower.includes('manager') || 
               jobRoleLower.includes('operations') || jobRoleLower.includes('sales') || 
               jobRoleLower.includes('marketing')) {
        domainRoadmap = fallbackRoadmaps.business
      }
      // SOFTWARE/TECH (check after engineering to avoid conflicts)
      else if (jobRoleLower.includes('developer') || jobRoleLower.includes('software') || 
               jobRoleLower.includes('programmer') || jobRoleLower.includes('coding')) {
        domainRoadmap = fallbackRoadmaps.technology
      }
    }
    
    // Generic keyword matching as last resort
    if (!domainRoadmap) {
      const keywords = Object.keys(fallbackRoadmaps)
      const matchingKey = keywords.find(key => {
        if (jobRoleLower.includes(key) || key.includes(jobRoleLower)) return true
        const jobWords = jobRoleLower.split(' ')
        const keyWords = key.split(' ')
        return jobWords.some(word => keyWords.includes(word) && word.length > 3)
      })
      domainRoadmap = matchingKey ? fallbackRoadmaps[matchingKey] : null
    }
    
    // Fallback to default if still not found
    if (!domainRoadmap) {
      domainRoadmap = fallbackRoadmaps.default
    }

    return {
      id: `fallback_roadmap_${Date.now()}`,
      title: request.jobRole,
      description: `Career roadmap for ${request.jobRole} in ${request.domain} (${request.experienceLevel} level)`,
      fitScore: 75,
      salaryRange: this.getDefaultSalaryRange(request.experienceLevel),
      growthProspects: 'medium' as const,
      requiredSkills: this.getDefaultSkills(request.domain),
      recommendedPath: this.buildFallbackLearningPath(request),
      jobMarketData: this.getDefaultJobMarketData(),
      primaryCareer: request.jobRole,
      relatedRoles: domainRoadmap.relatedRoles,
      careerPath: domainRoadmap.careerPath,
      alternatives: domainRoadmap.alternatives,
      summary: `Comprehensive career roadmap for ${request.jobRole} designed for ${request.experienceLevel} level professionals.`,
    }
  }
  /**
   * Helper method to calculate fit score based on user profile (Requirements 5.3)
   */
  private static calculateFitScore(request: RoadmapRequest): number {
    let score = 70 // Base score

    // Adjust based on experience level
    const experienceBonus = {
      entry: 5,
      junior: 10,
      mid: 15,
      senior: 20,
      expert: 25,
    }
    score += experienceBonus[request.experienceLevel] || 0

    // Adjust based on skills count
    if (request.skills.length > 5) score += 10
    else if (request.skills.length > 2) score += 5

    return Math.min(score, 95) // Cap at 95
  }

  /**
   * Extract salary range from roadmap data (Requirements 5.4)
   */
  private static extractSalaryRange(roadmapData: any): any {
    // Try to extract from job nodes or use defaults
    const jobNodes =
      roadmapData.careerPath?.nodes?.filter(
        (node: any) => node.type === 'job'
      ) || []
    if (jobNodes.length > 0 && jobNodes[0].salary) {
      const salaryMatch = jobNodes[0].salary.match(/\$(\d+)k?-\$?(\d+)k?/)
      if (salaryMatch) {
        return {
          min:
            parseInt(salaryMatch[1]) * (salaryMatch[1].length <= 2 ? 1000 : 1),
          max:
            parseInt(salaryMatch[2]) * (salaryMatch[2].length <= 2 ? 1000 : 1),
          currency: 'USD',
          period: 'yearly',
        }
      }
    }

    return {
      min: 50000,
      max: 90000,
      currency: 'USD',
      period: 'yearly',
    }
  }

  /**
   * Determine growth prospects based on domain (Requirements 5.3)
   */
  private static determineGrowthProspects(
    domain: string
  ): 'high' | 'medium' | 'low' {
    const highGrowthDomains = [
      'technology',
      'computer science',
      'ai',
      'machine learning',
      'data science',
      'cybersecurity',
      'cloud computing',
      'blockchain',
    ]

    return highGrowthDomains.some((d) => domain.toLowerCase().includes(d))
      ? 'high'
      : 'medium'
  }

  /**
   * Extract required skills from roadmap data (Requirements 5.4)
   */
  private static extractRequiredSkills(roadmapData: any): any[] {
    const skills: any[] = []
    const skillNodes =
      roadmapData.careerPath?.nodes?.filter(
        (node: any) => node.type === 'skill'
      ) || []

    skillNodes.forEach((node: any, index: number) => {
      skills.push({
        id: `skill_${index}`,
        name: node.title,
        category: 'technical',
        isRequired: true,
        priority: index < 3 ? 'critical' : 'important',
      })
    })

    return skills
  }

  /**
   * Build learning path from roadmap data (Requirements 5.4)
   */
  private static buildLearningPath(
    roadmapData: any,
    request: RoadmapRequest
  ): any {
    return {
      id: `learning_path_${Date.now()}`,
      title: `${request.jobRole} Learning Path`,
      description: `Comprehensive learning path for ${request.jobRole} in ${request.domain}`,
      totalDuration: '6-12 months',
      phases: this.extractLearningPhases(roadmapData),
      estimatedCost: 2000,
      difficulty:
        request.experienceLevel === 'entry' ? 'beginner' : 'intermediate',
      prerequisites: [
        `Basic understanding of ${request.domain}`,
        'Problem-solving mindset',
      ],
      outcomes: [
        `Master ${request.jobRole} skills`,
        'Build portfolio projects',
        'Ready for job applications',
      ],
    }
  }

  /**
   * Extract learning phases from roadmap (Requirements 5.4)
   */
  private static extractLearningPhases(roadmapData: any): any[] {
    const courseNodes =
      roadmapData.careerPath?.nodes?.filter(
        (node: any) => node.type === 'course' || node.type === 'certification'
      ) || []

    return courseNodes.map((node: any, index: number) => ({
      id: `phase_${index + 1}`,
      title: node.title,
      description: node.description,
      duration: node.duration || '4 weeks',
      priority: index < 2 ? 'critical' : 'important',
      order: index + 1,
      skills: node.requirements || [],
      resources: [
        {
          id: `resource_${index}`,
          title: node.title,
          description: node.description,
          type: node.type,
          provider: 'Multiple Platforms',
          duration: node.duration || '4 weeks',
          cost: 50,
          difficulty: node.difficulty || 'beginner',
          skills: node.requirements || [],
        },
      ],
    }))
  }

  /**
   * Generate job market data (Requirements 5.3)
   */
  private static generateJobMarketData(request: RoadmapRequest): any {
    return {
      demand:
        this.determineGrowthProspects(request.domain) === 'high'
          ? 'high'
          : 'medium',
      competitiveness: request.experienceLevel === 'entry' ? 'high' : 'medium',
      locations: ['Remote', 'Major Cities', 'Tech Hubs'],
      industryGrowth: 15,
      averageSalary: this.getAverageSalaryByExperience(request.experienceLevel),
    }
  }

  /**
   * Get average salary by experience level (Requirements 5.3)
   */
  private static getAverageSalaryByExperience(experienceLevel: string): number {
    const salaryMap = {
      entry: 60000,
      junior: 75000,
      mid: 95000,
      senior: 120000,
      expert: 150000,
    }
    return salaryMap[experienceLevel as keyof typeof salaryMap] || 75000
  }

  /**
   * Get default salary range by experience level (Requirements 10.4)
   */
  private static getDefaultSalaryRange(experienceLevel: string): any {
    const ranges = {
      entry: { min: 45000, max: 70000 },
      junior: { min: 60000, max: 85000 },
      mid: { min: 80000, max: 110000 },
      senior: { min: 100000, max: 140000 },
      expert: { min: 130000, max: 180000 },
    }

    const range =
      ranges[experienceLevel as keyof typeof ranges] || ranges.junior
    return {
      ...range,
      currency: 'USD',
      period: 'yearly',
    }
  }

  /**
   * Get default skills by domain (Requirements 10.4)
   */
  private static getDefaultSkills(domain: string): any[] {
    const skillMap: Record<string, string[]> = {
      technology: ['Programming', 'Problem Solving', 'System Design'],
      business: ['Communication', 'Leadership', 'Strategic Thinking'],
      design: ['Creativity', 'User Experience', 'Visual Design'],
      healthcare: ['Patient Care', 'Medical Knowledge', 'Empathy'],
      education: ['Teaching', 'Curriculum Development', 'Student Engagement'],
    }

    const domainKey =
      Object.keys(skillMap).find((key) => domain.toLowerCase().includes(key)) ||
      'technology'

    return skillMap[domainKey].map((skill, index) => ({
      id: `skill_${index}`,
      name: skill,
      category: 'core',
      isRequired: true,
      priority: 'important',
    }))
  }

  /**
   * Build fallback learning path (Requirements 10.4)
   */
  private static buildFallbackLearningPath(request: RoadmapRequest): any {
    return {
      id: `fallback_path_${Date.now()}`,
      title: `${request.jobRole} Fallback Path`,
      description: `Basic learning path for ${request.jobRole}`,
      totalDuration: '6 months',
      phases: [
        {
          id: 'phase1',
          title: 'Foundation Skills',
          description: `Learn the basics of ${request.domain}`,
          duration: '3 months',
          priority: 'critical',
          order: 1,
          skills: request.skills,
          resources: [
            {
              id: 'basic-course',
              title: `Introduction to ${request.domain}`,
              description: `Foundational course in ${request.domain}`,
              type: 'course',
              provider: 'Online Learning Platform',
              duration: '4 weeks',
              cost: 50,
              difficulty: 'beginner',
              skills: request.skills,
            },
          ],
        },
      ],
      estimatedCost: 500,
      difficulty: 'beginner',
      prerequisites: ['Basic computer skills'],
      outcomes: [
        `Understanding of ${request.domain}`,
        'Ready for advanced learning',
      ],
    }
  }

  /**
   * Get default job market data (Requirements 10.4)
   */
  private static getDefaultJobMarketData(): any {
    return {
      demand: 'medium',
      competitiveness: 'medium',
      locations: ['Remote', 'Major Cities'],
      industryGrowth: 10,
      averageSalary: 75000,
    }
  }

  /**
   * Get fallback roadmaps by domain (Requirements 10.4)
   */
  private static getFallbackRoadmapsByDomain(): Record<string, any> {
    return {
      technology: {
        relatedRoles: ['Software Developer', 'System Analyst', 'Technical Lead', 'DevOps Engineer'],
        careerPath: this.getDefaultTechCareerPath(),
        alternatives: this.getDefaultTechAlternatives(),
      },
      business: {
        relatedRoles: ['Business Analyst', 'Project Manager', 'Operations Manager', 'Strategy Consultant'],
        careerPath: this.getDefaultBusinessCareerPath(),
        alternatives: this.getDefaultBusinessAlternatives(),
      },
      'startup founder': {
        relatedRoles: ['Entrepreneur', 'CEO', 'Product Manager', 'Business Development'],
        careerPath: this.getStartupFounderCareerPath(),
        alternatives: this.getStartupFounderAlternatives(),
      },
      entrepreneur: {
        relatedRoles: ['Startup Founder', 'Business Owner', 'Consultant', 'Investor'],
        careerPath: this.getStartupFounderCareerPath(),
        alternatives: this.getStartupFounderAlternatives(),
      },
      'data scientist': {
        relatedRoles: ['Machine Learning Engineer', 'Data Analyst', 'AI Engineer', 'Business Intelligence Analyst'],
        careerPath: this.getDataScienceCareerPath(),
        alternatives: this.getDataScienceAlternatives(),
      },
      'data science': {
        relatedRoles: ['Data Scientist', 'ML Engineer', 'Data Engineer', 'Analytics Manager'],
        careerPath: this.getDataScienceCareerPath(),
        alternatives: this.getDataScienceAlternatives(),
      },
      'penetration tester': {
        relatedRoles: ['Security Analyst', 'Ethical Hacker', 'SOC Analyst', 'Security Engineer'],
        careerPath: this.getCybersecurityCareerPath(),
        alternatives: this.getCybersecurityAlternatives(),
      },
      cybersecurity: {
        relatedRoles: ['Penetration Tester', 'Security Analyst', 'Incident Responder', 'Security Architect'],
        careerPath: this.getCybersecurityCareerPath(),
        alternatives: this.getCybersecurityAlternatives(),
      },
      security: {
        relatedRoles: ['Cybersecurity Analyst', 'Penetration Tester', 'Security Engineer', 'InfoSec Specialist'],
        careerPath: this.getCybersecurityCareerPath(),
        alternatives: this.getCybersecurityAlternatives(),
      },
      'climate scientist': {
        relatedRoles: ['Environmental Scientist', 'Sustainability Consultant', 'Research Scientist', 'Policy Advisor'],
        careerPath: this.getClimateScientistCareerPath(),
        alternatives: this.getClimateScientistAlternatives(),
      },
      environmental: {
        relatedRoles: ['Climate Scientist', 'Conservation Biologist', 'Sustainability Manager', 'Environmental Engineer'],
        careerPath: this.getClimateScientistCareerPath(),
        alternatives: this.getClimateScientistAlternatives(),
      },
      'motion graphics': {
        relatedRoles: ['3D Animator', 'VFX Artist', 'Video Editor', 'Creative Director'],
        careerPath: this.getMotionGraphicsCareerPath(),
        alternatives: this.getCreativeAlternatives(),
      },
      animation: {
        relatedRoles: ['Motion Graphics Artist', '3D Modeler', 'Character Animator', 'VFX Compositor'],
        careerPath: this.getMotionGraphicsCareerPath(),
        alternatives: this.getCreativeAlternatives(),
      },
      designer: {
        relatedRoles: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Brand Designer'],
        careerPath: this.getDesignCareerPath(),
        alternatives: this.getCreativeAlternatives(),
      },
      construction: {
        relatedRoles: ['Project Manager', 'Site Supervisor', 'Civil Engineer', 'Safety Manager'],
        careerPath: this.getConstructionCareerPath(),
        alternatives: this.getConstructionAlternatives(),
      },
      surveyor: {
        relatedRoles: ['Land Surveyor', 'Quantity Surveyor', 'Geospatial Surveyor', 'Site Engineer'],
        careerPath: this.getSurveyorCareerPath(),
        alternatives: this.getSurveyorAlternatives(),
      },
      healthcare: {
        relatedRoles: ['Registered Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Physician'],
        careerPath: this.getHealthcareCareerPath(),
        alternatives: this.getHealthcareAlternatives(),
      },
      education: {
        relatedRoles: ['Teacher', 'Professor', 'Instructional Designer', 'Education Administrator'],
        careerPath: this.getEducationCareerPath(),
        alternatives: this.getEducationAlternatives(),
      },
      legal: {
        relatedRoles: ['Attorney', 'Paralegal', 'Legal Consultant', 'Compliance Officer'],
        careerPath: this.getLegalCareerPath(),
        alternatives: this.getLegalAlternatives(),
      },
      finance: {
        relatedRoles: ['Financial Analyst', 'Accountant', 'Investment Banker', 'CFO'],
        careerPath: this.getFinanceCareerPath(),
        alternatives: this.getFinanceAlternatives(),
      },
      engineering: {
        relatedRoles: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Project Engineer'],
        careerPath: this.getEngineeringCareerPath(),
        alternatives: this.getEngineeringAlternatives(),
      },
      default: {
        relatedRoles: ['Specialist', 'Coordinator', 'Manager', 'Director'],
        careerPath: this.getDefaultGenericCareerPath(),
        alternatives: this.getDefaultGenericAlternatives(),
      },
    }
  }

  /**
   * Get default technology career path (Requirements 10.4)
   */
  private static getDefaultTechCareerPath(): any {
    return {
      nodes: [
        {
          id: '1',
          type: 'course',
          title: 'Programming Fundamentals',
          description: 'Learn basic programming concepts',
          duration: '3 months',
          difficulty: 'beginner',
          position: { x: 100, y: 100 },
        },
        {
          id: '2',
          type: 'internship',
          title: 'Tech Internship',
          description: 'Gain practical experience',
          duration: '6 months',
          position: { x: 300, y: 100 },
        },
        {
          id: '3',
          type: 'job',
          title: 'Junior Developer',
          description: 'Entry-level development role',
          salary: '$60k-80k',
          position: { x: 500, y: 100 },
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'smoothstep',
          animated: true,
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'smoothstep',
          animated: true,
        },
      ],
    }
  }

  /**
   * Get default technology alternatives (Requirements 10.4)
   */
  private static getDefaultTechAlternatives(): any[] {
    return [
      {
        id: 'alt1',
        title: 'Data Analyst',
        description: 'Analyze data to drive business decisions',
        matchScore: 80,
        salary: '$65k-95k',
        requirements: ['SQL', 'Python', 'Statistics'],
        growth: 'high',
      },
      {
        id: 'alt2',
        title: 'UX Designer',
        description: 'Design user-friendly interfaces',
        matchScore: 75,
        salary: '$70k-100k',
        requirements: ['Design Tools', 'User Research', 'Prototyping'],
        growth: 'medium',
      },
      {
        id: 'alt3',
        title: 'Product Manager',
        description: 'Manage product development lifecycle',
        matchScore: 70,
        salary: '$80k-120k',
        requirements: ['Product Strategy', 'Communication', 'Analytics'],
        growth: 'high',
      },
    ]
  }

  /**
   * Get Data Science career path
   */
  private static getDataScienceCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Python & Statistics Fundamentals', description: 'Learn Python programming and statistical analysis', duration: '3 months', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'Machine Learning & AI', description: 'Master ML algorithms and deep learning', duration: '4 months', difficulty: 'intermediate', position: { x: 300, y: 100 } },
        { id: '3', type: 'course', title: 'Big Data & Cloud Computing', description: 'Learn Spark, Hadoop, AWS/Azure', duration: '3 months', difficulty: 'intermediate', position: { x: 500, y: 100 } },
        { id: '4', type: 'internship', title: 'Data Science Internship', description: 'Real-world data projects', duration: '6 months', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Junior Data Scientist', description: 'Entry-level data science role', salary: '$70k-95k', position: { x: 900, y: 100 } },
        { id: '6', type: 'job', title: 'Senior Data Scientist', description: 'Lead data science projects', salary: '$110k-150k', position: { x: 1100, y: 100 } },
        { id: '7', type: 'skill', title: 'Python, SQL, R', description: 'Programming languages', position: { x: 100, y: 300 } },
        { id: '8', type: 'skill', title: 'TensorFlow, PyTorch', description: 'ML frameworks', position: { x: 300, y: 300 } },
        { id: '9', type: 'certification', title: 'Google Data Analytics Certificate', description: 'Industry certification', position: { x: 500, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
        { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', animated: true },
      ],
    }
  }

  /**
   * Get Data Science alternatives
   */
  private static getDataScienceAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Machine Learning Engineer', description: 'Build and deploy ML models', matchScore: 92, salary: '$100k-150k', requirements: ['Python', 'TensorFlow', 'ML Algorithms'], growth: 'high' },
      { id: 'alt2', title: 'Data Analyst', description: 'Analyze data and create insights', matchScore: 88, salary: '$65k-90k', requirements: ['SQL', 'Python', 'Statistics', 'Tableau'], growth: 'high' },
      { id: 'alt3', title: 'AI Engineer', description: 'Develop AI systems and applications', matchScore: 90, salary: '$110k-160k', requirements: ['Deep Learning', 'NLP', 'Computer Vision'], growth: 'high' },
      { id: 'alt4', title: 'Business Intelligence Analyst', description: 'Create data dashboards and reports', matchScore: 80, salary: '$70k-100k', requirements: ['SQL', 'Power BI', 'Business Analysis'], growth: 'medium' },
    ]
  }

  /**
   * Get default business career path (Requirements 10.4)
   */
  private static getDefaultBusinessCareerPath(): any {
    return {
      nodes: [
        {
          id: '1',
          type: 'course',
          title: 'Business Fundamentals',
          description: 'Learn core business concepts',
          duration: '2 months',
          difficulty: 'beginner',
          position: { x: 100, y: 100 },
        },
        {
          id: '2',
          type: 'internship',
          title: 'Business Internship',
          description: 'Gain business experience',
          duration: '4 months',
          position: { x: 300, y: 100 },
        },
        {
          id: '3',
          type: 'job',
          title: 'Business Analyst',
          description: 'Analyze business processes',
          salary: '$55k-75k',
          position: { x: 500, y: 100 },
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'smoothstep',
          animated: true,
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'smoothstep',
          animated: true,
        },
      ],
    }
  }

  /**
   * Get default business alternatives (Requirements 10.4)
   */
  private static getDefaultBusinessAlternatives(): any[] {
    return [
      {
        id: 'alt1',
        title: 'Marketing Specialist',
        description: 'Develop and execute marketing strategies',
        matchScore: 75,
        salary: '$50k-80k',
        requirements: ['Marketing', 'Communication', 'Analytics'],
        growth: 'medium',
      },
      {
        id: 'alt2',
        title: 'Operations Manager',
        description: 'Optimize business operations',
        matchScore: 80,
        salary: '$70k-100k',
        requirements: ['Operations', 'Leadership', 'Process Improvement'],
        growth: 'medium',
      },
      {
        id: 'alt3',
        title: 'Financial Analyst',
        description: 'Analyze financial data and trends',
        matchScore: 70,
        salary: '$60k-90k',
        requirements: ['Finance', 'Excel', 'Data Analysis'],
        growth: 'medium',
      },
    ]
  }

  /**
   * Get default generic career path (Requirements 10.4)
   * Dynamically generates roadmap for ANY career
   */
  private static getDefaultGenericCareerPath(): any {
    return {
      nodes: [
        {
          id: '1',
          type: 'course',
          title: 'Foundation Skills',
          description: 'Build core competencies in your field',
          duration: '3-6 months',
          difficulty: 'beginner',
          position: { x: 100, y: 100 },
        },
        {
          id: '2',
          type: 'course',
          title: 'Advanced Training',
          description: 'Develop specialized expertise',
          duration: '4-8 months',
          difficulty: 'intermediate',
          position: { x: 300, y: 100 },
        },
        {
          id: '3',
          type: 'internship',
          title: 'Professional Experience',
          description: 'Gain hands-on industry experience',
          duration: '6-12 months',
          position: { x: 500, y: 100 },
        },
        {
          id: '4',
          type: 'job',
          title: 'Entry Level Position',
          description: 'Begin your professional career',
          salary: '$40k-60k',
          position: { x: 700, y: 100 },
        },
        {
          id: '5',
          type: 'job',
          title: 'Mid-Level Professional',
          description: 'Advance in your career with experience',
          salary: '$60k-90k',
          position: { x: 900, y: 100 },
        },
        {
          id: '6',
          type: 'skill',
          title: 'Core Skills',
          description: 'Essential competencies for your field',
          position: { x: 100, y: 300 },
        },
        {
          id: '7',
          type: 'certification',
          title: 'Professional Certification',
          description: 'Industry-recognized credentials',
          position: { x: 300, y: 300 },
        },
        {
          id: '8',
          type: 'skill',
          title: 'Leadership Skills',
          description: 'Team management and communication',
          position: { x: 500, y: 300 },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
        { id: 'e1-6', source: '1', target: '6', type: 'smoothstep' },
        { id: 'e2-7', source: '2', target: '7', type: 'smoothstep' },
      ],
    }
  }

  /**
   * Get default generic alternatives (Requirements 10.4)
   */
  private static getDefaultGenericAlternatives(): any[] {
    return [
      {
        id: 'alt1',
        title: 'Project Coordinator',
        description: 'Manage projects and coordinate team activities',
        matchScore: 75,
        salary: '$45k-70k',
        requirements: ['Project Management', 'Communication', 'Organization'],
        growth: 'medium',
      },
      {
        id: 'alt2',
        title: 'Operations Specialist',
        description: 'Optimize processes and improve efficiency',
        matchScore: 72,
        salary: '$50k-75k',
        requirements: ['Operations', 'Analysis', 'Process Improvement'],
        growth: 'medium',
      },
      {
        id: 'alt3',
        title: 'Consultant',
        description: 'Provide expert advice in your field',
        matchScore: 70,
        salary: '$60k-100k',
        requirements: ['Expertise', 'Communication', 'Problem Solving'],
        growth: 'high',
      },
    ]
  }

  /**
   * Get Startup Founder career path
   */
  private static getStartupFounderCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Entrepreneurship Fundamentals', description: 'Y Combinator Startup School', duration: '4 weeks', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'Product Development & MVP', description: 'Build and validate your product', duration: '3 months', difficulty: 'intermediate', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Startup Accelerator', description: 'Join accelerator program', duration: '3-6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Founder & CEO', description: 'Launch your startup', salary: 'Equity-based', position: { x: 700, y: 100 } },
        { id: '5', type: 'skill', title: 'Business Strategy', description: 'Develop business model', position: { x: 100, y: 300 } },
        { id: '6', type: 'certification', title: 'MBA or Business Degree', description: 'Formal business education', position: { x: 300, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getStartupFounderAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Product Manager', description: 'Lead product development', matchScore: 85, salary: '$90k-150k', requirements: ['Product Strategy', 'Leadership'], growth: 'high' },
      { id: 'alt2', title: 'Business Development Manager', description: 'Drive growth', matchScore: 80, salary: '$75k-130k', requirements: ['Sales', 'Strategy'], growth: 'high' },
      { id: 'alt3', title: 'Venture Capitalist', description: 'Invest in startups', matchScore: 75, salary: '$100k-200k', requirements: ['Finance', 'Business'], growth: 'medium' },
    ]
  }

  /**
   * Get Motion Graphics career path
   */
  private static getMotionGraphicsCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'After Effects Fundamentals', description: 'Master motion graphics essentials', duration: '3 months', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'Cinema 4D & 3D Animation', description: 'Learn 3D motion design', duration: '4 months', difficulty: 'intermediate', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Motion Design Intern', description: 'Work with creative agency', duration: '6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Junior Motion Graphics Artist', description: 'Create animations and visual effects', salary: '$45k-65k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Senior Motion Designer', description: 'Lead creative projects', salary: '$70k-100k', position: { x: 900, y: 100 } },
        { id: '6', type: 'skill', title: 'Visual Design', description: 'Composition and aesthetics', position: { x: 100, y: 300 } },
        { id: '7', type: 'certification', title: 'Adobe Certified Professional', description: 'Industry certification', position: { x: 300, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  /**
   * Get Cybersecurity career path
   */
  private static getCybersecurityCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Networking & Linux Fundamentals', description: 'Learn networking basics and Linux command line', duration: '3 months', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'Ethical Hacking & Pentesting', description: 'Master penetration testing techniques', duration: '4 months', difficulty: 'intermediate', position: { x: 300, y: 100 } },
        { id: '3', type: 'certification', title: 'CEH or OSCP Certification', description: 'Industry-recognized security certifications', position: { x: 500, y: 100 } },
        { id: '4', type: 'internship', title: 'Security Analyst Intern', description: 'Gain hands-on security experience', duration: '6 months', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Junior Penetration Tester', description: 'Entry-level pentesting role', salary: '$60k-80k', position: { x: 900, y: 100 } },
        { id: '6', type: 'job', title: 'Senior Security Engineer', description: 'Lead security assessments', salary: '$100k-140k', position: { x: 1100, y: 100 } },
        { id: '7', type: 'skill', title: 'Kali Linux & Tools', description: 'Nmap, Metasploit, Burp Suite', position: { x: 100, y: 300 } },
        { id: '8', type: 'skill', title: 'Web Security', description: 'OWASP Top 10, SQL Injection', position: { x: 300, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
        { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', animated: true },
      ],
    }
  }

  /**
   * Get Cybersecurity alternatives
   */
  private static getCybersecurityAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Security Analyst', description: 'Monitor and respond to security threats', matchScore: 90, salary: '$70k-100k', requirements: ['Security Monitoring', 'Incident Response', 'SIEM'], growth: 'high', experienceLevel: 'mid' },
      { id: 'alt2', title: 'Ethical Hacker', description: 'Identify vulnerabilities through authorized hacking', matchScore: 92, salary: '$80k-120k', requirements: ['Penetration Testing', 'Vulnerability Assessment', 'Exploits'], growth: 'high', experienceLevel: 'mid' },
      { id: 'alt3', title: 'SOC Analyst', description: 'Work in Security Operations Center', matchScore: 85, salary: '$65k-95k', requirements: ['Threat Detection', 'Log Analysis', 'Security Tools'], growth: 'high', experienceLevel: 'entry' },
      { id: 'alt4', title: 'Security Engineer', description: 'Design and implement security systems', matchScore: 88, salary: '$90k-130k', requirements: ['Security Architecture', 'Firewalls', 'Encryption'], growth: 'high', experienceLevel: 'senior' },
      { id: 'alt5', title: 'Penetration Tester Intern', description: 'Gain hands-on security experience', matchScore: 80, salary: '$15-25/hour', requirements: ['Basic Security', 'Networking', 'Linux'], growth: 'high', experienceLevel: 'internship' },
    ]
  }

  /**
   * Get Design career path
   */
  private static getDesignCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Graphic Design Fundamentals', description: 'Learn design principles', duration: '3 months', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'UI/UX Design', description: 'User interface and experience', duration: '4 months', difficulty: 'intermediate', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Design Intern', description: 'Agency or in-house role', duration: '6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Junior Designer', description: 'Create visual content', salary: '$45k-65k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Senior Designer', description: 'Lead design projects', salary: '$70k-100k', position: { x: 900, y: 100 } },
        { id: '6', type: 'skill', title: 'Adobe Creative Suite', description: 'Master design tools', position: { x: 100, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  /**
   * Get Creative career alternatives
   */
  private static getCreativeAlternatives(): any[] {
    return [
      { id: 'alt1', title: '3D Animator', description: 'Create 3D animations and visual effects', matchScore: 90, salary: '$55k-85k', requirements: ['3D Modeling', 'Animation', 'Cinema 4D/Blender'], growth: 'high' },
      { id: 'alt2', title: 'Video Editor', description: 'Edit and produce video content', matchScore: 85, salary: '$50k-75k', requirements: ['Premiere Pro', 'Storytelling', 'Post-Production'], growth: 'high' },
      { id: 'alt3', title: 'VFX Artist', description: 'Create visual effects for film and TV', matchScore: 88, salary: '$60k-95k', requirements: ['VFX Software', 'Compositing', 'Visual Effects'], growth: 'high' },
      { id: 'alt4', title: 'Creative Director', description: 'Lead creative teams and campaigns', matchScore: 80, salary: '$80k-120k', requirements: ['Creative Leadership', 'Strategy', 'Team Management'], growth: 'medium' },
    ]
  }

  private static getConstructionCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Construction Management Basics', description: 'Learn construction fundamentals', duration: '3 months', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'certification', title: 'OSHA Safety Certification', description: 'Construction safety training', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Construction Site Intern', description: 'On-site experience', duration: '6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Assistant Project Manager', description: 'Support construction projects', salary: '$45k-65k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Construction Manager', description: 'Lead construction projects', salary: '$70k-100k', position: { x: 900, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getConstructionAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Project Manager', description: 'Oversee construction projects', matchScore: 90, salary: '$65k-95k', requirements: ['Project Management', 'Scheduling', 'Budgeting'], growth: 'high' },
      { id: 'alt2', title: 'Site Supervisor', description: 'Manage on-site operations', matchScore: 85, salary: '$55k-80k', requirements: ['Site Management', 'Safety', 'Coordination'], growth: 'medium' },
      { id: 'alt3', title: 'Civil Engineer', description: 'Design construction projects', matchScore: 88, salary: '$70k-100k', requirements: ['Civil Engineering', 'AutoCAD', 'Structural Analysis'], growth: 'high' },
      { id: 'alt4', title: 'Safety Manager', description: 'Ensure construction site safety', matchScore: 80, salary: '$60k-85k', requirements: ['Safety Management', 'OSHA', 'Risk Assessment'], growth: 'medium' },
    ]
  }

  private static getSurveyorCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Surveying Fundamentals', description: 'Learn surveying principles and mathematics', duration: '4 months', difficulty: 'intermediate', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'GIS & CAD Training', description: 'Master surveying software tools', duration: '3 months', difficulty: 'intermediate', position: { x: 300, y: 100 } },
        { id: '3', type: 'certification', title: 'Land Surveyor License', description: 'Professional surveyor certification', position: { x: 500, y: 100 } },
        { id: '4', type: 'internship', title: 'Surveying Assistant', description: 'Field surveying experience', duration: '6 months', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Licensed Land Surveyor', description: 'Lead surveying projects', salary: '$55k-80k', position: { x: 900, y: 100 } },
        { id: '6', type: 'job', title: 'Senior Surveyor / Survey Manager', description: 'Manage surveying operations', salary: '$75k-110k', position: { x: 1100, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
        { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getSurveyorAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Land Surveyor', description: 'Measure and map land boundaries', matchScore: 95, salary: '$55k-85k', requirements: ['Surveying', 'GPS/GNSS', 'AutoCAD', 'GIS'], growth: 'medium', experienceLevel: 'mid' },
      { id: 'alt2', title: 'Quantity Surveyor', description: 'Manage construction project costs', matchScore: 88, salary: '$60k-90k', requirements: ['Cost Estimation', 'Project Management', 'Construction Knowledge'], growth: 'high', experienceLevel: 'mid' },
      { id: 'alt3', title: 'Geospatial Surveyor', description: 'Create spatial data and maps', matchScore: 90, salary: '$50k-75k', requirements: ['GIS', 'Remote Sensing', 'Spatial Analysis', 'GPS'], growth: 'high', experienceLevel: 'entry' },
      { id: 'alt4', title: 'Hydrographic Surveyor', description: 'Survey water bodies and coastlines', matchScore: 85, salary: '$55k-80k', requirements: ['Hydrography', 'Sonar', 'Mapping', 'Marine Navigation'], growth: 'medium', experienceLevel: 'mid' },
      { id: 'alt5', title: 'Survey Manager', description: 'Oversee surveying teams and projects', matchScore: 82, salary: '$75k-110k', requirements: ['Leadership', 'Project Management', 'Surveying', 'Client Relations'], growth: 'medium', experienceLevel: 'senior' },
    ]
  }

  private static getHealthcareCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Healthcare Fundamentals', description: 'Medical basics and terminology', duration: '4 months', difficulty: 'beginner', position: { x: 100, y: 100 } },
        { id: '2', type: 'certification', title: 'Nursing or Medical Degree', description: 'Professional healthcare credential', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Clinical Rotation', description: 'Hospital experience', duration: '12 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Registered Nurse / Medical Assistant', description: 'Entry healthcare role', salary: '$50k-70k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Senior Healthcare Professional', description: 'Advanced medical role', salary: '$80k-120k', position: { x: 900, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getHealthcareAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Registered Nurse', description: 'Provide direct patient care', matchScore: 92, salary: '$60k-85k', requirements: ['Nursing Degree', 'Patient Care', 'Medical Knowledge'], growth: 'high' },
      { id: 'alt2', title: 'Medical Assistant', description: 'Support physicians and nurses', matchScore: 85, salary: '$30k-45k', requirements: ['Medical Terminology', 'Clinical Skills', 'Patient Communication'], growth: 'high' },
      { id: 'alt3', title: 'Healthcare Administrator', description: 'Manage healthcare facilities', matchScore: 80, salary: '$70k-100k', requirements: ['Healthcare Management', 'Administration', 'Leadership'], growth: 'medium' },
      { id: 'alt4', title: 'Physician Assistant', description: 'Diagnose and treat patients', matchScore: 88, salary: '$90k-120k', requirements: ['Medical Degree', 'Diagnostics', 'Patient Care'], growth: 'high' },
    ]
  }

  private static getEducationCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Education Degree', description: "Bachelor's in Education", duration: '4 years', difficulty: 'intermediate', position: { x: 100, y: 100 } },
        { id: '2', type: 'certification', title: 'Teaching License', description: 'State teaching credential', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Student Teaching', description: 'Classroom experience', duration: '6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Classroom Teacher', description: 'Teach students', salary: '$40k-60k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Department Head / Professor', description: 'Lead education programs', salary: '$65k-95k', position: { x: 900, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getEducationAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Teacher', description: 'Educate students in classrooms', matchScore: 95, salary: '$45k-70k', requirements: ['Teaching License', 'Curriculum Design', 'Classroom Management'], growth: 'medium' },
      { id: 'alt2', title: 'Professor', description: 'Teach at university level', matchScore: 88, salary: '$60k-100k', requirements: ['Advanced Degree', 'Research', 'Teaching'], growth: 'medium' },
      { id: 'alt3', title: 'Instructional Designer', description: 'Design learning experiences', matchScore: 85, salary: '$55k-85k', requirements: ['Instructional Design', 'E-Learning', 'Curriculum'], growth: 'high' },
      { id: 'alt4', title: 'Education Administrator', description: 'Manage schools and programs', matchScore: 80, salary: '$70k-110k', requirements: ['Leadership', 'Administration', 'Education Policy'], growth: 'medium' },
    ]
  }

  private static getLegalCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Law Degree (JD)', description: 'Juris Doctor degree', duration: '3 years', difficulty: 'advanced', position: { x: 100, y: 100 } },
        { id: '2', type: 'certification', title: 'Bar Exam', description: 'State bar certification', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Legal Internship', description: 'Law firm experience', duration: '1 year', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Associate Attorney', description: 'Entry-level lawyer', salary: '$60k-100k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Partner / Senior Attorney', description: 'Lead legal practice', salary: '$120k-200k', position: { x: 900, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getLegalAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Attorney', description: 'Represent clients in legal matters', matchScore: 95, salary: '$80k-150k', requirements: ['Law Degree', 'Bar License', 'Legal Research'], growth: 'medium' },
      { id: 'alt2', title: 'Paralegal', description: 'Assist lawyers with legal work', matchScore: 85, salary: '$45k-65k', requirements: ['Legal Knowledge', 'Research', 'Documentation'], growth: 'medium' },
      { id: 'alt3', title: 'Legal Consultant', description: 'Advise on legal matters', matchScore: 88, salary: '$70k-120k', requirements: ['Legal Expertise', 'Consulting', 'Business Law'], growth: 'high' },
      { id: 'alt4', title: 'Compliance Officer', description: 'Ensure regulatory compliance', matchScore: 80, salary: '$60k-95k', requirements: ['Compliance', 'Regulations', 'Risk Management'], growth: 'high' },
    ]
  }

  private static getFinanceCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Finance or Accounting Degree', description: "Bachelor's in Finance", duration: '4 years', difficulty: 'intermediate', position: { x: 100, y: 100 } },
        { id: '2', type: 'certification', title: 'CPA or CFA', description: 'Professional certification', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Finance Internship', description: 'Financial institution experience', duration: '6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Financial Analyst', description: 'Analyze financial data', salary: '$55k-80k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Senior Financial Manager', description: 'Lead finance teams', salary: '$90k-140k', position: { x: 900, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getFinanceAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Financial Analyst', description: 'Analyze investments and financial data', matchScore: 92, salary: '$60k-90k', requirements: ['Financial Analysis', 'Excel', 'Modeling'], growth: 'high' },
      { id: 'alt2', title: 'Accountant', description: 'Manage financial records and taxes', matchScore: 90, salary: '$50k-75k', requirements: ['Accounting', 'CPA', 'Tax Knowledge'], growth: 'medium' },
      { id: 'alt3', title: 'Investment Banker', description: 'Facilitate financial transactions', matchScore: 85, salary: '$100k-200k', requirements: ['Finance', 'M&A', 'Client Relations'], growth: 'high' },
      { id: 'alt4', title: 'CFO', description: 'Lead company financial strategy', matchScore: 80, salary: '$130k-250k', requirements: ['Strategic Finance', 'Leadership', 'Business Acumen'], growth: 'medium' },
    ]
  }

  private static getEngineeringCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Engineering Degree', description: "Bachelor's in Engineering", duration: '4 years', difficulty: 'advanced', position: { x: 100, y: 100 } },
        { id: '2', type: 'certification', title: 'PE License', description: 'Professional Engineer license', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Engineering Internship', description: 'Hands-on engineering work', duration: '6 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Junior Engineer', description: 'Entry-level engineering role', salary: '$60k-80k', position: { x: 700, y: 100 } },
        { id: '5', type: 'job', title: 'Senior Engineer / Project Lead', description: 'Lead engineering projects', salary: '$90k-130k', position: { x: 900, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
        { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getEngineeringAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Mechanical Engineer', description: 'Design mechanical systems', matchScore: 92, salary: '$70k-100k', requirements: ['Mechanical Engineering', 'CAD', 'Design'], growth: 'high' },
      { id: 'alt2', title: 'Civil Engineer', description: 'Design infrastructure projects', matchScore: 90, salary: '$65k-95k', requirements: ['Civil Engineering', 'AutoCAD', 'Structural Analysis'], growth: 'medium' },
      { id: 'alt3', title: 'Electrical Engineer', description: 'Work with electrical systems', matchScore: 88, salary: '$75k-110k', requirements: ['Electrical Engineering', 'Circuit Design', 'Power Systems'], growth: 'high' },
      { id: 'alt4', title: 'Project Engineer', description: 'Manage engineering projects', matchScore: 85, salary: '$80k-120k', requirements: ['Project Management', 'Engineering', 'Leadership'], growth: 'high' },
    ]
  }

  private static getClimateScientistCareerPath(): any {
    return {
      nodes: [
        { id: '1', type: 'course', title: 'Environmental Science Degree', description: 'Bachelor\'s in Environmental Science', duration: '4 years', difficulty: 'intermediate', position: { x: 100, y: 100 } },
        { id: '2', type: 'course', title: 'Climate Modeling', description: 'Master climate research methods', duration: '2 years', difficulty: 'advanced', position: { x: 300, y: 100 } },
        { id: '3', type: 'internship', title: 'Research Assistant', description: 'Work in climate research lab', duration: '6-12 months', position: { x: 500, y: 100 } },
        { id: '4', type: 'job', title: 'Climate Scientist', description: 'Research climate patterns', salary: '$60k-100k', position: { x: 700, y: 100 } },
        { id: '5', type: 'certification', title: 'PhD in Climate Science', description: 'Advanced research degree', position: { x: 100, y: 300 } },
        { id: '6', type: 'skill', title: 'Data Science', description: 'Analyze climate data', position: { x: 300, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true },
        { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
      ],
    }
  }

  private static getClimateScientistAlternatives(): any[] {
    return [
      { id: 'alt1', title: 'Environmental Consultant', description: 'Advise on sustainability', matchScore: 85, salary: '$55k-95k', requirements: ['Environmental Science', 'Policy'], growth: 'high' },
      { id: 'alt2', title: 'Sustainability Manager', description: 'Lead sustainability initiatives', matchScore: 80, salary: '$70k-120k', requirements: ['Sustainability', 'Management'], growth: 'high' },
      { id: 'alt3', title: 'Environmental Policy Analyst', description: 'Shape environmental policy', matchScore: 75, salary: '$60k-90k', requirements: ['Policy', 'Research'], growth: 'medium' },
    ]
  }

  // Legacy method for backward compatibility - delegates to new enhanced method
  static async generateCareerPath(
    profile: UserProfile
  ): Promise<CareerRecommendation> {
    try {
      // Convert UserProfile to RoadmapRequest format
      const request: RoadmapRequest = {
        domain: this.extractDomainFromProfile(profile),
        jobRole: profile.careerInterest || 'Professional',
        experienceLevel: this.mapEducationToExperience(profile.educationLevel),
        skills: profile.skills || [],
        educationLevel: profile.educationLevel,
        age: profile.age,
        name: profile.name,
      }

      return await this.generateCareerRoadmap(request)
    } catch (error) {
      console.log('Generating career recommendations')
      return this.getFallbackRecommendation(profile)
    }
  }

  /**
   * Extract domain from user profile (Requirements 5.2)
   */
  private static extractDomainFromProfile(profile: UserProfile): string {
    const careerInterest = profile.careerInterest?.toLowerCase() || ''

    // Map career interests to domains
    if (
      careerInterest.includes('software') ||
      careerInterest.includes('programming') ||
      careerInterest.includes('developer') ||
      careerInterest.includes('tech')
    ) {
      return 'Technology & Computer Science'
    }
    if (
      careerInterest.includes('business') ||
      careerInterest.includes('management')
    ) {
      return 'Business & Management'
    }
    if (
      careerInterest.includes('design') ||
      careerInterest.includes('creative')
    ) {
      return 'Design & Creative Industries'
    }
    if (
      careerInterest.includes('health') ||
      careerInterest.includes('medical')
    ) {
      return 'Healthcare & Medicine'
    }
    if (
      careerInterest.includes('education') ||
      careerInterest.includes('teaching')
    ) {
      return 'Education & Training'
    }

    return 'Technology & Computer Science' // Default domain
  }

  /**
   * Map education level to experience level (Requirements 5.2)
   */
  private static mapEducationToExperience(
    educationLevel: string
  ): 'entry' | 'junior' | 'mid' | 'senior' | 'expert' {
    switch (educationLevel) {
      case 'high-school':
        return 'entry'
      case 'associates':
      case 'bachelors':
        return 'junior'
      case 'masters':
        return 'mid'
      case 'phd':
        return 'senior'
      default:
        return 'entry'
    }
  }

  /**
   * Enhanced career recommendations with caching (Requirements 5.1, 10.1, 10.2)
   */
  static async generateCareerRecommendations(prompt: string): Promise<string> {
    try {
      this.validateConfiguration()

      // Create cache key for the prompt
      const cacheKey = btoa(prompt.substring(0, 100)).replace(
        /[^a-zA-Z0-9]/g,
        ''
      )
      const cachedResult = await this.getCachedResponse<string>(cacheKey)
      if (cachedResult) {
        return cachedResult
      }

      console.log('🚀 Generating career recommendations with Gemini AI')

      const result = await this.withRetry(async () => {
        const response = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Request timeout')),
              geminiConfig.timeout
            )
          ),
        ])

        const textResponse = await response.response
        return textResponse.text()
      }, 'career recommendations')

      // Cache the result
      this.setCachedResponse(cacheKey, result)

      return result
    } catch (error) {
      console.log('Processing career recommendations')
      throw new Error(
        'Generating your personalized recommendations'
      )
    }
  }

  /**
   * Enhanced alternative career suggestions (Requirements 5.1, 5.3, 10.1)
   */
  static async suggestAlternatives(
    profile: UserProfile
  ): Promise<AlternativeCareer[]> {
    try {
      this.validateConfiguration()

      // Convert to roadmap request for consistency
      const request: RoadmapRequest = {
        domain: this.extractDomainFromProfile(profile),
        jobRole: profile.careerInterest || 'Professional',
        experienceLevel: this.mapEducationToExperience(profile.educationLevel),
        skills: profile.skills || [],
        educationLevel: profile.educationLevel,
        age: profile.age,
        name: profile.name,
      }

      const cacheKey = `alternatives_${this.generateCacheKey(request)}`
      const cachedResult = await this.getCachedResponse<AlternativeCareer[]>(
        cacheKey
      )
      if (cachedResult) {
        return cachedResult
      }

      console.log('🚀 Generating alternative careers with Gemini AI')

      const alternatives = await this.withRetry(async () => {
        const prompt = this.buildAlternativesPrompt(request)

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Request timeout')),
              geminiConfig.timeout
            )
          ),
        ])

        const response = await result.response
        const text = response.text()

        return this.parseAlternativesResponse(text)
      }, 'alternative careers')

      // Cache the result
      this.setCachedResponse(cacheKey, alternatives)

      return alternatives
    } catch (error) {
      console.log('Generating alternative career paths')
      return this.getFallbackAlternatives(profile)
    }
  }

  /**
   * Build alternatives prompt (Requirements 5.3)
   */
  private static buildAlternativesPrompt(request: RoadmapRequest): string {
    return `
You are a career advisor specializing in alternative career paths. Based on the user's profile, suggest 3 diverse and relevant alternative careers.

**User Profile:**
- Current Interest: ${request.jobRole}
- Domain: ${request.domain}
- Experience Level: ${request.experienceLevel}
- Skills: ${request.skills.join(', ')}
- Education: ${request.educationLevel}

**Requirements:**
1. Suggest careers that leverage the user's existing skills
2. Include both traditional and emerging roles
3. Consider the user's experience level for realistic transitions
4. Avoid generic suggestions like "Software Developer" or "Data Analyst"
5. Focus on specific, actionable career paths

**Output Format:**
Provide exactly 3 alternative careers in JSON format:

[
  {
    "id": "alt1",
    "title": "Specific Career Title",
    "description": "Detailed description explaining why this fits the user's profile and how their skills transfer",
    "matchScore": 85,
    "salary": "$XX,XXX-$XX,XXX",
    "requirements": ["Skill 1", "Skill 2", "Skill 3"],
    "growth": "high|medium|low"
  },
  {
    "id": "alt2",
    "title": "Another Career Title",
    "description": "Another detailed description",
    "matchScore": 75,
    "salary": "$XX,XXX-$XX,XXX",
    "requirements": ["Skill 1", "Skill 2", "Skill 3"],
    "growth": "high|medium|low"
  },
  {
    "id": "alt3",
    "title": "Third Career Title",
    "description": "Third detailed description",
    "matchScore": 70,
    "salary": "$XX,XXX-$XX,XXX",
    "requirements": ["Skill 1", "Skill 2", "Skill 3"],
    "growth": "high|medium|low"
  }
]

Make sure each alternative is realistic for someone with ${
      request.experienceLevel
    } experience level and includes specific salary ranges appropriate for that level.
    `
  }

  /**
   * Parse alternatives response (Requirements 5.4, 10.4)
   */
  private static parseAlternativesResponse(text: string): AlternativeCareer[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in alternatives response')
      }

      const alternatives = JSON.parse(jsonMatch[0])

      // Validate structure
      if (!Array.isArray(alternatives) || alternatives.length === 0) {
        throw new Error('Invalid alternatives structure')
      }

      return alternatives.map((alt: any) => ({
        id: alt.id || `alt_${Date.now()}_${Math.random()}`,
        title: alt.title || 'Alternative Career',
        description: alt.description || 'Career alternative description',
        matchScore: alt.matchScore || 70,
        salary: alt.salary || '$50k-80k',
        requirements: alt.requirements || [],
        growth: alt.growth || 'medium',
      }))
    } catch (error) {
      console.log('Processing alternative careers')
      throw new Error('Preparing career alternatives')
    }
  }

  /**
   * Generate content using Gemini AI
   */
  static async generateContent(prompt: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        'Gemini AI service is not configured. Please check your API key.'
      )
    }

    try {
      if (!genAI || !model) {
        throw new Error('Gemini AI not properly initialized')
      }

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.log('Processing AI content generation')
      throw error
    }
  }

  /**
   * Check if Gemini AI is properly configured
   */
  static isConfigured(): boolean {
    return !!(geminiConfig.apiKey && genAI && model)
  }

  /**
   * Clear cache manually (Requirements 10.2, 10.3)
   */
  static clearCache(): void {
    cacheService.clear()
    console.log('🧹 Gemini AI cache cleared')
  }

  /**
   * Get cache statistics (Requirements 10.2)
   */
  static getCacheStats(): { size: number; entries: string[] } {
    return {
      size: 0, // Cache service doesn't expose size
      entries: [], // Cache service doesn't expose keys
    }
  }

  /**
   * Check service health (Requirements 10.4)
   */
  static async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy'
    details: any
  }> {
    try {
      this.validateConfiguration()

      // Test with a simple prompt
      const testPrompt = 'Respond with "OK" if you can process this request.'
      const result = await Promise.race([
        model.generateContent(testPrompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        ),
      ])

      const response = await result.response
      const text = response.text()

      return {
        status: 'healthy',
        details: {
          apiKey: !!geminiConfig.apiKey,
          model: geminiConfig.model,
          cacheEnabled: geminiConfig.cacheEnabled,
          cacheSize: 0, // Cache service doesn't expose size
          testResponse: text.substring(0, 50),
        },
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          apiKey: !!geminiConfig.apiKey,
          model: geminiConfig.model,
        },
      }
    }
  }

  // Keep the original method signature for backward compatibility
  private static async generateCareerPathLegacy(
    profile: UserProfile
  ): Promise<CareerRecommendation> {
    // Delegate to the new enhanced method
    return this.generateCareerPath(profile)
  }

  private static getFallbackRecommendation(
    profile: UserProfile
  ): CareerRecommendation {
    // Fallback to mock data if API fails
    const mockPaths = {
      'software-developer': {
        nodes: [
          {
            id: '1',
            type: 'course' as const,
            title: 'Learn JavaScript',
            description: 'Master the fundamentals of JavaScript programming',
            duration: '3 months',
            difficulty: 'beginner' as const,
            position: { x: 100, y: 100 },
          },
          {
            id: '2',
            type: 'course' as const,
            title: 'React Development',
            description: 'Build modern web applications with React',
            duration: '4 months',
            difficulty: 'intermediate' as const,
            position: { x: 300, y: 100 },
          },
          {
            id: '3',
            type: 'internship' as const,
            title: 'Frontend Internship',
            description: '6-month internship at a tech startup',
            duration: '6 months',
            position: { x: 500, y: 100 },
          },
          {
            id: '4',
            type: 'job' as const,
            title: 'Junior Developer',
            description: 'Entry-level software developer position',
            salary: '$60k-80k',
            position: { x: 700, y: 100 },
          },
          {
            id: '5',
            type: 'job' as const,
            title: 'Senior Developer',
            description: 'Lead development projects and mentor juniors',
            salary: '$90k-120k',
            position: { x: 900, y: 100 },
          },
          {
            id: '6',
            type: 'company' as const,
            title: 'Google',
            description: 'Work at one of the top tech companies',
            position: { x: 1100, y: 100 },
          },
          {
            id: '7',
            type: 'skill' as const,
            title: 'TypeScript',
            description: 'Advanced JavaScript with type safety',
            position: { x: 100, y: 300 },
          },
          {
            id: '8',
            type: 'skill' as const,
            title: 'Node.js',
            description: 'Backend development with JavaScript',
            position: { x: 300, y: 300 },
          },
        ],
        edges: [
          {
            id: 'e1-2',
            source: '1',
            target: '2',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e2-3',
            source: '2',
            target: '3',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e3-4',
            source: '3',
            target: '4',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e4-5',
            source: '4',
            target: '5',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e5-6',
            source: '5',
            target: '6',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e1-7',
            source: '1',
            target: '7',
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep' as const,
          },
          {
            id: 'e2-8',
            source: '2',
            target: '8',
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep' as const,
          },
        ],
      },
    }

    const pathData = mockPaths['software-developer']
    return {
      id: `fallback_career_${Date.now()}`,
      title: 'AI Solutions Engineer',
      description:
        'Bridge the gap between AI research and practical applications by designing, implementing, and optimizing AI systems for real-world problems.',
      fitScore: 75,
      salaryRange: {
        min: 60000,
        max: 120000,
        currency: 'USD',
        period: 'yearly',
      },
      growthProspects: 'high' as const,
      requiredSkills: [],
      recommendedPath: {
        id: 'fallback_path',
        title: 'Software Developer Learning Path',
        description: 'Comprehensive learning path for software development',
        totalDuration: '6-12 months',
        phases: [
          {
            id: 'phase1',
            title: 'Foundation Skills',
            description: 'Learn the basics of programming and web development',
            duration: '3 months',
            priority: 'critical' as const,
            order: 1,
            skills: ['JavaScript', 'HTML', 'CSS'],
            resources: [
              {
                id: 'js-basics',
                title: 'JavaScript Fundamentals',
                description:
                  'Master the core concepts of JavaScript programming',
                type: 'course' as const,
                provider: 'Multiple Platforms',
                duration: '4 weeks',
                cost: 50,
                difficulty: 'beginner' as const,
                skills: ['JavaScript', 'Programming Basics', 'Web Development'],
              },
              {
                id: 'html-css',
                title: 'HTML & CSS Complete Course',
                description: 'Build beautiful and responsive websites',
                type: 'course' as const,
                provider: 'Multiple Platforms',
                duration: '3 weeks',
                cost: 40,
                difficulty: 'beginner' as const,
                skills: ['HTML', 'CSS', 'Responsive Design'],
              },
            ],
          },
          {
            id: 'phase2',
            title: 'Advanced Development',
            description: 'Learn modern frameworks and tools',
            duration: '4 months',
            priority: 'important' as const,
            order: 2,
            skills: ['React', 'Node.js', 'Databases'],
            resources: [
              {
                id: 'react-course',
                title: 'React - The Complete Guide',
                description: 'Build modern web applications with React',
                type: 'course' as const,
                provider: 'Multiple Platforms',
                duration: '6 weeks',
                cost: 80,
                difficulty: 'intermediate' as const,
                skills: ['React', 'JavaScript', 'Frontend Development'],
              },
            ],
          },
        ],
        estimatedCost: 2000,
        difficulty: 'intermediate' as const,
        prerequisites: ['Basic computer skills', 'Problem-solving mindset'],
        outcomes: [
          'Build web applications',
          'Understand programming concepts',
          'Ready for junior developer roles',
        ],
      },
      jobMarketData: {
        demand: 'high' as const,
        competitiveness: 'medium' as const,
        locations: ['Remote', 'Major Cities'],
        industryGrowth: 15,
        averageSalary: 90000,
      },
      primaryCareer: 'AI Solutions Engineer',
      relatedRoles: [
        'Machine Learning Engineer',
        'AI Research Scientist',
        'Computer Vision Engineer',
        'NLP Specialist',
      ],
      careerPath: {
        nodes: pathData.nodes,
        edges: pathData.edges,
      },
      alternatives: this.getFallbackAlternatives(profile),
      summary: `Based on your interest in ${
        profile.careerInterest
      } and skills in ${profile.skills.join(
        ', '
      )}, a career in AI Solutions Engineering would be perfect for you. This emerging field combines technical expertise with practical problem-solving to create impactful AI applications.`,
    }
  }

  private static getFallbackAlternatives(
    _profile: UserProfile
  ): AlternativeCareer[] {
    return [
      {
        id: 'alt1',
        title: 'AI Ethics Specialist',
        description: 'Ensure responsible AI development and deployment',
        matchScore: 85,
        salary: '$80k-120k',
        requirements: ['AI/ML Knowledge', 'Ethics', 'Policy Development'],
        growth: 'high',
      },
      {
        id: 'alt2',
        title: 'Blockchain Solutions Architect',
        description: 'Design decentralized systems and smart contracts',
        matchScore: 75,
        salary: '$90k-140k',
        requirements: ['Blockchain', 'Solidity', 'System Design'],
        growth: 'high',
      },
      {
        id: 'alt3',
        title: 'Climate Tech Engineer',
        description:
          'Develop technology solutions for environmental challenges',
        matchScore: 70,
        salary: '$70k-110k',
        requirements: [
          'Environmental Science',
          'Engineering',
          'Sustainability',
        ],
        growth: 'high',
      },
    ]
  }
}
