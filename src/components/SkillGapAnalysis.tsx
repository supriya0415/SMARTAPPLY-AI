import React from 'react';
import { SkillGapAnalysis as SkillGapAnalysisType, SkillGap } from '../lib/types';
import { NBCard } from './NBCard';
import { cn } from '../lib/utils';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Award,
  Zap
} from 'lucide-react';

interface SkillGapAnalysisProps {
  analysis: SkillGapAnalysisType;
  className?: string;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  analysis,
  className
}) => {

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'text-green-600';
    if (readiness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const criticalGaps = analysis.skillGaps.filter(gap => 
    gap.priority === 'critical' && gap.gapSize !== 'none'
  );
  const importantGaps = analysis.skillGaps.filter(gap => 
    gap.priority === 'important' && gap.gapSize !== 'none'
  );
  const strengths = analysis.skillGaps.filter(gap => gap.gapSize === 'none');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overview Header */}
      <NBCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Skill Gap Analysis</h2>
              <p className="text-sm text-muted-foreground">
                For {analysis.targetCareer}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              'text-2xl font-bold',
              getReadinessColor(analysis.overallReadiness)
            )}>
              {analysis.overallReadiness}%
            </div>
            <p className="text-xs text-muted-foreground">Career Ready</p>
          </div>
        </div>

        {/* Readiness Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Readiness</span>
            <span className="text-sm text-muted-foreground">
              {analysis.overallReadiness}% of {analysis.skillGaps.length} skills
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={cn(
                'h-3 rounded-full transition-all duration-500',
                analysis.overallReadiness >= 80 ? 'bg-green-500' :
                analysis.overallReadiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${analysis.overallReadiness}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{criticalGaps.length}</div>
            <div className="text-xs text-muted-foreground">Critical Gaps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{importantGaps.length}</div>
            <div className="text-xs text-muted-foreground">Important Gaps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{strengths.length}</div>
            <div className="text-xs text-muted-foreground">Strengths</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{analysis.skillGaps.length}</div>
            <div className="text-xs text-muted-foreground">Total Skills</div>
          </div>
        </div>
      </NBCard>

      {/* Strength Areas */}
      {analysis.strengthAreas.length > 0 && (
        <NBCard variant="ok">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-700">Your Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.strengthAreas.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </NBCard>
      )}

      {/* Critical Gaps */}
      {criticalGaps.length > 0 && (
        <NBCard variant="error">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-700">Critical Skill Gaps</h3>
            <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
              High Priority
            </span>
          </div>
          <div className="space-y-3">
            {criticalGaps.slice(0, 5).map((gap, index) => (
              <SkillGapItem key={index} gap={gap} />
            ))}
          </div>
        </NBCard>
      )}

      {/* Important Gaps */}
      {importantGaps.length > 0 && (
        <NBCard variant="warn">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-700">Important Skill Gaps</h3>
            <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
              Medium Priority
            </span>
          </div>
          <div className="space-y-3">
            {importantGaps.slice(0, 5).map((gap, index) => (
              <SkillGapItem key={index} gap={gap} />
            ))}
          </div>
        </NBCard>
      )}

      {/* Improvement Areas Summary */}
      {analysis.improvementAreas.length > 0 && (
        <NBCard>
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Focus Areas for Improvement</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            These skills will have the biggest impact on your career readiness:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.improvementAreas.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </NBCard>
      )}
    </div>
  );
};

interface SkillGapItemProps {
  gap: SkillGap;
}

const SkillGapItem: React.FC<SkillGapItemProps> = ({ gap }) => {
  const getGapSizeColor = (gapSize: string) => {
    switch (gapSize) {
      case 'small':
        return 'text-blue-600 bg-blue-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'large':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white/50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-foreground">{gap.skillName}</h4>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium capitalize',
              getGapSizeColor(gap.gapSize)
            )}>
              {gap.gapSize} gap
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Current: <span className="font-medium capitalize">{gap.currentLevel}</span></span>
            <span>→</span>
            <span>Target: <span className="font-medium capitalize">{gap.requiredLevel}</span></span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{gap.estimatedLearningTime}</span>
        </div>
      </div>
      
      {gap.recommendedActions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Recommended actions:</p>
          <div className="flex flex-wrap gap-1">
            {gap.recommendedActions.slice(0, 3).map((action, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};