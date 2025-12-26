import { AuthService } from '@/lib/services/authService'
import { debugLogger } from './debugLogger'

/**
 * Authentication Utilities
 * Helper functions for authentication-related operations
 */
export class AuthUtils {
  /**
   * Check if current route requires authentication
   */
  static requiresAuth(pathname: string): boolean {
    const publicRoutes = ['/', '/signin', '/signup']
    return !publicRoutes.includes(pathname)
  }

  /**
   * Get redirect path after successful login
   */
  static getPostLoginRedirect(userHasProfile: boolean = false): string {
    // Check if there's a stored redirect path
    const storedPath = AuthService.getRedirectPath()
    
    if (storedPath && storedPath !== '/signin' && storedPath !== '/signup') {
      return storedPath
    }

    // Default redirect based on user profile status
    return userHasProfile ? '/dashboard' : '/assessment'
  }

  /**
   * Validate authentication state and redirect if necessary
   */
  static validateAuthState(currentPath: string): boolean {
    const isAuthenticated = AuthService.isAuthenticated()
    const requiresAuth = this.requiresAuth(currentPath)

    debugLogger.log('Validating auth state', {
      component: 'AuthUtils',
      action: 'validate_auth_state',
      metadata: {
        currentPath,
        isAuthenticated,
        requiresAuth
      }
    })

    if (requiresAuth && !isAuthenticated) {
      debugLogger.log('Authentication required - redirecting to login', {
        component: 'AuthUtils',
        action: 'redirect_to_login',
        metadata: { from: currentPath }
      })
      
      // Store current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', currentPath)
      
      // Redirect to login
      window.location.href = '/signin'
      return false
    }

    return true
  }

  /**
   * Check if user has required permissions for a route
   */
  static hasPermission(route: string, userRole?: string): boolean {
    // Admin routes
    if (route.startsWith('/admin')) {
      return AuthService.isAdmin()
    }

    // All other protected routes just require authentication
    return AuthService.isAuthenticated()
  }

  /**
   * Get user display name
   */
  static getUserDisplayName(): string {
    const user = AuthService.getCurrentUser()
    return user?.username || 'User'
  }

  /**
   * Check if session is valid and not expired
   */
  static isSessionValid(): boolean {
    if (!AuthService.isAuthenticated()) {
      return false
    }

    try {
      const expirationDate = localStorage.getItem('expirationDate')
      if (!expirationDate) {
        return true // No expiration set, assume valid
      }

      const expDate = new Date(expirationDate)
      const now = new Date()
      
      return now <= expDate
    } catch (error) {
      debugLogger.error('Error checking session validity', error as Error, {
        component: 'AuthUtils',
        action: 'check_session_validity'
      })
      return false
    }
  }

  /**
   * Format time until session expires
   */
  static formatTimeUntilExpiry(): string | null {
    try {
      const expirationDate = localStorage.getItem('expirationDate')
      if (!expirationDate) return null

      const expDate = new Date(expirationDate)
      const now = new Date()
      const diff = expDate.getTime() - now.getTime()

      if (diff <= 0) return 'Expired'

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    } catch (error) {
      debugLogger.error('Error formatting expiry time', error as Error, {
        component: 'AuthUtils',
        action: 'format_expiry_time'
      })
      return null
    }
  }

  /**
   * Clear all authentication-related data
   */
  static clearAllAuthData(): void {
    try {
      // Clear localStorage
      const authKeys = ['jwt', 'user', 'expirationDate', 'career-mentor-store']
      authKeys.forEach(key => localStorage.removeItem(key))

      // Clear sessionStorage
      sessionStorage.clear()

      debugLogger.log('All authentication data cleared', {
        component: 'AuthUtils',
        action: 'clear_all_auth_data'
      })
    } catch (error) {
      debugLogger.error('Error clearing auth data', error as Error, {
        component: 'AuthUtils',
        action: 'clear_auth_data_error'
      })
    }
  }

  /**
   * Setup activity tracking for session extension
   */
  static setupActivityTracking(): () => void {
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    let lastActivity = Date.now()

    const handleActivity = () => {
      const now = Date.now()
      // Only update if it's been more than 1 minute since last activity
      if (now - lastActivity > 60000) {
        lastActivity = now
        localStorage.setItem('lastActivity', new Date().toISOString())
      }
    }

    // Add event listeners
    activities.forEach(activity => {
      document.addEventListener(activity, handleActivity, { passive: true })
    })

    debugLogger.log('Activity tracking setup complete', {
      component: 'AuthUtils',
      action: 'setup_activity_tracking'
    })

    // Return cleanup function
    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, handleActivity)
      })
    }
  }
}