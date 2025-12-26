/**
 * Integration Tests for Enhanced Gemini AI Service
 * Tests the actual implementation without complex mocking
 */

import { GeminiService } from '../geminiService'

describe('GeminiService Integration Tests', () => {
  beforeEach(() => {
    // Clear cache before each test
    GeminiService.clearCache()
  })

  describe('Cache Management', () => {
    test('should provide cache statistics', () => {
      const stats = GeminiService.getCacheStats()
      
      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('entries')
      expect(typeof stats.size).toBe('number')
      expect(Array.isArray(stats.entries)).toBe(true)
    })

    test('should clear cache successfully', () => {
      GeminiService.clearCache()
      const stats = GeminiService.getCacheStats()
      
      expect(stats.size).toBe(0)
      expect(stats.entries.length).toBe(0)
    })
  })

  describe('Health Check', () => {
    test('should perform health check and return status', async () => {
      const health = await GeminiService.checkHealth()
      
      expect(health).toHaveProperty('status')
      expect(health).toHaveProperty('details')
      expect(['healthy', 'unhealthy']).toContain(health.status)
      
      // Check details structure
      expect(health.details).toHaveProperty('apiKey')
      expect(health.details).toHaveProperty('model')
      expect(typeof health.details.apiKey).toBe('boolean')
      expect(typeof health.details.model).toBe('string')
    })
  })

  describe('Fallback Functionality', () => {
    test('should generate fallback roadmap when API is unavailable', async () => {
      const mockRequest = {
        domain: 'Technology & Computer Science',
        jobRole: 'Software Developer',
        experienceLevel: 'junior' as const,
        skills: ['JavaScript', 'React'],
        educationLevel: 'bachelors'
      }

      // This will likely use fallback since we don't have a real API key in tests
      const result = await GeminiService.generateCareerRoadmap(mockRequest)
      
      expect(result).toHaveProperty('primaryCareer')
      expect(result).toHaveProperty('careerPath')
      expect(result).toHaveProperty('alternatives')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('fitScore')
      
      // Verify structure
      expect(result.careerPath).toHaveProperty('nodes')
      expect(result.careerPath).toHaveProperty('edges')
      expect(Array.isArray(result.careerPath.nodes)).toBe(true)
      expect(Array.isArray(result.careerPath.edges)).toBe(true)
      expect(Array.isArray(result.alternatives)).toBe(true)
      
      // Verify fit score is reasonable
      expect(result.fitScore).toBeGreaterThan(0)
      expect(result.fitScore).toBeLessThanOrEqual(100)
    })

    test('should generate fallback alternatives when API fails', async () => {
      const mockProfile = {
        name: 'Test User',
        age: 25,
        educationLevel: 'bachelors' as const,
        skills: ['JavaScript', 'React'],
        careerInterest: 'Software Development'
      }

      const alternatives = await GeminiService.suggestAlternatives(mockProfile)
      
      expect(Array.isArray(alternatives)).toBe(true)
      expect(alternatives.length).toBeGreaterThan(0)
      
      // Check structure of first alternative
      if (alternatives.length > 0) {
        const alt = alternatives[0]
        expect(alt).toHaveProperty('id')
        expect(alt).toHaveProperty('title')
        expect(alt).toHaveProperty('description')
        expect(alt).toHaveProperty('matchScore')
        expect(alt).toHaveProperty('salary')
        expect(alt).toHaveProperty('requirements')
        expect(alt).toHaveProperty('growth')
        
        expect(typeof alt.title).toBe('string')
        expect(typeof alt.matchScore).toBe('number')
        expect(Array.isArray(alt.requirements)).toBe(true)
        expect(['high', 'medium', 'low']).toContain(alt.growth)
      }
    })
  })

  describe('Legacy Compatibility', () => {
    test('should maintain backward compatibility with generateCareerPath', async () => {
      const mockProfile = {
        name: 'Test User',
        age: 25,
        educationLevel: 'bachelors' as const,
        skills: ['JavaScript', 'React'],
        careerInterest: 'Software Development'
      }

      const result = await GeminiService.generateCareerPath(mockProfile)
      
      expect(result).toHaveProperty('primaryCareer')
      expect(result).toHaveProperty('careerPath')
      expect(result).toHaveProperty('alternatives')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('fitScore')
      expect(result).toHaveProperty('salaryRange')
      expect(result).toHaveProperty('growthProspects')
      expect(result).toHaveProperty('requiredSkills')
      expect(result).toHaveProperty('recommendedPath')
      expect(result).toHaveProperty('jobMarketData')
      
      // Verify salary range structure
      expect(result.salaryRange).toHaveProperty('min')
      expect(result.salaryRange).toHaveProperty('max')
      expect(result.salaryRange).toHaveProperty('currency')
      expect(result.salaryRange).toHaveProperty('period')
    })
  })

  describe('Data Validation', () => {
    test('should handle different experience levels correctly', async () => {
      const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'expert'] as const
      
      for (const level of experienceLevels) {
        const request = {
          domain: 'Technology & Computer Science',
          jobRole: 'Software Developer',
          experienceLevel: level,
          skills: ['JavaScript'],
          educationLevel: 'bachelors'
        }
        
        const result = await GeminiService.generateCareerRoadmap(request)
        expect(result.fitScore).toBeGreaterThan(0)
        expect(result.primaryCareer).toBeTruthy()
      }
    })

    test('should handle different domains correctly', async () => {
      const domains = [
        'Technology & Computer Science',
        'Business & Management',
        'Design & Creative Industries',
        'Healthcare & Medicine',
        'Education & Training'
      ]
      
      for (const domain of domains) {
        const request = {
          domain,
          jobRole: 'Professional',
          experienceLevel: 'junior' as const,
          skills: ['Communication'],
          educationLevel: 'bachelors'
        }
        
        const result = await GeminiService.generateCareerRoadmap(request)
        expect(result.primaryCareer).toBeTruthy()
        expect(result.alternatives.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Error Resilience', () => {
    test('should handle invalid requests gracefully', async () => {
      const invalidRequest = {
        domain: '',
        jobRole: '',
        experienceLevel: 'junior' as const,
        skills: [],
        educationLevel: ''
      }
      
      // Should not throw an error, should return fallback
      const result = await GeminiService.generateCareerRoadmap(invalidRequest)
      expect(result).toHaveProperty('primaryCareer')
    })

    test('should handle empty user profile gracefully', async () => {
      const emptyProfile = {
        name: '',
        age: 0,
        educationLevel: 'other' as const,
        skills: [],
        careerInterest: ''
      }
      
      // Should not throw an error, should return fallback
      const result = await GeminiService.generateCareerPath(emptyProfile)
      expect(result).toHaveProperty('primaryCareer')
    })
  })
})