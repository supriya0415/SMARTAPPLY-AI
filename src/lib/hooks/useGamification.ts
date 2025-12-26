import { useCallback } from 'react';
import { useUserStore } from '../stores/userStore';
import { GamificationService } from '../services/gamificationService';
import { CompletedActivity, Achievement } from '../types';

export const useGamification = () => {
  const {
    enhancedProfile,
    processActivityCompletion,
    awardExperience,
    checkAndAwardAchievements,
    updateMilestoneProgress,
    initializeGamification,
    getLevelInfo
  } = useUserStore();

  // Complete an activity and process all gamification rewards
  const completeActivity = useCallback((activity: CompletedActivity) => {
    processActivityCompletion(activity);
    
    // Also check for additional achievements that might be triggered
    checkAndAwardAchievements('activity_completed', activity);
  }, [processActivityCompletion, checkAndAwardAchievements]);

  // Award XP for various actions
  const awardXP = useCallback((amount: number, reason: string) => {
    awardExperience(amount, reason);
    
    // Check for achievements after XP award
    checkAndAwardAchievements('xp_awarded', { amount, reason });
  }, [awardExperience, checkAndAwardAchievements]);

  // Complete assessment and trigger related achievements
  const completeAssessment = useCallback(() => {
    awardXP(100, 'Completed career assessment');
    checkAndAwardAchievements('assessment_completed');
    updateMilestoneProgress();
  }, [awardXP, checkAndAwardAchievements, updateMilestoneProgress]);

  // Generate career recommendations and trigger achievements
  const generateRecommendations = useCallback(() => {
    awardXP(75, 'Generated career recommendations');
    checkAndAwardAchievements('recommendations_generated');
    updateMilestoneProgress();
  }, [awardXP, checkAndAwardAchievements, updateMilestoneProgress]);

  // Optimize resume and trigger achievements
  const optimizeResume = useCallback((atsImprovement?: number) => {
    awardXP(50, 'Optimized resume');
    if (atsImprovement && atsImprovement >= 20) {
      checkAndAwardAchievements('ats_improvement', { improvement: atsImprovement });
    }
    updateMilestoneProgress();
  }, [awardXP, checkAndAwardAchievements, updateMilestoneProgress]);

  // Chat interaction
  const recordChatInteraction = useCallback((conversationCount?: number) => {
    awardXP(10, 'AI mentor interaction');
    if (conversationCount && conversationCount >= 10) {
      checkAndAwardAchievements('chat_milestone', { conversationCount });
    }
  }, [awardXP, checkAndAwardAchievements]);

  // Update profile
  const updateProfile = useCallback(() => {
    awardXP(25, 'Updated profile');
    checkAndAwardAchievements('profile_updated');
    updateMilestoneProgress();
  }, [awardXP, checkAndAwardAchievements, updateMilestoneProgress]);

  // Get current gamification status
  const getGamificationStatus = useCallback(() => {
    if (!enhancedProfile) return null;
    return GamificationService.getGamificationStatus(enhancedProfile);
  }, [enhancedProfile]);

  // Check if user leveled up recently
  const checkRecentLevelUp = useCallback((): boolean => {
    const levelInfo = getLevelInfo();
    if (!levelInfo || !enhancedProfile) return false;
    
    // Check if level was updated in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return enhancedProfile.updatedAt > fiveMinutesAgo && levelInfo.currentLevel > 1;
  }, [getLevelInfo, enhancedProfile]);

  // Get recent achievements (last 24 hours)
  const getRecentAchievements = useCallback((): Achievement[] => {
    if (!enhancedProfile) return [];
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return enhancedProfile.achievements.filter(achievement => 
      achievement.earnedAt > oneDayAgo
    ).sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  }, [enhancedProfile]);

  // Initialize gamification for new users
  const initializeForUser = useCallback(() => {
    initializeGamification();
  }, [initializeGamification]);

  return {
    // State
    profile: enhancedProfile,
    levelInfo: getLevelInfo(),
    gamificationStatus: getGamificationStatus(),
    recentAchievements: getRecentAchievements(),
    hasRecentLevelUp: checkRecentLevelUp(),
    
    // Actions
    completeActivity,
    awardXP,
    completeAssessment,
    generateRecommendations,
    optimizeResume,
    recordChatInteraction,
    updateProfile,
    initializeForUser,
    
    // Utilities
    isInitialized: !!enhancedProfile?.currentMilestones?.length,
    currentLevel: enhancedProfile?.level || 1,
    currentXP: enhancedProfile?.experiencePoints || 0,
    currentStreak: enhancedProfile?.streaks?.currentStreak || 0,
    totalAchievements: enhancedProfile?.achievements?.length || 0
  };
};

// Hook for displaying gamification notifications
export const useGamificationNotifications = () => {
  const { enhancedProfile } = useUserStore();

  const getNotifications = useCallback(() => {
    if (!enhancedProfile) return [];

    const notifications = [];
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Recent achievements
    const recentAchievements = enhancedProfile.achievements.filter(
      achievement => achievement.earnedAt > fiveMinutesAgo
    );

    recentAchievements.forEach(achievement => {
      notifications.push({
        id: `achievement_${achievement.id}`,
        type: 'achievement' as const,
        title: 'Achievement Unlocked!',
        message: `${achievement.title} - ${achievement.description}`,
        icon: achievement.badgeIcon,
        timestamp: achievement.earnedAt,
        xp: achievement.experiencePoints
      });
    });

    // Level up notification
    const levelInfo = GamificationService.calculateLevel(enhancedProfile.experiencePoints);
    if (enhancedProfile.updatedAt > fiveMinutesAgo && levelInfo.currentLevel > 1) {
      notifications.push({
        id: `levelup_${levelInfo.currentLevel}`,
        type: 'levelup' as const,
        title: 'Level Up!',
        message: `You've reached level ${levelInfo.currentLevel} - ${levelInfo.levelTitle}`,
        icon: '🎉',
        timestamp: enhancedProfile.updatedAt,
        level: levelInfo.currentLevel
      });
    }

    // Streak notifications
    if (enhancedProfile.streaks.currentStreak > 0 && enhancedProfile.streaks.currentStreak % 7 === 0) {
      notifications.push({
        id: `streak_${enhancedProfile.streaks.currentStreak}`,
        type: 'streak' as const,
        title: 'Streak Milestone!',
        message: `${enhancedProfile.streaks.currentStreak} day learning streak! Keep it up!`,
        icon: '🔥',
        timestamp: enhancedProfile.streaks.lastActivityDate,
        streak: enhancedProfile.streaks.currentStreak
      });
    }

    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [enhancedProfile]);

  return {
    notifications: getNotifications(),
    hasNotifications: getNotifications().length > 0
  };
};