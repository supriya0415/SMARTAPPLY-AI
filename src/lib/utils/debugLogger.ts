/**
 * Developer Testing Utilities and Console Logging
 * Comprehensive logging system for debugging the user authentication and career flow
 */

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface DebugState {
  authentication: {
    isAuthenticated: boolean;
    token: string | null;
    user: any;
    lastLogin: Date | null;
  };
  profile: {
    hasBasicProfile: boolean;
    hasEnhancedProfile: boolean;
    profileData: any;
    enhancedProfileData: any;
  };
  storage: {
    localStorageKeys: string[];
    sessionStorageKeys: string[];
    storeState: any;
  };
  navigation: {
    currentRoute: string;
    lastNavigation: string | null;
    navigationHistory: string[];
  };
}

class DebugLogger {
  private isDevelopment: boolean;
  private logHistory: Array<{ timestamp: Date; level: string; message: string; context?: LogContext }> = [];
  private maxHistorySize = 1000;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
    
    if (this.isDevelopment) {
      // Make debug utilities available globally for F12 console access
      (window as any).debugUtils = {
        clearStorage: this.clearStorage.bind(this),
        inspectState: this.inspectState.bind(this),
        getLogHistory: this.getLogHistory.bind(this),
        exportLogs: this.exportLogs.bind(this),
        testFlow: this.testCompleteFlow.bind(this),
        resetApp: this.resetApplication.bind(this)
      };
      
      console.log('🔧 Debug utilities loaded. Access via window.debugUtils');
      console.log('Available commands:');
      console.log('  - debugUtils.clearStorage() - Clear all localStorage and sessionStorage');
      console.log('  - debugUtils.inspectState() - Inspect current application state');
      console.log('  - debugUtils.getLogHistory() - Get recent log history');
      console.log('  - debugUtils.exportLogs() - Export logs as JSON');
      console.log('  - debugUtils.testFlow() - Test complete user flow');
      console.log('  - debugUtils.resetApp() - Reset application to initial state');
    }
  }

  private addToHistory(level: string, message: string, context?: LogContext) {
    this.logHistory.push({
      timestamp: new Date(),
      level,
      message,
      context
    });

    // Keep history size manageable
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory = this.logHistory.slice(-this.maxHistorySize);
    }
  }

  // Core logging methods
  log(message: string, context?: LogContext) {
    if (!this.isDevelopment) return;
    
    const timestamp = new Date().toISOString();
    const prefix = context?.component ? `[${context.component}]` : '[DEBUG]';
    const fullMessage = `${prefix} ${message}`;
    
    console.log(`🔍 ${timestamp} ${fullMessage}`, context?.metadata || '');
    this.addToHistory('log', fullMessage, context);
  }

  info(message: string, context?: LogContext) {
    if (!this.isDevelopment) return;
    
    const timestamp = new Date().toISOString();
    const prefix = context?.component ? `[${context.component}]` : '[INFO]';
    const fullMessage = `${prefix} ${message}`;
    
    console.info(`ℹ️ ${timestamp} ${fullMessage}`, context?.metadata || '');
    this.addToHistory('info', fullMessage, context);
  }

  warn(message: string, context?: LogContext) {
    if (!this.isDevelopment) return;
    
    const timestamp = new Date().toISOString();
    const prefix = context?.component ? `[${context.component}]` : '[WARN]';
    const fullMessage = `${prefix} ${message}`;
    
    console.warn(`⚠️ ${timestamp} ${fullMessage}`, context?.metadata || '');
    this.addToHistory('warn', fullMessage, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    if (!this.isDevelopment) return;
    
    const timestamp = new Date().toISOString();
    const prefix = context?.component ? `[${context.component}]` : '[ERROR]';
    const fullMessage = `${prefix} ${message}`;
    
    console.error(`❌ ${timestamp} ${fullMessage}`, error || '', context?.metadata || '');
    this.addToHistory('error', fullMessage, { ...context, metadata: { ...context?.metadata, error: error?.message } });
  }

  // Authentication flow logging
  logAuthStart(username: string) {
    this.log('Authentication process started', {
      component: 'SignIn',
      action: 'auth_start',
      metadata: { username }
    });
  }

  logAuthSuccess(userData: any) {
    this.log('Authentication successful', {
      component: 'SignIn',
      action: 'auth_success',
      metadata: { userId: userData?.id, username: userData?.username }
    });
  }

  logAuthFailure(error: any) {
    this.error('Authentication failed', error, {
      component: 'SignIn',
      action: 'auth_failure'
    });
  }

  // Profile logging
  logProfileCreation(profileData: any) {
    this.log('Creating enhanced profile from results page:', {
      component: 'Results',
      action: 'profile_creation',
      metadata: { profileData }
    });
  }

  logProfileSave(profileData: any) {
    this.log('Setting enhanced profile in store:', {
      component: 'UserStore',
      action: 'profile_save',
      metadata: { profileId: profileData?.id }
    });
  }

  logProfileSaveComplete() {
    this.log('Enhanced profile saved to store and localStorage', {
      component: 'UserStore',
      action: 'profile_save_complete'
    });
  }

  // Navigation logging
  logNavigation(from: string, to: string, reason?: string) {
    this.log(`Navigation: ${from} → ${to}${reason ? ` (${reason})` : ''}`, {
      component: 'Router',
      action: 'navigation',
      metadata: { from, to, reason }
    });
  }

  // Enhanced profile detection logging
  logProfileDetection(hasProfile: boolean, profileData?: any) {
    this.log(`Enhanced profile detection: ${hasProfile ? 'FOUND' : 'NOT FOUND'}`, {
      component: 'SignIn',
      action: 'profile_detection',
      metadata: { hasProfile, profileData: hasProfile ? 'present' : 'none' }
    });
  }

  // Storage operations logging
  logStorageOperation(operation: 'read' | 'write' | 'clear', key: string, success: boolean) {
    this.log(`Storage ${operation}: ${key} - ${success ? 'SUCCESS' : 'FAILED'}`, {
      component: 'Storage',
      action: `storage_${operation}`,
      metadata: { key, success }
    });
  }

  // Assessment flow logging
  logAssessmentStart(profileData: any) {
    this.log('Career assessment started', {
      component: 'CareerAssessment',
      action: 'assessment_start',
      metadata: { userId: profileData?.id }
    });
  }

  logAssessmentComplete(assessmentData: any) {
    this.log('Career assessment completed', {
      component: 'CareerAssessment',
      action: 'assessment_complete',
      metadata: { assessmentData }
    });
  }

  // Dashboard logging
  logDashboardLoad(profileData: any) {
    this.log('Career dashboard loaded', {
      component: 'CareerDashboard',
      action: 'dashboard_load',
      metadata: { userId: profileData?.id, hasRecommendations: !!profileData?.careerRecommendations }
    });
  }

  // Logout logging
  logLogoutStart() {
    this.log('Logout process started', {
      component: 'Logout',
      action: 'logout_start'
    });
  }

  logLogoutComplete(success: boolean) {
    this.log(`Logout ${success ? 'completed successfully' : 'failed'}`, {
      component: 'Logout',
      action: 'logout_complete',
      metadata: { success }
    });
  }

  // Developer testing utilities
  clearStorage(): void {
    console.log('🧹 Clearing all storage...');
    
    try {
      // Clear localStorage
      const localKeys = Object.keys(localStorage);
      console.log('localStorage keys before clear:', localKeys);
      localStorage.clear();
      console.log('✓ localStorage cleared');
      
      // Clear sessionStorage
      const sessionKeys = Object.keys(sessionStorage);
      console.log('sessionStorage keys before clear:', sessionKeys);
      sessionStorage.clear();
      console.log('✓ sessionStorage cleared');
      
      // Verify clearing
      const remainingLocal = Object.keys(localStorage);
      const remainingSession = Object.keys(sessionStorage);
      
      if (remainingLocal.length === 0 && remainingSession.length === 0) {
        console.log('✅ All storage cleared successfully!');
        console.log('💡 Refresh the page to see the app reset to initial state');
      } else {
        console.warn('⚠️ Some storage items may remain:', {
          localStorage: remainingLocal,
          sessionStorage: remainingSession
        });
      }
      
      this.log('Storage cleared by developer', {
        component: 'DebugUtils',
        action: 'storage_clear',
        metadata: { localKeysCleared: localKeys.length, sessionKeysCleared: sessionKeys.length }
      });
      
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      this.error('Failed to clear storage', error as Error, {
        component: 'DebugUtils',
        action: 'storage_clear'
      });
    }
  }

  inspectState(): DebugState {
    console.log('🔍 Inspecting current application state...');
    
    try {
      // Authentication state
      const token = localStorage.getItem('jwt');
      const userData = localStorage.getItem('user');
      
      // Profile state
      const storeData = localStorage.getItem('career-mentor-store');
      let parsedStore = null;
      try {
        parsedStore = storeData ? JSON.parse(storeData) : null;
      } catch (e) {
        console.warn('Failed to parse store data:', e);
      }
      
      // Storage state
      const localStorageKeys = Object.keys(localStorage);
      const sessionStorageKeys = Object.keys(sessionStorage);
      
      const debugState: DebugState = {
        authentication: {
          isAuthenticated: !!token,
          token: token ? `${token.substring(0, 20)}...` : null,
          user: userData ? JSON.parse(userData) : null,
          lastLogin: null // Could be enhanced to track this
        },
        profile: {
          hasBasicProfile: !!(parsedStore?.profile),
          hasEnhancedProfile: !!(parsedStore?.enhancedProfile),
          profileData: parsedStore?.profile || null,
          enhancedProfileData: parsedStore?.enhancedProfile || null
        },
        storage: {
          localStorageKeys,
          sessionStorageKeys,
          storeState: parsedStore
        },
        navigation: {
          currentRoute: window.location.pathname,
          lastNavigation: null, // Could be enhanced to track this
          navigationHistory: [] // Could be enhanced to track this
        }
      };
      
      console.log('📊 Current Application State:', debugState);
      
      // Provide recommendations
      console.log('\n🎯 State Analysis:');
      if (!debugState.authentication.isAuthenticated) {
        console.log('  - User is not authenticated');
      } else if (!debugState.profile.hasEnhancedProfile) {
        console.log('  - User is authenticated but has no enhanced profile (needs assessment)');
      } else {
        console.log('  - User is authenticated with enhanced profile (should see dashboard)');
      }
      
      this.log('State inspection performed', {
        component: 'DebugUtils',
        action: 'state_inspect',
        metadata: { 
          isAuthenticated: debugState.authentication.isAuthenticated,
          hasEnhancedProfile: debugState.profile.hasEnhancedProfile
        }
      });
      
      return debugState;
      
    } catch (error) {
      console.error('❌ Error inspecting state:', error);
      this.error('Failed to inspect state', error as Error, {
        component: 'DebugUtils',
        action: 'state_inspect'
      });
      throw error;
    }
  }

  getLogHistory(): Array<{ timestamp: Date; level: string; message: string; context?: LogContext }> {
    console.log(`📜 Returning ${this.logHistory.length} log entries`);
    return [...this.logHistory];
  }

  exportLogs(): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalLogs: this.logHistory.length,
      logs: this.logHistory,
      currentState: this.inspectState()
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    console.log('📤 Logs exported. Copy the following JSON:');
    console.log(jsonString);
    
    return jsonString;
  }

  testCompleteFlow(): void {
    console.log('🧪 Testing complete user flow...');
    console.log('This will guide you through testing the entire authentication and career flow');
    
    console.log('\n📋 Test Steps:');
    console.log('1. Clear storage: debugUtils.clearStorage()');
    console.log('2. Refresh page to reset app state');
    console.log('3. Navigate to /signup and create account (test1/test123)');
    console.log('4. Complete career assessment');
    console.log('5. Verify enhanced profile creation in console');
    console.log('6. Navigate to dashboard');
    console.log('7. Logout and verify cleanup');
    console.log('8. Login again and verify direct dashboard redirect');
    
    console.log('\n🔍 Monitor these console messages:');
    console.log('  - "Creating enhanced profile from results page:"');
    console.log('  - "Setting enhanced profile in store:"');
    console.log('  - "Enhanced profile saved to store and localStorage"');
    console.log('  - Authentication and navigation logs');
    
    this.log('Complete flow test initiated', {
      component: 'DebugUtils',
      action: 'test_flow'
    });
  }

  resetApplication(): void {
    console.log('🔄 Resetting application to initial state...');
    
    try {
      // Clear all storage
      this.clearStorage();
      
      // Clear any in-memory state (if store is available)
      if ((window as any).userStore?.getState) {
        const store = (window as any).userStore.getState();
        if (store.clearData) {
          store.clearData();
          console.log('✓ In-memory store cleared');
        }
      }
      
      // Clear log history
      this.logHistory = [];
      console.log('✓ Log history cleared');
      
      console.log('✅ Application reset complete!');
      console.log('💡 Refresh the page to see the clean initial state');
      
      this.log('Application reset performed', {
        component: 'DebugUtils',
        action: 'app_reset'
      });
      
    } catch (error) {
      console.error('❌ Error resetting application:', error);
      this.error('Failed to reset application', error as Error, {
        component: 'DebugUtils',
        action: 'app_reset'
      });
    }
  }

  // Utility method to format objects for logging
  formatObject(obj: any, maxDepth: number = 2): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return '[Object - could not stringify]';
    }
  }
}

// Create singleton instance
export const debugLogger = new DebugLogger();

// Export for use in components
export default debugLogger;