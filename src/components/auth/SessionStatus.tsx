import React, { useState, useEffect } from 'react'
import { SessionManager } from '@/lib/utils/sessionManager'
import { AuthService } from '@/lib/services/authService'
import { Clock, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

/**
 * SessionStatus Component
 * Shows session information and allows manual refresh
 * Implements Requirements 1.3, 1.4: Session management display
 */
export const SessionStatus: React.FC = () => {
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0)
  const [isNearExpiry, setIsNearExpiry] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      return
    }

    const updateTimer = () => {
      const time = SessionManager.getTimeUntilExpiry()
      const nearExpiry = SessionManager.isSessionNearExpiry()
      
      setTimeUntilExpiry(time)
      setIsNearExpiry(nearExpiry)
    }

    // Update immediately
    updateTimer()

    // Update every minute
    const interval = setInterval(updateTimer, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const success = await SessionManager.forceRefresh()
      if (success) {
        // Update timer after successful refresh
        const time = SessionManager.getTimeUntilExpiry()
        setTimeUntilExpiry(time)
        setIsNearExpiry(false)
      }
    } catch (error) {
      console.error('Manual session refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  // Don't show if not authenticated
  if (!AuthService.isAuthenticated()) {
    return null
  }

  // Don't show if session is not near expiry (unless in development)
  if (!isNearExpiry && import.meta.env.MODE !== 'development') {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg border ${
      isNearExpiry 
        ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
        : 'bg-blue-50 border-blue-200 text-blue-800'
    }`}>
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">
          Session expires in {formatTime(timeUntilExpiry)}
        </span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-white/50 rounded transition-colors"
          title="Refresh session"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {isNearExpiry && (
        <p className="text-xs mt-1 opacity-75">
          Click refresh to extend your session
        </p>
      )}
    </div>
  )
}

export default SessionStatus