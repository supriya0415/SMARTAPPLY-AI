import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { AchievementBadge } from '../components/gamification/AchievementBadge';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { ArrowLeft, Award, Trophy, Star, Calendar } from 'lucide-react';
import { Achievement } from '../lib/types';

export const AchievementsPage: React.FC = () => {
  const navigate = useNavigate();
  const { enhancedProfile } = useUserStore();

  const achievements = enhancedProfile?.achievements || [];
  const totalXP = achievements.reduce((sum, achievement) => sum + achievement.experiencePoints, 0);
  
  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    const category = achievement.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  // Sort achievements by date (newest first)
  const recentAchievements = [...achievements]
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 5);

  const categoryIcons = {
    milestone: Trophy,
    learning: Star,
    progress: Award,
    general: Award
  };

  const categoryColors = {
    milestone: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    learning: 'bg-blue-100 text-blue-700 border-blue-200',
    progress: 'bg-green-100 text-green-700 border-green-200',
    general: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
            <p className="text-muted-foreground">
              Your learning milestones and accomplishments
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Stats */}
            <NBCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Achievement Overview</h2>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-foreground">{achievements.length} Earned</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{achievements.length}</div>
                  <div className="text-sm text-muted-foreground">Total Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{totalXP}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(achievementsByCategory).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
              </div>
            </NBCard>

            {/* Achievements by Category */}
            {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Award;
              const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;

              return (
                <NBCard key={category} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg border ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground capitalize">
                        {category} Achievements
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryAchievements.length} achievement{categoryAchievements.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categoryAchievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <AchievementBadge 
                          achievement={achievement} 
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-yellow-600 font-medium">
                              +{achievement.experiencePoints} XP
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(achievement.earnedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </NBCard>
              );
            })}

            {/* No Achievements State */}
            {achievements.length === 0 && (
              <NBCard className="p-8 text-center">
                <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey to earn your first achievements!
                </p>
                <NBButton onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </NBButton>
              </NBCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <NBCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </h3>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <AchievementBadge 
                        achievement={achievement} 
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </NBCard>
            )}

            {/* Quick Actions */}
            <NBCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <NBButton 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/learning-roadmap')}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Continue Learning
                </NBButton>
                <NBButton 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Dashboard
                </NBButton>
              </div>
            </NBCard>
          </div>
        </div>
      </main>
    </div>
  );
};