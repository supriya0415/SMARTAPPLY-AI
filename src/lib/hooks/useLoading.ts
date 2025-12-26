/**
 * Loading Hook
 * Implements requirements 10.3, 10.4
 * 
 * React hook for managing loading states with the loading service
 */

import { useState, useEffect, useCallback } from 'react';
import { loadingService, LoadingState } from '../services/loadingService';

export interface UseLoadingOptions {
  operationId: string;
  autoReset?: boolean;
  onStateChange?: (state: LoadingState) => void;
}

export interface UseLoadingReturn {
  isLoading: boolean;
  progress: number;
  message: string;
  stage: string;
  error: string | null;
  startTime: number | null;
  estimatedDuration: number | null;
  setLoading: (isLoading: boolean, options?: Partial<LoadingState>) => void;
  updateProgress: (progress: number, message?: string, stage?: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}

/**
 * Hook for managing loading states
 */
export function useLoading(options: UseLoadingOptions): UseLoadingReturn {
  const { operationId, autoReset = true, onStateChange } = options;
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    message: '',
    stage: '',
    error: undefined,
    startTime: undefined,
    estimatedDuration: undefined
  });

  // Subscribe to loading service updates
  useEffect(() => {
    const unsubscribe = loadingService.subscribe(operationId, (state) => {
      setLoadingState(state);
      onStateChange?.(state);
    });

    // Get initial state
    const initialState = loadingService.getLoadingState(operationId);
    if (initialState) {
      setLoadingState(initialState);
    }

    return unsubscribe;
  }, [operationId, onStateChange]);

  // Auto-reset on unmount if enabled
  useEffect(() => {
    return () => {
      if (autoReset) {
        loadingService.clear(operationId);
      }
    };
  }, [operationId, autoReset]);

  const setLoading = useCallback((isLoading: boolean, options?: Partial<LoadingState>) => {
    loadingService.setLoading(operationId, isLoading, options);
  }, [operationId]);

  const updateProgress = useCallback((progress: number, message?: string, stage?: string) => {
    loadingService.updateProgress(operationId, progress, message, stage);
  }, [operationId]);

  const setError = useCallback((error: string) => {
    loadingService.setError(operationId, error);
  }, [operationId]);

  const reset = useCallback(() => {
    loadingService.clear(operationId);
  }, [operationId]);

  return {
    isLoading: loadingState.isLoading,
    progress: loadingState.progress || 0,
    message: loadingState.message || '',
    stage: loadingState.stage || '',
    error: loadingState.error || null,
    startTime: loadingState.startTime || null,
    estimatedDuration: loadingState.estimatedDuration || null,
    setLoading,
    updateProgress,
    setError,
    reset
  };
}

/**
 * Hook for managing multiple loading operations
 */
export function useMultipleLoading(operationIds: string[]): {
  loadingStates: Map<string, LoadingState>;
  isAnyLoading: boolean;
  getLoadingState: (operationId: string) => LoadingState | null;
  setLoading: (operationId: string, isLoading: boolean, options?: Partial<LoadingState>) => void;
  clearAll: () => void;
} {
  const [loadingStates, setLoadingStates] = useState<Map<string, LoadingState>>(new Map());

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    operationIds.forEach(operationId => {
      const unsubscribe = loadingService.subscribe(operationId, (state) => {
        setLoadingStates(prev => new Map(prev.set(operationId, state)));
      });
      unsubscribers.push(unsubscribe);

      // Get initial state
      const initialState = loadingService.getLoadingState(operationId);
      if (initialState) {
        setLoadingStates(prev => new Map(prev.set(operationId, initialState)));
      }
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [operationIds]);

  const isAnyLoading = Array.from(loadingStates.values()).some(state => state.isLoading);

  const getLoadingState = useCallback((operationId: string) => {
    return loadingStates.get(operationId) || null;
  }, [loadingStates]);

  const setLoading = useCallback((operationId: string, isLoading: boolean, options?: Partial<LoadingState>) => {
    loadingService.setLoading(operationId, isLoading, options);
  }, []);

  const clearAll = useCallback(() => {
    operationIds.forEach(operationId => {
      loadingService.clear(operationId);
    });
    setLoadingStates(new Map());
  }, [operationIds]);

  return {
    loadingStates,
    isAnyLoading,
    getLoadingState,
    setLoading,
    clearAll
  };
}

/**
 * Hook for progressive loading with batching
 */
export function useProgressiveLoading<T>(): {
  isLoading: boolean;
  progress: number;
  currentBatch: number;
  totalBatches: number;
  loadedItems: T[];
  error: string | null;
  loadProgressively: (
    dataSource: T[] | (() => Promise<T[]>),
    options: {
      batchSize?: number;
      delayBetweenBatches?: number;
      onBatchComplete?: (batch: T[], batchIndex: number) => void;
      onProgress?: (progress: number, stage: string) => void;
    }
  ) => Promise<T[]>;
  reset: () => void;
} {
  const [state, setState] = useState({
    isLoading: false,
    progress: 0,
    currentBatch: 0,
    totalBatches: 0,
    loadedItems: [] as T[],
    error: null as string | null
  });

  const loadProgressively = useCallback(async (
    dataSource: T[] | (() => Promise<T[]>),
    options: {
      batchSize?: number;
      delayBetweenBatches?: number;
      onBatchComplete?: (batch: T[], batchIndex: number) => void;
      onProgress?: (progress: number, stage: string) => void;
    } = {}
  ) => {
    const { batchSize = 20, delayBetweenBatches = 100, onBatchComplete, onProgress } = options;
    const operationId = 'progressive-loading';

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, loadedItems: [] }));

      const result = await loadingService.progressiveLoad(
        dataSource,
        {
          batchSize,
          delayBetweenBatches,
          onBatchComplete: (batch, batchIndex) => {
            setState(prev => ({
              ...prev,
              currentBatch: batchIndex + 1,
              loadedItems: [...prev.loadedItems, ...batch]
            }));
            onBatchComplete?.(batch, batchIndex);
          },
          onProgress: (progress, stage) => {
            setState(prev => ({ ...prev, progress }));
            onProgress?.(progress, stage);
          },
          onComplete: (allData) => {
            setState(prev => ({
              ...prev,
              isLoading: false,
              progress: 100,
              loadedItems: allData
            }));
          },
          onError: (error) => {
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: error.message
            }));
          }
        },
        operationId
      );

      return result;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      progress: 0,
      currentBatch: 0,
      totalBatches: 0,
      loadedItems: [],
      error: null
    });
  }, []);

  return {
    ...state,
    loadProgressively,
    reset
  };
}

/**
 * Hook for lazy loading with intersection observer
 */
export function useLazyLoading<T>(
  loadFunction: (page: number, pageSize: number) => Promise<T[]>,
  options: {
    pageSize?: number;
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
  } = {}
): {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  observeRef: (element: Element | null) => void;
  loadMore: () => Promise<void>;
  reset: () => void;
} {
  const { pageSize = 20, threshold = 0.1, rootMargin = '100px', enabled = true } = options;
  
  const [state, setState] = useState({
    items: [] as T[],
    isLoading: false,
    hasMore: true,
    error: null as string | null
  });

  const [lazyLoader] = useState(() => 
    loadingService.createLazyLoader(loadFunction, {
      pageSize,
      threshold,
      rootMargin,
      onLoad: (data, page) => {
        setState(prev => ({
          ...prev,
          items: [...prev.items, ...data],
          isLoading: false,
          hasMore: data.length === pageSize
        }));
      },
      onError: (error) => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    })
  );

  const observeRef = useCallback((element: Element | null) => {
    if (element && enabled) {
      lazyLoader.observe(element);
    } else if (element) {
      lazyLoader.unobserve(element);
    }
  }, [lazyLoader, enabled]);

  const loadMore = useCallback(async () => {
    if (!state.isLoading && state.hasMore) {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await lazyLoader.loadMore();
    }
  }, [lazyLoader, state.isLoading, state.hasMore]);

  const reset = useCallback(() => {
    lazyLoader.reset();
    setState({
      items: [],
      isLoading: false,
      hasMore: true,
      error: null
    });
  }, [lazyLoader]);

  return {
    ...state,
    observeRef,
    loadMore,
    reset
  };
}

export default useLoading;