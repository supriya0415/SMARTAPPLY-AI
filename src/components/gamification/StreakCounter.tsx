import React from 'react';
import { StreakData } from '../../lib/types';
import { cn } from '../../lib/utils';

interface StreakCounterProps {
  streakData: StreakData;
  size?: 'sm' | 'md' | 'lg';
  showGoal?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'text-sm',
    streak: 'text-lg font-bold',
    icon: 'text-xl'
  },
  md: {
    container: 'text-base',
    streak: 'text-2xl font-bold',
    icon: 'text-2xl'
  },
  lg: {
    container: 'text-lg',
    streak: 'text-3xl font-bold',
    icon: 'text-3xl'
  }
};

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streakData,
  size = 'md',
  showGoal = true,
  className
}) => {
  const sizeClass = sizeClasses[size];
  const isOnFire = streakData.currentStreak >= 3;
  const goalProgress = streakData.streakGoal > 0 
    ? (streakData.currentStreak / streakData.streakGoal) * 100 
    : 0;

  const getStreakColor = () => {
    if (streakData.currentStreak === 0) return 'text-gray-400';
    if (streakData.currentStreak < 3) return 'text-orange-500';
    if (streakData.currentStreak < 7) return 'text-red-500';
    return 'text-red-600';
  };

  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) return 'Start your streak!';
    if (streakData.currentStreak === 1) return 'Great start!';
    if (streakData.currentStreak < 7) return 'Building momentum!';
    if (streakData.currentStreak < 30) return 'On fire!';
    return 'Unstoppable!';
  };

  return (
    <div className={cn('flex flex-col items-center space-y-2', sizeClass.container, className)}>
      {/* Streak Icon and Count */}
      <div className="flex items-center space-x-2">
        <div className={cn('transition-all duration-300', sizeClass.icon, getStreakColor())}>
          {isOnFire ? '🔥' : '📅'}
        </div>
        <div className="text-center">
          <div className={cn('text-gray-900', sizeClass.streak)}>
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-gray-600">
            {streakData.streakType === 'daily' ? 'day' : 'week'} streak
          </div>
        </div>
      </div>

      {/* Streak Message */}
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700">
          {getStreakMessage()}
        </div>
        {streakData.longestStreak > streakData.currentStreak && (
          <div className="text-xs text-gray-500">
            Best: {streakData.longestStreak} days
          </div>
        )}
      </div>

      {/* Goal Progress */}
      {showGoal && streakData.streakGoal > 0 && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Goal Progress</span>
            <span className="text-xs text-gray-600">
              {streakData.currentStreak}/{streakData.streakGoal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                'transition-all duration-500 ease-out rounded-full h-full',
                isOnFire 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                  : 'bg-gradient-to-r from-orange-400 to-red-400'
              )}
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
          {goalProgress >= 100 && (
            <div className="text-center mt-1">
              <span className="text-xs text-green-600 font-semibold">Goal Achieved! 🎉</span>
            </div>
          )}
        </div>
      )}

      {/* Last Activity */}
      <div className="text-xs text-gray-500 text-center">
        Last activity: {new Date(streakData.lastActivityDate).toLocaleDateString()}
      </div>
    </div>
  );
};