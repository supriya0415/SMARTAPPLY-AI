import React from 'react';
import { CareerRecommendation, SalaryRange } from '../lib/types';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { cn } from '../lib/utils';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  BarChart3,
  Users,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CareerComparisonProps {
  recommendations: CareerRecommendation[];
  onClose: () => void;
  onSelect?: (recommendation: CareerRecommendation) => void;
  className?: string;
}

export const CareerComparison: React.FC<CareerComparisonProps> = ({
  recommendations,
  onClose,
  onSelect,
  className
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
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

  const getCompetitivenessColor = (competitiveness: string) => {
    switch (competitiveness) {
      case 'low':
        return 'text-green-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getBestInCategory = (category: 'fitScore' | 'salary' | 'growth' | 'demand') => {
    switch (category) {
      case 'fitScore':
        return Math.max(...recommendations.map(r => r.fitScore));
      case 'salary':
        return Math.max(...recommendations.map(r => r.salaryRange.max));
      case 'growth':
        return recommendations.find(r => r.growthProspects === 'high')?.id;
      case 'demand':
        return recommendations.find(r => r.jobMarketData?.demand === 'high')?.id;
      default:
        return null;
    }
  };

  const bestFitScore = getBestInCategory('fitScore');
  const bestSalary = getBestInCategory('salary');
  const bestGrowthId = getBestInCategory('growth');
  const bestDemandId = getBestInCategory('demand');

  return (
    <div className={cn('fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50', className)}>
      <div className="bg-background rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Career Comparison</h2>
            <p className="text-muted-foreground">
              Compare {recommendations.length} career recommendations side by side
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${recommendations.length}, 1fr)` }}>
              {/* Header Row */}
              <div className="font-medium text-muted-foreground">Career</div>
              {recommendations.map((rec) => (
                <NBCard key={rec.id} className="p-4">
                  <h3 className="font-bold text-lg text-foreground mb-2">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {rec.description}
                  </p>
                  <NBButton
                    size="sm"
                    onClick={() => onSelect?.(rec)}
                    className="w-full"
                  >
                    Select This Career
                  </NBButton>
                </NBCard>
              ))}

              {/* Fit Score Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Fit Score
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center space-x-2">
                  <div className={cn(
                    'text-2xl font-bold',
                    getFitScoreColor(rec.fitScore)
                  )}>
                    {rec.fitScore}%
                  </div>
                  {rec.fitScore === bestFitScore && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              ))}

              {/* Salary Range Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Salary Range
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center space-x-2">
                  <div className="text-sm font-medium">
                    {formatSalary(rec.salaryRange)}
                  </div>
                  {rec.salaryRange.max === bestSalary && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              ))}

              {/* Growth Prospects Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Growth Prospects
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(rec.growthProspects)}
                    <span className="text-sm font-medium capitalize">
                      {rec.growthProspects}
                    </span>
                  </div>
                  {rec.id === bestGrowthId && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              ))}

              {/* Market Demand Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Market Demand
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center space-x-2">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium capitalize',
                    getDemandColor(rec.jobMarketData?.demand || 'medium')
                  )}>
                    {rec.jobMarketData?.demand || 'Medium'}
                  </span>
                  {rec.id === bestDemandId && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              ))}

              {/* Competition Level Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Competition
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id}>
                  <span className={cn(
                    'text-sm font-medium capitalize',
                    getCompetitivenessColor(rec.jobMarketData?.competitiveness || 'medium')
                  )}>
                    {rec.jobMarketData?.competitiveness || 'Medium'}
                  </span>
                </div>
              ))}

              {/* Industry Growth Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Industry Growth
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id}>
                  <span className="text-sm font-medium text-green-600">
                    +{rec.jobMarketData?.industryGrowth || 0}%
                  </span>
                </div>
              ))}

              {/* Top Skills Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Key Skills
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id} className="space-y-1">
                  {rec.requiredSkills?.slice(0, 4).map((skill, index) => (
                    <div
                      key={index}
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        skill.priority === 'critical' 
                          ? 'bg-red-100 text-red-700'
                          : skill.priority === 'important'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {skill.name}
                    </div>
                  ))}
                  {(rec.requiredSkills?.length || 0) > 4 && (
                    <div className="text-xs text-muted-foreground">
                      +{(rec.requiredSkills?.length || 0) - 4} more
                    </div>
                  )}
                </div>
              ))}

              {/* Locations Row */}
              <div className="font-medium text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Top Locations
              </div>
              {recommendations.map((rec) => (
                <div key={rec.id} className="space-y-1">
                  {rec.jobMarketData?.locations?.slice(0, 3).map((location, index) => (
                    <div key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                      {location}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-secondary/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Star className="w-4 h-4 inline mr-1 text-yellow-500 fill-current" />
              Stars indicate the best option in each category
            </div>
            <NBButton variant="secondary" onClick={onClose}>
              Close Comparison
            </NBButton>
          </div>
        </div>
      </div>
    </div>
  );
};