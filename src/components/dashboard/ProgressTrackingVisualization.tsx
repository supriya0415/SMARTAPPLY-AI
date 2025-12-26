import React from 'react';
import { BookOpen, Target, Clock, TrendingUp } from 'lucide-react';
import { NBCard } from '@/components/NBCard';
import { NBButton } from '@/components/NBButton';
import { EnhancedUserProfile } from '@/lib/types';

interface ProgressTrackingVisualizationProps {
  profile: EnhancedUserProfile;
  onViewDetailedProgress: () => void;
}

/**
 * Simplified progress tracking showing career learning progress
 * Requirements: 6.4, 7.3, 7.4 - Progress tracking visualization with completion marking
 */
export const ProgressTrackingVisualization: React.FC<ProgressTrackingVisualizationProps> = ({
  profile,
  onViewDetailedProgress
}) => {
  const progressData = profile.progressData;
  
  // Calculate simple, understandable metrics
  const learningActivities = progressData?.learningActivities || [];
  const resourcesCompleted = learningActivities.length;
  const skillsGained = profile.skills?.length || 0;
  const careerProgress = Math.round(progressData?.overallProgress || 0);
  
  // Calculate total time invested (in hours)
  const totalTimeMinutes = learningActivities.reduce((sum, activity) => sum + (activity.timeSpent || 0), 0);
  const totalTimeHours = Math.floor(totalTimeMinutes / 60);
  
  // Get most recent activity
  const lastActivity = learningActivities.length > 0
    ? learningActivities[learningActivities.length - 1]
    : null;

  return (
    <NBCard className="p-6 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border-indigo-200">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-indigo-900 mb-1">
          Your Learning Progress
        </h3>
        <p className="text-indigo-700 text-sm">
          Track your career development journey for {profile.careerInterest}
        </p>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-6 p-4 bg-white/60 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-indigo-900">
            Career Roadmap Progress
          </span>
          <span className="text-2xl font-bold text-indigo-600">
            {careerProgress}%
          </span>
        </div>
        <div className="w-full bg-indigo-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
            style={{ width: `${careerProgress}%` }}
          >
            {careerProgress > 10 && (
              <span className="text-xs text-white font-medium">{careerProgress}%</span>
            )}
          </div>
        </div>
        <p className="text-xs text-indigo-600 mt-2">
          {careerProgress === 0 
            ? "Start your first learning resource to begin!" 
            : careerProgress < 25
            ? "Great start! Keep going!"
            : careerProgress < 50
            ? "You're making solid progress!"
            : careerProgress < 75
            ? "Halfway there! Excellent work!"
            : careerProgress < 100
            ? "Almost done! Final stretch!"
            : "Roadmap complete! 🎉"
          }
        </p>
      </div>

      {/* Key Metrics - Simple & Clear */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Resources Completed</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{resourcesCompleted}</div>
          <p className="text-xs text-gray-500 mt-1">Courses & materials finished</p>
        </div>

        <div className="p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Skills Gained</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">{skillsGained}</div>
          <p className="text-xs text-gray-500 mt-1">New skills acquired</p>
        </div>

        <div className="p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-600">Time Invested</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{totalTimeHours}h</div>
          <p className="text-xs text-gray-500 mt-1">Hours of learning</p>
        </div>

        <div className="p-4 bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Last Activity</span>
          </div>
          <div className="text-lg font-bold text-orange-600">
            {lastActivity 
              ? new Date(lastActivity.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Not started'
            }
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lastActivity ? lastActivity.title : 'Begin your first resource'}
          </p>
        </div>
      </div>

      {/* View All Resources Button */}
      <NBButton
        onClick={onViewDetailedProgress}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        View All Learning Resources →
      </NBButton>
    </NBCard>
  );
};