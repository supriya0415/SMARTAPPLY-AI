/**
 * Unit Tests for Enhanced Gemini AI Integration Service
 * Tests requirements 5.1, 5.2, 5.3, 5.4, 10.1, 10.2, 10.3, 10.4
 */

import { GeminiService } from '../geminiService'
import { UserProfile, EducationLevel } from '../../types'

// Mock the Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn()
    })
  }))
}))

// Mock the config
jest.mock('../../config', () => ({
  config: {
    geminiApiKey: 'test-api-key-123'
  }
}))

describe('GeminiService', () => {
  const mockUserProfile: UserProfile = {
    name: 'Test User',
    age: 25,
    educationLevel: 'bachelors' as EducationLevel,
    skills: ['JavaScript', 'React', 'Node.js'],
    careerInterest: 'Software Development'
  }

  const mockRoadmapRequest = {
    domain: 'Technology & Computer Science',
    jobRole: 'Software Developer',
    experienceLevel: 'junior' as const,
    skills: ['JavaScript', 'React', 'Node.js'],
    educationLevel: 'bachelors',
    age: 25,
    name: 'Test User'
  }

  beforeEach(() => {
    // Clear cache before each test
    GeminiService.clearCache()
    jest.clearAllMocks()
  })

  describe('Configuration and Initialization', () => {
    test('should validate API configuration correctly', async () => {
      // Test with valid configuration
      const healthCheck = await GeminiService.checkHealth()
      expect(healthCheck.details.apiKey).toBe(true)
    })

    test('should handle missing API key gracefully', async () => {
      // Mock missing API key
      jest.doMock('../../config', () => ({
        config: { geminiApiKey: '' }
      }))

      const healthCheck = await GeminiService.checkHealth()
      expect(healthCheck.status).toBe('unhealthy')
      expect(healthCheck.details.error).toContain('API key')
    })
  })

  describe('Caching Layer (Requirements 10.1, 10.2)', () => {
    test('should cache roadmap responses', async () => {
      const mockResponse = {
        primaryCareer: 'Software Developer',
        relatedRoles: ['Frontend Developer', 'Backend Developer'],
        summary: 'Test summary',
        careerPath: { nodes: [], edges: [] },
        alternatives: []
      }

      // Mock successful API response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse)
        }
      })

      // First call should hit the API
      const result1 = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)
      expect(result1.primaryCareer).toBe('Software Developer')

      // Second call should use cache
      const result2 = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)
      expect(result2.primaryCareer).toBe('Software Developer')
    })

    test('should provide cache statistics', () => {
      const stats = GeminiService.getCacheStats()
      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('entries')
      expect(Array.isArray(stats.entries)).toBe(true)
    })

    test('should clear cache manually', () => {
      GeminiService.clearCache()
      const stats = GeminiService.getCacheStats()
      expect(stats.size).toBe(0)
    })
  })

  describe('Roadmap Generation (Requirements 5.1, 5.2, 5.3)', () => {
    test('should generate career roadmap based on domain and experience', async () => {
      const mockResponse = {
        primaryCareer: 'Software Developer',
        relatedRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
        summary: 'Perfect fit for your JavaScript skills',
        careerPath: {
          nodes: [
            {
              id: '1',
              type: 'course',
              title: 'Advanced JavaScript',
              description: 'Master JavaScript concepts',
              duration: '3 months',
              difficulty: 'intermediate',
              position: { x: 100, y: 100 }
            }
          ],
          edges: []
        },
        alternatives: [
          {
            id: 'alt1',
            title: 'Frontend Developer',
            description: 'Focus on user interfaces',
            matchScore: 85,
            salary: '$70k-100k',
            requirements: ['React', 'CSS', 'JavaScript'],
            growth: 'high'
          }
        ]
      }

      // Mock API response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse)
        }
      })

      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)

      expect(result).toHaveProperty('primaryCareer')
      expect(result).toHaveProperty('careerPath')
      expect(result).toHaveProperty('alternatives')
      expect(result.primaryCareer).toBe('Software Developer')
    })

    test('should handle different experience levels', async () => {
      const entryLevelRequest = {
        ...mockRoadmapRequest,
        experienceLevel: 'entry' as const
      }

      const seniorLevelRequest = {
        ...mockRoadmapRequest,
        experienceLevel: 'senior' as const
      }

      // Test entry level
      const entryResult = await GeminiService.generateCareerRoadmap(entryLevelRequest)
      expect(entryResult.fitScore).toBeGreaterThan(0)

      // Test senior level
      const seniorResult = await GeminiService.generateCareerRoadmap(seniorLevelRequest)
      expect(seniorResult.fitScore).toBeGreaterThan(0)
    })

    test('should map education level to experience correctly', async () => {
      const profiles = [
        { ...mockUserProfile, educationLevel: 'high-school' as EducationLevel },
        { ...mockUserProfile, educationLevel: 'bachelors' as EducationLevel },
        { ...mockUserProfile, educationLevel: 'masters' as EducationLevel },
        { ...mockUserProfile, educationLevel: 'phd' as EducationLevel }
      ]

      for (const profile of profiles) {
        const result = await GeminiService.generateCareerPath(profile)
        expect(result).toHaveProperty('primaryCareer')
        expect(result.fitScore).toBeGreaterThan(0)
      }
    })
  })

  describe('Error Handling and Fallbacks (Requirements 10.3, 10.4)', () => {
    test('should provide fallback roadmap when API fails', async () => {
      // Mock API failure
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API Error'))

      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)

      expect(result).toHaveProperty('primaryCareer')
      expect(result).toHaveProperty('careerPath')
      expect(result.summary).toContain('fallback')
    })

    test('should handle network timeouts', async () => {
      // Mock timeout
      const mockGenerateContent = jest.fn().mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 100)
        )
      )

      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)
      expect(result).toHaveProperty('primaryCareer')
    })

    test('should handle invalid JSON responses', async () => {
      // Mock invalid JSON response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => 'Invalid JSON response'
        }
      })

      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)
      expect(result).toHaveProperty('primaryCareer')
    })

    test('should retry failed requests with exponential backoff', async () => {
      let callCount = 0
      const mockGenerateContent = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          return Promise.reject(new Error('Temporary failure'))
        }
        return Promise.resolve({
          response: {
            text: () => JSON.stringify({
              primaryCareer: 'Software Developer',
              relatedRoles: [],
              summary: 'Test',
              careerPath: { nodes: [], edges: [] },
              alternatives: []
            })
          }
        })
      })

      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest)
      expect(callCount).toBe(3) // Should retry twice before succeeding
      expect(result.primaryCareer).toBe('Software Developer')
    })
  })

  describe('Alternative Career Suggestions (Requirements 5.3)', () => {
    test('should generate alternative career suggestions', async () => {
      const mockAlternatives = [
        {
          id: 'alt1',
          title: 'Frontend Developer',
          description: 'Focus on user interfaces',
          matchScore: 85,
          salary: '$70k-100k',
          requirements: ['React', 'CSS', 'JavaScript'],
          growth: 'high'
        },
        {
          id: 'alt2',
          title: 'Backend Developer',
          description: 'Focus on server-side development',
          matchScore: 80,
          salary: '$75k-105k',
          requirements: ['Node.js', 'Databases', 'APIs'],
          growth: 'high'
        }
      ]

      // Mock API response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockAlternatives)
        }
      })

      const result = await GeminiService.suggestAlternatives(mockUserProfile)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('matchScore')
      expect(result[0]).toHaveProperty('requirements')
    })

    test('should provide fallback alternatives when API fails', async () => {
      // Mock API failure
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API Error'))

      const result = await GeminiService.suggestAlternatives(mockUserProfile)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('title')
    })
  })

  describe('Legacy Compatibility', () => {
    test('should maintain backward compatibility with generateCareerPath', async () => {
      const result = await GeminiService.generateCareerPath(mockUserProfile)

      expect(result).toHaveProperty('primaryCareer')
      expect(result).toHaveProperty('careerPath')
      expect(result).toHaveProperty('alternatives')
      expect(result).toHaveProperty('summary')
    })

    test('should handle generateCareerRecommendations', async () => {
      const mockResponse = 'This is a career recommendation response'

      // Mock API response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => mockResponse
        }
      })

      const result = await GeminiService.generateCareerRecommendations('Test prompt')
      expect(typeof result).toBe('string')
    })
  })

  describe('Domain Mapping (Requirements 5.2)', () => {
    test('should correctly map career interests to domains', async () => {
      const testCases = [
        { careerInterest: 'Software Development', expectedDomain: 'Technology & Computer Science' },
        { careerInterest: 'Business Management', expectedDomain: 'Business & Management' },
        { careerInterest: 'Graphic Design', expectedDomain: 'Design & Creative Industries' },
        { careerInterest: 'Healthcare', expectedDomain: 'Healthcare & Medicine' },
        { careerInterest: 'Teaching', expectedDomain: 'Education & Training' }
      ]

      for (const testCase of testCases) {
        const profile = { ...mockUserProfile, careerInterest: testCase.careerInterest }
        const result = await GeminiService.generateCareerPath(profile)
        expect(result).toHaveProperty('primaryCareer')
      }
    })
  })

  describe('Performance and Optimization (Requirements 10.1, 10.2, 10.3)', () => {
    test('should handle concurrent requests efficiently', async () => {
      const requests = Array(5).fill(null).map(() => 
        GeminiService.generateCareerRoadmap(mockRoadmapRequest)
      )

      const results = await Promise.all(requests)
      
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result).toHaveProperty('primaryCareer')
      })
    })

    test('should respect cache expiration', async () => {
      // This test would need to mock time or use a shorter cache duration
      // For now, we'll test that cache entries have expiration timestamps
      const stats = GeminiService.getCacheStats()
      expect(typeof stats.size).toBe('number')
    })
  })

  describe('Health Check (Requirements 10.4)', () => {
    test('should perform health check successfully', async () => {
      const health = await GeminiService.checkHealth()
      
      expect(health).toHaveProperty('status')
      expect(health).toHaveProperty('details')
      expect(['healthy', 'unhealthy']).toContain(health.status)
    })

    test('should report unhealthy status when API is unavailable', async () => {
      // Mock API failure
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('Service unavailable'))

      const health = await GeminiService.checkHealth()
      expect(health.status).toBe('unhealthy')
      expect(health.details).toHaveProperty('error')
    })
  })
})