import { SKILL_TAXONOMY } from '../data/careerDatabase'

export interface SkillMatch {
  userSkill: string
  careerSkill: string
  similarity: number
  matchType: 'exact' | 'semantic' | 'transferable' | 'fuzzy'
  confidence: number
}

export interface SkillMatchResult {
  exactMatches: SkillMatch[]
  semanticMatches: SkillMatch[]
  transferableMatches: SkillMatch[]
  fuzzyMatches: SkillMatch[]
  overallSimilarity: number
  totalMatches: number
}

export class SemanticSkillAnalyzer {
  private skillSynonyms: Map<string, string[]>
  private skillCategories: Map<string, string>
  private normalizedSkills: Map<string, string>

  constructor() {
    this.skillSynonyms = new Map()
    this.skillCategories = new Map()
    this.normalizedSkills = new Map()
    this.initializeTaxonomy()
  }

  private initializeTaxonomy() {
    // Initialize synonyms map
    SKILL_TAXONOMY.synonyms.forEach(({ canonical, synonyms }) => {
      this.skillSynonyms.set(canonical.toLowerCase(), synonyms.map(s => s.toLowerCase()))
      synonyms.forEach(synonym => {
        this.skillSynonyms.set(synonym.toLowerCase(), [canonical.toLowerCase()])
      })
    })

    // Initialize categories map
    SKILL_TAXONOMY.categories.forEach(category => {
      category.skills.forEach(skill => {
        this.skillCategories.set(skill.toLowerCase(), category.id)
      })
    })

    // Initialize normalized skills
    this.initializeNormalizedSkills()
  }

  private initializeNormalizedSkills() {
    const commonNormalizations = [
      ['javascript', 'js'],
      ['typescript', 'ts'],
      ['react.js', 'react'],
      ['vue.js', 'vue'],
      ['node.js', 'nodejs'],
      ['html/css', 'html css'],
      ['frontend', 'front-end'],
      ['backend', 'back-end'],
      ['fullstack', 'full-stack'],
      ['ai/ml', 'artificial intelligence machine learning'],
      ['ui/ux', 'user interface user experience'],
      ['devops', 'development operations']
    ]

    commonNormalizations.forEach(([original, normalized]) => {
      this.normalizedSkills.set(original, normalized)
    })
  }

  /**
   * Normalize skill name for better matching
   */
  normalizeSkill(skill: string): string {
    const lower = skill.toLowerCase().trim()
    
    // Remove common prefixes/suffixes
    let normalized = lower
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Apply specific normalizations
    if (this.normalizedSkills.has(normalized)) {
      normalized = this.normalizedSkills.get(normalized)!
    }

    return normalized
  }

  /**
   * Calculate similarity between two skills
   */
  calculateSkillSimilarity(userSkill: string, careerSkill: string): SkillMatch {
    const normalizedUser = this.normalizeSkill(userSkill)
    const normalizedCareer = this.normalizeSkill(careerSkill)

    // Exact match
    if (normalizedUser === normalizedCareer) {
      return {
        userSkill,
        careerSkill,
        similarity: 1.0,
        matchType: 'exact',
        confidence: 1.0
      }
    }

    // Semantic match through synonyms
    const semanticSimilarity = this.calculateSemanticSimilarity(normalizedUser, normalizedCareer)
    if (semanticSimilarity > 0.8) {
      return {
        userSkill,
        careerSkill,
        similarity: semanticSimilarity,
        matchType: 'semantic',
        confidence: 0.9
      }
    }

    // Transferable skills (same category)
    const transferableSimilarity = this.calculateTransferableSimilarity(normalizedUser, normalizedCareer)
    if (transferableSimilarity > 0.6) {
      return {
        userSkill,
        careerSkill,
        similarity: transferableSimilarity,
        matchType: 'transferable',
        confidence: 0.7
      }
    }

    // Fuzzy string matching
    const fuzzySimilarity = this.calculateFuzzyStringSimilarity(normalizedUser, normalizedCareer)
    if (fuzzySimilarity > 0.7) {
      return {
        userSkill,
        careerSkill,
        similarity: fuzzySimilarity,
        matchType: 'fuzzy',
        confidence: 0.6
      }
    }

    return {
      userSkill,
      careerSkill,
      similarity: 0,
      matchType: 'fuzzy',
      confidence: 0
    }
  }

  /**
   * Calculate semantic similarity using synonyms and related terms
   */
  private calculateSemanticSimilarity(skill1: string, skill2: string): number {
    // Check direct synonyms
    const synonyms1 = this.skillSynonyms.get(skill1) || []
    const synonyms2 = this.skillSynonyms.get(skill2) || []

    if (synonyms1.includes(skill2) || synonyms2.includes(skill1)) {
      return 0.95
    }

    // Check if they share synonyms
    const sharedSynonyms = synonyms1.filter(s => synonyms2.includes(s))
    if (sharedSynonyms.length > 0) {
      return 0.85
    }

    // Check for partial matches in synonyms
    for (const syn1 of synonyms1) {
      for (const syn2 of synonyms2) {
        if (syn1.includes(syn2) || syn2.includes(syn1)) {
          return 0.75
        }
      }
    }

    return 0
  }

  /**
   * Calculate transferable skill similarity (same category)
   */
  private calculateTransferableSimilarity(skill1: string, skill2: string): number {
    const category1 = this.skillCategories.get(skill1)
    const category2 = this.skillCategories.get(skill2)

    if (category1 && category2 && category1 === category2) {
      // Same category, calculate based on how related they are
      if (category1 === 'programming') return 0.8
      if (category1 === 'web-development') return 0.75
      if (category1 === 'data-science') return 0.7
      if (category1 === 'cloud-platforms') return 0.7
      if (category1 === 'design') return 0.65
      return 0.6
    }

    // Check for cross-category transferability
    const transferableCategories = [
      ['programming', 'web-development'],
      ['data-science', 'programming'],
      ['cloud-platforms', 'programming'],
      ['design', 'web-development']
    ]

    for (const [cat1, cat2] of transferableCategories) {
      if ((category1 === cat1 && category2 === cat2) || 
          (category1 === cat2 && category2 === cat1)) {
        return 0.5
      }
    }

    return 0
  }

  /**
   * Calculate fuzzy string similarity using Levenshtein distance
   */
  private calculateFuzzyStringSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2)
    const maxLength = Math.max(str1.length, str2.length)
    
    if (maxLength === 0) return 1.0
    
    const similarity = 1 - (distance / maxLength)
    
    // Only consider it a match if similarity is high enough
    return similarity > 0.7 ? similarity : 0
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  /**
   * Analyze skill matches between user skills and career requirements
   */
  analyzeSkillMatches(userSkills: string[], careerSkills: string[]): SkillMatchResult {
    const exactMatches: SkillMatch[] = []
    const semanticMatches: SkillMatch[] = []
    const transferableMatches: SkillMatch[] = []
    const fuzzyMatches: SkillMatch[] = []

    let totalSimilarity = 0
    let matchCount = 0

    for (const careerSkill of careerSkills) {
      let bestMatch: SkillMatch | null = null

      for (const userSkill of userSkills) {
        const match = this.calculateSkillSimilarity(userSkill, careerSkill)
        
        if (match.similarity > 0 && (!bestMatch || match.similarity > bestMatch.similarity)) {
          bestMatch = match
        }
      }

      if (bestMatch && bestMatch.similarity > 0) {
        switch (bestMatch.matchType) {
          case 'exact':
            exactMatches.push(bestMatch)
            break
          case 'semantic':
            semanticMatches.push(bestMatch)
            break
          case 'transferable':
            transferableMatches.push(bestMatch)
            break
          case 'fuzzy':
            fuzzyMatches.push(bestMatch)
            break
        }

        totalSimilarity += bestMatch.similarity
        matchCount++
      }
    }

    const overallSimilarity = matchCount > 0 ? totalSimilarity / careerSkills.length : 0

    return {
      exactMatches,
      semanticMatches,
      transferableMatches,
      fuzzyMatches,
      overallSimilarity,
      totalMatches: matchCount
    }
  }

  /**
   * Get skill suggestions based on user's current skills
   */
  getSkillSuggestions(userSkills: string[], targetCategory?: string): string[] {
    const normalizedUserSkills = userSkills.map(skill => this.normalizeSkill(skill))
    const suggestions: string[] = []

    // Get skills from the same categories as user's skills
    const userCategories = new Set<string>()
    normalizedUserSkills.forEach(skill => {
      const category = this.skillCategories.get(skill)
      if (category) userCategories.add(category)
    })

    // Add complementary skills from user's categories
    SKILL_TAXONOMY.categories.forEach(category => {
      if (userCategories.has(category.id) || category.id === targetCategory) {
        category.skills.forEach(skill => {
          const normalized = this.normalizeSkill(skill)
          if (!normalizedUserSkills.includes(normalized)) {
            suggestions.push(skill)
          }
        })
      }
    })

    return suggestions.slice(0, 10) // Return top 10 suggestions
  }
}