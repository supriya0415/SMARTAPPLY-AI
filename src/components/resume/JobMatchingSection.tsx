import React from 'react';
import { NBCard } from '../NBCard';
import { Briefcase, TrendingUp, ExternalLink } from 'lucide-react';
import { JobMatch } from '../../lib/services/enhancedResumeService';

interface JobMatchingSectionProps {
  jobMatches: JobMatch[];
  nextLevelAdvice: string[];
}

export const JobMatchingSection: React.FC<JobMatchingSectionProps> = ({ 
  jobMatches, 
  nextLevelAdvice 
}) => {
  if ((!jobMatches || jobMatches.length === 0) && (!nextLevelAdvice || nextLevelAdvice.length === 0)) {
    return null;
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const handleSearchJob = (jobTitle: string) => {
    const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}`;
    window.open(linkedInUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Job Matches */}
      {jobMatches && jobMatches.length > 0 && (
        <NBCard className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">You're a Strong Match For</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your resume, these roles align well with your skills and experience
              </p>
            </div>
          </div>

          <div className="grid gap-4 mt-6">
            {jobMatches.map((job, index) => (
              <div
                key={index}
                className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                        {job.title}
                      </h4>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getMatchColor(job.matchScore)}`}>
                        {job.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{job.reason}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-green-600">
                        💰 {job.salaryRange}
                      </span>
                      <button
                        onClick={() => handleSearchJob(job.title)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 transition-colors"
                      >
                        <span>Search on LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NBCard>
      )}

      {/* Next Level Advice */}
      {nextLevelAdvice && nextLevelAdvice.length > 0 && (
        <NBCard className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-start space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Ready for the Next Level?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Here's what you need to focus on to advance your career
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {nextLevelAdvice.map((advice, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground flex-1">{advice}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white border border-purple-300 rounded-lg">
            <p className="text-sm text-purple-900">
              🎯 <strong>Career Tip:</strong> Focus on one area at a time. Demonstrable expertise 
              in one key area is often more valuable than surface-level knowledge of many.
            </p>
          </div>
        </NBCard>
      )}
    </div>
  );
};

