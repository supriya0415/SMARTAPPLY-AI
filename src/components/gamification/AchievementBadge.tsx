import React from 'react';
import { Achievement } from '../../lib/types';
import { cn } from '../../lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const rarityColors = {
  common: 'bg-gray-100 border-gray-300 text-gray-700',
  uncommon: 'bg-green-100 border-green-300 text-green-700',
  rare: 'bg-blue-100 border-blue-300 text-blue-700',
  epic: 'bg-purple-100 border-purple-300 text-purple-700',
  legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700'
};

const sizeClasses = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-20 h-20 text-3xl'
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showDetails = false,
  className
}) => {
  const rarityClass = rarityColors[achievement.rarity];
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn('group relative', className)}>
      <div
        className={cn(
          'rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110',
          rarityClass,
          sizeClass
        )}
        title={showDetails ? undefined : `${achievement.title} - ${achievement.description}`}
      >
        <span className="select-none">{achievement.badgeIcon}</span>
      </div>
      
      {showDetails && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="font-semibold">{achievement.title}</div>
            <div className="text-gray-300 text-xs">{achievement.description}</div>
            <div className="text-yellow-400 text-xs mt-1">+{achievement.experiencePoints} XP</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};