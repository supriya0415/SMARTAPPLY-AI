import React, { useEffect, useState } from 'react'
import { AuthService } from '@/lib/services/authService'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { debugLogger } from '@/lib/utils/debugLogger'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

/**
 * AuthGuard Component
 * Provides authentication checking and loading states
 * Implements Requirements 1.1, 1.2: Authentication verification
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  requireAuth = true 
}) => {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        debugLogger.log('AuthGuard checking authentication', {
          component: 'AuthGuard',
          action: 'auth_check_start'
        });

        const authenticated = AuthService.isAuthenticated()
        setIsAuthenticated(authenticated)
        
        debugLogger.log('AuthGuard authentication check complete', {
          component: 'AuthGuard',
          action: 'auth_check_complete',
          metadata: { authenticated }
        });
      } catch (error) {
        debugLogger.error('AuthGuard authentication check failed', error as Error, {
          component: 'AuthGuard',
          action: 'auth_check_error'
        });
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    // Redirect to login
    AuthService.requireAuth()
    return null
  }

  // If authentication is not required or user is authenticated
  return <>{children}</>
}

export default AuthGuard