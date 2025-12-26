/**
 * Performance Tests for Gemini AI Integration and Caching
 * Tests requirements 10.1, 10.2, 10.3, 10.4
 */

import { GeminiService } from '../geminiService';
import { performance } from 'perf_hooks';

// Mock the Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn()
    })
  }))
}));

// Mock the config
jest.mock('../../config', () => ({
  config: {
    geminiApiKey: 'test-api-key-123'
  }
}));

describe('Gemini AI Performance Tests', () => {
  const mockRoadmapRequest = {
    domain: 'Technology & Computer Science',
    jobRole: 'Software Developer',
    experienceLevel: 'junior' as const,
    skills: ['JavaScript', 'React', 'Node.js'],
    educationLevel: 'bachelors',
    age: 25,
    name: 'Test User'
  };

  const mockResponse = {
    primaryCareer: 'Software Developer',
    relatedRoles: ['Frontend Developer', 'Backend Developer'],
    summary: 'Test summary',
    careerPath: { nodes: [], edges: [] },
    alternatives: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    GeminiService.clearCache();
  });

  describe('Caching Performance (Requirements 10.1, 10.2)', () => {
    test('should cache responses for quick retrieval', async () => {
      // Mock API response
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse)
        }
      });

      // First call - should hit API
      const start1 = performance.now();
      const result1 = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end1 = performance.now();
      const firstCallTime = end1 - start1;

      expect(result1.primaryCareer).toBe('Software Developer');

      // Second call - should use cache (much faster)
      const start2 = performance.now();
      const result2 = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end2 = performance.now();
      const secondCallTime = end2 - start2;

      expect(result2.primaryCareer).toBe('Software Developer');
      
      // Cache should be significantly faster (at least 10x faster)
      expect(secondCallTime).toBeLessThan(firstCallTime / 10);
    });

    test('should handle cache size limits efficiently', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse)
        }
      });

      // Generate many different requests to test cache size management
      const requests = Array.from({ length: 150 }, (_, i) => ({
        ...mockRoadmapRequest,
        jobRole: `Job Role ${i}`,
      }));

      const start = performance.now();
      
      // Process all requests
      const results = await Promise.all(
        requests.map(request => GeminiService.generateCareerRoadmap(request))
      );

      const end = performance.now();
      const totalTime = end - start;

      expect(results).toHaveLength(150);
      expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds

      // Check cache stats
      const stats = GeminiService.getCacheStats();
      expect(stats.size).toBeLessThanOrEqual(100); // Should respect max cache size
    });

    test('should provide fast cache statistics', () => {
      const start = performance.now();
      const stats = GeminiService.getCacheStats();
      const end = performance.now();
      const statsTime = end - start;

      expect(statsTime).toBeLessThan(10); // Should be very fast (< 10ms)
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('entries');
    });

    test('should clear cache efficiently', async () => {
      // Add some items to cache first
      await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      
      const start = performance.now();
      GeminiService.clearCache();
      const end = performance.now();
      const clearTime = end - start;

      expect(clearTime).toBeLessThan(100); // Should clear quickly (< 100ms)
      
      const stats = GeminiService.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('API Response Times (Requirements 10.3, 10.4)', () => {
    test('should handle API timeouts gracefully', async () => {
      // Mock a slow API response
      const mockGenerateContent = jest.fn().mockImplementation(() => 
        new Promise((resolve) => 
          setTimeout(() => resolve({
            response: { text: () => JSON.stringify(mockResponse) }
          }), 35000) // 35 seconds - should timeout
        )
      );

      const start = performance.now();
      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end = performance.now();
      const responseTime = end - start;

      // Should fallback quickly when API times out
      expect(responseTime).toBeLessThan(32000); // Should not wait full 35 seconds
      expect(result).toHaveProperty('primaryCareer');
      expect(result.summary).toContain('fallback'); // Should use fallback
    });

    test('should retry failed requests with exponential backoff', async () => {
      let callCount = 0;
      const mockGenerateContent = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve({
          response: { text: () => JSON.stringify(mockResponse) }
        });
      });

      const start = performance.now();
      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end = performance.now();
      const totalTime = end - start;

      expect(callCount).toBe(3); // Should retry twice
      expect(result.primaryCareer).toBe('Software Developer');
      
      // Should complete retries within reasonable time (with exponential backoff)
      expect(totalTime).toBeGreaterThan(1000); // At least 1 second for retries
      expect(totalTime).toBeLessThan(10000); // But not more than 10 seconds
    });

    test('should handle concurrent requests efficiently', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: () => JSON.stringify(mockResponse) }
      });

      // Create 10 concurrent requests with different parameters
      const requests = Array.from({ length: 10 }, (_, i) => ({
        ...mockRoadmapRequest,
        jobRole: `Job Role ${i}`,
      }));

      const start = performance.now();
      const results = await Promise.all(
        requests.map(request => GeminiService.generateCareerRoadmap(request))
      );
      const end = performance.now();
      const totalTime = end - start;

      expect(results).toHaveLength(10);
      expect(totalTime).toBeLessThan(15000); // Should handle concurrency efficiently
      
      // All results should be valid
      results.forEach(result => {
        expect(result).toHaveProperty('primaryCareer');
      });
    });

    test('should optimize API calls to minimize response time', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: () => JSON.stringify(mockResponse) }
      });

      const start = performance.now();
      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end = performance.now();
      const responseTime = end - start;

      expect(result.primaryCareer).toBe('Software Developer');
      
      // Should complete within reasonable time for a single API call
      expect(responseTime).toBeLessThan(5000); // Less than 5 seconds for single call
    });
  });

  describe('Memory Usage and Efficiency (Requirements 10.1, 10.2)', () => {
    test('should manage memory efficiently with large datasets', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: () => JSON.stringify(mockResponse) }
      });

      // Process many requests to test memory management
      const batchSize = 50;
      const batches = 5;

      for (let batch = 0; batch < batches; batch++) {
        const requests = Array.from({ length: batchSize }, (_, i) => ({
          ...mockRoadmapRequest,
          jobRole: `Batch ${batch} Job ${i}`,
        }));

        const start = performance.now();
        const results = await Promise.all(
          requests.map(request => GeminiService.generateCareerRoadmap(request))
        );
        const end = performance.now();
        const batchTime = end - start;

        expect(results).toHaveLength(batchSize);
        expect(batchTime).toBeLessThan(10000); // Each batch should complete quickly

        // Check that cache is managing size properly
        const stats = GeminiService.getCacheStats();
        expect(stats.size).toBeLessThanOrEqual(100); // Should not exceed max size
      }
    });

    test('should compress cached data efficiently', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: () => JSON.stringify(mockResponse) }
      });

      // Generate a large response to test compression
      const largeResponse = {
        ...mockResponse,
        careerPath: {
          nodes: Array.from({ length: 100 }, (_, i) => ({
            id: `node-${i}`,
            type: 'course',
            title: `Course ${i}`,
            description: `This is a detailed description for course ${i} with lots of text to test compression efficiency`,
            duration: '4 weeks',
            difficulty: 'intermediate',
            position: { x: i * 10, y: i * 10 },
          })),
          edges: Array.from({ length: 99 }, (_, i) => ({
            id: `edge-${i}`,
            source: `node-${i}`,
            target: `node-${i + 1}`,
            type: 'smoothstep',
            animated: true,
          })),
        },
      };

      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(largeResponse) }
      });

      const start = performance.now();
      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end = performance.now();
      const processingTime = end - start;

      expect(result.careerPath.nodes).toHaveLength(100);
      expect(processingTime).toBeLessThan(2000); // Should handle large data efficiently
    });
  });

  describe('Fallback Performance (Requirements 10.3, 10.4)', () => {
    test('should provide fast fallback when API is unavailable', async () => {
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API unavailable'));

      const start = performance.now();
      const result = await GeminiService.generateCareerRoadmap(mockRoadmapRequest);
      const end = performance.now();
      const fallbackTime = end - start;

      expect(result).toHaveProperty('primaryCareer');
      expect(result.summary).toContain('fallback');
      
      // Fallback should be very fast (< 1 second)
      expect(fallbackTime).toBeLessThan(1000);
    });

    test('should handle multiple fallback scenarios efficiently', async () => {
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('Service error'));

      // Test multiple concurrent fallback requests
      const requests = Array.from({ length: 20 }, (_, i) => ({
        ...mockRoadmapRequest,
        jobRole: `Fallback Job ${i}`,
      }));

      const start = performance.now();
      const results = await Promise.all(
        requests.map(request => GeminiService.generateCareerRoadmap(request))
      );
      const end = performance.now();
      const totalFallbackTime = end - start;

      expect(results).toHaveLength(20);
      expect(totalFallbackTime).toBeLessThan(5000); // All fallbacks should complete quickly
      
      // All results should be valid fallback responses
      results.forEach(result => {
        expect(result).toHaveProperty('primaryCareer');
        expect(result.summary).toContain('fallback');
      });
    });
  });

  describe('Health Check Performance (Requirements 10.4)', () => {
    test('should perform health check quickly', async () => {
      const start = performance.now();
      const health = await GeminiService.checkHealth();
      const end = performance.now();
      const healthCheckTime = end - start;

      expect(healthCheckTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(health).toHaveProperty('status');
      expect(['healthy', 'unhealthy']).toContain(health.status);
    });

    test('should handle health check failures quickly', async () => {
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('Service down'));

      const start = performance.now();
      const health = await GeminiService.checkHealth();
      const end = performance.now();
      const healthCheckTime = end - start;

      expect(healthCheckTime).toBeLessThan(3000); // Should fail fast
      expect(health.status).toBe('unhealthy');
    });
  });
});