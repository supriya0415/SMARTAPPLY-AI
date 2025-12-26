import { useState, useEffect, useCallback } from 'react';
import { UserProfileService, UserProfileData, DashboardState, SessionProgress } from '../services/userProfileService';
import { AuthService } from '../services/authService';
import { debugLogger } from '../utils/debugLogger';

export interface UseUserProfileReturn {
  // Profile data
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  
  // Dashboard state
  dashboardState: DashboardState | null;
  
  // Session management
  currentSession: SessionProgress | null;
  
  // Actions
  loadProfile: () => Promise<void>;
  saveProfile: (profileData: any) => Promise<boolean>;
  saveDashboardState: (state: DashboardState) => void;
  startSession: () => SessionProgress | null;
  updateSession: (sessionId: string, updates: Partial<SessionProgress>) => void;
  endSession: (sessionId: string) => Promise<boolean>;
  syncProgress: () => Promise<boolean>;
  clearUserData: () => void;
  
  // Computed properties
  hasCompletedAssessment: boolean;
  preferredRedirectPath: string;
}

/**
 * Custom hook for managing user profile and dashboard state
 * Implements requirements 9.1, 9.2, 9.3, 9.4
 */
export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardState, setDashboardState] = useState<DashboardState | null>(null);
  const [currentSession, setCurrentSession] = useState<SessionProgress | null>(null);

  /**
   * Load user profile from backend
   * Requirement 9.1: Redirect returning users to saved dashboard
   */
  const loadProfile = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      setProfile(null);
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      debugLogger.log('Loading user profile via hook', {
        component: 'useUserProfile',
        action: 'load_profile'
      });

      const profileData = await UserProfileService.loadUserProfile();
      setProfile(profileData);

      // Load dashboard state if profile exists
      if (profileData) {
        const savedDashboardState = UserProfileService.loadDashboardState();
        setDashboardState(savedDashboardState);

        // Check for active session
        const activeSession = UserProfileService.getCurrentSession();
        setCurrentSession(activeSession);
      }

      debugLogger.log('Profile loaded successfully via hook', {
        component: 'useUserProfile',
        action: 'load_profile',
        metadata: { 
          hasProfile: !!profileData,
          hasDashboardState: !!dashboardState,
          hasActiveSession: !!currentSession
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      
      debugLogger.error('Failed to load profile via hook', err as Error, {
        component: 'useUserProfile',
        action: 'load_profile'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save user profile data
   * Requirement 9.2: Display previously saved progress
   */
  const saveProfile = useCallback(async (profileData: any): Promise<boolean> => {
    try {
      debugLogger.log('Saving profile via hook', {
        component: 'useUserProfile',
        action: 'save_profile'
      });

      const success = await UserProfileService.saveUserProfile(profileData);
      
      if (success) {
        // Reload profile to get updated data
        await loadProfile();
      }

      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      
      debugLogger.error('Failed to save profile via hook', err as Error, {
        component: 'useUserProfile',
        action: 'save_profile'
      });
      
      return false;
    }
  }, [loadProfile]);

  /**
   * Save dashboard state
   * Requirement 9.3: Show current position in learning roadmap
   */
  const saveDashboardState = useCallback((state: DashboardState) => {
    try {
      UserProfileService.saveDashboardState(state);
      setDashboardState(state);

      debugLogger.log('Dashboard state saved via hook', {
        component: 'useUserProfile',
        action: 'save_dashboard_state',
        metadata: { currentView: state.currentView }
      });
    } catch (err) {
      debugLogger.error('Failed to save dashboard state via hook', err as Error, {
        component: 'useUserProfile',
        action: 'save_dashboard_state'
      });
    }
  }, []);

  /**
   * Start a new learning session
   * Requirement 9.4: Maintain checklist progress from previous sessions
   */
  const startSession = useCallback((): SessionProgress | null => {
    try {
      const session = UserProfileService.startLearningSession();
      setCurrentSession(session);

      debugLogger.log('Session started via hook', {
        component: 'useUserProfile',
        action: 'start_session',
        metadata: { sessionId: session.sessionId }
      });

      return session;
    } catch (err) {
      debugLogger.error('Failed to start session via hook', err as Error, {
        component: 'useUserProfile',
        action: 'start_session'
      });
      return null;
    }
  }, []);

  /**
   * Update current learning session
   */
  const updateSession = useCallback((sessionId: string, updates: Partial<SessionProgress>) => {
    try {
      const updatedSession = UserProfileService.updateLearningSession(sessionId, updates);
      if (updatedSession) {
        setCurrentSession(updatedSession);
      }

      debugLogger.log('Session updated via hook', {
        component: 'useUserProfile',
        action: 'update_session',
        metadata: { sessionId }
      });
    } catch (err) {
      debugLogger.error('Failed to update session via hook', err as Error, {
        component: 'useUserProfile',
        action: 'update_session'
      });
    }
  }, []);

  /**
   * End current learning session
   */
  const endSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const success = await UserProfileService.endLearningSession(sessionId);
      
      if (success) {
        setCurrentSession(null);
        // Reload profile to get updated progress
        await loadProfile();
      }

      debugLogger.log('Session ended via hook', {
        component: 'useUserProfile',
        action: 'end_session',
        metadata: { sessionId, success }
      });

      return success;
    } catch (err) {
      debugLogger.error('Failed to end session via hook', err as Error, {
        component: 'useUserProfile',
        action: 'end_session'
      });
      return false;
    }
  }, [loadProfile]);

  /**
   * Sync progress with backend
   */
  const syncProgress = useCallback(async (): Promise<boolean> => {
    try {
      debugLogger.log('Syncing progress via hook', {
        component: 'useUserProfile',
        action: 'sync_progress'
      });

      const success = await UserProfileService.syncProgressWithBackend();
      
      if (success) {
        // Reload profile to get synced data
        await loadProfile();
      }

      return success;
    } catch (err) {
      debugLogger.error('Failed to sync progress via hook', err as Error, {
        component: 'useUserProfile',
        action: 'sync_progress'
      });
      return false;
    }
  }, [loadProfile]);

  /**
   * Clear all user data (for logout)
   */
  const clearUserData = useCallback(() => {
    try {
      UserProfileService.clearUserData();
      setProfile(null);
      setDashboardState(null);
      setCurrentSession(null);
      setError(null);

      debugLogger.log('User data cleared via hook', {
        component: 'useUserProfile',
        action: 'clear_user_data'
      });
    } catch (err) {
      debugLogger.error('Failed to clear user data via hook', err as Error, {
        component: 'useUserProfile',
        action: 'clear_user_data'
      });
    }
  }, []);

  // Computed properties
  const hasCompletedAssessment = profile?.enhancedProfile?.careerAssessment?.completedAt != null;
  const preferredRedirectPath = UserProfileService.getPreferredRedirectPath();

  // Load profile on mount and when authentication changes
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      loadProfile();
    } else {
      setProfile(null);
      setDashboardState(null);
      setCurrentSession(null);
    }
  }, [loadProfile]);

  // Auto-sync progress periodically
  useEffect(() => {
    if (!profile || !AuthService.isAuthenticated()) {
      return;
    }

    // Sync progress every 5 minutes
    const syncInterval = setInterval(() => {
      syncProgress().catch(err => {
        debugLogger.error('Auto-sync failed', err as Error, {
          component: 'useUserProfile',
          action: 'auto_sync'
        });
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, [profile, syncProgress]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // End any active session when component unmounts
      if (currentSession) {
        UserProfileService.endLearningSession(currentSession.sessionId).catch(err => {
          debugLogger.error('Failed to end session on unmount', err as Error, {
            component: 'useUserProfile',
            action: 'cleanup'
          });
        });
      }
    };
  }, [currentSession]);

  return {
    // Profile data
    profile,
    isLoading,
    error,
    
    // Dashboard state
    dashboardState,
    
    // Session management
    currentSession,
    
    // Actions
    loadProfile,
    saveProfile,
    saveDashboardState,
    startSession,
    updateSession,
    endSession,
    syncProgress,
    clearUserData,
    
    // Computed properties
    hasCompletedAssessment,
    preferredRedirectPath
  };
}