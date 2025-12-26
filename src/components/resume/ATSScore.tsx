import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ATSSuggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSScoreProps {
  score: number;
  suggestions: ATSSuggestion[];
  className?: string;
}

export const ATSScore: React.FC<ATSScoreProps> = ({ 
  score, 
  suggestions, 
  className 
}) => {
  // Determine styling based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 50) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Needs Improvement';
  };

  const getBgGradient = (score: number) => {
    if (score >= 70) return 'from-green-50 to-white';
    if (score >= 50) return 'from-yellow-50 to-white';
    return 'from-red-50 to-white';
  };

  return (
    <div className={cn(
      'bg-gradient-to-b rounded-xl border p-6',
      getBgGradient(score),
      className
    )}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        {getScoreIcon(score)}
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            ATS Score: {score}/100
          </h3>
          <p className="text-muted-foreground">
            {getScoreLabel(score)} - Applicant Tracking System compatibility
          </p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">ATS Compatibility</span>
          <span className={cn('text-sm font-bold', getScoreColor(score))}>
            {score}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={cn(
              'h-3 rounded-full transition-all duration-500',
              score >= 70 ? 'bg-green-500' :
              score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          This score represents how well your resume will perform in Applicant Tracking Systems 
          used by employers to filter candidates before human review.
        </p>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Key Recommendations:</h4>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3">
                {suggestion.type === "good" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                )}
                <p className={cn(
                  'text-sm',
                  suggestion.type === "good" ? "text-green-700" : "text-amber-700"
                )}>
                  {suggestion.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-muted-foreground italic">
          💡 Tip: Higher ATS scores increase your chances of getting past automated filters 
          and reaching human recruiters.
        </p>
      </div>
    </div>
  );
};