import React from 'react';
import { CareerRecommendation, SalaryRange } from '../lib/types';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { cn } from '../lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  Bookmark,
  BookmarkCheck,
  Eye,
  BarChart3,
  Target
} from 'lucide-react';

interface CareerRecommendationCardProps {
  recommendation: CareerRecommendation;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect?: (recommendation: CareerRecommendation) => void;
  onSave?: (recommendation: CareerRecommendation) => void;
  onViewDetails?: (recommendation: CareerRecommendation) => void;
  onCompare?: (recommendation: CareerRecommendation) => void;
  showCompareButton?: boolean;
  className?: string;
}

export const CareerRecommendationCard: React.FC<CareerRecommendationCardProps> = ({
  recommendation,
  isSelected = false,
  isSaved = false,
  onSelect,
  onSave,
  onViewDetails,
  onCompare,
  showCompareButton = false,
  className
}) => {
  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFitScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getGrowthIcon = (growth: string) => {
    switch (growth) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatSalary = (salaryRange: SalaryRange) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salaryRange.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `${formatter.format(salaryRange.min)} - ${formatter.format(salaryRange.max)}`;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div 
      className={cn(
        'transition-all duration-200 hover:shadow-lg cursor-pointer',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
      onClick={() => onSelect?.(recommendation)}
    >
      <NBCard className={className}>
      {/* Header with Fit Score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-foreground">{recommendation.title}</h3>
            <div className={cn(
              'px-2 py-1 rounded-full border text-xs font-medium flex items-center space-x-1',
              getFitScoreBackground(recommendation.fitScore)
            )}>
              <Target className="w-3 h-3" />
              <span className={getFitScoreColor(recommendation.fitScore)}>
                {recommendation.fitScore}% Match
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {recommendation.description}
          </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(recommendation);
          }}
          className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Salary Range</span>
          </div>
          <p className="text-sm text-foreground font-semibold">
            {formatSalary(recommendation.salaryRange)}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Growth Prospects</span>
          </div>
          <div className="flex items-center space-x-1">
            {getGrowthIcon(recommendation.growthProspects)}
            <span className="text-sm font-semibold capitalize">
              {recommendation.growthProspects}
            </span>
          </div>
        </div>
      </div>

      {/* Job Market Info */}
      {recommendation.jobMarketData && (
        <div className="bg-secondary/30 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Market Demand</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium capitalize',
                getDemandColor(recommendation.jobMarketData.demand)
              )}>
                {recommendation.jobMarketData.demand}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Competition</span>
              <span className="font-medium capitalize">
                {recommendation.jobMarketData.competitiveness}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Industry Growth</span>
              <span className="font-medium text-green-600">
                +{recommendation.jobMarketData.industryGrowth}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg. Salary</span>
              <span className="font-medium">
                ${(recommendation.jobMarketData.averageSalary / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Skills Required */}
      {recommendation.requiredSkills && recommendation.requiredSkills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Key Skills Required</h4>
          <div className="flex flex-wrap gap-1">
            {recommendation.requiredSkills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  skill.priority === 'critical' 
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : skill.priority === 'important'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                )}
              >
                {skill.name}
              </span>
            ))}
            {recommendation.requiredSkills.length > 6 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{recommendation.requiredSkills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Related Roles */}
      {recommendation.relatedRoles && recommendation.relatedRoles.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Related Roles</h4>
          <div className="flex flex-wrap gap-1">
            {recommendation.relatedRoles.slice(0, 4).map((role, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground"
              >
                {role}
              </span>
            ))}
            {recommendation.relatedRoles.length > 4 && (
              <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                +{recommendation.relatedRoles.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {recommendation.summary && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground italic">
            "{recommendation.summary}"
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t border-border">
        <NBButton
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(recommendation);
          }}
          className="flex-1 flex items-center justify-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </NBButton>
        
        {showCompareButton && (
          <NBButton
            variant="accent"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCompare?.(recommendation);
            }}
            className="flex items-center justify-center space-x-1"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Compare</span>
          </NBButton>
        )}
      </div>
    </NBCard>
    </div>
  );
};