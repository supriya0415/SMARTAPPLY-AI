import React from 'react';
import { ScoreGauge } from './ScoreGauge';
import { ResumeFeedback } from '../../lib/types';
import { cn } from '../../lib/utils';

interface ResumeSummaryProps {
  feedback: ResumeFeedback;
  className?: string;
}

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium border',
      getScoreColor(score)
    )}>
      {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
    </span>
  );
};

const CategoryScore: React.FC<{ title: string; score: number }> = ({ title, score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-3">
        <h4 className="font-medium text-foreground">{title}</h4>
        <ScoreBadge score={score} />
      </div>
      <div className="text-right">
        <span className={cn('text-xl font-bold', getScoreColor(score))}>
          {score}
        </span>
        <span className="text-gray-500 text-sm">/100</span>
      </div>
    </div>
  );
};

export const ResumeSummary: React.FC<ResumeSummaryProps> = ({ 
  feedback, 
  className 
}) => {
  return (
    <div className={cn('bg-white rounded-xl border shadow-sm', className)}>
      {/* Header with overall score */}
      <div className="flex items-center space-x-6 p-6 border-b">
        <ScoreGauge score={feedback.overallScore} size="lg" />
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Overall Resume Score
          </h3>
          <p className="text-muted-foreground">
            This score is calculated based on multiple factors including ATS compatibility, 
            content quality, structure, and skills alignment.
          </p>
        </div>
      </div>

      {/* Category scores */}
      <div className="p-6 space-y-4">
        <h4 className="font-semibold text-foreground mb-4">Score Breakdown</h4>
        
        <CategoryScore title="ATS Compatibility" score={feedback.ATS.score} />
        <CategoryScore title="Tone & Style" score={feedback.toneAndStyle.score} />
        <CategoryScore title="Content Quality" score={feedback.content.score} />
        <CategoryScore title="Structure & Format" score={feedback.structure.score} />
        <CategoryScore title="Skills Alignment" score={feedback.skills.score} />
      </div>
    </div>
  );
};