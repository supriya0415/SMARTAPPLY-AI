import React from 'react';
import { LevelInfo } from '../../lib/types';
import { cn } from '../../lib/utils';

interface LevelDisplayProps {
  levelInfo: LevelInfo;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'text-sm',
    level: 'text-lg font-bold',
    progress: 'h-1',
    title: 'text-xs'
  },
  md: {
    container: 'text-base',
    level: 'text-2xl font-bold',
    progress: 'h-2',
    title: 'text-sm'
  },
  lg: {
    container: 'text-lg',
    level: 'text-3xl font-bold',
    progress: 'h-3',
    title: 'text-base'
  }
};

export const LevelDisplay: React.FC<LevelDisplayProps> = ({
  levelInfo,
  showProgress = true,
  size = 'md',
  className
}) => {
  const sizeClass = sizeClasses[size];
  const progressPercentage = levelInfo.xpToNextLevel > 0 
    ? ((levelInfo.totalXPRequired - levelInfo.xpToNextLevel) / levelInfo.totalXPRequired) * 100
    : 100;

  return (
    <div className={cn('flex flex-col items-center space-y-2', sizeClass.container, className)}>
      {/* Level Number */}
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
          <span className={sizeClass.level}>{levelInfo.currentLevel}</span>
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900">Level {levelInfo.currentLevel}</div>
          <div className={cn('text-gray-600', sizeClass.title)}>{levelInfo.levelTitle}</div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && levelInfo.xpToNextLevel > 0 && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">
              {levelInfo.currentXP.toLocaleString()} XP
            </span>
            <span className="text-xs text-gray-600">
              {levelInfo.totalXPRequired.toLocaleString()} XP
            </span>
          </div>
          <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClass.progress)}>
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%`, height: '100%' }}
            />
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-gray-500">
              {levelInfo.xpToNextLevel.toLocaleString()} XP to next level
            </span>
          </div>
        </div>
      )}

      {/* Max Level Indicator */}
      {levelInfo.xpToNextLevel === 0 && (
        <div className="text-center">
          <div className="text-yellow-600 font-semibold text-sm">Max Level Reached!</div>
          <div className="text-xs text-gray-500">
            {levelInfo.currentXP.toLocaleString()} Total XP
          </div>
        </div>
      )}
    </div>
  );
};