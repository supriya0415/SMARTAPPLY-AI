import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { useGamification } from '../lib/hooks/useGamification';
import { GamificationDashboard } from './gamification/GamificationDashboard';
import { ProgressRoadmapVisualization } from './ProgressRoadmapVisualization';
import { ProgressAnalytics } from './ProgressAnalytics';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  Calendar,
  Clock,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface ProgressDashboardProps {
  className?: string;
  compact?: boolean;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  className,
  compact = false
}) => {
  const navigate = useNavigate();
  const { enhancedProfile, setEnhancedProfile } = useUserStore();
  const {
    profile,
    currentLevel,
    totalAchievements,
    recentAchievements,
    awardXP,
    completeActivity
  } = useGamification();

  // Initialize gamification if not already done
  React.useEffect(() => {
    if (enhancedProfile && !enhancedProfile.currentMilestones?.length) {
      // Initialize gamification system
      const initializeGamification = async () => {
        try {
          const { GamificationService } = await import('../lib/services/gamificationService');
          
          // Initialize basic gamification data
          const defaultMilestones = GamificationService.generateDefaultMilestones();
          const initialProgressData = {
            overallProgress: 0,
            skillProgress: {},
            milestoneProgress: {},
            learningActivities: [],
            lastUpdated: new Date()
          };
          const initialStreaks = {
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: new Date(),
            streakType: 'daily' as const,
            streakGoal: 7
          };
          
          const initializedProfile = {
            ...enhancedProfile,
            currentMilestones: defaultMilestones,
            progressData: enhancedProfile.progressData || initialProgressData,
            achievements: enhancedProfile.achievements || [],
            level: enhancedProfile.level || 1,
            experiencePoints: enhancedProfile.experiencePoints || 0,
            badges: enhancedProfile.badges || [],
            streaks: enhancedProfile.streaks || initialStreaks,
            updatedAt: new Date()
          };
          
          setEnhancedProfile(initializedProfile);
          toast.success('🎮 Gamification system initialized!');
        } catch (error) {
          console.error('Error initializing gamification:', error);
        }
      };
      
      initializeGamification();
    }
  }, [enhancedProfile, setEnhancedProfile]);

  // Handler functions
  const handleStartLearning = () => {
    if (enhancedProfile?.learningRoadmap) {
      navigate('/learning-roadmap');
    } else {
      toast.info('Complete your career assessment to get a personalized learning roadmap');
      navigate('/assessment');
    }
  };

  const handleViewAchievements = () => {
    toast.info('Achievement gallery coming soon!');
  };

  const handleCompleteActivity = () => {
    // Simulate completing an activity for demo purposes
    const demoActivity = {
      id: `activity_${Date.now()}`,
      resourceId: 'demo_resource',
      title: 'Demo Learning Activity',
      type: 'course' as const,
      completedAt: new Date(),
      timeSpent: 30,
      skillsGained: ['Problem Solving'],
      rating: 5
    };
    
    completeActivity(demoActivity);
    awardXP(50, 'Completed demo activity');
    toast.success('🎉 Activity completed! +50 XP earned');
  };

  const handleViewRoadmap = () => {
    if (enhancedProfile?.learningRoadmap) {
      navigate('/learning-roadmap');
    } else {
      toast.info('Select a career path to generate your learning roadmap');
      navigate('/career-dashboard');
    }
  };

  if (!enhancedProfile || !profile) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-8 text-center', className)}>
        <div className="text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-lg font-medium">No Progress Data</div>
          <div className="text-sm mb-4">Complete your career assessment to start tracking progress</div>
          <NBButton onClick={() => navigate('/assessment')}>
            Start Assessment
          </NBButton>
        </div>
      </div>
    );
  }

  const progressData = enhancedProfile.progressData;
  const overallProgress = progressData?.overallProgress || 0;
  const skillsInProgress = Object.keys(progressData?.skillProgress || {}).length;
  const completedActivities = progressData?.learningActivities?.length || 0;
  const completedMilestones = enhancedProfile.currentMilestones?.filter(m => m.isCompleted).length || 0;
  const totalMilestones = enhancedProfile.currentMilestones?.length || 0;

  if (compact) {
    return (
      <NBCard className={cn('p-4', className)}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
            <div className="text-xs text-gray-600">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedMilestones}/{totalMilestones}</div>
            <div className="text-xs text-gray-600">Milestones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{currentLevel}</div>
            <div className="text-xs text-gray-600">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalAchievements}</div>
            <div className="text-xs text-gray-600">Achievements</div>
          </div>
        </div>
      </NBCard>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Your Progress Dashboard</h1>
        <p className="text-blue-100">
          Track your career development journey and celebrate your achievements
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <NBCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewRoadmap}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-3xl font-bold text-blue-600">{overallProgress}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <span>View Roadmap</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </NBCard>

        {/* Milestones */}
        <NBCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewRoadmap}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones</p>
              <p className="text-3xl font-bold text-green-600">
                {completedMilestones}/{totalMilestones}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <span>View Milestones</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </NBCard>

        {/* Learning Activities */}
        <NBCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStartLearning}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities Completed</p>
              <p className="text-3xl font-bold text-purple-600">{completedActivities}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              {skillsInProgress} skills in progress
            </div>
            <div className="flex items-center text-xs text-purple-600">
              <span>Start Learning</span>
              <Play className="w-3 h-3 ml-1" />
            </div>
          </div>
        </NBCard>

        {/* Achievements */}
        <NBCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewAchievements}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-3xl font-bold text-yellow-600">{totalAchievements}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              {recentAchievements.length} earned recently
            </div>
            <div className="flex items-center text-xs text-yellow-600">
              <span>View All</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </NBCard>
      </div>

      {/* Progress Roadmap Visualization */}
      <NBCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Learning Roadmap Progress</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last updated: {progressData?.lastUpdated ? new Date(progressData.lastUpdated).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
        <ProgressRoadmapVisualization 
          learningRoadmap={enhancedProfile.learningRoadmap}
          progressData={progressData}
        />
      </NBCard>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gamification Dashboard */}
        <div>
          <GamificationDashboard />
        </div>

        {/* Progress Analytics */}
        <div>
          <ProgressAnalytics 
            progressData={progressData}
            achievements={enhancedProfile.achievements}
            milestones={enhancedProfile.currentMilestones}
          />
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <NBCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="flex space-x-2">
            <NBButton
              variant="secondary"
              size="sm"
              onClick={handleCompleteActivity}
              className="flex items-center space-x-1"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Activity</span>
            </NBButton>
            <NBButton
              size="sm"
              onClick={handleStartLearning}
              className="flex items-center space-x-1"
            >
              <Play className="w-4 h-4" />
              <span>Start Learning</span>
            </NBButton>
          </div>
        </div>
        <RecentActivityTimeline 
          activities={progressData?.learningActivities?.slice(-5) || []}
          achievements={recentAchievements.slice(0, 3)}
        />
      </NBCard>

      {/* Quick Actions */}
      <NBCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NBButton
            variant="secondary"
            onClick={() => navigate('/career-dashboard')}
            className="flex items-center justify-center space-x-2 p-4"
          >
            <Target className="w-5 h-5" />
            <span>View Career Recommendations</span>
          </NBButton>
          
          <NBButton
            variant="secondary"
            onClick={handleViewRoadmap}
            className="flex items-center justify-center space-x-2 p-4"
          >
            <BookOpen className="w-5 h-5" />
            <span>Learning Roadmap</span>
          </NBButton>
          
          <NBButton
            variant="secondary"
            onClick={() => navigate('/assessment')}
            className="flex items-center justify-center space-x-2 p-4"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Retake Assessment</span>
          </NBButton>
        </div>
      </NBCard>
    </div>
  );
};

// Recent Activity Timeline Component
interface RecentActivityTimelineProps {
  activities: any[];
  achievements: any[];
}

const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  achievements
}) => {
  // Combine and sort activities and achievements by date
  const timelineItems = [
    ...activities.map(activity => ({
      type: 'activity' as const,
      date: new Date(activity.completedAt),
      title: activity.title,
      description: `Completed ${activity.type}`,
      icon: BookOpen,
      color: 'blue'
    })),
    ...achievements.map(achievement => ({
      type: 'achievement' as const,
      date: new Date(achievement.earnedAt),
      title: achievement.title,
      description: achievement.description,
      icon: Award,
      color: 'yellow'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  if (timelineItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No recent activity</p>
        <p className="text-sm">Complete learning activities to see your progress here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            item.color === 'blue' ? 'bg-blue-100' : 'bg-yellow-100'
          )}>
            <item.icon className={cn(
              'w-5 h-5',
              item.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
              <span className="text-xs text-gray-500">
                {item.date.toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};