import React from 'react';
import { Milestone } from '../../lib/types';
import { cn } from '../../lib/utils';
import { AchievementBadge } from './AchievementBadge';

interface MilestoneProgressProps {
  milestones: Milestone[];
  showCompleted?: boolean;
  maxDisplay?: number;
  className?: string;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  milestones,
  showCompleted = true,
  maxDisplay = 5,
  className
}) => {
  const sortedMilestones = milestones
    .sort((a, b) => a.order - b.order)
    .slice(0, maxDisplay);

  const completedCount = milestones.filter(m => m.isCompleted).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Overall Progress */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Career Milestones</h3>
          <span className="text-sm text-gray-600">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ease-out rounded-full h-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">
            {progressPercentage.toFixed(0)}% Complete
          </span>
        </div>
      </div>

      {/* Milestone List */}
      <div className="space-y-3">
        {sortedMilestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            showCompleted={showCompleted}
          />
        ))}
      </div>

      {milestones.length > maxDisplay && (
        <div className="text-center">
          <span className="text-sm text-gray-500">
            +{milestones.length - maxDisplay} more milestones
          </span>
        </div>
      )}
    </div>
  );
};

interface MilestoneCardProps {
  milestone: Milestone;
  showCompleted: boolean;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, showCompleted }) => {
  if (!showCompleted && milestone.isCompleted) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-4 border transition-all duration-200',
        milestone.isCompleted
          ? 'border-green-300 bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-start space-x-3">
        {/* Status Indicator */}
        <div className="flex-shrink-0 mt-1">
          {milestone.isCompleted ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
          )}
        </div>

        {/* Milestone Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={cn(
                'text-sm font-medium',
                milestone.isCompleted ? 'text-green-800' : 'text-gray-900'
              )}>
                {milestone.title}
              </h4>
              <p className={cn(
                'text-sm mt-1',
                milestone.isCompleted ? 'text-green-600' : 'text-gray-600'
              )}>
                {milestone.description}
              </p>
              
              {/* Requirements */}
              {!milestone.isCompleted && milestone.requirements.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Requirements:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {milestone.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>{req.replace(/_/g, ' ').replace(/:/g, ': ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Completion Date */}
              {milestone.isCompleted && milestone.completedAt && (
                <div className="text-xs text-green-600 mt-2">
                  Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                </div>
              )}

              {/* Estimated Time */}
              {!milestone.isCompleted && milestone.estimatedTimeToComplete && (
                <div className="text-xs text-gray-500 mt-2">
                  Estimated time: {milestone.estimatedTimeToComplete}
                </div>
              )}
            </div>

            {/* Reward Badge */}
            <div className="flex-shrink-0 ml-3">
              <AchievementBadge
                achievement={milestone.reward}
                size="sm"
                showDetails={true}
                className={cn(
                  'transition-opacity duration-200',
                  milestone.isCompleted ? 'opacity-100' : 'opacity-50'
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};