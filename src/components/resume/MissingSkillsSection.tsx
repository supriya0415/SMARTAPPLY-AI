import React from 'react';
import { NBCard } from '../NBCard';
import { BookOpen, ExternalLink, AlertTriangle } from 'lucide-react';
import { SkillGap } from '../../lib/services/enhancedResumeService';

interface MissingSkillsSectionProps {
  missingSkills: SkillGap[];
}

export const MissingSkillsSection: React.FC<MissingSkillsSectionProps> = ({ missingSkills }) => {
  if (!missingSkills || missingSkills.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <NBCard className="p-6">
      <div className="flex items-start space-x-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-semibold text-foreground">Skills to Develop</h3>
          <p className="text-sm text-muted-foreground mt-1">
            These skills from the job description are not reflected in your resume. 
            Here are resources to help you learn them:
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {missingSkills.map((skillGap, index) => (
          <div key={index} className="border-l-4 border-purple-500 pl-4 pb-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-semibold text-lg text-foreground">{skillGap.skill}</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(skillGap.priority)}`}>
                {skillGap.priority} priority
              </span>
            </div>

            {skillGap.learningResources && skillGap.learningResources.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Recommended Learning Resources:
                </p>
                <div className="grid gap-3">
                  {skillGap.learningResources.map((resource, resourceIndex) => (
                    <a
                      key={resourceIndex}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between p-3 bg-white hover:bg-purple-50 border border-gray-200 rounded-lg transition-all hover:shadow-md"
                    >
                      <div className="flex-1">
                        <div className="flex items-start space-x-2">
                          <div className="flex-1">
                            <p className="font-medium text-foreground group-hover:text-purple-600 transition-colors">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{resource.relevance}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                {resource.provider}
                              </span>
                              <span className="text-xs text-muted-foreground">{resource.duration}</span>
                              <span className="text-xs font-semibold text-green-600">
                                {resource.cost === 0 ? 'Free' : `$${resource.cost}`}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-purple-600 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Consider online courses, certifications, or hands-on projects to develop this skill.
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Pro Tip:</strong> Focus on high-priority skills first. Even basic familiarity 
          with these skills can significantly improve your resume's match score!
        </p>
      </div>
    </NBCard>
  );
};

