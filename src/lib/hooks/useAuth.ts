import { useState, useEffect, useCallback } from 'react'
import { AuthService, LoginCredentials, SignUpCredentials, AuthResult } from '@/lib/services/authService'
import { useUserStore } from '@/lib/stores/userStore'
import { AuthUtils } from '@/lib/utils/authUtils'
import { debugLogger } from '@/lib/utils/debugLogger'

export interface UseAuthReturn {
  // State
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>
  logout: () => Promise<boolean>
  refreshToken: () => Promise<boolean>
  clearError: () => void

  // Utilities
  hasPermission: (route: string) => boolean
  getUserDisplayName: () => string
  isSessionValid: () => boolean
}

/**
 * Authentication Hook
 * Provides authentication state and actions
 * Implements Requirements 1.1, 1.2, 1.3, 1.4
 */
export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { logout: storeLogout } = useUserStore()

  // Get authentication state
  const isAuthenticated = AuthService.isAuthenticated()
  const user = AuthService.getCurrentUser()

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)

    try {
      debugLogger.log('useAuth login started', {
        component: 'useAuth',
        action: 'login_start',
        metadata: { username: credentials.username }
      })

      const result = await AuthService.login(credentials)
      
      if (!result.success) {
        setError(result.message || 'Login failed')
      }

      debugLogger.log('useAuth login completed', {
        component: 'useAuth',
        action: 'login_complete',
        metadata: { success: result.success }
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      
      debugLogger.error('useAuth login error', error as Error, {
        component: 'useAuth',
        action: 'login_error'
      })

      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sign up function
  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)

    try {
      debugLogger.log('useAuth signup started', {
        component: 'useAuth',
        action: 'signup_start',
        metadata: { username: credentials.username }
      })

      const result = await AuthService.signUp(credentials)
      
      if (!result.success) {
        setError(result.message || 'Sign up failed')
      }

      debugLogger.log('useAuth signup completed', {
        component: 'useAuth',
        action: 'signup_complete',
        metadata: { success: result.success }
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setError(errorMessage)
      
      debugLogger.error('useAuth signup error', error as Error, {
        component: 'useAuth',
        action: 'signup_error'
      })

      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      debugLogger.log('useAuth logout started', {
        component: 'useAuth',
        action: 'logout_start'
      })

      const success = await AuthService.logout()
      
      if (success) {
        // Clear user store
        await storeLogout()
      }

      debugLogger.log('useAuth logout completed', {
        component: 'useAuth',
        action: 'logout_complete',
        metadata: { success }
      })

      return success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      setError(errorMessage)
      
      debugLogger.error('useAuth logout error', error as Error, {
        component: 'useAuth',
        action: 'logout_error'
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }, [storeLogout])

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      debugLogger.log('useAuth token refresh started', {
        component: 'useAuth',
        action: 'refresh_start'
      })

      const success = await AuthService.refreshToken()

      debugLogger.log('useAuth token refresh completed', {
        component: 'useAuth',
        action: 'refresh_complete',
        metadata: { success }
      })

      return success
    } catch (error) {
      debugLogger.error('useAuth token refresh error', error as Error, {
        component: 'useAuth',
        action: 'refresh_error'
      })

      return false
    }
  }, [])

  // Permission check
  const hasPermission = useCallback((route: string): boolean => {
    return AuthUtils.hasPermission(route, user?.accessLevel)
  }, [user])

  // Get user display name
  const getUserDisplayName = useCallback((): string => {
    return AuthUtils.getUserDisplayName()
  }, [])

  // Check session validity
  const isSessionValid = useCallback((): boolean => {
    return AuthUtils.isSessionValid()
  }, [])

  // Setup activity tracking on mount
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = AuthUtils.setupActivityTracking()
      return cleanup
    }
  }, [isAuthenticated])

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    error,

    // Actions
    login,
    signUp,
    logout,
    refreshToken,
    clearError,

    // Utilities
    hasPermission,
    getUserDisplayName,
    isSessionValid
  }
}