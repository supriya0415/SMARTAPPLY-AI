import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedDashboard } from '../components/dashboard';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { LoadingState } from '../components/ui/LoadingState';
import { useUserStore } from '../lib/stores/userStore';
import { EnhancedProfileService } from '../lib/services/enhancedProfileService';
import { ErrorHandlingService } from '../lib/services/errorHandlingService';
import { toast } from 'sonner';
import { User, RefreshCw } from 'lucide-react';
import { debugLogger } from '../lib/utils/debugLogger';

export const CareerDashboard = () => {
  const navigate = useNavigate();
  const { enhancedProfile, setEnhancedProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    debugLogger.logDashboardLoad(enhancedProfile);
    
    // Check for enhanced profile in database, localStorage, and store
    let hasValidProfile = !!enhancedProfile;
    
    const loadEnhancedProfile = async () => {
      if (hasValidProfile) return;
      
      setIsLoading(true);
      try {
        // First try to load from database
        debugLogger.log('No enhanced profile in store, checking database', {
          component: 'CareerDashboard',
          action: 'profile_check_db'
        });
        const databaseProfile = await EnhancedProfileService.loadEnhancedProfile();
        
        if (databaseProfile && 
            databaseProfile.achievements !== undefined &&
            databaseProfile.badges !== undefined &&
            databaseProfile.level !== undefined &&
            databaseProfile.careerRecommendations !== undefined &&
            databaseProfile.careerRecommendations.length > 0) {
          
          debugLogger.log('Found complete enhanced profile in database, loading into store', {
            component: 'CareerDashboard',
            action: 'profile_found_db',
            metadata: { profileName: databaseProfile.name }
          });
          setEnhancedProfile(databaseProfile);
          hasValidProfile = true;
          return;
        }
      } catch (error) {
        debugLogger.error('Error loading enhanced profile from database', error as Error, {
          component: 'CareerDashboard',
          action: 'profile_load_db_error'
        });
        ErrorHandlingService.handleApiError(error, 'Loading profile from database');
      }
      
      // Fallback to localStorage
      if (!hasValidProfile) {
        console.log('No enhanced profile in database, checking localStorage...');
        try {
          const storedData = localStorage.getItem('career-mentor-store');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            const storedProfile = parsed?.enhancedProfile;
            
            // Check if stored profile is complete
            if (storedProfile && 
                storedProfile.achievements !== undefined &&
                storedProfile.badges !== undefined &&
                storedProfile.level !== undefined &&
                storedProfile.careerRecommendations !== undefined &&
                storedProfile.careerRecommendations.length > 0) {
              
              console.log('Found complete enhanced profile in localStorage, loading into store...');
              setEnhancedProfile(storedProfile);
              hasValidProfile = true;
            }
          }
        } catch (error) {
          console.error('Error checking localStorage for enhanced profile:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    // Load enhanced profile if not available
    if (!hasValidProfile) {
      loadEnhancedProfile();
    }
    
    // Only redirect if we definitely don't have a valid profile
    if (!hasValidProfile && !isLoading) {
      const token = localStorage.getItem('jwt');
      if (token) {
        // User is logged in but hasn't completed assessment
        console.log('No valid enhanced profile found, redirecting to assessment');
        toast.info('Please complete your career assessment first');
        navigate('/assessment');
      } else {
        // User not logged in
        console.log('No token found, redirecting to signin');
        navigate('/signin');
      }
      return;
    }
  }, [enhancedProfile, navigate, isLoading]);

  // Loading state component
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingState
          title="Loading Dashboard"
          description="Setting up your personalized career dashboard..."
          size="lg"
          variant="card"
        />
      </div>
    );
  }

  if (!enhancedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Complete Your Assessment</h3>
          <p className="text-gray-600 mb-4">Please complete the career assessment first to get personalized recommendations.</p>
          <NBButton onClick={() => navigate('/assessment')}>
            Start Assessment
          </NBButton>
        </NBCard>
      </div>
    );
  }

  // Use the clean EnhancedDashboard component
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">Unable to load dashboard. Please try refreshing the page.</p>
          <NBButton onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </NBButton>
        </NBCard>
      </div>
    }>
      <EnhancedDashboard profile={enhancedProfile} />
    </ErrorBoundary>
  );
};