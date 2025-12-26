/**
 * Optimization Examples
 * Implements requirements 10.1, 10.2, 10.3, 10.4
 * 
 * Examples of how to use the performance optimization features
 */

import { cacheService } from '../services/cacheService';
import { loadingService } from '../services/loadingService';
import { optimizedApiService } from '../services/optimizedApiService';
import { performanceMonitor } from '../services/performanceMonitorService';
import { GeminiService } from '../services/geminiService';
import { LearningResourcesService } from '../services/learningResourcesService';

/**
 * Example 1: Optimized data fetching with caching
 */
export async function fetchUserDataOptimized(userId: string) {
  const operationId = 'fetch-user-data';
  
  try {
    // Set loading state
    loadingService.setLoading(operationId, true, {
      message: 'Loading user data...',
      progress: 0
    });

    // Use cache-or-fetch pattern
    const userData = await cacheService.getOrSet(
      `user_data_${userId}`,
      async () => {
        loadingService.updateProgress(operationId, 30, 'Fetching from API...');
        
        // Simulate API call with performance monitoring
        return await performanceMonitor.measureAsync(
          'fetch_user_api',
          async () => {
            const response = await fetch(`/api/users/${userId}`);
            return response.json();
          }
        );
      },
      30 * 60 * 1000 // 30 minutes TTL
    );

    loadingService.updateProgress(operationId, 100, 'Data loaded successfully');
    loadingService.setLoading(operationId, false);

    return userData;
  } catch (error) {
    loadingService.setError(operationId, (error as Error).message);
    throw error;
  }
}

/**
 * Example 2: Batch API requests for better performance
 */
export async function fetchMultipleResourcesOptimized(resourceIds: string[]) {
  const requests = resourceIds.map(id => ({
    id: `resource_${id}`,
    url: `/api/resources/${id}`,
    method: 'GET' as const,
    priority: 'medium' as const,
    cacheable: true,
    cacheKey: `resource_${id}`,
    cacheTTL: 15 * 60 * 1000 // 15 minutes
  }));

  // Use batch processing for better performance
  return await optimizedApiService.requestAll(requests);
}

/**
 * Example 3: Progressive loading for large datasets
 */
export async function loadLearningResourcesProgressively(domain: string) {
  const operationId = 'load-resources-progressive';

  return await loadingService.progressiveLoad(
    async () => {
      // Fetch all resources for the domain
      const response = await LearningResourcesService.getResources({ domain });
      return response.resources;
    },
    {
      batchSize: 20,
      delayBetweenBatches: 100,
      onBatchComplete: (batch, batchIndex) => {
        console.log(`Loaded batch ${batchIndex + 1} with ${batch.length} resources`);
      },
      onProgress: (progress, stage) => {
        console.log(`Progress: ${progress}% - ${stage}`);
      }
    },
    operationId
  );
}

/**
 * Example 4: Optimized Gemini AI calls with caching
 */
export async function generateCareerRoadmapOptimized(request: any) {
  // The GeminiService already uses the enhanced caching
  // This example shows how to add additional optimization layers
  
  const operationId = 'generate-roadmap-optimized';
  
  try {
    // Pre-check if we have similar cached results
    const similarRequests = await cacheService.getBatch([
      `gemini_roadmap_${request.domain}_${request.experienceLevel}`,
      `gemini_roadmap_${request.jobRole}_entry`,
      `gemini_roadmap_${request.jobRole}_${request.experienceLevel}`
    ]);

    // If we have a close match, use it as a starting point
    const existingRoadmap = Array.from(similarRequests.values()).find(r => r !== null);
    
    if (existingRoadmap) {
      loadingService.setLoading(operationId, true, {
        message: 'Found similar roadmap, customizing...',
        progress: 50
      });
      
      // Customize the existing roadmap instead of generating from scratch
      // This is much faster than a full AI generation
      const customizedRoadmap = await customizeExistingRoadmap(existingRoadmap, request);
      
      loadingService.setLoading(operationId, false, { progress: 100 });
      return customizedRoadmap;
    }

    // Fall back to full AI generation
    return await GeminiService.generateCareerRoadmap(request);
    
  } catch (error) {
    loadingService.setError(operationId, (error as Error).message);
    throw error;
  }
}

/**
 * Example 5: Preloading strategy for better UX
 */
export async function preloadCriticalData(userProfile: any) {
  const operationId = 'preload-critical-data';
  
  try {
    loadingService.setLoading(operationId, true, {
      message: 'Preloading application data...',
      progress: 0
    });

    // Preload in priority order
    const preloadTasks = [
      // High priority - user's domain resources
      {
        key: `resources_${userProfile.domain}`,
        factory: () => LearningResourcesService.getResources({ 
          domain: userProfile.domain 
        }),
        ttl: 30 * 60 * 1000
      },
      
      // Medium priority - related domains
      {
        key: `resources_related_${userProfile.domain}`,
        factory: () => LearningResourcesService.getResources({ 
          domain: getRelatedDomain(userProfile.domain) 
        }),
        ttl: 60 * 60 * 1000
      },
      
      // Low priority - general resources
      {
        key: 'resources_general',
        factory: () => LearningResourcesService.getResources({}),
        ttl: 2 * 60 * 60 * 1000
      }
    ];

    await cacheService.preload(preloadTasks);

    loadingService.setLoading(operationId, false, {
      progress: 100,
      message: 'Preloading completed'
    });

  } catch (error) {
    loadingService.setError(operationId, (error as Error).message);
    console.error('Preloading failed:', error);
  }
}

/**
 * Example 6: Performance monitoring integration
 */
export async function monitoredApiCall<T>(
  operationName: string,
  apiCall: () => Promise<T>
): Promise<T> {
  // Start performance monitoring
  const endTiming = performanceMonitor.startTiming(operationName);
  
  try {
    const result = await apiCall();
    
    // Record successful operation
    performanceMonitor.recordMetric({
      name: `${operationName}_success`,
      value: 1,
      unit: 'count',
      category: 'api',
      metadata: { success: true }
    });
    
    return result;
    
  } catch (error) {
    // Record failed operation
    performanceMonitor.recordMetric({
      name: `${operationName}_error`,
      value: 1,
      unit: 'count',
      category: 'api',
      metadata: { 
        success: false, 
        error: (error as Error).message 
      }
    });
    
    throw error;
  } finally {
    // End timing measurement
    endTiming();
  }
}

/**
 * Example 7: Cache invalidation strategy
 */
export async function updateUserProfileOptimized(userId: string, updates: any) {
  const operationId = 'update-user-profile';
  
  try {
    loadingService.setLoading(operationId, true, {
      message: 'Updating profile...',
      progress: 0
    });

    // Update via API
    const updatedProfile = await performanceMonitor.measureAsync(
      'update_profile_api',
      async () => {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        return response.json();
      }
    );

    loadingService.updateProgress(operationId, 70, 'Updating cache...');

    // Invalidate related cache entries
    await cacheService.invalidatePattern(`user_.*_${userId}`);
    await cacheService.invalidatePattern(`progress_.*_${userId}`);
    
    // Update cache with new data
    await cacheService.set(`user_data_${userId}`, updatedProfile, 30 * 60 * 1000);

    loadingService.setLoading(operationId, false, {
      progress: 100,
      message: 'Profile updated successfully'
    });

    return updatedProfile;
    
  } catch (error) {
    loadingService.setError(operationId, (error as Error).message);
    throw error;
  }
}

/**
 * Example 8: Lazy loading with intersection observer
 */
export function createLazyResourceLoader() {
  return loadingService.createLazyLoader(
    async (page: number, pageSize: number) => {
      // Fetch resources for the page
      const response = await LearningResourcesService.getResources({
        page: page + 1, // API is 1-indexed
        pageSize
      });
      
      return response.resources;
    },
    {
      pageSize: 20,
      threshold: 0.1,
      rootMargin: '100px',
      onLoad: (data, page) => {
        console.log(`Loaded page ${page} with ${data.length} resources`);
        
        // Record performance metric
        performanceMonitor.recordMetric({
          name: 'lazy_load_page',
          value: data.length,
          unit: 'count',
          category: 'user-interaction',
          metadata: { page }
        });
      },
      onError: (error) => {
        console.error('Lazy loading error:', error);
        
        performanceMonitor.recordMetric({
          name: 'lazy_load_error',
          value: 1,
          unit: 'count',
          category: 'api',
          metadata: { error: error.message }
        });
      }
    }
  );
}

// Helper functions

function getRelatedDomain(domain: string): string {
  const domainMap: Record<string, string> = {
    'technology-computer-science': 'engineering-manufacturing',
    'business-management': 'design-creative-industries',
    'healthcare-medicine': 'science-research'
  };
  
  return domainMap[domain] || 'technology-computer-science';
}

async function customizeExistingRoadmap(existingRoadmap: any, request: any): Promise<any> {
  // Simulate roadmap customization (much faster than full AI generation)
  return performanceMonitor.measureAsync(
    'customize_roadmap',
    async () => {
      // Apply customizations based on the request
      const customized = {
        ...existingRoadmap,
        primaryCareer: request.jobRole,
        summary: `Customized roadmap for ${request.jobRole} in ${request.domain}`,
        // Modify other fields as needed
      };
      
      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return customized;
    }
  );
}

/**
 * Example 9: Performance report generation
 */
export function generatePerformanceReport() {
  const report = performanceMonitor.getPerformanceReport(15 * 60 * 1000); // Last 15 minutes
  
  console.log('Performance Report:', {
    timeRange: {
      start: new Date(report.timeRange.start).toISOString(),
      end: new Date(report.timeRange.end).toISOString()
    },
    summary: report.summary,
    recommendations: report.recommendations,
    totalMetrics: report.metrics.length
  });
  
  return report;
}

/**
 * Example 10: Cache statistics monitoring
 */
export function monitorCachePerformance() {
  const cacheStats = cacheService.getStats();
  
  console.log('Cache Performance:', {
    hitRate: `${cacheStats.hitRate.toFixed(2)}%`,
    totalSize: `${(cacheStats.totalSize / 1024 / 1024).toFixed(2)} MB`,
    entryCount: cacheStats.entryCount,
    memoryHits: cacheStats.memoryHits,
    localStorageHits: cacheStats.localStorageHits
  });
  
  // Record cache performance metrics
  performanceMonitor.recordMetric({
    name: 'cache_hit_rate',
    value: cacheStats.hitRate,
    unit: 'percentage',
    category: 'cache'
  });
  
  performanceMonitor.recordMetric({
    name: 'cache_size',
    value: cacheStats.totalSize,
    unit: 'bytes',
    category: 'memory'
  });
  
  return cacheStats;
}