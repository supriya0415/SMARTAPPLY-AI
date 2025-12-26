import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  CheckSquare, 
  GraduationCap, 
  TrendingUp,
  Target,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { LearningResourcesPanel } from './LearningResourcesPanel';
import { LearningChecklist } from './LearningChecklist';
import { StudyGuides } from './StudyGuides';
import { ProgressTrackingService, ProgressStats } from '@/lib/services/progressTrackingService';
import { useUserStore } from '@/lib/stores/userStore';

interface LearningResourcesDashboardProps {
  domain: string;
  subfield?: string;
  targetRole?: string;
  className?: string;
}

export const LearningResourcesDashboard: React.FC<LearningResourcesDashboardProps> = ({
  domain,
  subfield,
  targetRole,
  className = ''
}) => {
  const { profile, enhancedProfile } = useUserStore();
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [loading, setLoading] = useState(true);

  // Get user ID from profile or enhanced profile
  const userId = enhancedProfile?.name || profile?.name || 'anonymous';

  useEffect(() => {
    loadProgressStats();
  }, [domain, userId]);

  const loadProgressStats = async () => {
    try {
      setLoading(true);
      const stats = await ProgressTrackingService.getProgressStats(userId, domain);
      setProgressStats(stats);
    } catch (error) {
      console.error('Error loading progress stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const userName = enhancedProfile?.name || profile?.name || 'there';
    const domainName = domain.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (targetRole) {
      return `Welcome ${userName}! Here are your learning resources for becoming a ${targetRole} in ${domainName}.`;
    } else {
      return `Welcome ${userName}! Explore learning resources in ${domainName} to advance your career.`;
    }
  };

  const getProgressInsights = () => {
    if (!progressStats) return [];

    const insights = [];

    if (progressStats.currentStreak > 0) {
      insights.push({
        type: 'streak',
        message: `🔥 You're on a ${progressStats.currentStreak}-day learning streak!`,
        color: 'text-orange-600'
      });
    }

    if (progressStats.weeklyProgress > 0) {
      insights.push({
        type: 'weekly',
        message: `📚 You've completed ${progressStats.weeklyProgress} resources this week`,
        color: 'text-blue-600'
      });
    }

    if (progressStats.completionRate > 80) {
      insights.push({
        type: 'completion',
        message: `⭐ Excellent completion rate of ${Math.round(progressStats.completionRate)}%!`,
        color: 'text-green-600'
      });
    }

    if (progressStats.skillsAcquired >= 5) {
      insights.push({
        type: 'skills',
        message: `🎯 You've acquired ${progressStats.skillsAcquired} skills so far`,
        color: 'text-purple-600'
      });
    }

    return insights;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const insights = getProgressInsights();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Learning Resources
          </CardTitle>
          <CardDescription>
            {getWelcomeMessage()}
          </CardDescription>
        </CardHeader>
        
        {/* Progress Overview */}
        {progressStats && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {progressStats.totalResourcesCompleted}
                </div>
                <div className="text-sm text-blue-700">Resources Completed</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {progressStats.skillsAcquired}
                </div>
                <div className="text-sm text-green-700">Skills Acquired</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor(progressStats.totalTimeSpent / 60)}h
                </div>
                <div className="text-sm text-purple-700">Time Invested</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {progressStats.currentStreak}
                </div>
                <div className="text-sm text-orange-700">Day Streak</div>
              </div>
            </div>

            {/* Progress Insights */}
            {insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Your Progress</h4>
                <div className="flex flex-wrap gap-2">
                  {insights.map((insight, index) => (
                    <Badge key={index} variant="outline" className={`${insight.color} border-current`}>
                      {insight.message}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Study Guides
          </TabsTrigger>
        </TabsList>

        {/* Learning Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <LearningResourcesPanel 
            domain={domain}
            subfield={subfield}
          />
        </TabsContent>

        {/* Learning Checklist Tab */}
        <TabsContent value="checklist" className="mt-6">
          {targetRole ? (
            <LearningChecklist
              domain={domain}
              subfield={subfield}
              targetRole={targetRole}
              userId={userId}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a Target Role
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Choose a specific career role to get a personalized learning checklist.
                  </p>
                  <Button onClick={() => setActiveTab('resources')}>
                    Browse Resources Instead
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Study Guides Tab */}
        <TabsContent value="guides" className="mt-6">
          <StudyGuides
            domain={domain}
            subfield={subfield}
            targetRole={targetRole}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('resources')}
            >
              <BookOpen className="h-6 w-6" />
              <span className="font-medium">Find New Resources</span>
              <span className="text-xs text-gray-500">Discover courses and materials</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('checklist')}
            >
              <CheckSquare className="h-6 w-6" />
              <span className="font-medium">Track Progress</span>
              <span className="text-xs text-gray-500">Update your learning checklist</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('guides')}
            >
              <GraduationCap className="h-6 w-6" />
              <span className="font-medium">Study Guides</span>
              <span className="text-xs text-gray-500">Follow structured learning paths</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Showcase */}
      {progressStats && (progressStats.totalResourcesCompleted > 0 || progressStats.skillsAcquired > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progressStats.totalResourcesCompleted >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="font-medium">Learning Enthusiast</div>
                    <div className="text-sm text-gray-600">Completed 5+ resources</div>
                  </div>
                </div>
              )}
              
              {progressStats.skillsAcquired >= 10 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-medium">Skill Master</div>
                    <div className="text-sm text-gray-600">Acquired 10+ skills</div>
                  </div>
                </div>
              )}
              
              {progressStats.currentStreak >= 7 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="font-medium">Week Warrior</div>
                    <div className="text-sm text-gray-600">7-day learning streak</div>
                  </div>
                </div>
              )}
              
              {Math.floor(progressStats.totalTimeSpent / 60) >= 100 && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <div className="font-medium">Time Investor</div>
                    <div className="text-sm text-gray-600">100+ hours of learning</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};