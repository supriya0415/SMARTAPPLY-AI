import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardLayout } from './DashboardLayout';
import { DashboardHeader } from './DashboardHeader';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { CareerRoadmapDisplay } from './CareerRoadmapDisplay';
import { LearningResourcesSection } from './LearningResourcesSection';
import { ProgressTrackingVisualization } from './ProgressTrackingVisualization';
import { SimilarJobsRecommendation } from './SimilarJobsRecommendation';
import { EnhancedUserProfile } from '@/lib/types';
import { useUserStore } from '@/lib/stores/userStore';

interface EnhancedDashboardProps {
  profile: EnhancedUserProfile;
}

/**
 * Enhanced Dashboard Component - Clean, organized interface with all dashboard sections
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3, 8.4
 * - Clean dashboard layout with organized sections
 * - Career roadmap display
 * - Learning resources with domain-specific materials
 * - Progress tracking visualization
 * - Similar jobs recommendation section
 * - Responsive design for mobile and desktop
 */
export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { setEnhancedProfile } = useUserStore();

  // Get the current career roadmap from recommendations
  const currentRoadmap = profile.careerRecommendations?.[0] || null;

  const handleLogout = () => {
    // Simple logout confirmation as per requirements (2.1, 2.2)
    const confirmed = window.confirm('Do you want to log out?');
    if (confirmed) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('career-mentor-store');
      toast.success('Logged out successfully');
      navigate('/signin');
    }
  };

  const handleSettings = () => {
    navigate('/profile');
  };

  const handleViewFullRoadmap = () => {
    navigate('/learning-resources');
  };

  const handleUpdateRoadmap = () => {
    const confirmed = window.confirm(
      'Are you sure you want to retake the career assessment? This will update your career recommendations and learning roadmap based on your current preferences.'
    );
    
    if (confirmed) {
      // Clear selected career from localStorage
      localStorage.removeItem('selectedCareer');
      
      // Clear current assessment data to force retake
      const updatedProfile = {
        ...profile,
        careerAssessment: undefined,
        careerRecommendations: [],
        learningRoadmap: undefined,
        updatedAt: new Date()
      };
      
      setEnhancedProfile(updatedProfile);
      toast.info('Starting new career assessment...');
      navigate('/assessment');
    }
  };

  const handleResourceComplete = (resourceId: string) => {
    // Update profile with completed resource
    const updatedProfile = {
      ...profile,
      progressData: {
        ...profile.progressData,
        learningActivities: [
          ...(profile.progressData?.learningActivities || []),
          {
            id: `activity_${Date.now()}`,
            resourceId,
            title: 'Learning Resource',
            type: 'course' as const,
            completedAt: new Date(),
            timeSpent: 30,
            skillsGained: [],
          }
        ],
        overallProgress: Math.min((profile.progressData?.overallProgress || 0) + 5, 100),
        lastUpdated: new Date()
      },
      updatedAt: new Date()
    };
    
    setEnhancedProfile(updatedProfile);
    toast.success('Completed!', { duration: 2000 });
  };

  const handleViewAllResources = () => {
    navigate('/learning-resources');
  };

  const handleViewDetailedProgress = () => {
    navigate('/learning-resources');
  };

  const handleViewJobDetails = (jobId: string, jobData?: any) => {
    // Use the passed job data or try to find it from career recommendations
    let job = jobData;
    if (!job) {
      const allJobs = profile.careerRecommendations?.flatMap(rec => rec.alternatives || []) || [];
      job = allJobs.find(j => j.id === jobId);
    }
    
    if (job) {
      // Show detailed job information in a nice toast notification
      toast.success(
        <div className="space-y-3 p-2">
          <div className="font-bold text-lg text-cyan-900">{job.title}</div>
          <div className="text-sm text-gray-700">{job.description}</div>
          
          <div className="flex items-center gap-4 text-sm border-t border-b border-gray-200 py-2">
            <span className="font-semibold text-green-600">💰 {job.salary}</span>
            <span className="font-semibold text-blue-600">🎯 {job.matchScore}% match</span>
            <span className={`font-semibold ${
              job.growth === 'very high' || job.growth === 'high' ? 'text-green-600' : 
              job.growth === 'medium' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              📈 {job.growth.charAt(0).toUpperCase() + job.growth.slice(1)} growth
            </span>
          </div>
          
          <div className="text-sm">
            <strong className="text-gray-800">Required Skills:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {job.requirements.map((req: string, idx: number) => (
                <span key={idx} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs">
                  {req}
                </span>
              ))}
            </div>
          </div>
          
          {job.experienceLevel && (
            <div className="text-sm">
              <strong className="text-gray-800">Experience Level:</strong>{' '}
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}
              </span>
            </div>
          )}
        </div>,
        {
          duration: 10000,
          position: 'top-center',
          style: {
            minWidth: '400px',
            maxWidth: '500px',
          },
        }
      );
      
      // Also log for debugging
      console.log('📋 Job Details:', job);
      
      // Optionally, open LinkedIn search for this job
      setTimeout(() => {
        toast.info(
          <div className="text-sm">
            <span>Want to see actual openings? </span>
            <button 
              onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`, '_blank')}
              className="underline font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Search on LinkedIn →
            </button>
          </div>,
          { duration: 5000 }
        );
      }, 1000);
    } else {
      // Fallback: Open LinkedIn job search
      const searchQuery = encodeURIComponent(jobId.replace(/[0-9-]/g, ''));
      window.open(`https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`, '_blank');
      toast.info('Opening LinkedIn job search in new tab...');
    }
  };

  const handleSaveJob = (jobId: string) => {
    toast.success('Job saved to your bookmarks');
  };

  const handleViewAllJobs = () => {
    // Navigate to job search or external job board
    toast.info('Opening job search...');
  };

  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <DashboardHeader
        profile={profile}
        onLogout={handleLogout}
        onSettings={handleSettings}
      />

      {/* Personalized Greeting with AI-generated insights */}
      <PersonalizedGreeting
        userName={profile.name || 'User'}
        careerInterest={profile.careerInterest || 'your field'}
        yearsOfExperience={profile.yearsOfExperience || 0}
        completedResources={profile.learningResourcesCompleted?.length || 0}
        overallProgress={profile.progressData?.overallProgress || 0}
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Career Roadmap - Top Left */}
        <CareerRoadmapDisplay
          roadmap={currentRoadmap}
          onViewFullRoadmap={handleViewFullRoadmap}
          onUpdateRoadmap={handleUpdateRoadmap}
        />

        {/* Progress Tracking - Top Right */}
        <ProgressTrackingVisualization
          profile={profile}
          onViewDetailedProgress={handleViewDetailedProgress}
        />
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Resources - Bottom Left */}
        <LearningResourcesSection
          profile={profile}
          onResourceComplete={handleResourceComplete}
          onViewAllResources={handleViewAllResources}
        />

        {/* Similar Jobs - Bottom Right */}
        <SimilarJobsRecommendation
          profile={profile}
          onViewJobDetails={handleViewJobDetails}
          onSaveJob={handleSaveJob}
          onViewAllJobs={handleViewAllJobs}
        />
      </div>

      {/* Quick Stats Footer - Career-Focused */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white/60 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {profile.careerRecommendations?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Career Matches</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {profile.progressData?.learningActivities?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Resources Completed</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {profile.skills?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Skills</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {profile.yearsOfExperience || 0}
          </div>
          <div className="text-sm text-gray-600">Years Experience</div>
        </div>
      </div>
    </DashboardLayout>
  );
};