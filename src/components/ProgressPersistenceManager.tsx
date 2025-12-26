import React, { useEffect, useCallback, useRef } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ProgressTrackingService } from '@/lib/services/progressTrackingService';
import { debugLogger } from '@/lib/utils/debugLogger';

export interface ProgressPersistenceManagerProps {
  children: React.ReactNode;
  onProgressSaved?: (progress: any) => void;
  onProgressRestored?: (progress: any) => void;
  autoSaveInterval?: number; // milliseconds, default 60000 (1 minute)
}

/**
 * Progress Persistence Manager Component
 * Handles automatic saving and restoration of learning progress
 * Implements requirements 9.2, 9.4 for progress persistence
 */
export function ProgressPersistenceManager({ 
  children, 
  onProgressSaved,
  onProgressRestored,
  autoSaveInterval = 60000 // 1 minute default
}: ProgressPersistenceManagerProps) {
  const { 
    profile, 
    currentSession,
    updateSession,
    syncProgress,
    isLoading 
  } = useUserProfile();

  const lastSyncTime = useRef<Date>(new Date());
  const pendingUpdates = useRef<any[]>([]);

  /**
   * Requirement 9.2: Display previously saved progress
   * Restore user's learning progress when component mounts
   */
  const restoreProgress = useCallback(async () => {
    if (!profile) {
      return;
    }

    try {
      debugLogger.log('Restoring learning progress', {
        component: 'ProgressPersistenceManager',
        action: 'restore_progress',
        metadata: { userId: profile.id }
      });

      // Get user's progress from the service
      const progress = await ProgressTrackingService.getUserProgress(profile.id);
      
      if (progress) {
        debugLogger.log('Learning progress restored', {
          component: 'ProgressPersistenceManager',
          action: 'restore_progress',
          metadata: {
            userId: profile.id,
            overallProgress: progress.overallProgress,
            completedResources: progress.completedResources.length,
            skillsAcquired: progress.skillsAcquired.length
          }
        });

        if (onProgressRestored) {
          onProgressRestored(progress);
        }
      }

    } catch (error) {
      debugLogger.error('Failed to restore learning progress', error as Error, {
        component: 'ProgressPersistenceManager',
        action: 'restore_progress'
      });
    }
  }, [profile, onProgressRestored]);

  /**
   * Save progress updates to local storage and queue for backend sync
   */
  const saveProgressUpdate = useCallback((update: any) => {
    if (!profile || !currentSession) {
      return;
    }

    try {
      debugLogger.log('Saving progress update', {
        component: 'ProgressPersistenceManager',
        action: 'save_progress_update',
        metadata: {
          userId: profile.id,
          sessionId: currentSession.sessionId,
          updateType: update.type
        }
      });

      // Add to pending updates queue
      pendingUpdates.current.push({
        ...update,
        timestamp: new Date(),
        sessionId: currentSession.sessionId
      });

      // Update current session with the progress
      updateSession(currentSession.sessionId, {
        lastActivity: new Date(),
        progressSnapshot: {
          ...currentSession.progressSnapshot,
          lastUpdate: update
        }
      });

      if (onProgressSaved) {
        onProgressSaved(update);
      }

    } catch (error) {
      debugLogger.error('Failed to save progress update', error as Error, {
        component: 'ProgressPersistenceManager',
        action: 'save_progress_update'
      });
    }
  }, [profile, currentSession, updateSession, onProgressSaved]);

  /**
   * Requirement 9.4: Maintain checklist progress from previous sessions
   * Sync pending progress updates with backend
   */
  const syncPendingUpdates = useCallback(async () => {
    if (!profile || pendingUpdates.current.length === 0) {
      return;
    }

    try {
      debugLogger.log('Syncing pending progress updates', {
        component: 'ProgressPersistenceManager',
        action: 'sync_pending_updates',
        metadata: {
          userId: profile.id,
          pendingCount: pendingUpdates.current.length
        }
      });

      // Process each pending update
      for (const update of pendingUpdates.current) {
        if (update.type === 'resource_completion') {
          await ProgressTrackingService.updateProgress(profile.id, {
            resourceId: update.resourceId,
            skillsGained: update.skillsGained || [],
            timeSpent: update.timeSpent || 0,
            completed: update.completed || false,
            milestoneReached: update.milestoneReached
          });
        } else if (update.type === 'checklist_update') {
          // Handle checklist updates
          if (update.checklistId && update.itemId) {
            ProgressTrackingService.updateChecklistItem(
              update.checklistId,
              update.itemId,
              update.itemUpdates
            );
          }
        }
      }

      // Sync with backend
      const syncSuccess = await syncProgress();
      
      if (syncSuccess) {
        // Clear pending updates after successful sync
        pendingUpdates.current = [];
        lastSyncTime.current = new Date();

        debugLogger.log('Progress updates synced successfully', {
          component: 'ProgressPersistenceManager',
          action: 'sync_pending_updates',
          metadata: { userId: profile.id }
        });
      }

    } catch (error) {
      debugLogger.error('Failed to sync pending progress updates', error as Error, {
        component: 'ProgressPersistenceManager',
        action: 'sync_pending_updates'
      });
    }
  }, [profile, syncProgress]);

  /**
   * Handle resource completion events
   */
  const handleResourceCompletion = useCallback((resourceId: string, completed: boolean, timeSpent?: number, skillsGained?: string[]) => {
    saveProgressUpdate({
      type: 'resource_completion',
      resourceId,
      completed,
      timeSpent: timeSpent || 0,
      skillsGained: skillsGained || [],
      timestamp: new Date()
    });
  }, [saveProgressUpdate]);

  /**
   * Handle checklist item updates
   */
  const handleChecklistUpdate = useCallback((checklistId: string, itemId: string, itemUpdates: any) => {
    saveProgressUpdate({
      type: 'checklist_update',
      checklistId,
      itemId,
      itemUpdates,
      timestamp: new Date()
    });
  }, [saveProgressUpdate]);

  /**
   * Handle milestone achievements
   */
  const handleMilestoneAchieved = useCallback((milestoneId: string, milestoneData: any) => {
    saveProgressUpdate({
      type: 'milestone_achieved',
      milestoneId,
      milestoneData,
      timestamp: new Date()
    });
  }, [saveProgressUpdate]);

  // Restore progress when profile loads
  useEffect(() => {
    if (profile && !isLoading) {
      restoreProgress();
    }
  }, [profile, isLoading, restoreProgress]);

  // Auto-sync progress updates
  useEffect(() => {
    if (!profile) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncPendingUpdates();
    }, autoSaveInterval);

    return () => clearInterval(syncInterval);
  }, [profile, autoSaveInterval, syncPendingUpdates]);

  // Sync on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Attempt to sync immediately before page unload
      if (pendingUpdates.current.length > 0) {
        // Use sendBeacon for reliable data sending during page unload
        const data = JSON.stringify({
          userId: profile?.id,
          updates: pendingUpdates.current,
          timestamp: new Date()
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/user/sync-progress', data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [profile]);

  // Sync on visibility change (tab switch, minimize, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && pendingUpdates.current.length > 0) {
        syncPendingUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncPendingUpdates]);

  // Provide progress management functions to child components
  const progressManager = {
    handleResourceCompletion,
    handleChecklistUpdate,
    handleMilestoneAchieved,
    syncPendingUpdates,
    getPendingUpdatesCount: () => pendingUpdates.current.length,
    getLastSyncTime: () => lastSyncTime.current
  };

  return (
    <ProgressPersistenceContext.Provider value={progressManager}>
      {children}
    </ProgressPersistenceContext.Provider>
  );
}

/**
 * Context for progress persistence management
 */
export const ProgressPersistenceContext = React.createContext<{
  handleResourceCompletion: (resourceId: string, completed: boolean, timeSpent?: number, skillsGained?: string[]) => void;
  handleChecklistUpdate: (checklistId: string, itemId: string, itemUpdates: any) => void;
  handleMilestoneAchieved: (milestoneId: string, milestoneData: any) => void;
  syncPendingUpdates: () => Promise<void>;
  getPendingUpdatesCount: () => number;
  getLastSyncTime: () => Date;
} | null>(null);

/**
 * Hook to use progress persistence context
 */
export function useProgressPersistence() {
  const context = React.useContext(ProgressPersistenceContext);
  if (!context) {
    throw new Error('useProgressPersistence must be used within a ProgressPersistenceManager');
  }
  return context;
}

/**
 * Higher-order component to wrap components with progress persistence
 */
export function withProgressPersistence<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProgressPersistenceWrapper(props: P) {
    return (
      <ProgressPersistenceManager>
        <Component {...props} />
      </ProgressPersistenceManager>
    );
  };
}

export default ProgressPersistenceManager;