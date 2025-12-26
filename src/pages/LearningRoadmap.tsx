import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { useGamification } from '../lib/hooks/useGamification';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import PlatformLinkCard from '../components/PlatformLinkCard';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  DollarSign, 
  Target, 
  CheckCircle,
  Play,
  Award,
  TrendingUp,
  BarChart3,
  Star,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export const LearningRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const { enhancedProfile, setEnhancedProfile } = useUserStore();
  const { awardXP, completeActivity } = useGamification();
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);


  useEffect(() => {
    const generateMissingRoadmap = async () => {
      if (enhancedProfile?.selectedCareerPath && !enhancedProfile?.learningRoadmap) {
        console.log('Learning roadmap missing, generating...');
        
        try {
          // Find the selected career recommendation
          const selectedCareer = enhancedProfile.careerRecommendations?.find(
            rec => rec.id === enhancedProfile.selectedCareerPath
          );
          
          if (selectedCareer) {
            // Create a basic learning roadmap from the career's recommended path
            const basicRoadmap = {
              id: `roadmap_${selectedCareer.id}`,
              title: `${selectedCareer.title} Learning Path`,
              description: `Personalized learning path for ${selectedCareer.title}`,
              totalDuration: selectedCareer.recommendedPath?.totalDuration || '6-12 months',
              phases: selectedCareer.recommendedPath?.phases || [
                {
                  id: 'phase_1',
                  title: 'Foundation Skills',
                  description: 'Build fundamental skills required for this career',
                  duration: '2-3 months',
                  priority: 'critical' as const,
                  resources: [],
                  skills: selectedCareer.requiredSkills?.slice(0, 3).map(s => s.name) || [],
                  order: 1
                }
              ],
              estimatedCost: selectedCareer.recommendedPath?.estimatedCost || 2000,
              difficulty: selectedCareer.recommendedPath?.difficulty || 'intermediate' as const,
              prerequisites: selectedCareer.recommendedPath?.prerequisites || [],
              outcomes: selectedCareer.recommendedPath?.outcomes || [`Job-ready for ${selectedCareer.title}`]
            };
            
            // Update the enhanced profile with the learning roadmap
            const updatedProfile = {
              ...enhancedProfile,
              learningRoadmap: basicRoadmap,
              updatedAt: new Date()
            };
            
            setEnhancedProfile(updatedProfile);
            toast.success('Learning roadmap generated successfully!');
          }
        } catch (error) {
          console.error('Failed to generate learning roadmap:', error);
          toast.error('Failed to generate learning roadmap. Please try again.');
        }
      }
    };

    if (!enhancedProfile?.selectedCareerPath) {
      toast.error('Please select a career path first');
      navigate('/dashboard');
    } else {
      generateMissingRoadmap();
    }
  }, [enhancedProfile, navigate, setEnhancedProfile]);

  if (!enhancedProfile?.learningRoadmap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <div className="space-y-4">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">No Learning Roadmap</h2>
              <p className="text-muted-foreground mt-2">
                Please select a career path to generate your personalized learning roadmap.
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

  const roadmap = enhancedProfile.learningRoadmap;
  const selectedCareer = enhancedProfile.careerRecommendations.find(
    rec => rec.id === enhancedProfile.selectedCareerPath
  );



  const handleCompletePhase = (phaseId: string, phaseTitle: string) => {
    setCompletedPhases(prev => [...prev, phaseId]);
    
    // Award XP and create activity
    completeActivity({
      id: `phase_${phaseId}_${Date.now()}`,
      resourceId: phaseId,
      title: `Completed: ${phaseTitle}`,
      type: 'course',
      completedAt: new Date(),
      timeSpent: 120, // 2 hours average
      skillsGained: roadmap.phases.find(p => p.id === phaseId)?.skills || []
    });
    
    toast.success(`🎉 Phase completed: ${phaseTitle}!`);
  };

  const getPhaseProgress = () => {
    const totalPhases = roadmap.phases.length;
    const completed = completedPhases.length;
    return totalPhases > 0 ? (completed / totalPhases) * 100 : 0;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'important': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'nice-to-have': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
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
              <h1 className="text-2xl font-bold text-foreground">Learning Roadmap</h1>
              <p className="text-muted-foreground">
                {selectedCareer?.title || 'Your Career Path'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roadmap Overview */}
            <NBCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {roadmap.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground">
                    {Math.round(getPhaseProgress())}% Complete
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${getPhaseProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {roadmap.description}
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Duration</p>
                    <p className="text-sm text-muted-foreground">{roadmap.totalDuration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Est. Cost</p>
                    <p className="text-sm text-muted-foreground">
                      ${roadmap.estimatedCost?.toLocaleString() || 'Free'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Difficulty</p>
                    <p className="text-sm text-muted-foreground capitalize">{roadmap.difficulty}</p>
                  </div>
                </div>
              </div>
            </NBCard>

            {/* Learning Phases */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Learning Phases</h2>
              
              {roadmap.phases
                .sort((a, b) => a.order - b.order)
                .map((phase, index) => {
                  const isCompleted = completedPhases.includes(phase.id);
                  const isActive = index === 0 || completedPhases.includes(roadmap.phases[index - 1]?.id);
                  
                  return (
                    <NBCard key={phase.id} className={cn(
                      'p-6 transition-all duration-200',
                      isCompleted && 'bg-green-50 border-green-200',
                      isActive && !isCompleted && 'border-blue-200'
                    )}>
                      <div className="flex items-start space-x-4">
                        {/* Phase Number */}
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                          isCompleted 
                            ? 'bg-green-500 text-white'
                            : isActive 
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        )}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>

                        {/* Phase Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {phase.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium border',
                                getPriorityColor(phase.priority)
                              )}>
                                {phase.priority}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {phase.duration}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">
                            {phase.description}
                          </p>

                          {/* Skills */}
                          {phase.skills && phase.skills.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-foreground mb-2">Skills You'll Learn</h4>
                              <div className="flex flex-wrap gap-2">
                                {phase.skills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resources */}
                          {phase.resources && phase.resources.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-foreground mb-2">Learning Resources</h4>
                              <div className="space-y-3">
                                {phase.resources.slice(0, 2).map((resource, resourceIndex) => (
                                  <PlatformLinkCard
                                    key={resourceIndex}
                                    resource={resource}
                                    className="text-sm"
                                  />
                                ))}

                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            {!isCompleted && isActive && (
                              <>

                                <NBButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleCompletePhase(phase.id, phase.title)}
                                  className="flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Mark Complete</span>
                                </NBButton>
                              </>
                            )}
                            
                            {isCompleted && (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            )}
                            
                            {!isActive && !isCompleted && (
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Complete previous phases to unlock</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </NBCard>
                  );
                })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <NBCard className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Progress Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phases Completed</span>
                  <span className="font-medium text-foreground">
                    {completedPhases.length} / {roadmap.phases.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="font-medium text-foreground">
                    {Math.round(getPhaseProgress())}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getPhaseProgress()}%` }}
                  />
                </div>
              </div>
            </NBCard>

            {/* Prerequisites */}
            {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
              <NBCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {roadmap.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </NBCard>
            )}

            {/* Learning Outcomes */}
            {roadmap.outcomes && roadmap.outcomes.length > 0 && (
              <NBCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Learning Outcomes</h2>
                <ul className="space-y-2">
                  {roadmap.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </NBCard>
            )}

            {/* Quick Actions */}
            <NBCard className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <NBButton 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Dashboard
                </NBButton>
                <NBButton 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/achievements')}
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Achievements
                </NBButton>
              </div>
            </NBCard>
          </div>
        </div>
      </main>
    </div>
  );
};