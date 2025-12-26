import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CareerRecommendation } from '../lib/types';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { useUserStore } from '../lib/stores/userStore';
import { useGamification } from '../lib/hooks/useGamification';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Users, 
  BarChart3,
  Target,
  BookOpen,
  Award,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export const CareerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get recommendation from navigation state
  const recommendation = location.state?.recommendation as CareerRecommendation;
  
  // Get user store and gamification hooks
  const { enhancedProfile, setEnhancedProfile } = useUserStore();
  const { awardXP, updateProfile } = useGamification();

  const handleSelectCareer = () => {
    if (!enhancedProfile) return;
    
    // Update the user's selected career path
    const updatedProfile = {
      ...enhancedProfile,
      selectedCareerPath: recommendation.id,
      updatedAt: new Date()
    };
    
    setEnhancedProfile(updatedProfile);
    
    // Award XP for selecting a career path
    awardXP(50, `Selected career path: ${recommendation.title}`);
    
    toast.success(`Selected ${recommendation.title} as your career path!`);
    navigate('/dashboard');
  };

  const handleSaveToFavorites = () => {
    // This could be implemented to save to a favorites list
    // For now, just award some XP and show success
    awardXP(10, `Saved career to favorites: ${recommendation.title}`);
    toast.success(`Saved ${recommendation.title} to your favorites!`);
  };

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Career Not Found</h2>
              <p className="text-muted-foreground mt-2">
                The career details you're looking for could not be found.
              </p>
            </div>
            <NBButton onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </NBButton>
          </div>
        </NBCard>
      </div>
    );
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <NBButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </NBButton>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{recommendation.title}</h1>
              <p className="text-muted-foreground">Detailed Career Information</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <NBCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Career Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {recommendation.description}
              </p>
              
              {recommendation.summary && (
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <span>Why This Career Fits You</span>
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    "{recommendation.summary}"
                  </p>
                </div>
              )}
            </NBCard>

            {/* Required Skills */}
            <NBCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Required Skills</span>
              </h2>
              
              {recommendation.requiredSkills && recommendation.requiredSkills.length > 0 ? (
                <div className="space-y-4">
                  {['critical', 'important', 'nice-to-have'].map(priority => {
                    const skillsForPriority = recommendation.requiredSkills.filter(
                      skill => skill.priority === priority
                    );
                    
                    if (skillsForPriority.length === 0) return null;
                    
                    return (
                      <div key={priority}>
                        <h3 className="font-medium text-foreground mb-2 capitalize">
                          {priority === 'nice-to-have' ? 'Nice to Have' : priority} Skills
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {skillsForPriority.map((skill, index) => (
                            <div
                              key={index}
                              className={cn(
                                'p-3 rounded-lg border',
                                priority === 'critical' 
                                  ? 'bg-red-50 border-red-200'
                                  : priority === 'important'
                                  ? 'bg-yellow-50 border-yellow-200'
                                  : 'bg-blue-50 border-blue-200'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-foreground">{skill.name}</span>
                                {skill.isRequired && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground capitalize">
                                {skill.category}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific skills listed for this career.</p>
              )}
            </NBCard>

            {/* Learning Path */}
            {recommendation.recommendedPath && (
              <NBCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Learning Path</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{recommendation.recommendedPath.totalDuration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Estimated Cost</p>
                        <p className="text-sm text-muted-foreground">
                          ${recommendation.recommendedPath.estimatedCost?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {recommendation.recommendedPath.description}
                    </p>
                  </div>
                  
                  {recommendation.recommendedPath.outcomes && recommendation.recommendedPath.outcomes.length > 0 && (
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Learning Outcomes</h3>
                      <ul className="space-y-1">
                        {recommendation.recommendedPath.outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </NBCard>
            )}

            {/* Related Roles */}
            {recommendation.relatedRoles && recommendation.relatedRoles.length > 0 && (
              <NBCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Related Career Paths</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendation.relatedRoles.map((role, index) => (
                    <div
                      key={index}
                      className="p-3 bg-accent/20 rounded-lg text-center"
                    >
                      <span className="text-sm font-medium text-foreground">{role}</span>
                    </div>
                  ))}
                </div>
              </NBCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <NBCard className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h2>
              <div className="space-y-4">
                {/* Fit Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Fit Score</span>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-sm font-medium',
                    getFitScoreColor(recommendation.fitScore)
                  )}>
                    {recommendation.fitScore}%
                  </span>
                </div>

                {/* Growth Prospects */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Growth</span>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-sm font-medium capitalize',
                    getGrowthColor(recommendation.growthProspects)
                  )}>
                    {recommendation.growthProspects}
                  </span>
                </div>

                {/* Market Demand */}
                {recommendation.jobMarketData && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Demand</span>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-sm font-medium capitalize',
                      getDemandColor(recommendation.jobMarketData.demand)
                    )}>
                      {recommendation.jobMarketData.demand}
                    </span>
                  </div>
                )}
              </div>
            </NBCard>

            {/* Salary Information */}
            <NBCard className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Salary Range</span>
              </h2>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${recommendation.salaryRange.min.toLocaleString()} - ${recommendation.salaryRange.max.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {recommendation.salaryRange.period} • {recommendation.salaryRange.currency}
                  </div>
                </div>
                
                {recommendation.jobMarketData?.averageSalary && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Market Average</span>
                      <span className="font-medium text-foreground">
                        ${recommendation.jobMarketData.averageSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </NBCard>

            {/* Job Market Data */}
            {recommendation.jobMarketData && (
              <NBCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Market Insights</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry Growth</span>
                    <span className="font-medium text-foreground">
                      {recommendation.jobMarketData.industryGrowth}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Competition</span>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium capitalize',
                      recommendation.jobMarketData.competitiveness === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : recommendation.jobMarketData.competitiveness === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    )}>
                      {recommendation.jobMarketData.competitiveness}
                    </span>
                  </div>
                  
                  {recommendation.jobMarketData.locations && recommendation.jobMarketData.locations.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground mb-2 block">Top Locations</span>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.jobMarketData.locations.slice(0, 3).map((location, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </NBCard>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <NBButton 
                className="w-full"
                onClick={handleSelectCareer}
              >
                Select This Career
              </NBButton>
              <NBButton 
                variant="secondary" 
                className="w-full"
                onClick={handleSaveToFavorites}
              >
                Save to Favorites
              </NBButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};