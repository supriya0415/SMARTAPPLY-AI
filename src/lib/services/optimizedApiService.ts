/**
 * Optimized API Service
 * Implements requirements 10.1, 10.2, 10.3, 10.4
 * 
 * Provides optimized API calls with:
 * - Request batching and deduplication
 * - Intelligent caching
 * - Retry mechanisms with exponential backoff
 * - Request prioritization
 * - Performance monitoring
 */

import { cacheService } from './cacheService';
import { loadingService } from './loadingService';

export interface ApiRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  priority: 'high' | 'medium' | 'low';
  cacheable?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  retryConfig?: RetryConfig;
  timeout?: number;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

export interface BatchConfig {
  maxBatchSize: number;
  batchTimeout: number;
  endpoint: string;
  groupBy?: (request: ApiRequest) => string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  cached: boolean;
  requestId: string;
  duration: number;
}

export interface PerformanceMetrics {
  totalRequests: number;
  cacheHitRate: number;
  averageResponseTime: number;
  errorRate: number;
  batchedRequests: number;
  deduplicatedRequests: number;
}

export class OptimizedApiService {
  private static instance: OptimizedApiService;
  private pendingRequests = new Map<string, Promise<ApiResponse>>();
  private batchQueues = new Map<string, ApiRequest[]>();
  private batchTimers = new Map<string, NodeJS.Timeout>();
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
    errorRate: 0,
    batchedRequests: 0,
    deduplicatedRequests: 0
  };

  private defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: (error) => {
      // Retry on network errors and 5xx status codes
      return !error.response || (error.response.status >= 500 && error.response.status < 600);
    }
  };

  private constructor() {}

  static getInstance(): OptimizedApiService {
    if (!OptimizedApiService.instance) {
      OptimizedApiService.instance = new OptimizedApiService();
    }
    return OptimizedApiService.instance;
  }

  /**
   * Execute a single API request with caching and optimization
   */
  async request<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // Check for request deduplication
      const requestKey = this.generateRequestKey(request);
      if (this.pendingRequests.has(requestKey)) {
        this.metrics.deduplicatedRequests++;
        return await this.pendingRequests.get(requestKey) as ApiResponse<T>;
      }

      // Check cache first
      if (request.cacheable && request.cacheKey) {
        const cached = await cacheService.get<T>(request.cacheKey);
        if (cached) {
          this.updateCacheHitRate(true);
          return {
            data: cached,
            status: 200,
            headers: {},
            cached: true,
            requestId: request.id,
            duration: Date.now() - startTime
          };
        }
        this.updateCacheHitRate(false);
      }

      // Create and store the request promise
      const requestPromise = this.executeRequest<T>(request, startTime);
      this.pendingRequests.set(requestKey, requestPromise);

      const response = await requestPromise;

      // Cache the response if cacheable
      if (request.cacheable && request.cacheKey && response.status < 400) {
        await cacheService.set(request.cacheKey, response.data, request.cacheTTL);
      }

      // Clean up pending request
      this.pendingRequests.delete(requestKey);

      return response;

    } catch (error) {
      this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.totalRequests - 1) + 1) / this.metrics.totalRequests;
      this.pendingRequests.delete(this.generateRequestKey(request));
      throw error;
    }
  }

  /**
   * Execute multiple requests in parallel with optimization
   */
  async requestAll<T = any>(requests: ApiRequest[]): Promise<ApiResponse<T>[]> {
    const operationId = 'batch-api-requests';
    
    loadingService.setLoading(operationId, true, {
      message: 'Processing API requests...',
      progress: 0
    });

    try {
      // Group requests by priority
      const priorityGroups = this.groupRequestsByPriority(requests);
      const results: ApiResponse<T>[] = [];

      // Process high priority requests first
      for (const [priority, groupRequests] of priorityGroups) {
        const groupResults = await Promise.allSettled(
          groupRequests.map(req => this.request<T>(req))
        );

        groupResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            console.error(`Request failed:`, groupRequests[index], result.reason);
            // Add error response
            results.push({
              data: null as T,
              status: 500,
              headers: {},
              cached: false,
              requestId: groupRequests[index].id,
              duration: 0
            });
          }
        });

        // Update progress
        const progress = Math.round((results.length / requests.length) * 100);
        loadingService.updateProgress(operationId, progress);
      }

      loadingService.setLoading(operationId, false, { progress: 100 });
      return results;

    } catch (error) {
      loadingService.setError(operationId, (error as Error).message);
      throw error;
    }
  }

  /**
   * Add request to batch queue
   */
  async batchRequest<T = any>(
    request: ApiRequest, 
    batchConfig: BatchConfig
  ): Promise<ApiResponse<T>> {
    const batchKey = batchConfig.groupBy ? batchConfig.groupBy(request) : 'default';
    
    if (!this.batchQueues.has(batchKey)) {
      this.batchQueues.set(batchKey, []);
    }

    const queue = this.batchQueues.get(batchKey)!;
    queue.push(request);

    // Return a promise that will be resolved when the batch is processed
    return new Promise((resolve, reject) => {
      request.resolve = resolve;
      request.reject = reject;

      // Set up batch timer if not already set
      if (!this.batchTimers.has(batchKey)) {
        const timer = setTimeout(() => {
          this.processBatch(batchKey, batchConfig);
        }, batchConfig.batchTimeout);
        
        this.batchTimers.set(batchKey, timer);
      }

      // Process immediately if batch is full
      if (queue.length >= batchConfig.maxBatchSize) {
        clearTimeout(this.batchTimers.get(batchKey)!);
        this.batchTimers.delete(batchKey);
        this.processBatch(batchKey, batchConfig);
      }
    });
  }

  /**
   * Preload data with intelligent caching
   */
  async preloadData(
    requests: ApiRequest[],
    options: {
      priority?: 'high' | 'medium' | 'low';
      maxConcurrency?: number;
      onProgress?: (completed: number, total: number) => void;
    } = {}
  ): Promise<void> {
    const { priority = 'low', maxConcurrency = 3, onProgress } = options;
    const operationId = 'preload-data';

    loadingService.setLoading(operationId, true, {
      message: 'Preloading data...',
      progress: 0
    });

    try {
      // Filter out requests that are already cached
      const uncachedRequests = [];
      for (const request of requests) {
        if (request.cacheable && request.cacheKey) {
          const cached = await cacheService.get(request.cacheKey);
          if (!cached) {
            uncachedRequests.push({ ...request, priority });
          }
        } else {
          uncachedRequests.push({ ...request, priority });
        }
      }

      if (uncachedRequests.length === 0) {
        loadingService.setLoading(operationId, false, { progress: 100 });
        return;
      }

      // Process with concurrency limit
      await loadingService.batchRequests(
        uncachedRequests,
        (request) => this.request(request),
        {
          maxConcurrency,
          onProgress: (completed, total) => {
            const progress = Math.round((completed / total) * 100);
            loadingService.updateProgress(operationId, progress);
            onProgress?.(completed, total);
          }
        }
      );

      loadingService.setLoading(operationId, false, { progress: 100 });

    } catch (error) {
      loadingService.setError(operationId, (error as Error).message);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      cacheHitRate: 0,
      averageResponseTime: 0,
      errorRate: 0,
      batchedRequests: 0,
      deduplicatedRequests: 0
    };
  }

  /**
   * Clear all pending requests and batches
   */
  clearAll(): void {
    this.pendingRequests.clear();
    this.batchQueues.clear();
    
    // Clear all batch timers
    for (const timer of this.batchTimers.values()) {
      clearTimeout(timer);
    }
    this.batchTimers.clear();
  }

  // Private methods

  private async executeRequest<T>(request: ApiRequest, startTime: number): Promise<ApiResponse<T>> {
    const retryConfig = { ...this.defaultRetryConfig, ...request.retryConfig };
    let lastError: any;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const response = await this.makeHttpRequest<T>(request);
        
        // Update metrics
        const duration = Date.now() - startTime;
        this.updateAverageResponseTime(duration);

        return {
          data: response.data,
          status: response.status,
          headers: response.headers || {},
          cached: false,
          requestId: request.id,
          duration
        };

      } catch (error) {
        lastError = error;

        // Check if we should retry
        if (attempt < retryConfig.maxAttempts && retryConfig.retryCondition?.(error)) {
          const delay = Math.min(
            retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt - 1),
            retryConfig.maxDelay
          );
          
          await this.delay(delay);
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  private async makeHttpRequest<T>(request: ApiRequest): Promise<{ data: T; status: number; headers?: Record<string, string> }> {
    const controller = new AbortController();
    const timeoutId = request.timeout ? setTimeout(() => controller.abort(), request.timeout) : null;

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers
        },
        body: request.data ? JSON.stringify(request.data) : undefined,
        signal: controller.signal
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      throw error;
    }
  }

  private async processBatch(batchKey: string, batchConfig: BatchConfig): Promise<void> {
    const queue = this.batchQueues.get(batchKey);
    if (!queue || queue.length === 0) return;

    // Remove from queue and timer
    this.batchQueues.delete(batchKey);
    this.batchTimers.delete(batchKey);

    this.metrics.batchedRequests += queue.length;

    try {
      // Create batch request
      const batchRequest: ApiRequest = {
        id: `batch_${Date.now()}`,
        url: batchConfig.endpoint,
        method: 'POST',
        data: { requests: queue.map(req => ({ id: req.id, ...req })) },
        priority: 'high'
      };

      const batchResponse = await this.executeRequest(batchRequest, Date.now());
      
      // Distribute responses to individual requests
      if (batchResponse.data && Array.isArray(batchResponse.data.responses)) {
        batchResponse.data.responses.forEach((response: any) => {
          const originalRequest = queue.find(req => req.id === response.id);
          if (originalRequest && originalRequest.resolve) {
            originalRequest.resolve({
              data: response.data,
              status: response.status || 200,
              headers: response.headers || {},
              cached: false,
              requestId: response.id,
              duration: batchResponse.duration
            });
          }
        });
      }

    } catch (error) {
      // Reject all requests in the batch
      queue.forEach(request => {
        if (request.reject) {
          request.reject(error);
        }
      });
    }
  }

  private generateRequestKey(request: ApiRequest): string {
    const keyData = {
      url: request.url,
      method: request.method,
      data: request.data
    };
    return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '');
  }

  private groupRequestsByPriority(requests: ApiRequest[]): Map<string, ApiRequest[]> {
    const groups = new Map<string, ApiRequest[]>();
    
    requests.forEach(request => {
      const priority = request.priority;
      if (!groups.has(priority)) {
        groups.set(priority, []);
      }
      groups.get(priority)!.push(request);
    });

    // Return in priority order
    const orderedGroups = new Map<string, ApiRequest[]>();
    ['high', 'medium', 'low'].forEach(priority => {
      if (groups.has(priority)) {
        orderedGroups.set(priority, groups.get(priority)!);
      }
    });

    return orderedGroups;
  }

  private updateCacheHitRate(hit: boolean): void {
    const totalCacheRequests = this.metrics.cacheHitRate * this.metrics.totalRequests;
    const newHits = hit ? totalCacheRequests + 1 : totalCacheRequests;
    this.metrics.cacheHitRate = newHits / this.metrics.totalRequests;
  }

  private updateAverageResponseTime(duration: number): void {
    const totalTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1);
    this.metrics.averageResponseTime = (totalTime + duration) / this.metrics.totalRequests;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Extend ApiRequest interface for batch processing
declare module './optimizedApiService' {
  interface ApiRequest {
    resolve?: (response: ApiResponse) => void;
    reject?: (error: any) => void;
  }
}

// Export singleton instance
export const optimizedApiService = OptimizedApiService.getInstance();