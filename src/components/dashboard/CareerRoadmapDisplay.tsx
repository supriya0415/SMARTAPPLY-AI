import React from 'react';
import { MapPin, Clock, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '@/components/NBCard';
import { NBButton } from '@/components/NBButton';
import { CareerRecommendation } from '@/lib/types';

interface CareerRoadmapDisplayProps {
  roadmap: CareerRecommendation | null;
  onViewFullRoadmap: () => void;
  onUpdateRoadmap: () => void;
}

/**
 * Career roadmap display component showing personalized career path
 * Requirements: 6.2 - Display user's personalized career roadmap
 */
export const CareerRoadmapDisplay: React.FC<CareerRoadmapDisplayProps> = ({
  roadmap,
  onViewFullRoadmap,
  onUpdateRoadmap
}) => {
  const navigate = useNavigate();

  const handleMilestoneClick = () => {
    navigate('/learning-resources');
  };
  if (!roadmap) {
    return (
      <NBCard className="p-6 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 border-yellow-200">
        <div className="text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">
            No Career Roadmap Yet
          </h3>
          <p className="text-yellow-600 mb-4">
            Complete your career assessment to get a personalized roadmap
          </p>
          <NBButton 
            variant="primary"
            onClick={onUpdateRoadmap}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Create Roadmap
          </NBButton>
        </div>
      </NBCard>
    );
  }

  const nextMilestone = roadmap.careerPath?.nodes?.[0];
  const totalMilestones = roadmap.careerPath?.nodes?.length || 0;

  return (
    <NBCard className="p-6 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-blue-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-1">
            Your Career Roadmap
          </h3>
          <p className="text-blue-700 font-medium">{roadmap.title}</p>
        </div>
        <div className="flex gap-2">
          <NBButton
            variant="ghost"
            onClick={onUpdateRoadmap}
            className="text-blue-600 hover:bg-blue-100"
          >
            Update
          </NBButton>
          <NBButton
            variant="primary"
            onClick={onViewFullRoadmap}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            View Full Roadmap
          </NBButton>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalMilestones}</div>
            <div className="text-sm text-gray-600">Total Milestones</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {roadmap.fitScore}%
            </div>
            <div className="text-sm text-gray-600">Match Score</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {roadmap.salaryRange?.min ? `$${Math.round(roadmap.salaryRange.min / 1000)}k` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Starting Salary</div>
          </div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div 
            className="bg-white/80 rounded-lg p-4 border border-blue-200 cursor-pointer hover:bg-white/90 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            onClick={handleMilestoneClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMilestoneClick();
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">Next Milestone</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {nextMilestone.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {nextMilestone.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {nextMilestone.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {nextMilestone.duration}
                    </div>
                  )}
                  {nextMilestone.difficulty && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {nextMilestone.difficulty}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400 mt-1 group-hover:text-blue-600 transition-colors duration-200" />
            </div>
          </div>
        )}


      </div>
    </NBCard>
  );
};