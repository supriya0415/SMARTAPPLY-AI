import React from 'react';
import { useGamification } from '../../lib/hooks/useGamification';
import { LevelDisplay } from './LevelDisplay';
import { StreakCounter } from './StreakCounter';
import { AchievementBadge } from './AchievementBadge';
import { MilestoneProgress } from './MilestoneProgress';
import { cn } from '../../lib/utils';

interface GamificationDashboardProps {
  className?: string;
  compact?: boolean;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  className,
  compact = false
}) => {
  const {
    profile,
    levelInfo,
    gamificationStatus,
    recentAchievements,
    currentLevel,
    currentXP,
    currentStreak,
    totalAchievements,
    isInitialized
  } = useGamification();

  if (!profile || !isInitialized) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-6 text-center', className)}>
        <div className="text-gray-500">
          <div className="text-4xl mb-2">🎮</div>
          <div className="text-lg font-medium">Gamification Loading...</div>
          <div className="text-sm">Setting up your career journey rewards</div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Level */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentLevel}</div>
            <div className="text-xs text-gray-600">Level</div>
          </div>

          {/* XP */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{currentXP.toLocaleString()}</div>
            <div className="text-xs text-gray-600">XP</div>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{currentStreak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>

          {/* Achievements */}
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalAchievements}</div>
            <div className="text-xs text-gray-600">Achievements</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Your Career Journey</h2>
        <p className="text-blue-100">Track your progress and earn rewards as you advance your career</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Level Display */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Level</h3>
          {levelInfo && <LevelDisplay levelInfo={levelInfo} />}
        </div>

        {/* Streak Counter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Streak</h3>
          {profile.streaks && <StreakCounter streakData={profile.streaks} />}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3">
                  <AchievementBadge achievement={achievement} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      +{achievement.experiencePoints} XP
                    </div>
                  </div>
                </div>
              ))}
              {recentAchievements.length > 3 && (
                <div className="text-center">
                  <span className="text-xs text-gray-500">
                    +{recentAchievements.length - 3} more recent
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-sm">Complete activities to earn achievements!</div>
            </div>
          )}
        </div>
      </div>

      {/* All Achievements */}
      {profile.achievements.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Achievements ({profile.achievements.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {profile.achievements
              .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
              .map((achievement) => (
                <div key={achievement.id} className="text-center">
                  <AchievementBadge 
                    achievement={achievement} 
                    size="md" 
                    showDetails={true}
                  />
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {achievement.title}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {profile.currentMilestones && profile.currentMilestones.length > 0 && (
        <MilestoneProgress 
          milestones={profile.currentMilestones}
          showCompleted={true}
          maxDisplay={5}
        />
      )}

      {/* Gamification Status Summary */}
      {gamificationStatus && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {gamificationStatus.level.currentLevel}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
              <div className="text-xs text-gray-500">
                {gamificationStatus.level.levelTitle}
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {gamificationStatus.progressToNextLevel.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">To Next Level</div>
              <div className="text-xs text-gray-500">
                {gamificationStatus.level.xpToNextLevel.toLocaleString()} XP needed
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-red-600">
                {gamificationStatus.currentStreak.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-xs text-gray-500">
                Best: {gamificationStatus.currentStreak.longestStreak} days
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {gamificationStatus.recentAchievements.length}
              </div>
              <div className="text-sm text-gray-600">Recent Achievements</div>
              <div className="text-xs text-gray-500">
                Last 5 earned
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};