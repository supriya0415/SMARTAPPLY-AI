import { Navigate, useLocation } from 'react-router-dom'
import { AuthService } from '@/lib/services/authService'
import { useUserStore } from '@/lib/stores/userStore'
import { debugLogger } from '@/lib/utils/debugLogger'

interface ProtectedRouteProps {
  children: JSX.Element
  requiresEnhancedProfile?: boolean
}

export const ProtectedRoute = ({
  children,
  requiresEnhancedProfile = false,
}: ProtectedRouteProps) => {
  const location = useLocation()
  const { enhancedProfile } = useUserStore()

  debugLogger.log('ProtectedRoute check initiated', {
    component: 'ProtectedRoute',
    action: 'route_check',
    metadata: {
      currentPath: location.pathname,
      isAuthenticated: AuthService.isAuthenticated(),
      hasEnhancedProfile: !!enhancedProfile,
      requiresEnhancedProfile,
    },
  })

  // First check: Authentication required (Requirements 1.1, 1.2)
  if (!AuthService.isAuthenticated()) {
    debugLogger.logNavigation(
      location.pathname,
      '/signin',
      'Authentication required - Requirements 1.1, 1.2'
    )
    return <Navigate to="/signin" replace />
  }

  // Function to check if enhanced profile is complete
  const isEnhancedProfileComplete = (profile: any) => {
    if (!profile) return false

    // NEW: Less strict check - only look for actual career data, not gamification fields
    // A complete profile has EITHER:
    // 1. Career recommendations (generated roadmap)
    // 2. Career interest (at minimum)
    const hasCareerRecommendations = !!(
      profile.careerRecommendations && 
      profile.careerRecommendations.length > 0
    )
    
    const hasCareerInterest = !!(
      profile.careerInterest && 
      profile.careerInterest.trim().length > 0
    )
    
    // Profile is complete if it has recommendations OR at least a career interest
    return hasCareerRecommendations || hasCareerInterest
  }

  // Check enhanced profile status from multiple sources
  let hasCompleteEnhancedProfile = false
  let profileData = null

  // First check Zustand store
  if (enhancedProfile && isEnhancedProfileComplete(enhancedProfile)) {
    hasCompleteEnhancedProfile = true
    profileData = enhancedProfile
    debugLogger.log('Complete enhanced profile found in Zustand store', {
      component: 'ProtectedRoute',
      action: 'profile_found_zustand',
    })
  } else {
    // Fallback to localStorage check
    try {
      const storedData = localStorage.getItem('career-mentor-store')
      if (storedData) {
        const parsed = JSON.parse(storedData)
        const storedProfile = parsed?.enhancedProfile

        if (storedProfile && isEnhancedProfileComplete(storedProfile)) {
          hasCompleteEnhancedProfile = true
          profileData = storedProfile
          debugLogger.log('Complete enhanced profile found in localStorage', {
            component: 'ProtectedRoute',
            action: 'profile_found_localStorage',
          })
        } else {
          debugLogger.log(
            'Enhanced profile incomplete or missing in localStorage',
            {
              component: 'ProtectedRoute',
              action: 'profile_incomplete_localStorage',
            }
          )
        }
      }
    } catch (error) {
      debugLogger.error(
        'Error checking localStorage for enhanced profile',
        error as Error,
        {
          component: 'ProtectedRoute',
          action: 'profile_check_error',
        }
      )
    }
  }

  debugLogger.log('Enhanced profile status determined', {
    component: 'ProtectedRoute',
    action: 'profile_status',
    metadata: {
      hasCompleteProfile: hasCompleteEnhancedProfile,
      profileExists: !!profileData,
      hasRecommendations: profileData?.careerRecommendations?.length || 0,
    },
  })

  // Enhanced profile routing logic based on requirements 4.3, 4.4, 4.5
  if (hasCompleteEnhancedProfile) {
    // User has completed assessment - should access dashboard and other protected pages
    debugLogger.log('User has complete enhanced profile', {
      component: 'ProtectedRoute',
      action: 'profile_complete',
    })

    // If user is trying to access assessment page but has completed it, redirect to dashboard
    if (location.pathname === '/assessment') {
      debugLogger.logNavigation(
        '/assessment',
        '/dashboard',
        'User has completed assessment - Requirement 4.5'
      )
      return <Navigate to="/dashboard" replace />
    }

    // Allow access to all other protected pages
    debugLogger.log('Allowing access to protected page', {
      component: 'ProtectedRoute',
      action: 'access_granted',
      metadata: { path: location.pathname },
    })
    return children
  } else {
    // User doesn't have complete enhanced profile
    debugLogger.log('User does not have complete enhanced profile', {
      component: 'ProtectedRoute',
      action: 'profile_incomplete',
    })

    // If the route requires enhanced profile (like dashboard), redirect to assessment
    if (requiresEnhancedProfile || location.pathname === '/dashboard') {
      debugLogger.logNavigation(
        location.pathname,
        '/assessment',
        'Route requires enhanced profile - Requirement 4.3'
      )
      return <Navigate to="/assessment" replace />
    }

    // For other protected routes that don't require enhanced profile, allow access
    // This includes routes like /profile, /achievements, etc. that should be accessible
    // even without completing the assessment
    debugLogger.log(
      "Allowing access to protected page that doesn't require enhanced profile",
      {
        component: 'ProtectedRoute',
        action: 'access_granted_no_profile_required',
        metadata: { path: location.pathname },
      }
    )
    return children
  }
}

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  // Check authentication first
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/signin" replace />
  }

  // Check admin access
  if (!AuthService.isAdmin()) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute
