import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, CheckCircle, Play, ExternalLink, Target } from 'lucide-react';
import { NBCard } from '@/components/NBCard';
import { NBButton } from '@/components/NBButton';
import { EnhancedUserProfile } from '@/lib/types';
import { LearningResource, ResourceRecommendation, LearningProgress } from '@/lib/types/learningResourceTypes';
import { LearningResourcesService } from '@/lib/services/learningResourcesService';
import { ProgressTrackingService, ProgressStats } from '@/lib/services/progressTrackingService';

interface LearningResourcesSectionProps {
  profile: EnhancedUserProfile;
  onResourceComplete: (resourceId: string) => void;
  onViewAllResources: () => void;
}

/**
 * Enhanced learning resources section with comprehensive domain-specific materials and progress tracking
 * Requirements: 6.3, 7.1, 7.2, 7.3, 7.4, 7.5 - Learning resources with checklist-based progress tracking
 */
export const LearningResourcesSection: React.FC<LearningResourcesSectionProps> = ({
  profile,
  onResourceComplete,
  onViewAllResources
}) => {
  const [recommendations, setRecommendations] = useState<ResourceRecommendation[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine domain from profile with comprehensive mapping
  const getDomainFromCareer = (careerInterest: string): string => {
    const career = careerInterest.toLowerCase();
    
    // Cybersecurity (check FIRST - very specific)
    if (career.includes('security') || career.includes('penetration') || career.includes('pentester') ||
        career.includes('ethical hack') || career.includes('cybersec') || career.includes('infosec')) {
      return 'technology-computer-science';
    }
    
    // Data Science & AI (check before general tech)
    if (career.includes('data scien') || career.includes('ml engineer') ||
        career.includes('machine learning') || career.includes('ai engineer')) {
      return 'technology-computer-science';
    }
    
    // Healthcare
    if (career.includes('doctor') || career.includes('nurse') || career.includes('physician') ||
        career.includes('medic') || career.includes('healthcare') || career.includes('clinical') ||
        career.includes('medical')) {
      return 'healthcare';
    }
    
    // Legal
    if (career.includes('lawyer') || career.includes('attorney') || career.includes('legal') ||
        career.includes('paralegal') || career.includes('law ')) {
      return 'legal';
    }
    
    // Education
    if (career.includes('teacher') || career.includes('professor') || career.includes('educator') ||
        career.includes('instructor') || career.includes('tutor')) {
      return 'education';
    }
    
    // Finance & Accounting
    if (career.includes('accountant') || career.includes('cpa') || career.includes('financial analyst') ||
        career.includes('finance ') || career.includes('investment') || career.includes('banker') ||
        career.includes('auditor')) {
      return 'finance';
    }
    
    // Construction & Trades
    if (career.includes('construction') || career.includes('builder') || career.includes('carpenter') ||
        career.includes('electrician') || career.includes('plumber') || career.includes('contractor')) {
      return 'construction';
    }
    
    // Engineering (non-software, check before general "engineer")
    if ((career.includes('engineer') && !career.includes('software') && !career.includes('developer')) ||
        career.includes('mechanical') || career.includes('civil eng') || 
        career.includes('electrical eng') || career.includes('structural')) {
      return 'engineering';
    }
    
    // Technology & Computer Science (after checking for non-software engineers)
    if (career.includes('software') || career.includes('developer') || career.includes('programmer') || 
        career.includes('tech') || career.includes('devops') || career.includes('cloud') || 
        career.includes('backend') || career.includes('frontend') || career.includes('fullstack') || 
        career.includes('mobile') || career.includes('coding')) {
      return 'technology-computer-science';
    }
    
    // Design, Art & Creative Industries
    if (career.includes('motion') || career.includes('animation') || career.includes('graphic') ||
        career.includes('design') || career.includes('visual') || career.includes('illustrat') ||
        career.includes('artist') || career.includes('3d') || career.includes('vfx') ||
        career.includes('video edit') || career.includes('creative') || career.includes('art')) {
      return 'design-art-creative';
    }
    
    // Communication, Media & Marketing
    if (career.includes('marketing') || career.includes('media') || career.includes('social media') ||
        career.includes('content') || career.includes('advertising') || career.includes('brand') ||
        career.includes('film') || career.includes('cinemat') || career.includes('photo')) {
      return 'communication-media-marketing';
    }
    
    // Architecture
    if (career.includes('architect') && !career.includes('software')) {
      return 'design-art-creative';
    }
    
    // Music & Audio
    if (career.includes('music') || career.includes('audio') || career.includes('sound')) {
      return 'communication-media-marketing';
    }
    
    // Science & Research
    if (career.includes('scientist') || career.includes('researcher') || career.includes('lab')) {
      return 'science';
    }
    
    // Data Analyst / Business Analyst (after data science check)
    if (career.includes('data analyst') || career.includes('business analyst')) {
      return 'business-management';
    }
    
    // Business & Management (default)
    return 'business-management';
  };

  const domain = getDomainFromCareer(
    profile.careerInterest || profile.careerRecommendations?.[0]?.primaryCareer || 'business'
  );

  const userId = profile.name || 'anonymous';

  useEffect(() => {
    loadLearningData();
  }, [profile]);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      
      // Get experience level from profile
      const yearsExp = profile.yearsOfExperience || 0;
      const experienceLevel: 'Entry' | 'Junior' | 'Mid' | 'Senior' = 
        yearsExp === 0 ? 'Entry' :
        yearsExp <= 2 ? 'Junior' :
        yearsExp <= 5 ? 'Mid' : 'Senior';
      
      // Load REAL personalized resources using RealLearningResourcesService
      const { RealLearningResourcesService } = await import('@/lib/services/realLearningResourcesService');
      const realResources = RealLearningResourcesService.getPersonalizedResources(
        profile.careerInterest || 'Software Developer',
        experienceLevel,
        profile.skills || []
      );
      
      // Convert to recommendation format (take top 4 highest relevance)
      const sortedResources = realResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
      const topResources = sortedResources.slice(0, 4);
      
      const recs = topResources.map(resource => ({
        resource: {
          id: resource.id,
          title: resource.title,
          domain: domain,
          type: 'course' as const,
          provider: resource.provider,
          url: resource.url,
          difficulty: resource.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
          duration: resource.duration,
          completed: false,
          skills: resource.skills
        },
        score: resource.relevanceScore,
        reasons: [resource.description],
        matchedSkills: resource.skills.filter(skill => 
          profile.skills?.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        ),
        difficulty: resource.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
        estimatedBenefit: resource.relevanceScore
      }));
      
      setRecommendations(recs);

      // Load progress statistics
      const stats = await ProgressTrackingService.getProgressStats(userId, domain);
      setProgressStats(stats);
    } catch (error) {
      // Silent error handling - continue with available data
    } finally {
      setLoading(false);
    }
  };

  const handleResourceComplete = async (resourceId: string) => {
    try {
      await LearningResourcesService.updateResourceProgress({
        resourceId,
        completed: true,
        progress: 100,
        timeSpent: 30, // Placeholder
        skillsPracticed: []
      });

      onResourceComplete(resourceId);
      
      // Reload data to reflect changes
      await loadLearningData();
    } catch (error) {
      // Silent error handling - continue with current state
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'certification': return <Star className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <NBCard className="p-6 bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </NBCard>
    );
  }

  if (recommendations.length === 0) {
    return (
      <NBCard className="p-6 bg-gradient-to-r from-purple-50/90 to-pink-50/90 border-purple-200">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-lg font-semibold text-purple-700 mb-2">
            Discover Learning Resources
          </h3>
          <p className="text-purple-600 mb-4">
            Get personalized learning recommendations based on your career goals
          </p>
          <NBButton 
            variant="primary"
            onClick={onViewAllResources}
            className="bg-purple-500 text-white hover:bg-purple-600"
          >
            Explore Resources
          </NBButton>
        </div>
      </NBCard>
    );
  }

  return (
    <NBCard className="p-6 bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-200">
      <div className="mb-6">
        <div>
          <h3 className="text-xl font-semibold text-green-900 mb-1">
            Learning Resources
          </h3>
          <p className="text-green-700">
            Personalized recommendations for {profile.careerInterest || 'your career path'}
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      {progressStats && (
        <div className="mb-6 p-4 bg-white/60 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {progressStats.totalResourcesCompleted}
              </div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {progressStats.skillsAcquired}
              </div>
              <div className="text-xs text-blue-700">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.floor(progressStats.totalTimeSpent / 60)}h
              </div>
              <div className="text-xs text-purple-700">Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {progressStats.currentStreak}
              </div>
              <div className="text-xs text-orange-700">Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Resources */}
      <div className="space-y-3">
        <h4 className="font-medium text-green-800 mb-3">Recommended for You</h4>
        {recommendations.map((rec) => {
          const resource = rec.resource;
          
          return (
            <div
              key={resource.id}
              className="p-4 rounded-lg border bg-white/80 border-gray-200 hover:border-green-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded text-gray-600">
                      {getResourceIcon(resource.type)}
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {resource.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Star className="h-3 w-3" />
                      {Math.round(rec.score)}% match
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {resource.description}
                  </p>

                  {/* Recommendation reasons */}
                  {rec.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {rec.reasons.slice(0, 2).map((reason, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      {resource.duration}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    <span className="text-gray-500">
                      {resource.provider}
                    </span>
                    {resource.cost === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span className="text-gray-500">${resource.cost}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {resource.url && (
                    <NBButton
                      variant="ghost"
                      className="text-blue-600 hover:bg-blue-100 px-3 py-1 text-sm"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      View
                    </NBButton>
                  )}
                  {!resource.completed && (
                    <NBButton
                      variant="primary"
                      onClick={() => handleResourceComplete(resource.id)}
                      className="bg-green-500 text-white hover:bg-green-600 text-sm px-3 py-1 font-medium"
                    >
                      Start
                    </NBButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-green-200">
        <div className="flex justify-center">
          <NBButton
            variant="primary"
            onClick={onViewAllResources}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-2"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Resources
          </NBButton>
        </div>
      </div>
    </NBCard>
  );
};