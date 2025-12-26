import React from 'react';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { CareerRecommendation } from '../lib/types';

interface SummaryPanelProps {
  recommendation: CareerRecommendation;
  userName: string;
  onDashboardClick?: () => void;
  onStartOverClick?: () => void;
  showDashboardButton?: boolean;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  recommendation, 
  userName,
  onDashboardClick,
  onStartOverClick,
  showDashboardButton = false
}) => {
  return (
    <div className="space-y-6">
      <NBCard variant="accent">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hello, {userName}! 👋
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {recommendation.summary}
            </p>
          </div>
          <div className="flex space-x-2 ml-4">
            {showDashboardButton && onDashboardClick && (
              <NBButton
                onClick={onDashboardClick}
                className="bg-primary hover:bg-primary/90 text-white whitespace-nowrap"
              >
                Go to Dashboard
              </NBButton>
            )}
            {onStartOverClick && (
              <NBButton
                variant="secondary"
                onClick={onStartOverClick}
                className="whitespace-nowrap"
              >
                Start Over
              </NBButton>
            )}
          </div>
        </div>
      </NBCard>

      <NBCard>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Your Career Path: {recommendation.primaryCareer}
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Related Roles:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.relatedRoles.map((role, index) => (
                <span
                  key={index}
                  className="bg-primary/20 text-gray-900 px-3 py-1 rounded-full text-sm font-medium border border-primary/30"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </NBCard>

    </div>
  );
};
