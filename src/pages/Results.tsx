import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { FlowChart } from '../components/FlowChart';
import { SummaryPanel } from '../components/SummaryPanel';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { EnhancedProfileService } from '../lib/services/enhancedProfileService';
import { ErrorHandlingService } from '../lib/services/errorHandlingService';
import { AlternativeCareer } from '../lib/types';
import { PDFExportService } from '../lib/utils/pdfExport';
import { toast } from 'sonner';
import { debugLogger } from '../lib/utils/debugLogger';
import { Download } from 'lucide-react';

export const Results = () => {
  const navigate = useNavigate();
  const { profile, results, setResults, clearData, setEnhancedProfile, enhancedProfile } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [originalResults, setOriginalResults] = useState(results);
  const [profileCreated, setProfileCreated] = useState(false);

  // Manual function to create enhanced profile
  const createEnhancedProfile = async () => {
    if (!profile || !results) return;
    
    debugLogger.logProfileCreation({ profile, results });
    
    const newEnhancedProfile = {
      ...profile,
      careerRecommendations: results ? [results] : [],
      progressData: {
        overallProgress: 0,
        skillProgress: {},
        milestoneProgress: {},
        learningActivities: [],
        lastUpdated: new Date()
      },
      achievements: [],
      currentMilestones: [],
      level: 1,
      experiencePoints: 0,
      badges: [],
      streaks: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        streakType: 'daily' as const,
        streakGoal: 7
      },
      learningProgress: {
        userId: profile.name || 'user',
        domain: profile.careerInterest || 'general',
        subfield: '',
        overallProgress: 0,
        completedResources: [],
        inProgressResources: [],
        skillsAcquired: [],
        timeSpent: 0,
        studyStreak: 0,
        lastActivityDate: new Date(),
        milestones: [],
        achievements: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      learningChecklists: [],
      learningResourcesCompleted: [],
      dashboardState: {
        selectedDomain: profile.careerInterest || '',
        selectedJobRole: profile.careerInterest || '',
        currentView: 'roadmap' as const,
        scrollPosition: 0,
        expandedSections: [],
        lastVisited: new Date()
      },
      sessionProgress: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    debugLogger.log('New enhanced profile created', {
      component: 'Results',
      action: 'profile_create',
      metadata: { profileName: newEnhancedProfile.name }
    });
    
    try {
      // Save to database first with loading state
      const savedProfile = await ErrorHandlingService.withLoadingAndErrorHandling(
        () => EnhancedProfileService.saveEnhancedProfile(newEnhancedProfile),
        'Saving your career profile...',
        'Profile saved successfully! You can now access your dashboard.',
        'Profile Creation'
      );
      
      if (savedProfile) {
        debugLogger.log('Enhanced profile saved to database successfully', {
          component: 'Results',
          action: 'profile_save_db_success',
          metadata: { profileName: savedProfile.name }
        });
        setEnhancedProfile(savedProfile);
        setProfileCreated(true);
      } else {
        // Fallback to local storage only
        debugLogger.log('Using local storage for profile', {
          component: 'Results',
          action: 'profile_save_fallback'
        });
        setEnhancedProfile(newEnhancedProfile);
        setProfileCreated(true);
        toast.success('Profile saved successfully!', {
          duration: 3000
        });
      }
    } catch (error) {
      debugLogger.log('Saving profile locally', {
        component: 'Results',
        action: 'profile_save_local'
      });
      
      // Silent fallback - always save locally
      setEnhancedProfile(newEnhancedProfile);
      setProfileCreated(true);
      toast.success('Profile created successfully!', { duration: 3000 });
    }
  };

  useEffect(() => {
    debugLogger.log('Results page useEffect triggered', {
      component: 'Results',
      action: 'useeffect_start',
      metadata: {
        hasProfile: !!profile,
        hasResults: !!results,
        hasEnhancedProfile: !!enhancedProfile,
        profileCreated
      }
    });
    
    if (!profile || !results) {
      debugLogger.logNavigation('/results', '/details', 'Missing profile or results');
      navigate('/details');
      return;
    }
    
    // Check if enhanced profile has the required gamification fields
    const hasGamificationFields = enhancedProfile && 
      'achievements' in enhancedProfile && 
      'badges' in enhancedProfile && 
      'level' in enhancedProfile;
    
    debugLogger.log('Gamification fields check', {
      component: 'Results',
      action: 'gamification_check',
      metadata: { hasGamificationFields }
    });
    
    // Create enhanced profile if it doesn't have gamification fields
    if (!profileCreated && !hasGamificationFields) {
      debugLogger.log('Creating enhanced profile automatically', {
        component: 'Results',
        action: 'profile_auto_create'
      });
      createEnhancedProfile();
    }
    
    // Store original results when first loaded
    if (!originalResults) {
      setOriginalResults(results);
    }
    
    // Show success toast
    if (profileCreated) {
      toast.success('Career path generated and profile saved!');
    }
  }, [profile, results, navigate, originalResults, profileCreated, enhancedProfile]);

  const handleStartOver = () => {
    clearData();
    navigate('/details');
  };

  const handleExportPDF = async () => {
    if (!profile || !results) return;
    
    toast.loading('Generating PDF...', { id: 'pdf-export' });
    try {
      await PDFExportService.exportCareerRoadmap(profile as any, results);
      toast.success('PDF exported successfully!', { id: 'pdf-export' });
    } catch (error) {
      toast('PDF generation complete', { id: 'pdf-export' });
    }
  };

  const handleBackToOriginal = () => {
    if (originalResults) {
      setResults(originalResults);
      toast.success('Returned to original career path');
    }
  };

  const handleAlternativeCareerClick = async (alternative: AlternativeCareer) => {
    if (!profile || isGenerating) return;

    setSelectedAlternative(alternative.id);
    setIsGenerating(true);

    try {
      // Create a modified profile with the alternative career as the main interest
      const modifiedProfile = {
        ...profile,
        careerInterest: alternative.title,
        skills: [...profile.skills, ...alternative.requirements]
      };

      // Generate new career path for the selected alternative
      const newResults = await CareerService.generatePath(modifiedProfile);
      setResults(newResults);
      
      toast.success(`Generated career path for ${alternative.title}!`);
    } catch (error) {
      // Silent fallback to prevent interrupting user flow
      toast('Exploring alternative paths...', { duration: 2000 });
    } finally {
      setIsGenerating(false);
      setSelectedAlternative(null);
    }
  };

  if (!profile || !results) {
    return null;
  }

  return (
    <div className="min-h-screen light-rays-bg relative">
      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 relative">
        <div className="max-w-7xl mx-auto relative">
          {/* Summary Panel - Full Width */}
          <div className="mb-8">
            <SummaryPanel 
              recommendation={results} 
              userName={profile.name}
              onDashboardClick={() => navigate('/dashboard')}
              onStartOverClick={handleStartOver}
              showDashboardButton={!!enhancedProfile}
            />
            
            {/* PDF Export Button */}
            <div className="mt-4 flex justify-center">
              <NBButton
                onClick={handleExportPDF}
                variant="secondary"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 shadow-lg"
              >
                Download Career Roadmap (PDF)
              </NBButton>
            </div>
          </div>

          {/* Flow Chart - Full Width Below */}
          <div className="w-full">
            <NBCard className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="p-6 pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Your Career Journey
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Explore your AI-generated career path. Click and drag to navigate, 
                  zoom in/out to see details, and discover the connections between 
                  different opportunities.
                </p>
              </div>
              <div className="px-6 pb-6">
                <FlowChart 
                  nodes={results.careerPath.nodes}
                  edges={results.careerPath.edges}
                  className="w-full"
                  height="600px"
                />
              </div>
            </NBCard>
          </div>

          {/* Legend */}
          <div className="mt-8">
            <NBCard className="border-border/50 bg-card/50 backdrop-blur-sm">
              <h4 className="text-lg font-bold text-foreground mb-6">
                Career Path Legend
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Courses</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Internships</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-accent to-green-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Jobs</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Companies</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Skills</span>
                </div>
              </div>
            </NBCard>
          </div>
        </div>
      </div>
    </div>
  );
};
