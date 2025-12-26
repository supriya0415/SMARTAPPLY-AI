/**
 * Performance Monitor Service
 * Implements requirements 10.3, 10.4
 * 
 * Monitors and tracks performance metrics for optimization analysis
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  category: 'api' | 'cache' | 'render' | 'user-interaction' | 'memory';
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  timeRange: {
    start: number;
    end: number;
  };
  metrics: PerformanceMetric[];
  summary: {
    averageApiResponseTime: number;
    cacheHitRate: number;
    memoryUsage: number;
    errorRate: number;
    userInteractionLatency: number;
  };
  recommendations: string[];
}

export interface PerformanceThresholds {
  apiResponseTime: number; // ms
  cacheHitRate: number; // percentage
  memoryUsage: number; // bytes
  errorRate: number; // percentage
  renderTime: number; // ms
}

export class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private thresholds: PerformanceThresholds = {
    apiResponseTime: 2000, // 2 seconds
    cacheHitRate: 80, // 80%
    memoryUsage: 100 * 1024 * 1024, // 100MB
    errorRate: 5, // 5%
    renderTime: 100 // 100ms
  };

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitorService {
    if (!PerformanceMonitorService.instance) {
      PerformanceMonitorService.instance = new PerformanceMonitorService();
    }
    return PerformanceMonitorService.instance;
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now()
    };

    this.metrics.push(fullMetric);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check thresholds and log warnings
    this.checkThresholds(fullMetric);
  }

  /**
   * Start timing an operation
   */
  startTiming(operationName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        category: 'api'
      });
    };
  }

  /**
   * Measure function execution time
   */
  async measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>,
    category: PerformanceMetric['category'] = 'api'
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        category,
        metadata: { success: true }
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        category,
        metadata: { success: false, error: (error as Error).message }
      });
      
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(
    operationName: string,
    operation: () => T,
    category: PerformanceMetric['category'] = 'render'
  ): T {
    const startTime = performance.now();
    
    try {
      const result = operation();
      const duration = performance.now() - startTime;
      
      this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        category,
        metadata: { success: true }
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        category,
        metadata: { success: false, error: (error as Error).message }
      });
      
      throw error;
    }
  }

  /**
   * Record cache performance
   */
  recordCacheMetric(operation: 'hit' | 'miss' | 'set' | 'evict', cacheType: string): void {
    this.recordMetric({
      name: `cache_${operation}`,
      value: 1,
      unit: 'count',
      category: 'cache',
      metadata: { cacheType }
    });
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      this.recordMetric({
        name: 'memory_used',
        value: memory.usedJSHeapSize,
        unit: 'bytes',
        category: 'memory',
        metadata: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      });
    }
  }

  /**
   * Record user interaction latency
   */
  recordUserInteraction(interactionType: string, latency: number): void {
    this.recordMetric({
      name: 'user_interaction',
      value: latency,
      unit: 'ms',
      category: 'user-interaction',
      metadata: { type: interactionType }
    });
  }

  /**
   * Get performance report for a time range
   */
  getPerformanceReport(timeRangeMs: number = 5 * 60 * 1000): PerformanceReport {
    const now = Date.now();
    const startTime = now - timeRangeMs;
    
    const relevantMetrics = this.metrics.filter(
      metric => metric.timestamp >= startTime
    );

    const summary = this.calculateSummary(relevantMetrics);
    const recommendations = this.generateRecommendations(summary);

    return {
      timeRange: { start: startTime, end: now },
      metrics: relevantMetrics,
      summary,
      recommendations
    };
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(
    category: PerformanceMetric['category'],
    timeRangeMs: number = 5 * 60 * 1000
  ): PerformanceMetric[] {
    const now = Date.now();
    const startTime = now - timeRangeMs;
    
    return this.metrics.filter(
      metric => metric.category === category && metric.timestamp >= startTime
    );
  }

  /**
   * Get average metric value
   */
  getAverageMetric(
    metricName: string,
    timeRangeMs: number = 5 * 60 * 1000
  ): number {
    const now = Date.now();
    const startTime = now - timeRangeMs;
    
    const relevantMetrics = this.metrics.filter(
      metric => metric.name === metricName && metric.timestamp >= startTime
    );

    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / relevantMetrics.length;
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics(olderThanMs: number = 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - olderThanMs;
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoffTime);
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['name', 'value', 'unit', 'timestamp', 'category', 'metadata'];
      const rows = this.metrics.map(metric => [
        metric.name,
        metric.value.toString(),
        metric.unit,
        new Date(metric.timestamp).toISOString(),
        metric.category,
        JSON.stringify(metric.metadata || {})
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Set performance thresholds
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  // Private methods

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              
              this.recordMetric({
                name: 'page_load_time',
                value: navEntry.loadEventEnd - navEntry.navigationStart,
                unit: 'ms',
                category: 'render'
              });
              
              this.recordMetric({
                name: 'dom_content_loaded',
                value: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
                unit: 'ms',
                category: 'render'
              });
            }
          }
        });
        
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported:', error);
      }

      // Observe resource timing
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              
              this.recordMetric({
                name: 'resource_load_time',
                value: resourceEntry.responseEnd - resourceEntry.requestStart,
                unit: 'ms',
                category: 'api',
                metadata: {
                  url: resourceEntry.name,
                  type: resourceEntry.initiatorType
                }
              });
            }
          }
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing observer not supported:', error);
      }

      // Observe long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'longtask') {
              this.recordMetric({
                name: 'long_task',
                value: entry.duration,
                unit: 'ms',
                category: 'render',
                metadata: {
                  startTime: entry.startTime
                }
              });
            }
          }
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task observer not supported:', error);
      }
    }

    // Monitor memory usage periodically
    setInterval(() => {
      this.recordMemoryUsage();
    }, 30000); // Every 30 seconds
  }

  private checkThresholds(metric: PerformanceMetric): void {
    let threshold: number | undefined;
    
    switch (metric.name) {
      case 'api_response_time':
        threshold = this.thresholds.apiResponseTime;
        break;
      case 'memory_used':
        threshold = this.thresholds.memoryUsage;
        break;
      case 'render_time':
        threshold = this.thresholds.renderTime;
        break;
    }

    if (threshold && metric.value > threshold) {
      console.warn(`Performance threshold exceeded: ${metric.name} = ${metric.value}${metric.unit} (threshold: ${threshold}${metric.unit})`);
    }
  }

  private calculateSummary(metrics: PerformanceMetric[]): PerformanceReport['summary'] {
    const apiMetrics = metrics.filter(m => m.category === 'api');
    const cacheMetrics = metrics.filter(m => m.category === 'cache');
    const memoryMetrics = metrics.filter(m => m.name === 'memory_used');
    const userInteractionMetrics = metrics.filter(m => m.category === 'user-interaction');

    // Calculate averages
    const averageApiResponseTime = apiMetrics.length > 0
      ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length
      : 0;

    const cacheHits = cacheMetrics.filter(m => m.name === 'cache_hit').length;
    const cacheMisses = cacheMetrics.filter(m => m.name === 'cache_miss').length;
    const cacheHitRate = (cacheHits + cacheMisses) > 0
      ? (cacheHits / (cacheHits + cacheMisses)) * 100
      : 0;

    const averageMemoryUsage = memoryMetrics.length > 0
      ? memoryMetrics.reduce((sum, m) => sum + m.value, 0) / memoryMetrics.length
      : 0;

    const errorMetrics = metrics.filter(m => m.metadata?.success === false);
    const errorRate = metrics.length > 0
      ? (errorMetrics.length / metrics.length) * 100
      : 0;

    const averageUserInteractionLatency = userInteractionMetrics.length > 0
      ? userInteractionMetrics.reduce((sum, m) => sum + m.value, 0) / userInteractionMetrics.length
      : 0;

    return {
      averageApiResponseTime,
      cacheHitRate,
      memoryUsage: averageMemoryUsage,
      errorRate,
      userInteractionLatency: averageUserInteractionLatency
    };
  }

  private generateRecommendations(summary: PerformanceReport['summary']): string[] {
    const recommendations: string[] = [];

    if (summary.averageApiResponseTime > this.thresholds.apiResponseTime) {
      recommendations.push('Consider implementing request batching or caching to reduce API response times');
    }

    if (summary.cacheHitRate < this.thresholds.cacheHitRate) {
      recommendations.push('Improve cache hit rate by optimizing cache keys and TTL values');
    }

    if (summary.memoryUsage > this.thresholds.memoryUsage) {
      recommendations.push('Monitor memory usage and implement cleanup strategies for large datasets');
    }

    if (summary.errorRate > this.thresholds.errorRate) {
      recommendations.push('Investigate and fix sources of errors to improve reliability');
    }

    if (summary.userInteractionLatency > this.thresholds.renderTime) {
      recommendations.push('Optimize UI responsiveness by reducing render times and using progressive loading');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is within acceptable thresholds');
    }

    return recommendations;
  }

  /**
   * Cleanup observers on destroy
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitorService.getInstance();