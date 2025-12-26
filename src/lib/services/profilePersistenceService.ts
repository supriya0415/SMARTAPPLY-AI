import axios from '@/utility/axiosInterceptor';
import { AuthService } from './authService';
import { debugLogger } from '@/lib/utils/debugLogger';

/**
 * Profile Persistence Service
 * Implements requirements 9.1, 9.2, 9.3, 9.4 for user profile and progress persistence
 */

export interface ProgressTrackingData {
  userId: string;
  domain: string;
  subfield?: string;
  overallProgress: number;
  completedResources: string[];
  inProgressResources: string[];
  skillsAcquired: string[];
  timeSpent: number;
  studyStreak: number;
  lastActivityDate: Date;
  milestones: ProgressMilestone[];
  achievements: ProgressAchievement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  type: 'resource-completion' | 'skill-mastery' | 'time-based';
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
}

export interface ProgressAchievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'completion' | 'consistency' | 'skill' | 'milestone';
  earnedAt: Date;
  experiencePoints: number;
}

export interface DashboardStateData {
  userId: string;
  selectedDomain?: string;
  selectedJobRole?: string;
  currentView: 'roadmap' | 'resources' | 'progress' | 'similar-jobs';
  scrollPosition: number;
  expandedSections: string[];
  lastVisited: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    autoSave: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionProgressData {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  lastActivity: Date;
  activitiesCompleted: string[];
  timeSpent: number;
  currentResource?: string;
  progressSnapshot: any;
  sessionType: 'learning' | 'assessment' | 'dashboard' | 'general';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningChecklistData {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: string;
  subfield?: string;
  targetRole: string;
  items: ChecklistItem[];
  overallProgress: number;
  estimatedCompletion: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: 'skill' | 'resource' | 'project' | 'milestone';
  priority: 'critical' | 'important' | 'nice-to-have';
  estimatedTime?: string;
  dependencies?: string[];
  completed: boolean;
  completedAt?: Date;
  progress: number;
  notes?: string;
  relatedResourceIds?: string[];
}

export interface UserProfileMetadata {
  userId: string;
  profileCompleteness: number;
  lastProfileUpdate: Date;
  assessmentCompleted: boolean;
  assessmentCompletedAt?: Date;
  onboardingCompleted: boolean;
  onboardingStep: number;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    learningReminders: boolean;
  };
  statistics: {
    totalLoginDays: number;
    totalTimeSpent: number;
    resourcesCompleted: number;
    achievementsEarned: number;
    currentStreak: number;
    longestStreak: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ProfilePersistenceService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly LOCAL_STORAGE_PREFIX = 'profile_cache_';

  /**
   * Requirement 9.2: Display previously saved progress
   * Get user's progress tracking data
   */
  static async getProgressTracking(domain?: string, subfield?: string): Promise<ProgressTrackingData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user found');
      }

      debugLogger.log('Getting progress tracking data', {
        component: 'ProfilePersistenceService',
        action: 'get_progress',
        metadata: { userId: currentUser.id, domain, subfield }
      });

      // Try cache first
      const cacheKey = `progress_${currentUser.id}_${domain || 'all'}_${subfield || 'none'}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from backend
      const url = domain ? `/profile/progress/${domain}` : '/profile/progress';
      const params = subfield ? { subfield } : {};
      
      const response = await axios.get(url, { params });
      
      if (response.data) {
        // Cache the result
        this.setCachedData(cacheKey, response.data);
        
        debugLogger.log('Progress tracking data retrieved successfully', {
          component: 'ProfilePersistenceService',
          action: 'get_progress',
          metadata: { 
            userId: currentUser.id,
            overallProgress: response.data.overallProgress,
            completedResources: response.data.completedResources.length
          }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      debugLogger.error('Failed to get progress tracking data', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'get_progress'
      });
      return null;
    }
  }

  /**
   * Save progress tracking data
   */
  static async saveProgressTracking(progressData: Partial<ProgressTrackingData>): Promise<boolean> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user found');
      }

      debugLogger.log('Saving progress tracking data', {
        component: 'ProfilePersistenceService',
        action: 'save_progress',
        metadata: { 
          userId: currentUser.id,
          domain: progressData.domain,
          overallProgress: progressData.overallProgress
        }
      });

      const response = await axios.post('/profile/progress', {
        ...progressData,
        userId: currentUser.id,
        updatedAt: new Date()
      });

      if (response.data) {
        // Clear cache to force refresh
        const cacheKey = `progress_${currentUser.id}_${progressData.domain || 'all'}_${progressData.subfield || 'none'}`;
        this.clearCachedData(cacheKey);
        
        debugLogger.log('Progress tracking data saved successfully', {
          component: 'ProfilePersistenceService',
          action: 'save_progress',
          metadata: { userId: currentUser.id }
        });
        
        return true;
      }

      return false;
    } catch (error) {
      debugLogger.error('Failed to save progress tracking data', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'save_progress'
      });
      return false;
    }
  }

  /**
   * Requirement 9.1: Redirect returning users to saved dashboard
   * Requirement 9.3: Show current position in learning roadmap
   * Get dashboard state for restoration
   */
  static async getDashboardState(): Promise<DashboardStateData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user found');
      }

      debugLogger.log('Getting dashboard state', {
        component: 'ProfilePersistenceService',
        action: 'get_dashboard_state',
        metadata: { userId: currentUser.id }
      });

      // Try cache first
      const cacheKey = `dashboard_${currentUser.id}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await axios.get('/profile/dashboard-state');
      
      if (response.data) {
        // Cache the result
        this.setCachedData(cacheKey, response.data);
        
        debugLogger.log('Dashboard state retrieved successfully', {
          component: 'ProfilePersistenceService',
          action: 'get_dashboard_state',
          metadata: { 
            userId: currentUser.id,
            currentView: response.data.currentView,
            selectedDomain: response.data.selectedDomain,
            lastVisited: response.data.lastVisited
          }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      debugLogger.error('Failed to get dashboard state', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'get_dashboard_state'
      });
      return null;
    }
  }

  /**
   * Save dashboard state
   */
  static async saveDashboardState(stateData: Partial<DashboardStateData>): Promise<boolean> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user found');
      }

      debugLogger.log('Saving dashboard state', {
        component: 'ProfilePersistenceService',
        action: 'save_dashboard_state',
        metadata: { 
          userId: currentUser.id,
          currentView: stateData.currentView,
          selectedDomain: stateData.selectedDomain
        }
      });

      const response = await axios.post('/profile/dashboard-state', {
        ...stateData,
        userId: currentUser.id,
        lastVisited: new Date()
      });

      if (response.data) {
        // Clear cache to force refresh
        const cacheKey = `dashboard_${currentUser.id}`;
        this.clearCachedData(cacheKey);
        
        debugLogger.log('Dashboard state saved successfully', {
          component: 'ProfilePersistenceService',
          action: 'save_dashboard_state',
          metadata: { userId: currentUser.id }
        });
        
        return true;
      }

      return false;
    } catch (error) {
      debugLogger.error('Failed to save dashboard state', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'save_dashboard_state'
      });
      return false;
    }
  }

  /**
   * Requirement 9.4: Maintain checklist progress from previous sessions
   * Start a new learning session
   */
  static async startLearningSession(sessionType: 'learning' | 'assessment' | 'dashboard' | 'general' = 'learning'): Promise<SessionProgressData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user found');
      }

      debugLogger.log('Starting learning session', {
        component: 'ProfilePersistenceService',
        action: 'start_session',
        metadata: { userId: currentUser.id, sessionType }
      });

      const response = await axios.post('/profile/session/start', {
        sessionType
      });

      if (response.data) {
        debugLogger.log('Learning session started successfully', {
          component: 'ProfilePersistenceService',
          action: 'start_session',
          metadata: { 
            userId: currentUser.id,
            sessionId: response.data.sessionId,
            sessionType
          }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      debugLogger.error('Failed to start learning session', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'start_session'
      });
      return null;
    }
  }

  /**
   * Update session progress
   */
  static async updateSessionProgress(sessionId: string, updates: Partial<SessionProgressData>): Promise<SessionProgressData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      debugLogger.log('Updating session progress', {
        component: 'ProfilePersistenceService',
        action: 'update_session',
        metadata: { 
          sessionId,
          activitiesCompleted: updates.activitiesCompleted?.length || 0
        }
      });

      const response = await axios.put(`/profile/session/${sessionId}`, updates);

      if (response.data) {
        debugLogger.log('Session progress updated successfully', {
          component: 'ProfilePersistenceService',
          action: 'update_session',
          metadata: { sessionId }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      debugLogger.error('Failed to update session progress', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'update_session'
      });
      return null;
    }
  }

  /**
   * End learning session
   */
  static async endLearningSession(sessionId: string): Promise<boolean> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      debugLogger.log('Ending learning session', {
        component: 'ProfilePersistenceService',
        action: 'end_session',
        metadata: { sessionId }
      });

      const response = await axios.post(`/profile/session/${sessionId}/end`);

      if (response.data) {
        debugLogger.log('Learning session ended successfully', {
          component: 'ProfilePersistenceService',
          action: 'end_session',
          metadata: { 
            sessionId,
            totalTime: response.data.timeSpent
          }
        });
        
        return true;
      }

      return false;
    } catch (error) {
      debugLogger.error('Failed to end learning session', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'end_session'
      });
      return false;
    }
  }

  /**
   * Get active learning session
   */
  static async getActiveSession(): Promise<SessionProgressData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        return null;
      }

      const response = await axios.get('/profile/session/active');
      
      if (response.data) {
        debugLogger.log('Active session retrieved', {
          component: 'ProfilePersistenceService',
          action: 'get_active_session',
          metadata: { sessionId: response.data.sessionId }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      // Don't log 404 errors as they're expected when no active session exists
      if (error.response?.status !== 404) {
        debugLogger.error('Failed to get active session', error as Error, {
          component: 'ProfilePersistenceService',
          action: 'get_active_session'
        });
      }
      return null;
    }
  }

  /**
   * Get learning checklists
   */
  static async getLearningChecklists(domain?: string): Promise<LearningChecklistData[]> {
    try {
      if (!AuthService.isAuthenticated()) {
        return [];
      }

      const params = domain ? { domain } : {};
      const response = await axios.get('/profile/checklists', { params });
      
      return response.data || [];
    } catch (error) {
      debugLogger.error('Failed to get learning checklists', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'get_checklists'
      });
      return [];
    }
  }

  /**
   * Create learning checklist
   */
  static async createLearningChecklist(checklistData: Partial<LearningChecklistData>): Promise<LearningChecklistData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post('/profile/checklists', checklistData);
      
      if (response.data) {
        debugLogger.log('Learning checklist created successfully', {
          component: 'ProfilePersistenceService',
          action: 'create_checklist',
          metadata: { checklistId: response.data.id }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      debugLogger.error('Failed to create learning checklist', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'create_checklist'
      });
      return null;
    }
  }

  /**
   * Update checklist item
   */
  static async updateChecklistItem(checklistId: string, itemId: string, updates: Partial<ChecklistItem>): Promise<LearningChecklistData | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`/profile/checklists/${checklistId}/items/${itemId}`, updates);
      
      if (response.data) {
        debugLogger.log('Checklist item updated successfully', {
          component: 'ProfilePersistenceService',
          action: 'update_checklist_item',
          metadata: { checklistId, itemId, completed: updates.completed }
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      debugLogger.error('Failed to update checklist item', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'update_checklist_item'
      });
      return null;
    }
  }

  /**
   * Get user profile metadata
   */
  static async getProfileMetadata(): Promise<UserProfileMetadata | null> {
    try {
      if (!AuthService.isAuthenticated()) {
        return null;
      }

      const response = await axios.get('/profile/metadata');
      
      return response.data || null;
    } catch (error) {
      debugLogger.error('Failed to get profile metadata', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'get_metadata'
      });
      return null;
    }
  }

  /**
   * Update user profile metadata
   */
  static async updateProfileMetadata(updates: Partial<UserProfileMetadata>): Promise<boolean> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put('/profile/metadata', updates);
      
      if (response.data) {
        debugLogger.log('Profile metadata updated successfully', {
          component: 'ProfilePersistenceService',
          action: 'update_metadata'
        });
        
        return true;
      }

      return false;
    } catch (error) {
      debugLogger.error('Failed to update profile metadata', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'update_metadata'
      });
      return false;
    }
  }

  /**
   * Sync all user data with backend
   */
  static async syncAllData(data: {
    progressData?: Partial<ProgressTrackingData>;
    dashboardState?: Partial<DashboardStateData>;
    sessionData?: Partial<SessionProgressData>;
  }): Promise<boolean> {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      debugLogger.log('Syncing all user data', {
        component: 'ProfilePersistenceService',
        action: 'sync_all_data',
        metadata: { 
          hasProgressData: !!data.progressData,
          hasDashboardState: !!data.dashboardState,
          hasSessionData: !!data.sessionData
        }
      });

      const response = await axios.post('/profile/sync', data);
      
      if (response.data?.success) {
        // Clear all caches to force refresh
        this.clearAllCaches();
        
        debugLogger.log('All user data synced successfully', {
          component: 'ProfilePersistenceService',
          action: 'sync_all_data'
        });
        
        return true;
      }

      return false;
    } catch (error) {
      debugLogger.error('Failed to sync all user data', error as Error, {
        component: 'ProfilePersistenceService',
        action: 'sync_all_data'
      });
      return false;
    }
  }

  // Private helper methods for caching

  private static getCachedData(key: string): any | null {
    try {
      const cached = localStorage.getItem(`${this.LOCAL_STORAGE_PREFIX}${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(`${this.LOCAL_STORAGE_PREFIX}${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private static setCachedData(key: string, data: any): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`${this.LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      // Ignore cache errors
    }
  }

  private static clearCachedData(key: string): void {
    try {
      localStorage.removeItem(`${this.LOCAL_STORAGE_PREFIX}${key}`);
    } catch (error) {
      // Ignore cache errors
    }
  }

  private static clearAllCaches(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.LOCAL_STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      // Ignore cache errors
    }
  }
}