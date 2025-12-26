import axios from '@/utility/axiosInterceptor';
import { AuthService } from './authService';
import { EnhancedProfileService } from './enhancedProfileService';
import { ProgressTrackingService } from './progressTrackingService';
import { ProfilePersistenceService } from './profilePersistenceService';
import { debugLogger } from '@/lib/utils/debugLogger';
import { EnhancedUserProfile } from '../types';

export interface UserProfileData {
  id: string;
  username: string;
  accessLevel: string;
  createdAt: Date;
  enhancedProfile?: EnhancedUserProfile;
  lastLoginDate?: Date;
}

export interface DashboardState {
  selectedDomain?: string;
  selectedJobRole?: string;
  currentView?: 'roadmap' | 'resources' | 'progress' | 'similar-jobs';
  scrollPosition?: number;
  expandedSections?: string[];
  lastVisited: Date;
}

export interface SessionProgress {
  sessionId: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  activitiesCompleted: string[];
  timeSpent: number; // minutes
  currentResource?: string;
  progressSnapshot: any;
}

/**
 * User Profile Service
 * Implements requirements 9.1, 9.2, 9.3, 9.4 for user profile and progress persistence
 */
export class UserProfileService {
  private static readonly DASHBOARD_STATE_KEY = 'dashboard_state';
  private static readonly SESSION_PROGRESS_KEY = 'session_progress';
  private static readonly PROFILE_CACHE_KEY = 'cached_profile';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Requirement 9.1: Redirect returning users to saved dashboard
   * Load complete user profile with enhanced data and progress
   */
  static async loadUserProfile(): Promise<UserProfileData | null> {
    try {
      debugLogger.log('Loading user profile', {
        component: 'UserProfileService',
        action: 'load_profile'
      });

      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        debugLogger.log('User not authenticated, cannot load profile', {
          component: 'UserProfileService',
          action: 'load_profile'
        });
        return null;
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      // Try to get cached profile first
      const cachedProfile = this.getCachedProfile();
      if (cachedProfile && this.isCacheValid(cachedProfile.cachedAt)) {
        debugLogger.log('Using cached profile', {
          component: 'UserProfileService',
          action: 'load_profile',
          metadata: { userId: currentUser.id }
        });
        return cachedProfile.profile;
      }

      // Load enhanced profile from backend
      let enhancedProfile: EnhancedUserProfile | null = null;
      try {
        enhancedProfile = await EnhancedProfileService.loadEnhancedProfile();
      } catch (error) {
        debugLogger.log('No enhanced profile found, user may need to complete assessment', {
          component: 'UserProfileService',
          action: 'load_profile',
          metadata: { userId: currentUser.id }
        });
      }

      const profileData: UserProfileData = {
        id: currentUser.id,
        username: currentUser.username,
        accessLevel: currentUser.accessLevel || 'user',
        createdAt: currentUser.createdAt || new Date(),
        enhancedProfile,
        lastLoginDate: new Date()
      };

      // Cache the profile
      this.cacheProfile(profileData);

      debugLogger.log('User profile loaded successfully', {
        component: 'UserProfileService',
        action: 'load_profile',
        metadata: { 
          userId: currentUser.id,
          hasEnhancedProfile: !!enhancedProfile
        }
      });

      return profileData;

    } catch (error) {
      debugLogger.error('Failed to load user profile', error as Error, {
        component: 'UserProfileService',
        action: 'load_profile'
      });
      return null;
    }
  }

  /**
   * Requirement 9.2: Display previously saved progress
   * Save user profile data to backend
   */
  static async saveUserProfile(profileData: Partial<EnhancedUserProfile>): Promise<boolean> {
    try {
      debugLogger.log('Saving user profile', {
        component: 'UserProfileService',
        action: 'save_profile',
        metadata: { dataKeys: Object.keys(profileData) }
      });

      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Save enhanced profile to backend
      await EnhancedProfileService.saveEnhancedProfile(profileData as EnhancedUserProfile);

      // Clear cached profile to force reload
      this.clearCachedProfile();

      debugLogger.log('User profile saved successfully', {
        component: 'UserProfileService',
        action: 'save_profile'
      });

      return true;

    } catch (error) {
      debugLogger.error('Failed to save user profile', error as Error, {
        component: 'UserProfileService',
        action: 'save_profile'
      });
      return false;
    }
  }

  /**
   * Requirement 9.3: Show current position in learning roadmap
   * Save dashboard state for restoration
   */
  static saveDashboardState(state: DashboardState): void {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return;
      }

      const stateWithTimestamp = {
        ...state,
        lastVisited: new Date()
      };

      localStorage.setItem(
        `${this.DASHBOARD_STATE_KEY}_${currentUser.id}`,
        JSON.stringify(stateWithTimestamp)
      );

      debugLogger.log('Dashboard state saved', {
        component: 'UserProfileService',
        action: 'save_dashboard_state',
        metadata: { 
          userId: currentUser.id,
          currentView: state.currentView,
          selectedDomain: state.selectedDomain
        }
      });

    } catch (error) {
      debugLogger.error('Failed to save dashboard state', error as Error, {
        component: 'UserProfileService',
        action: 'save_dashboard_state'
      });
    }
  }

  /**
   * Requirement 9.1: Redirect to saved dashboard
   * Load saved dashboard state
   */
  static loadDashboardState(): DashboardState | null {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      const stored = localStorage.getItem(`${this.DASHBOARD_STATE_KEY}_${currentUser.id}`);
      if (!stored) {
        return null;
      }

      const state = JSON.parse(stored) as DashboardState;
      
      debugLogger.log('Dashboard state loaded', {
        component: 'UserProfileService',
        action: 'load_dashboard_state',
        metadata: { 
          userId: currentUser.id,
          currentView: state.currentView,
          selectedDomain: state.selectedDomain,
          lastVisited: state.lastVisited
        }
      });

      return state;

    } catch (error) {
      debugLogger.error('Failed to load dashboard state', error as Error, {
        component: 'UserProfileService',
        action: 'load_dashboard_state'
      });
      return null;
    }
  }

  /**
   * Requirement 9.4: Maintain checklist progress from previous sessions
   * Start a new learning session
   */
  static startLearningSession(): SessionProgress {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const session: SessionProgress = {
        sessionId,
        userId: currentUser.id,
        startTime: new Date(),
        lastActivity: new Date(),
        activitiesCompleted: [],
        timeSpent: 0,
        progressSnapshot: {}
      };

      this.saveSessionProgress(session);

      debugLogger.log('Learning session started', {
        component: 'UserProfileService',
        action: 'start_session',
        metadata: { 
          userId: currentUser.id,
          sessionId
        }
      });

      return session;

    } catch (error) {
      debugLogger.error('Failed to start learning session', error as Error, {
        component: 'UserProfileService',
        action: 'start_session'
      });
      throw error;
    }
  }

  /**
   * Update current learning session with progress
   */
  static updateLearningSession(
    sessionId: string, 
    updates: Partial<SessionProgress>
  ): SessionProgress | null {
    try {
      const session = this.getSessionProgress(sessionId);
      if (!session) {
        debugLogger.log('Session not found for update', {
          component: 'UserProfileService',
          action: 'update_session',
          metadata: { sessionId }
        });
        return null;
      }

      const updatedSession: SessionProgress = {
        ...session,
        ...updates,
        lastActivity: new Date()
      };

      this.saveSessionProgress(updatedSession);

      debugLogger.log('Learning session updated', {
        component: 'UserProfileService',
        action: 'update_session',
        metadata: { 
          sessionId,
          activitiesCompleted: updatedSession.activitiesCompleted.length,
          timeSpent: updatedSession.timeSpent
        }
      });

      return updatedSession;

    } catch (error) {
      debugLogger.error('Failed to update learning session', error as Error, {
        component: 'UserProfileService',
        action: 'update_session'
      });
      return null;
    }
  }

  /**
   * End current learning session and persist progress
   */
  static async endLearningSession(sessionId: string): Promise<boolean> {
    try {
      const session = this.getSessionProgress(sessionId);
      if (!session) {
        return false;
      }

      // Calculate final session time
      const endTime = new Date();
      const totalTime = Math.floor((endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
      
      // Update progress tracking with session data
      if (session.activitiesCompleted.length > 0) {
        for (const activityId of session.activitiesCompleted) {
          await ProgressTrackingService.updateProgress(session.userId, {
            resourceId: activityId,
            skillsGained: [], // Would be populated based on activity
            timeSpent: Math.floor(totalTime / session.activitiesCompleted.length),
            completed: true
          });
        }
      }

      // Clean up session storage
      this.clearSessionProgress(sessionId);

      debugLogger.log('Learning session ended', {
        component: 'UserProfileService',
        action: 'end_session',
        metadata: { 
          sessionId,
          totalTime,
          activitiesCompleted: session.activitiesCompleted.length
        }
      });

      return true;

    } catch (error) {
      debugLogger.error('Failed to end learning session', error as Error, {
        component: 'UserProfileService',
        action: 'end_session'
      });
      return false;
    }
  }

  /**
   * Get current active learning session
   */
  static getCurrentSession(): SessionProgress | null {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      // Look for active session in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.SESSION_PROGRESS_KEY}_${currentUser.id}`)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const session = JSON.parse(stored) as SessionProgress;
            
            // Check if session is still active (within last 2 hours)
            const lastActivity = new Date(session.lastActivity);
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            
            if (lastActivity > twoHoursAgo) {
              return session;
            } else {
              // Clean up old session
              localStorage.removeItem(key);
            }
          }
        }
      }

      return null;

    } catch (error) {
      debugLogger.error('Failed to get current session', error as Error, {
        component: 'UserProfileService',
        action: 'get_current_session'
      });
      return null;
    }
  }

  /**
   * Sync local progress with backend using ProfilePersistenceService
   */
  static async syncProgressWithBackend(): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      debugLogger.log('Syncing progress with backend', {
        component: 'UserProfileService',
        action: 'sync_progress',
        metadata: { userId: currentUser.id }
      });

      // Get local progress data
      const localProgress = await ProgressTrackingService.getUserProgress(currentUser.id);
      
      // Get dashboard state
      const dashboardState = this.loadDashboardState();
      
      // Get active session
      const activeSession = this.getCurrentSession();
      
      // Sync all data using ProfilePersistenceService
      const success = await ProfilePersistenceService.syncAllData({
        progressData: localProgress,
        dashboardState: dashboardState || undefined,
        sessionData: activeSession || undefined
      });
      
      if (success) {
        debugLogger.log('Progress synced successfully', {
          component: 'UserProfileService',
          action: 'sync_progress',
          metadata: { userId: currentUser.id }
        });
        return true;
      }

      return false;

    } catch (error) {
      debugLogger.error('Failed to sync progress with backend', error as Error, {
        component: 'UserProfileService',
        action: 'sync_progress'
      });
      return false;
    }
  }

  /**
   * Clear all user data (for logout)
   */
  static clearUserData(): void {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        // Clear dashboard state
        localStorage.removeItem(`${this.DASHBOARD_STATE_KEY}_${currentUser.id}`);
        
        // Clear active sessions
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`${this.SESSION_PROGRESS_KEY}_${currentUser.id}`)) {
            localStorage.removeItem(key);
          }
        }
      }

      // Clear cached profile
      this.clearCachedProfile();

      debugLogger.log('User data cleared', {
        component: 'UserProfileService',
        action: 'clear_user_data'
      });

    } catch (error) {
      debugLogger.error('Failed to clear user data', error as Error, {
        component: 'UserProfileService',
        action: 'clear_user_data'
      });
    }
  }

  /**
   * Check if user has completed career assessment
   */
  static async hasCompletedAssessment(): Promise<boolean> {
    try {
      const profile = await this.loadUserProfile();
      return !!(profile?.enhancedProfile?.careerAssessment?.completedAt);
    } catch (error) {
      return false;
    }
  }

  /**
   * Requirement 9.1: Restore dashboard state from backend for returning users
   */
  static async restoreDashboardStateFromBackend(): Promise<DashboardState | null> {
    try {
      const backendState = await ProfilePersistenceService.getDashboardState();
      
      if (backendState) {
        // Convert backend format to local format and save locally
        const localState: DashboardState = {
          selectedDomain: backendState.selectedDomain,
          selectedJobRole: backendState.selectedJobRole,
          currentView: backendState.currentView,
          scrollPosition: backendState.scrollPosition,
          expandedSections: backendState.expandedSections,
          lastVisited: new Date(backendState.lastVisited)
        };
        
        // Save to local storage for immediate access
        this.saveDashboardState(localState);
        
        debugLogger.log('Dashboard state restored from backend', {
          component: 'UserProfileService',
          action: 'restore_dashboard_state',
          metadata: { 
            currentView: localState.currentView,
            selectedDomain: localState.selectedDomain,
            lastVisited: localState.lastVisited
          }
        });
        
        return localState;
      }
      
      return null;
    } catch (error) {
      debugLogger.error('Failed to restore dashboard state from backend', error as Error, {
        component: 'UserProfileService',
        action: 'restore_dashboard_state'
      });
      return null;
    }
  }

  /**
   * Get user's preferred redirect path after login
   */
  static async getPreferredRedirectPath(): Promise<string> {
    try {
      // First try to restore dashboard state from backend
      const backendState = await this.restoreDashboardStateFromBackend();
      
      if (backendState) {
        // User has previous dashboard state, redirect to dashboard
        return '/dashboard';
      }
      
      // Check local dashboard state
      const localState = this.loadDashboardState();
      if (localState) {
        return '/dashboard';
      }
      
      // Check if user has completed assessment
      const hasCompleted = await this.hasCompletedAssessment();
      if (!hasCompleted) {
        return '/career-assessment';
      }
      
      return '/dashboard';
    } catch (error) {
      debugLogger.error('Error determining preferred redirect path', error as Error, {
        component: 'UserProfileService',
        action: 'get_preferred_redirect_path'
      });
      return '/dashboard';
    }
  }

  // Private helper methods

  private static saveSessionProgress(session: SessionProgress): void {
    try {
      const key = `${this.SESSION_PROGRESS_KEY}_${session.userId}_${session.sessionId}`;
      localStorage.setItem(key, JSON.stringify(session));
    } catch (error) {
      debugLogger.error('Failed to save session progress', error as Error, {
        component: 'UserProfileService',
        action: 'save_session_progress'
      });
    }
  }

  private static getSessionProgress(sessionId: string): SessionProgress | null {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      const key = `${this.SESSION_PROGRESS_KEY}_${currentUser.id}_${sessionId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  private static clearSessionProgress(sessionId: string): void {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return;
      }

      const key = `${this.SESSION_PROGRESS_KEY}_${currentUser.id}_${sessionId}`;
      localStorage.removeItem(key);
    } catch (error) {
      debugLogger.error('Failed to clear session progress', error as Error, {
        component: 'UserProfileService',
        action: 'clear_session_progress'
      });
    }
  }

  private static cacheProfile(profile: UserProfileData): void {
    try {
      const cacheData = {
        profile,
        cachedAt: new Date()
      };
      localStorage.setItem(this.PROFILE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      debugLogger.error('Failed to cache profile', error as Error, {
        component: 'UserProfileService',
        action: 'cache_profile'
      });
    }
  }

  private static getCachedProfile(): { profile: UserProfileData; cachedAt: Date } | null {
    try {
      const stored = localStorage.getItem(this.PROFILE_CACHE_KEY);
      if (!stored) {
        return null;
      }

      const cacheData = JSON.parse(stored);
      return {
        profile: cacheData.profile,
        cachedAt: new Date(cacheData.cachedAt)
      };
    } catch (error) {
      return null;
    }
  }

  private static clearCachedProfile(): void {
    try {
      localStorage.removeItem(this.PROFILE_CACHE_KEY);
    } catch (error) {
      debugLogger.error('Failed to clear cached profile', error as Error, {
        component: 'UserProfileService',
        action: 'clear_cached_profile'
      });
    }
  }

  private static isCacheValid(cachedAt: Date): boolean {
    const now = new Date();
    return (now.getTime() - cachedAt.getTime()) < this.CACHE_DURATION;
  }
}