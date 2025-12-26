import { LearningResource, PlatformLink, LearningPlatform } from '../types'

// Platform configurations
const PLATFORMS: LearningPlatform[] = [
  {
    id: 'udemy',
    name: 'Udemy',
    displayName: 'Udemy',
    logo: '🎓',
    baseUrl: 'https://www.udemy.com',
    searchTemplate: 'https://www.udemy.com/courses/search/?q={keywords}',
    strengths: ['programming', 'business', 'design']
  },
  {
    id: 'coursera',
    name: 'Coursera',
    displayName: 'Coursera',
    logo: '🏛️',
    baseUrl: 'https://www.coursera.org',
    searchTemplate: 'https://www.coursera.org/search?query={keywords}',
    strengths: ['academic', 'certifications', 'data-science']
  },
  {
    id: 'linkedin-learning',
    name: 'LinkedIn Learning',
    displayName: 'LinkedIn Learning',
    logo: '💼',
    baseUrl: 'https://www.linkedin.com/learning',
    searchTemplate: 'https://www.linkedin.com/learning/search?keywords={keywords}',
    strengths: ['business', 'soft-skills', 'professional']
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    displayName: 'freeCodeCamp',
    logo: '🔥',
    baseUrl: 'https://www.freecodecamp.org',
    searchTemplate: 'https://www.freecodecamp.org/learn',
    strengths: ['programming', 'web-development']
  }
]

export class LearningPlatformService {
  static generatePlatformLinks(resource: LearningResource): PlatformLink[] {
    try {
      console.log('Generating platform links for:', resource)
      
      const keywords = this.extractKeywords(resource)
      console.log('Extracted keywords:', keywords)
      
      const relevantPlatforms = this.getRelevantPlatforms(resource)
      console.log('Relevant platforms:', relevantPlatforms)
      
      const links = relevantPlatforms.map(platform => ({
        platform: platform.id,
        displayName: platform.displayName,
        url: this.buildSearchUrl(platform, keywords),
        logo: platform.logo,
        isRecommended: this.isPlatformRecommended(platform, resource)
      }))
      
      console.log('Generated links:', links)
      return links
    } catch (error) {
      console.error('Error generating platform links:', error)
      return []
    }
  }

  private static extractKeywords(resource: LearningResource): string[] {
    const keywords = []
    
    // Add title words
    if (resource.title) {
      keywords.push(...resource.title.toLowerCase().split(' '))
    }
    
    // Add skills (handle case where skills might be undefined or empty)
    if (resource.skills && resource.skills.length > 0) {
      keywords.push(...resource.skills.map(skill => skill.toLowerCase()))
    }
    
    // Add type
    if (resource.type) {
      keywords.push(resource.type)
    }
    
    // Add provider if available
    if (resource.provider && resource.provider !== 'Multiple Platforms') {
      keywords.push(resource.provider.toLowerCase())
    }
    
    // Clean and filter keywords
    const cleanedKeywords = keywords
      .filter(keyword => keyword && keyword.length > 2)
      .filter(keyword => !['the', 'and', 'for', 'with', 'course', 'learn', 'learning'].includes(keyword))
      .slice(0, 4) // Increase to top 4 keywords
    
    // If no good keywords found, use the title as fallback
    if (cleanedKeywords.length === 0 && resource.title) {
      return [resource.title.toLowerCase()]
    }
    
    return cleanedKeywords
  }

  private static getRelevantPlatforms(resource: LearningResource): LearningPlatform[] {
    // For simplicity, return all platforms but could be filtered based on resource type/skills
    return PLATFORMS
  }

  private static buildSearchUrl(platform: LearningPlatform, keywords: string[]): string {
    const searchQuery = keywords.join(' ')
    return platform.searchTemplate.replace('{keywords}', encodeURIComponent(searchQuery))
  }

  private static isPlatformRecommended(platform: LearningPlatform, resource: LearningResource): boolean {
    // More inclusive logic: recommend based on resource type and platform strengths
    const title = resource.title?.toLowerCase() || ''
    const skills = resource.skills?.map(s => s.toLowerCase()) || []
    const allText = [title, ...skills].join(' ')
    
    // Check if platform strengths match the content
    for (const strength of platform.strengths) {
      if (allText.includes(strength) || allText.includes(strength.replace('-', ' '))) {
        return true
      }
    }
    
    // Default recommendations based on type
    if (resource.type === 'course') {
      return platform.id === 'udemy' || platform.id === 'coursera'
    }
    if (resource.type === 'certification') {
      return platform.id === 'coursera' || platform.id === 'linkedin-learning'
    }
    
    // For business/management content, recommend LinkedIn Learning
    if (allText.includes('management') || allText.includes('business') || allText.includes('sem')) {
      return platform.id === 'linkedin-learning' || platform.id === 'coursera'
    }
    
    return false
  }

  static getAllPlatforms(): LearningPlatform[] {
    return PLATFORMS
  }

  static getPlatformById(id: string): LearningPlatform | undefined {
    return PLATFORMS.find(platform => platform.id === id)
  }
}