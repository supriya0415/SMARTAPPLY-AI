import { AuthService } from '@/lib/services/authService';
import { debugLogger } from './debugLogger';
import { toast } from 'sonner';

/**
 * Session Management Utility
 * Implements Requirements 1.3, 1.4: Session management and token handling
 */
export class SessionManager {
  private static refreshInterval: NodeJS.Timeout | null = null;
  private static readonly REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
  private static readonly WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiration

  /**
   * Initialize session management
   */
  static initialize(): void {
    debugLogger.log('Session manager initializing', {
      component: 'SessionManager',
      action: 'initialize'
    });

    // Initialize AuthService
    AuthService.initialize();

    // Start session monitoring if user is authenticated
    if (AuthService.isAuthenticated()) {
      this.startSessionMonitoring();
    }

    // Listen for authentication state changes
    this.setupAuthStateListener();
  }

  /**
   * Start monitoring session for token refresh and expiration
   */
  static startSessionMonitoring(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    debugLogger.log('Starting session monitoring', {
      component: 'SessionManager',
      action: 'start_monitoring'
    });

    this.refreshInterval = setInterval(async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          this.stopSessionMonitoring();
          return;
        }

        // Check if token needs refresh
        const refreshed = await AuthService.refreshToken();
        
        if (!refreshed) {
          debugLogger.warn('Token refresh failed - user needs to re-authenticate', {
            component: 'SessionManager',
            action: 'refresh_failed'
          });
          
          this.handleSessionExpired();
        }
      } catch (error) {
        debugLogger.error('Session monitoring error', error as Error, {
          component: 'SessionManager',
          action: 'monitoring_error'
        });
      }
    }, this.REFRESH_INTERVAL);
  }

  /**
   * Stop session monitoring
   */
  static stopSessionMonitoring(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      
      debugLogger.log('Session monitoring stopped', {
        component: 'SessionManager',
        action: 'stop_monitoring'
      });
    }
  }

  /**
   * Handle session expiration
   */
  static handleSessionExpired(): void {
    debugLogger.log('Session expired - logging out user', {
      component: 'SessionManager',
      action: 'session_expired'
    });

    // Clear authentication data
    AuthService.clearAuthData();

    // Show notification
    toast.error('Your session has expired. Please log in again.', {
      duration: 5000,
      id: 'session-expired'
    });

    // Redirect to login
    window.location.href = '/signin';
  }

  /**
   * Setup listener for authentication state changes
   */
  static setupAuthStateListener(): void {
    // Listen for storage changes (e.g., logout in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'jwt' && !event.newValue) {
        debugLogger.log('Authentication cleared in another tab', {
          component: 'SessionManager',
          action: 'auth_cleared_external'
        });
        
        // Stop monitoring and redirect
        this.stopSessionMonitoring();
        window.location.href = '/signin';
      }
    });

    // Listen for focus events to check session validity
    window.addEventListener('focus', () => {
      if (!AuthService.isAuthenticated()) {
        debugLogger.log('Session invalid on window focus', {
          component: 'SessionManager',
          action: 'session_invalid_on_focus'
        });
        
        this.handleSessionExpired();
      }
    });
  }

  /**
   * Extend session (called on user activity)
   */
  static extendSession(): void {
    if (AuthService.isAuthenticated()) {
      // Update last activity timestamp
      localStorage.setItem('lastActivity', new Date().toISOString());
      
      debugLogger.log('Session extended', {
        component: 'SessionManager',
        action: 'session_extended'
      });
    }
  }

  /**
   * Check if session is about to expire
   */
  static isSessionNearExpiry(): boolean {
    try {
      const expirationDate = localStorage.getItem('expirationDate');
      if (!expirationDate) return false;

      const expDate = new Date(expirationDate);
      const now = new Date();
      const timeUntilExpiry = expDate.getTime() - now.getTime();

      return timeUntilExpiry <= this.WARNING_THRESHOLD && timeUntilExpiry > 0;
    } catch (error) {
      debugLogger.error('Error checking session expiry', error as Error, {
        component: 'SessionManager',
        action: 'check_expiry'
      });
      return false;
    }
  }

  /**
   * Get time until session expires (in milliseconds)
   */
  static getTimeUntilExpiry(): number {
    try {
      const expirationDate = localStorage.getItem('expirationDate');
      if (!expirationDate) return 0;

      const expDate = new Date(expirationDate);
      const now = new Date();
      
      return Math.max(0, expDate.getTime() - now.getTime());
    } catch (error) {
      debugLogger.error('Error getting time until expiry', error as Error, {
        component: 'SessionManager',
        action: 'get_time_until_expiry'
      });
      return 0;
    }
  }

  /**
   * Cleanup session manager
   */
  static cleanup(): void {
    this.stopSessionMonitoring();
    
    debugLogger.log('Session manager cleaned up', {
      component: 'SessionManager',
      action: 'cleanup'
    });
  }

  /**
   * Force session refresh
   */
  static async forceRefresh(): Promise<boolean> {
    try {
      debugLogger.log('Forcing session refresh', {
        component: 'SessionManager',
        action: 'force_refresh'
      });

      const success = await AuthService.refreshToken();
      
      if (success) {
        toast.success('Session refreshed successfully', {
          duration: 2000
        });
      } else {
        toast.error('Failed to refresh session', {
          duration: 3000
        });
      }

      return success;
    } catch (error) {
      debugLogger.error('Force refresh failed', error as Error, {
        component: 'SessionManager',
        action: 'force_refresh_error'
      });
      
      toast.error('Session refresh failed', {
        duration: 3000
      });
      
      return false;
    }
  }
}