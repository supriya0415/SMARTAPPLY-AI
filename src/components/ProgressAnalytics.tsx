import React from 'react';
import { ProgressData, Achievement, Milestone } from '../lib/types';
import { cn } from '../lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  Target,
  Award,
  Activity
} from 'lucide-react';

interface ProgressAnalyticsProps {
  progressData?: ProgressData;
  achievements: Achievement[];
  milestones: Milestone[];
  className?: string;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  progressData,
  achievements,
  milestones,
  className
}) => {
  // Calculate analytics data
  const getAnalyticsData = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Recent achievements
    const recentAchievements = achievements.filter(a => 
      new Date(a.earnedAt) >= thirtyDaysAgo
    );

    // Recent activities
    const recentActivities = progressData?.learningActivities?.filter(a => 
      new Date(a.completedAt) >= thirtyDaysAgo
    ) || [];

    // Weekly activity
    const weeklyActivities = progressData?.learningActivities?.filter(a => 
      new Date(a.completedAt) >= sevenDaysAgo
    ) || [];

    // Skill progress distribution
    const skillProgressData = Object.values(progressData?.skillProgress || {});
    const skillDistribution = {
      beginner: skillProgressData.filter(s => s.progress < 25).length,
      intermediate: skillProgressData.filter(s => s.progress >= 25 && s.progress < 75).length,
      advanced: skillProgressData.filter(s => s.progress >= 75).length
    };

    // Achievement categories
    const achievementsByCategory = achievements.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Milestone completion rate
    const completedMilestones = milestones.filter(m => m.isCompleted).length;
    const milestoneCompletionRate = milestones.length > 0 ? 
      (completedMilestones / milestones.length) * 100 : 0;

    // Learning streak calculation
    const activities = progressData?.learningActivities || [];
    const sortedActivities = activities
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    let currentStreak = 0;
    let lastActivityDate = null;
    
    for (const activity of sortedActivities) {
      const activityDate = new Date(activity.completedAt);
      const daysDiff = lastActivityDate ? 
        Math.floor((lastActivityDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      if (lastActivityDate === null || daysDiff <= 1) {
        currentStreak++;
        lastActivityDate = activityDate;
      } else {
        break;
      }
    }

    return {
      recentAchievements: recentAchievements.length,
      recentActivities: recentActivities.length,
      weeklyActivities: weeklyActivities.length,
      skillDistribution,
      achievementsByCategory,
      milestoneCompletionRate,
      currentStreak,
      totalTimeSpent: activities.reduce((acc, a) => acc + (a.timeSpent || 0), 0),
      averageSessionTime: activities.length > 0 ? 
        activities.reduce((acc, a) => acc + (a.timeSpent || 0), 0) / activities.length : 0
    };
  };

  const analytics = getAnalyticsData();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Analytics Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Progress Analytics
        </h2>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics.weeklyActivities}</div>
            <div className="text-sm text-blue-700">This Week</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics.currentStreak}</div>
            <div className="text-sm text-green-700">Day Streak</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(analytics.milestoneCompletionRate)}%
            </div>
            <div className="text-sm text-purple-700">Milestones</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(analytics.totalTimeSpent / 60)}h
            </div>
            <div className="text-sm text-yellow-700">Total Time</div>
          </div>
        </div>
      </div>

      {/* Skill Progress Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-600" />
          Skill Progress Distribution
        </h3>
        
        <div className="space-y-4">
          {/* Beginner Skills */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm font-medium">Beginner (0-25%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full"
                  style={{ 
                    width: `${Object.values(analytics.skillDistribution).reduce((a, b) => a + b, 0) > 0 ? 
                      (analytics.skillDistribution.beginner / Object.values(analytics.skillDistribution).reduce((a, b) => a + b, 0)) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{analytics.skillDistribution.beginner}</span>
            </div>
          </div>

          {/* Intermediate Skills */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm font-medium">Intermediate (25-75%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ 
                    width: `${Object.values(analytics.skillDistribution).reduce((a, b) => a + b, 0) > 0 ? 
                      (analytics.skillDistribution.intermediate / Object.values(analytics.skillDistribution).reduce((a, b) => a + b, 0)) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{analytics.skillDistribution.intermediate}</span>
            </div>
          </div>

          {/* Advanced Skills */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm font-medium">Advanced (75%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full"
                  style={{ 
                    width: `${Object.values(analytics.skillDistribution).reduce((a, b) => a + b, 0) > 0 ? 
                      (analytics.skillDistribution.advanced / Object.values(analytics.skillDistribution).reduce((a, b) => a + b, 0)) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{analytics.skillDistribution.advanced}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-600" />
          Achievement Categories
        </h3>
        
        {Object.keys(analytics.achievementsByCategory).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(analytics.achievementsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    category === 'learning' ? 'bg-blue-400' :
                    category === 'progress' ? 'bg-green-400' :
                    category === 'consistency' ? 'bg-purple-400' :
                    category === 'milestone' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  )}></div>
                  <span className="text-sm font-medium capitalize">{category}</span>
                </div>
                <span className="text-sm text-gray-600 font-semibold">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No achievements earned yet</p>
          </div>
        )}
      </div>

      {/* Learning Activity Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-600" />
          Learning Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity (30 days)</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Activities Completed</span>
                <span className="font-semibold">{analytics.recentActivities}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Achievements Earned</span>
                <span className="font-semibold">{analytics.recentAchievements}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Session</span>
                <span className="font-semibold">{Math.round(analytics.averageSessionTime)} min</span>
              </div>
            </div>
          </div>

          {/* Progress Trends */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Progress Trends</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">
                  {analytics.weeklyActivities > 0 ? 'Active this week' : 'No activity this week'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">
                  {analytics.currentStreak > 0 ? `${analytics.currentStreak} day learning streak` : 'No current streak'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">
                  {Math.round(analytics.totalTimeSpent / 60)}h total learning time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-600" />
          Milestone Progress
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overall Completion</span>
            <span className="text-lg font-semibold text-indigo-600">
              {Math.round(analytics.milestoneCompletionRate)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analytics.milestoneCompletionRate}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {milestones.filter(m => m.isCompleted).length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-600">
                {milestones.filter(m => !m.isCompleted).length}
              </div>
              <div className="text-gray-600">Remaining</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {milestones.length}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};