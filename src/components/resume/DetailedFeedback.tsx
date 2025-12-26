import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { ResumeFeedback } from '../../lib/types';
import { cn } from '../../lib/utils';

interface DetailedFeedbackProps {
  feedback: ResumeFeedback;
  className?: string;
}

interface FeedbackSectionProps {
  title: string;
  score: number;
  tips: Array<{
    type: "good" | "improve";
    tip: string;
    explanation?: string;
  }>;
  isOpen: boolean;
  onToggle: () => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  title,
  score,
  tips,
  isOpen,
  onToggle
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBorderColor = (score: number) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  return (
    <div className={cn('border rounded-lg', getBorderColor(score))}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <span className={cn('text-xl font-bold', getScoreColor(score))}>
            {score}/100
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-4 mt-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                {tip.type === "good" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={cn(
                    'font-medium text-sm',
                    tip.type === "good" ? "text-green-700" : "text-amber-700"
                  )}>
                    {tip.tip}
                  </p>
                  {tip.explanation && (
                    <p className="text-sm text-gray-600 mt-1">
                      {tip.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const DetailedFeedback: React.FC<DetailedFeedbackProps> = ({ 
  feedback, 
  className 
}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['ATS']));

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const sections = [
    {
      key: 'ATS',
      title: 'ATS Compatibility',
      score: feedback.ATS.score,
      tips: feedback.ATS.tips
    },
    {
      key: 'toneAndStyle',
      title: 'Tone & Style',
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips
    },
    {
      key: 'content',
      title: 'Content Quality',
      score: feedback.content.score,
      tips: feedback.content.tips
    },
    {
      key: 'structure',
      title: 'Structure & Format',
      score: feedback.structure.score,
      tips: feedback.structure.tips
    },
    {
      key: 'skills',
      title: 'Skills Alignment',
      score: feedback.skills.score,
      tips: feedback.skills.tips
    }
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Detailed Analysis</h2>
        <p className="text-muted-foreground">
          Expand each section to see specific recommendations for improving your resume.
        </p>
      </div>

      {sections.map((section) => (
        <FeedbackSection
          key={section.key}
          title={section.title}
          score={section.score}
          tips={section.tips}
          isOpen={openSections.has(section.key)}
          onToggle={() => toggleSection(section.key)}
        />
      ))}
    </div>
  );
};