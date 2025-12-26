import React, { useEffect, useCallback } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { debugLogger } from '@/lib/utils/debugLogger';

export interface DashboardStateManagerProps {
  children: React.ReactNode;
  onStateRestored?: (state: any) => void;
  onSessionStarted?: (sessionId: string) => void;
}

/**
 * Dashboard State Manager Component
 * Handles automatic restoration of dashboard state for returning users
 * Implements requirements 9.1, 9.3, 9.4
 */
export function DashboardStateManager({ 
  children, 
  onStateRestored, 
  onSessionStarted 
}: DashboardStateManagerProps) {
  const { 
    profile, 
    dashboardState, 
    currentSession,
    startSession,
    saveDashboardState,
    isLoading 
  } = useUserProfile();

  /**
   * Requirement 9.1: Redirect returning users to saved dashboard
   * Restore dashboard state when component mounts
   */
  const restoreDashboardState = useCallback(() => {
    if (!profile || !dashboardState) {
      return;
    }

    try {
      debugLogger.log('Restoring dashboard state', {
        component: 'DashboardStateManager',
        action: 'restore_state',
        metadata: {
          userId: profile.id,
          currentView: dashboardState.currentView,
          selectedDomain: dashboardState.selectedDomain,
          lastVisited: dashboardState.lastVisited
        }
      });

      // Notify parent component about state restoration
      if (onStateRestored) {
        onStateRestored(dashboardState);
      }

      // Restore scroll position if available
      if (dashboardState.scrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, dashboardState.scrollPosition || 0);
        }, 100);
      }

      // Expand previously expanded sections
      if (dashboardState.expandedSections && dashboardState.expandedSections.length > 0) {
        dashboardState.expandedSections.forEach(sectionId => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.classList.add('expanded');
          }
        });
      }

    } catch (error) {
      debugLogger.error('Failed to restore dashboard state', error as Error, {
        component: 'DashboardStateManager',
        action: 'restore_state'
      });
    }
  }, [profile, dashboardState, onStateRestored]);

  /**
   * Requirement 9.4: Maintain checklist progress from previous sessions
   * Initialize or resume learning session
   */
  const initializeLearningSession = useCallback(() => {
    if (!profile) {
      return;
    }

    try {
      // Check if there's already an active session
      if (currentSession) {
        debugLogger.log('Resuming existing learning session', {
          component: 'DashboardStateManager',
          action: 'resume_session',
          metadata: {
            userId: profile.id,
            sessionId: currentSession.sessionId,
            lastActivity: currentSession.lastActivity
          }
        });

        if (onSessionStarted) {
          onSessionStarted(currentSession.sessionId);
        }
        return;
      }

      // Start a new learning session
      const newSession = startSession();
      if (newSession) {
        debugLogger.log('Started new learning session', {
          component: 'DashboardStateManager',
          action: 'start_session',
          metadata: {
            userId: profile.id,
            sessionId: newSession.sessionId
          }
        });

        if (onSessionStarted) {
          onSessionStarted(newSession.sessionId);
        }
      }

    } catch (error) {
      debugLogger.error('Failed to initialize learning session', error as Error, {
        component: 'DashboardStateManager',
        action: 'initialize_session'
      });
    }
  }, [profile, currentSession, startSession, onSessionStarted]);

  /**
   * Save current dashboard state periodically
   */
  const saveCurrentState = useCallback(() => {
    if (!profile) {
      return;
    }

    try {
      // Get current state from DOM
      const currentState = {
        selectedDomain: profile.enhancedProfile?.careerAssessment?.responses?.domain || '',
        selectedJobRole: profile.enhancedProfile?.careerAssessment?.responses?.jobRole || '',
        currentView: getCurrentViewFromURL(),
        scrollPosition: window.scrollY,
        expandedSections: getExpandedSections(),
        lastVisited: new Date()
      };

      saveDashboardState(currentState);

      debugLogger.log('Dashboard state saved automatically', {
        component: 'DashboardStateManager',
        action: 'auto_save_state',
        metadata: {
          userId: profile.id,
          currentView: currentState.currentView,
          scrollPosition: currentState.scrollPosition
        }
      });

    } catch (error) {
      debugLogger.error('Failed to save current dashboard state', error as Error, {
        component: 'DashboardStateManager',
        action: 'auto_save_state'
      });
    }
  }, [profile, saveDashboardState]);

  // Helper function to get current view from URL
  const getCurrentViewFromURL = (): string => {
    const path = window.location.pathname;
    if (path.includes('roadmap')) return 'roadmap';
    if (path.includes('resources')) return 'resources';
    if (path.includes('progress')) return 'progress';
    if (path.includes('similar-jobs')) return 'similar-jobs';
    return 'roadmap'; // default
  };

  // Helper function to get expanded sections
  const getExpandedSections = (): string[] => {
    const expandedElements = document.querySelectorAll('.expanded[id]');
    return Array.from(expandedElements).map(el => el.id);
  };

  // Restore state when profile loads
  useEffect(() => {
    if (profile && !isLoading) {
      restoreDashboardState();
      initializeLearningSession();
    }
  }, [profile, isLoading, restoreDashboardState, initializeLearningSession]);

  // Save state periodically and on page unload
  useEffect(() => {
    if (!profile) {
      return;
    }

    // Save state every 30 seconds
    const saveInterval = setInterval(saveCurrentState, 30 * 1000);

    // Save state before page unload
    const handleBeforeUnload = () => {
      saveCurrentState();
    };

    // Save state on visibility change (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveCurrentState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile, saveCurrentState]);

  // Save state on scroll (throttled)
  useEffect(() => {
    if (!profile) {
      return;
    }

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        saveCurrentState();
      }, 1000); // Save scroll position after 1 second of no scrolling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [profile, saveCurrentState]);

  return <>{children}</>;
}

/**
 * Higher-order component to wrap dashboard components with state management
 */
export function withDashboardStateManager<P extends object>(
  Component: React.ComponentType<P>
) {
  return function DashboardStateManagerWrapper(props: P) {
    return (
      <DashboardStateManager>
        <Component {...props} />
      </DashboardStateManager>
    );
  };
}

export default DashboardStateManager;