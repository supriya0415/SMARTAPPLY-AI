import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '@/lib/services/authService'
import { useUserStore } from '@/lib/stores/userStore'
import { debugLogger } from '@/lib/utils/debugLogger'

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: 'button' | 'link'
}

/**
 * Logout Button Component
 * Implements Requirements 2.1, 2.2, 2.3: Simple logout confirmation without warnings
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'button' 
}) => {
  const navigate = useNavigate()
  const { logout: storeLogout } = useUserStore()

  const handleLogout = async () => {
    try {
      debugLogger.log('Logout button clicked', {
        component: 'LogoutButton',
        action: 'logout_initiated'
      });

      // Use AuthService logout which implements the simple confirmation (Requirements 2.1, 2.2)
      const success = await AuthService.logout();
      
      if (success) {
        // Clear user store state
        await storeLogout();
        
        // Redirect to login page (Requirement 2.3)
        navigate('/signin', { replace: true });
        
        debugLogger.log('Logout completed successfully', {
          component: 'LogoutButton',
          action: 'logout_complete'
        });
      }
    } catch (error) {
      debugLogger.error('Logout button error', error as Error, {
        component: 'LogoutButton',
        action: 'logout_error'
      });
    }
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
      >
        {children || 'Logout'}
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors ${className}`}
    >
      {children || 'Logout'}
    </button>
  )
}

export default LogoutButton