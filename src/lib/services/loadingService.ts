/**
 * Loading Service
 * Implements requirements 10.3, 10.4
 * 
 * Manages loading states, progressive loading, and loading indicators
 */

export interface LoadingState {
  isLoading: boolean;
  progress?: number; // 0-100
  message?: string;
  stage?: string;
  error?: string;
  startTime?: number;
  estimatedDuration?: number;
}

export interface ProgressiveLoadingConfig {
  batchSize: number;
  delayBetweenBatches: number;
  priorityOrder?: string[];
  onBatchComplete?: (batch: any[], batchIndex: number) => void;
  onProgress?: (progress: number, stage: string) => void;
  onComplete?: (allData: any[]) => void;
  onError?: (error: Error, batchIndex?: number) => void;
}

export class LoadingService {
  private static loadingStates = new Map<string, LoadingState>();
  private static listeners = new Map<string, Set<(state: LoadingState) => void>>();

  /**
   * Set loading state for a specific operation
   */
  static setLoading(
    operationId: string, 
    isLoading: boolean, 
    options?: Partial<LoadingState>
  ): void {
    const currentState = this.loadingStates.get(operationId) || {};
    
    const newState: LoadingState = {
      ...currentState,
      isLoading,
      ...options,
      startTime: isLoading ? Date.now() : currentState.startTime
    };

    this.loadingStates.set(operationId, newState);
    this.notifyListeners(operationId, newState);
  }

  /**
   * Update loading progress
   */
  static updateProgress(
    operationId: string, 
    progress: number, 
    message?: string, 
    stage?: string
  ): void {
    const currentState = this.loadingStates.get(operationId);
    if (!currentState) return;

    const newState: LoadingState = {
      ...currentState,
      progress: Math.min(100, Math.max(0, progress)),
      message,
      stage
    };

    this.loadingStates.set(operationId, newState);
    this.notifyListeners(operationId, newState);
  }

  /**
   * Set loading error
   */
  static setError(operationId: string, error: string): void {
    const currentState = this.loadingStates.get(operationId) || {};
    
    const newState: LoadingState = {
      ...currentState,
      isLoading: false,
      error,
      progress: 0
    };

    this.loadingStates.set(operationId, newState);
    this.notifyListeners(operationId, newState);
  }

  /**
   * Get current loading state
   */
  static getLoadingState(operationId: string): LoadingState | null {
    return this.loadingStates.get(operationId) || null;
  }

  /**
   * Check if any operation is loading
   */
  static isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(state => state.isLoading);
  }

  /**
   * Get all loading operations
   */
  static getAllLoadingStates(): Map<string, LoadingState> {
    return new Map(this.loadingStates);
  }

  /**
   * Subscribe to loading state changes
   */
  static subscribe(
    operationId: string, 
    callback: (state: LoadingState) => void
  ): () => void {
    if (!this.listeners.has(operationId)) {
      this.listeners.set(operationId, new Set());
    }
    
    this.listeners.get(operationId)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(operationId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(operationId);
        }
      }
    };
  }

  /**
   * Progressive loading with batching
   */
  static async progressiveLoad<T>(
    dataSource: T[] | (() => Promise<T[]>),
    config: ProgressiveLoadingConfig,
    operationId: string = 'progressive-load'
  ): Promise<T[]> {
    try {
      this.setLoading(operationId, true, {
        message: 'Starting progressive load...',
        stage: 'initialization',
        progress: 0
      });

      // Get data
      const data = Array.isArray(dataSource) ? dataSource : await dataSource();
      
      if (data.length === 0) {
        this.setLoading(operationId, false, { progress: 100 });
        config.onComplete?.(data);
        return data;
      }

      // Sort by priority if specified
      let sortedData = [...data];
      if (config.priorityOrder) {
        sortedData = this.sortByPriority(data, config.priorityOrder);
      }

      // Process in batches
      const batches = this.createBatches(sortedData, config.batchSize);
      const results: T[] = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const progress = Math.round(((i + 1) / batches.length) * 100);
        
        this.updateProgress(
          operationId,
          progress,
          `Processing batch ${i + 1} of ${batches.length}...`,
          `batch-${i + 1}`
        );

        try {
          // Process batch
          results.push(...batch);
          config.onBatchComplete?.(batch, i);

          // Update progress
          config.onProgress?.(progress, `batch-${i + 1}`);

          // Delay between batches (except for the last one)
          if (i < batches.length - 1 && config.delayBetweenBatches > 0) {
            await this.delay(config.delayBetweenBatches);
          }
        } catch (error) {
          config.onError?.(error as Error, i);
          throw error;
        }
      }

      this.setLoading(operationId, false, {
        progress: 100,
        message: 'Progressive load completed',
        stage: 'complete'
      });

      config.onComplete?.(results);
      return results;

    } catch (error) {
      this.setError(operationId, (error as Error).message);
      config.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Lazy loading with intersection observer
   */
  static createLazyLoader<T>(
    loadFunction: (page: number, pageSize: number) => Promise<T[]>,
    options: {
      pageSize?: number;
      threshold?: number;
      rootMargin?: string;
      onLoad?: (data: T[], page: number) => void;
      onError?: (error: Error) => void;
    } = {}
  ): {
    observe: (element: Element) => void;
    unobserve: (element: Element) => void;
    loadMore: () => Promise<void>;
    reset: () => void;
  } {
    const {
      pageSize = 20,
      threshold = 0.1,
      rootMargin = '100px',
      onLoad,
      onError
    } = options;

    let currentPage = 0;
    let isLoading = false;
    let hasMore = true;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && hasMore) {
          await loadMore();
        }
      },
      { threshold, rootMargin }
    );

    const loadMore = async (): Promise<void> => {
      if (isLoading || !hasMore) return;

      isLoading = true;
      const operationId = `lazy-load-page-${currentPage}`;

      try {
        this.setLoading(operationId, true, {
          message: `Loading page ${currentPage + 1}...`,
          stage: 'loading'
        });

        const data = await loadFunction(currentPage, pageSize);
        
        if (data.length < pageSize) {
          hasMore = false;
        }

        currentPage++;
        onLoad?.(data, currentPage - 1);

        this.setLoading(operationId, false, {
          progress: 100,
          message: 'Page loaded successfully'
        });

      } catch (error) {
        this.setError(operationId, (error as Error).message);
        onError?.(error as Error);
      } finally {
        isLoading = false;
      }
    };

    return {
      observe: (element: Element) => observer.observe(element),
      unobserve: (element: Element) => observer.unobserve(element),
      loadMore,
      reset: () => {
        currentPage = 0;
        isLoading = false;
        hasMore = true;
      }
    };
  }

  /**
   * Batch API requests with progress tracking
   */
  static async batchRequests<T, R>(
    items: T[],
    requestFunction: (item: T) => Promise<R>,
    options: {
      batchSize?: number;
      delayBetweenBatches?: number;
      maxConcurrency?: number;
      onProgress?: (completed: number, total: number) => void;
      onBatchComplete?: (results: R[], batchIndex: number) => void;
      onError?: (error: Error, item: T, itemIndex: number) => void;
      continueOnError?: boolean;
    } = {}
  ): Promise<R[]> {
    const {
      batchSize = 10,
      delayBetweenBatches = 100,
      maxConcurrency = 3,
      onProgress,
      onBatchComplete,
      onError,
      continueOnError = true
    } = options;

    const operationId = 'batch-requests';
    const results: R[] = [];
    const batches = this.createBatches(items, batchSize);
    let completed = 0;

    this.setLoading(operationId, true, {
      message: 'Starting batch requests...',
      progress: 0,
      stage: 'initialization'
    });

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      
      this.updateProgress(
        operationId,
        Math.round((batchIndex / batches.length) * 100),
        `Processing batch ${batchIndex + 1} of ${batches.length}`,
        `batch-${batchIndex + 1}`
      );

      try {
        // Process batch with concurrency limit
        const batchResults = await this.processBatchWithConcurrency(
          batch,
          requestFunction,
          maxConcurrency,
          (item, index) => {
            completed++;
            onProgress?.(completed, items.length);
          },
          continueOnError ? onError : undefined
        );

        results.push(...batchResults);
        onBatchComplete?.(batchResults, batchIndex);

        // Delay between batches
        if (batchIndex < batches.length - 1 && delayBetweenBatches > 0) {
          await this.delay(delayBetweenBatches);
        }

      } catch (error) {
        if (!continueOnError) {
          this.setError(operationId, (error as Error).message);
          throw error;
        }
      }
    }

    this.setLoading(operationId, false, {
      progress: 100,
      message: 'Batch requests completed',
      stage: 'complete'
    });

    return results;
  }

  /**
   * Preload resources with priority
   */
  static async preloadResources(
    resources: Array<{
      url: string;
      type: 'image' | 'script' | 'style' | 'fetch';
      priority: 'high' | 'medium' | 'low';
      onLoad?: () => void;
      onError?: (error: Error) => void;
    }>,
    operationId: string = 'preload-resources'
  ): Promise<void> {
    // Sort by priority
    const sortedResources = resources.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    this.setLoading(operationId, true, {
      message: 'Preloading resources...',
      progress: 0,
      stage: 'preloading'
    });

    const promises = sortedResources.map(async (resource, index) => {
      try {
        await this.preloadResource(resource);
        resource.onLoad?.();
        
        const progress = Math.round(((index + 1) / sortedResources.length) * 100);
        this.updateProgress(operationId, progress);
        
      } catch (error) {
        resource.onError?.(error as Error);
      }
    });

    await Promise.allSettled(promises);

    this.setLoading(operationId, false, {
      progress: 100,
      message: 'Resource preloading completed',
      stage: 'complete'
    });
  }

  // Private helper methods

  private static notifyListeners(operationId: string, state: LoadingState): void {
    const listeners = this.listeners.get(operationId);
    if (listeners) {
      listeners.forEach(callback => callback(state));
    }
  }

  private static sortByPriority<T>(data: T[], priorityOrder: string[]): T[] {
    return data.sort((a, b) => {
      const aIndex = priorityOrder.findIndex(p => 
        JSON.stringify(a).toLowerCase().includes(p.toLowerCase())
      );
      const bIndex = priorityOrder.findIndex(p => 
        JSON.stringify(b).toLowerCase().includes(p.toLowerCase())
      );
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
  }

  private static createBatches<T>(data: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  private static async processBatchWithConcurrency<T, R>(
    batch: T[],
    requestFunction: (item: T) => Promise<R>,
    maxConcurrency: number,
    onItemComplete?: (item: T, index: number) => void,
    onError?: (error: Error, item: T, itemIndex: number) => void
  ): Promise<R[]> {
    const results: R[] = [];
    const executing: Promise<void>[] = [];

    for (let i = 0; i < batch.length; i++) {
      const item = batch[i];
      
      const promise = requestFunction(item)
        .then(result => {
          results[i] = result;
          onItemComplete?.(item, i);
        })
        .catch(error => {
          onError?.(error, item, i);
          if (!onError) throw error; // Re-throw if no error handler
        });

      executing.push(promise);

      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
        // Remove completed promises
        for (let j = executing.length - 1; j >= 0; j--) {
          if (await Promise.race([executing[j], Promise.resolve('pending')]) !== 'pending') {
            executing.splice(j, 1);
          }
        }
      }
    }

    await Promise.allSettled(executing);
    return results;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async preloadResource(resource: {
    url: string;
    type: 'image' | 'script' | 'style' | 'fetch';
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      switch (resource.type) {
        case 'image':
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${resource.url}`));
          img.src = resource.url;
          break;

        case 'script':
          const script = document.createElement('script');
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${resource.url}`));
          script.src = resource.url;
          document.head.appendChild(script);
          break;

        case 'style':
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.onload = () => resolve();
          link.onerror = () => reject(new Error(`Failed to load stylesheet: ${resource.url}`));
          link.href = resource.url;
          document.head.appendChild(link);
          break;

        case 'fetch':
          fetch(resource.url)
            .then(() => resolve())
            .catch(error => reject(new Error(`Failed to fetch: ${resource.url} - ${error.message}`)));
          break;

        default:
          reject(new Error(`Unknown resource type: ${resource.type}`));
      }
    });
  }

  /**
   * Clear all loading states
   */
  static clearAll(): void {
    this.loadingStates.clear();
    this.listeners.clear();
  }

  /**
   * Clear specific loading state
   */
  static clear(operationId: string): void {
    this.loadingStates.delete(operationId);
    this.listeners.delete(operationId);
  }
}

// Export singleton instance
export const loadingService = LoadingService;