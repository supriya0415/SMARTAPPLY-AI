import React, { useEffect, useState } from 'react';
import { useProfilePersistence } from '../lib/hooks/useProfilePersistence';
import { AuthService } from '../lib/services/authService';

/**
 * Profile Persistence Demo Component
 * Demonstrates requirements 9.1, 9.2, 9.3, 9.4 implementation
 */

interface ProfilePersistenceDemoProps {
  domain?: string;
  subfield?: string;
}

export const ProfilePersistenceDemo: React.FC<ProfilePersistenceDemoProps> = ({ 
  domain = 'technology-computer-science', 
  subfield = 'web-development' 
}) => {
  const {
    progressData,
    dashboardState,
    activeSession,
    isLoading,
    error,
    saveProgress,
    saveDashboardState,
    startSession,
    updateSession,
    endSession,
    syncAllData,
    clearError,
    restoreDashboardState
  } = useProfilePersistence(domain, subfield);

  const [demoProgress, setDemoProgress] = useState(0);
  const [currentView, setCurrentView] = useState<'roadmap' | 'resources' | 'progress' | 'similar-jobs'>('roadmap');

  // Restore dashboard state on component mount (Requirement 9.1)
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      restoreDashboardState();
    }
  }, [restoreDashboardState]);

  // Auto-save dashboard state when view changes (Requirement 9.3)
  useEffect(() => {
    if (AuthService.isAuthenticated() && dashboardState) {
      saveDashboardState({
        currentView,
        selectedDomain: domain,
        scrollPosition: 0,
        expandedSections: ['progress-section'],
        lastVisited: new Date()
      });
    }
  }, [currentView, domain, saveDashboardState, dashboardState]);

  const handleStartSession = async () => {
    const session = await startSession('learning');
    if (session) {
      console.log('Session started:', session.sessionId);
    }
  };

  const handleUpdateProgress = async () => {
    const newProgress = Math.min(demoProgress + 10, 100);
    setDemoProgress(newProgress);

    const success = await saveProgress({
      domain,
      subfield,
      overallProgress: newProgress,
      completedResources: [`resource-${Math.floor(newProgress / 10)}`],
      skillsAcquired: ['React', 'TypeScript', 'Node.js'].slice(0, Math.floor(newProgress / 30)),
      timeSpent: newProgress * 2, // 2 minutes per progress point
      studyStreak: Math.floor(newProgress / 20),
      lastActivityDate: new Date()
    });

    if (success) {
      console.log('Progress updated successfully');
    }
  };

  const handleUpdateSession = async () => {
    if (activeSession) {
      const success = await updateSession(activeSession.sessionId, {
        activitiesCompleted: [...activeSession.activitiesCompleted, `activity-${Date.now()}`],
        timeSpent: activeSession.timeSpent + 5,
        currentResource: 'demo-resource-1',
        progressSnapshot: { demoProgress }
      });

      if (success) {
        console.log('Session updated successfully');
      }
    }
  };

  const handleEndSession = async () => {
    if (activeSession) {
      const success = await endSession(activeSession.sessionId);
      if (success) {
        console.log('Session ended successfully');
      }
    }
  };

  const handleSyncAll = async () => {
    const success = await syncAllData();
    if (success) {
      console.log('All data synced successfully');
    }
  };

  if (!AuthService.isAuthenticated()) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
        <p className="text-yellow-700">Please log in to see profile persistence features.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Persistence Demo</h2>
        <p className="text-gray-600 mb-6">
          This component demonstrates the implementation of requirements 9.1, 9.2, 9.3, and 9.4 
          for user profile and progress persistence.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">Loading profile data...</p>
          </div>
        )}
      </div>

      {/* Dashboard State Demo (Requirements 9.1, 9.3) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Dashboard State Persistence (Requirements 9.1, 9.3)
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current View (automatically saved):
          </label>
          <div className="flex space-x-2">
            {(['roadmap', 'resources', 'progress', 'similar-jobs'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {dashboardState && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Saved Dashboard State:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Current View:</strong> {dashboardState.currentView}</li>
              <li><strong>Selected Domain:</strong> {dashboardState.selectedDomain || 'None'}</li>
              <li><strong>Last Visited:</strong> {new Date(dashboardState.lastVisited).toLocaleString()}</li>
              <li><strong>Expanded Sections:</strong> {dashboardState.expandedSections.join(', ') || 'None'}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Progress Tracking Demo (Requirement 9.2) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Progress Tracking Persistence (Requirement 9.2)
        </h3>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Demo Progress</span>
            <span className="text-sm text-gray-500">{demoProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${demoProgress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleUpdateProgress}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Update Progress (+10%)
        </button>

        {progressData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Saved Progress Data:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Overall Progress:</strong> {progressData.overallProgress}%</li>
              <li><strong>Domain:</strong> {progressData.domain}</li>
              <li><strong>Completed Resources:</strong> {progressData.completedResources.length}</li>
              <li><strong>Skills Acquired:</strong> {progressData.skillsAcquired.join(', ') || 'None'}</li>
              <li><strong>Time Spent:</strong> {progressData.timeSpent} minutes</li>
              <li><strong>Study Streak:</strong> {progressData.studyStreak} days</li>
              <li><strong>Last Activity:</strong> {new Date(progressData.lastActivityDate).toLocaleString()}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Session Management Demo (Requirement 9.4) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Session Progress Maintenance (Requirement 9.4)
        </h3>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleStartSession}
            disabled={!!activeSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Start Session
          </button>
          
          <button
            onClick={handleUpdateSession}
            disabled={!activeSession}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Update Session
          </button>
          
          <button
            onClick={handleEndSession}
            disabled={!activeSession}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            End Session
          </button>
        </div>

        {activeSession && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Active Session:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Session ID:</strong> {activeSession.sessionId}</li>
              <li><strong>Type:</strong> {activeSession.sessionType}</li>
              <li><strong>Started:</strong> {new Date(activeSession.startTime).toLocaleString()}</li>
              <li><strong>Last Activity:</strong> {new Date(activeSession.lastActivity).toLocaleString()}</li>
              <li><strong>Activities Completed:</strong> {activeSession.activitiesCompleted.length}</li>
              <li><strong>Time Spent:</strong> {activeSession.timeSpent} minutes</li>
              <li><strong>Current Resource:</strong> {activeSession.currentResource || 'None'}</li>
            </ul>
          </div>
        )}

        {!activeSession && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700">No active session. Start a session to track progress.</p>
          </div>
        )}
      </div>

      {/* Sync All Data */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Synchronization</h3>
        <p className="text-gray-600 mb-4">
          Sync all profile data with the backend to ensure consistency across devices.
        </p>
        
        <button
          onClick={handleSyncAll}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Sync All Data
        </button>
      </div>

      {/* Implementation Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Implementation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✅ Requirement 9.1</h4>
            <p className="text-blue-700">Returning users are redirected to their saved dashboard with restored state.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✅ Requirement 9.2</h4>
            <p className="text-blue-700">Previously saved progress is displayed and persisted across sessions.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✅ Requirement 9.3</h4>
            <p className="text-blue-700">Current position in learning roadmap is maintained and displayed.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">✅ Requirement 9.4</h4>
            <p className="text-blue-700">Session-based progress maintenance with checklist progress from previous sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};