import { useState, useEffect, useCallback } from 'react';
import { ProfilePersistenceService, ProgressTrackingData, DashboardStateData, SessionProgressData } from '../services/profilePersistenceService';
import { UserProfileService } from '../services/userProfileService';
import { AuthService } from '../services/authService';
import { debugLogger } from '../utils/debugLogger';

/**
 * Profile Persistence Hook
 * Implements requirements 9.1, 9.2, 9.3, 9.4 for user profile and progress persistence
 */

export interface UseProfilePersistenceReturn {
  // Progress tracking
  progressData: ProgressTrackingData | null;
  loadingProgress: boolean;
  saveProgress: (data: Partial<ProgressTrackingData>) => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  
  // Dashboard state
  dashboardState: DashboardStateData | null;
  loadingDashboard: boolean;
  saveDashboardState: (state: Partial<DashboardStateData>) => Promise<boolean>;
  restoreDashboardState: () => Promise<void>;
  
  // Session management
  activeSession: SessionProgressData | null;
  loadingSession: boolean;
  startSession: (type?: 'learning' | 'assessment' | 'dashboard' | 'general') => Promise<SessionProgressData | null>;
  updateSession: (sessionId: string, updates: Partial<SessionProgressData>) => Promise<boolean>;
  endSession: (sessionId: string) => Promise<boolean>;
  
  // General
  isLoading: boolean;
  error: string | null;
  syncAllData: () => Promise<boolean>;
  clearError: () => void;
}

export function useProfilePersistence(domain?: string, subfield?: string): UseProfilePersistenceReturn {
  // State management
  const [progressData, setProgressData] = useState<ProgressTrackingData | null>(null);
  const [dashboardState, setDashboardState] = useState<DashboardStateData | null>(null);
  const [activeSession, setActiveSession] = useState<SessionProgressData | null>(null);
  
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = loadingProgress || loadingDashboard || loadingSession;

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Progress tracking functions
  const loadProgress = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    setLoadingProgress(true);
    setError(null);

    try {
      const data = await ProfilePersistenceService.getProgressTracking(domain, subfield);
      setProgressData(data);
      
      debugLogger.log('Progress data loaded in hook', {
        component: 'useProfilePersistence',
        action: 'load_progress',
        metadata: { 
          domain, 
          subfield,
          hasData: !!data,
          overallProgress: data?.overallProgress
        }
      });
    } catch (err) {
      const errorMessage = 'Failed to load progress data';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'load_progress'
      });
    } finally {
      setLoadingProgress(false);
    }
  }, [domain, subfield]);

  const saveProgress = useCallback(async (data: Partial<ProgressTrackingData>): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setError('User not authenticated');
      return false;
    }

    setError(null);

    try {
      const success = await ProfilePersistenceService.saveProgressTracking(data);
      
      if (success) {
        // Refresh progress data
        await loadProgress();
        
        debugLogger.log('Progress saved successfully in hook', {
          component: 'useProfilePersistence',
          action: 'save_progress',
          metadata: { domain: data.domain, overallProgress: data.overallProgress }
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = 'Failed to save progress data';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'save_progress'
      });
      return false;
    }
  }, [loadProgress]);

  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  // Dashboard state functions
  const loadDashboard = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    setLoadingDashboard(true);
    setError(null);

    try {
      const data = await ProfilePersistenceService.getDashboardState();
      setDashboardState(data);
      
      debugLogger.log('Dashboard state loaded in hook', {
        component: 'useProfilePersistence',
        action: 'load_dashboard',
        metadata: { 
          hasData: !!data,
          currentView: data?.currentView,
          selectedDomain: data?.selectedDomain
        }
      });
    } catch (err) {
      const errorMessage = 'Failed to load dashboard state';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'load_dashboard'
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const saveDashboardState = useCallback(async (state: Partial<DashboardStateData>): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setError('User not authenticated');
      return false;
    }

    setError(null);

    try {
      const success = await ProfilePersistenceService.saveDashboardState(state);
      
      if (success) {
        // Refresh dashboard state
        await loadDashboard();
        
        debugLogger.log('Dashboard state saved successfully in hook', {
          component: 'useProfilePersistence',
          action: 'save_dashboard_state',
          metadata: { 
            currentView: state.currentView,
            selectedDomain: state.selectedDomain
          }
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = 'Failed to save dashboard state';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'save_dashboard_state'
      });
      return false;
    }
  }, [loadDashboard]);

  const restoreDashboardState = useCallback(async () => {
    await loadDashboard();
    
    // Also try to restore from UserProfileService for local fallback
    try {
      await UserProfileService.restoreDashboardStateFromBackend();
    } catch (error) {
      debugLogger.error('Failed to restore dashboard state from UserProfileService', error as Error, {
        component: 'useProfilePersistence',
        action: 'restore_dashboard_state'
      });
    }
  }, [loadDashboard]);

  // Session management functions
  const loadActiveSession = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    setLoadingSession(true);
    setError(null);

    try {
      const session = await ProfilePersistenceService.getActiveSession();
      setActiveSession(session);
      
      debugLogger.log('Active session loaded in hook', {
        component: 'useProfilePersistence',
        action: 'load_active_session',
        metadata: { 
          hasSession: !!session,
          sessionId: session?.sessionId,
          sessionType: session?.sessionType
        }
      });
    } catch (err) {
      // Don't set error for missing active session as it's normal
      debugLogger.log('No active session found', {
        component: 'useProfilePersistence',
        action: 'load_active_session'
      });
    } finally {
      setLoadingSession(false);
    }
  }, []);

  const startSession = useCallback(async (type: 'learning' | 'assessment' | 'dashboard' | 'general' = 'learning'): Promise<SessionProgressData | null> => {
    if (!AuthService.isAuthenticated()) {
      setError('User not authenticated');
      return null;
    }

    setError(null);

    try {
      const session = await ProfilePersistenceService.startLearningSession(type);
      
      if (session) {
        setActiveSession(session);
        
        debugLogger.log('Session started successfully in hook', {
          component: 'useProfilePersistence',
          action: 'start_session',
          metadata: { 
            sessionId: session.sessionId,
            sessionType: session.sessionType
          }
        });
      }
      
      return session;
    } catch (err) {
      const errorMessage = 'Failed to start session';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'start_session'
      });
      return null;
    }
  }, []);

  const updateSession = useCallback(async (sessionId: string, updates: Partial<SessionProgressData>): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setError('User not authenticated');
      return false;
    }

    setError(null);

    try {
      const updatedSession = await ProfilePersistenceService.updateSessionProgress(sessionId, updates);
      
      if (updatedSession) {
        setActiveSession(updatedSession);
        
        debugLogger.log('Session updated successfully in hook', {
          component: 'useProfilePersistence',
          action: 'update_session',
          metadata: { sessionId }
        });
        
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = 'Failed to update session';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'update_session'
      });
      return false;
    }
  }, []);

  const endSession = useCallback(async (sessionId: string): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setError('User not authenticated');
      return false;
    }

    setError(null);

    try {
      const success = await ProfilePersistenceService.endLearningSession(sessionId);
      
      if (success) {
        setActiveSession(null);
        
        debugLogger.log('Session ended successfully in hook', {
          component: 'useProfilePersistence',
          action: 'end_session',
          metadata: { sessionId }
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = 'Failed to end session';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'end_session'
      });
      return false;
    }
  }, []);

  // Sync all data
  const syncAllData = useCallback(async (): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setError('User not authenticated');
      return false;
    }

    setError(null);

    try {
      const success = await ProfilePersistenceService.syncAllData({
        progressData: progressData || undefined,
        dashboardState: dashboardState || undefined,
        sessionData: activeSession || undefined
      });
      
      if (success) {
        // Refresh all data
        await Promise.all([
          loadProgress(),
          loadDashboard(),
          loadActiveSession()
        ]);
        
        debugLogger.log('All data synced successfully in hook', {
          component: 'useProfilePersistence',
          action: 'sync_all_data'
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = 'Failed to sync all data';
      setError(errorMessage);
      debugLogger.error(errorMessage, err as Error, {
        component: 'useProfilePersistence',
        action: 'sync_all_data'
      });
      return false;
    }
  }, [progressData, dashboardState, activeSession, loadProgress, loadDashboard, loadActiveSession]);

  // Load initial data on mount and when authentication changes
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      Promise.all([
        loadProgress(),
        loadDashboard(),
        loadActiveSession()
      ]).catch(error => {
        debugLogger.error('Failed to load initial profile persistence data', error as Error, {
          component: 'useProfilePersistence',
          action: 'initial_load'
        });
      });
    }
  }, [loadProgress, loadDashboard, loadActiveSession]);

  // Auto-sync data periodically (every 5 minutes)
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    const interval = setInterval(() => {
      syncAllData().catch(error => {
        debugLogger.error('Auto-sync failed', error as Error, {
          component: 'useProfilePersistence',
          action: 'auto_sync'
        });
      });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [syncAllData]);

  return {
    // Progress tracking
    progressData,
    loadingProgress,
    saveProgress,
    refreshProgress,
    
    // Dashboard state
    dashboardState,
    loadingDashboard,
    saveDashboardState,
    restoreDashboardState,
    
    // Session management
    activeSession,
    loadingSession,
    startSession,
    updateSession,
    endSession,
    
    // General
    isLoading,
    error,
    syncAllData,
    clearError
  };
}