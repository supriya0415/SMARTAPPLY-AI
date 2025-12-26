import { useUserStore } from '../stores/userStore';
import { GamificationService, XP_VALUES } from '../services/gamificationService';
import { CompletedActivity, CareerAssessmentData } from '../types';

/**
 * Integration utilities for connecting gamification with other services
 */

/**
 * Process career assessment completion and award appropriate gamification rewards
 */
export const processAssessmentCompletion = (assessmentData: CareerAssessmentData) => {
  const store = useUserStore.getState();
  
  // Award XP for completing assessment
  store.awardExperience(XP_VALUES.COMPLETE_ASSESSMENT, 'Completed career assessment');
  
  // Check for assessment-related achievements
  store.checkAndAwardAchievements('assessment_completed', assessmentData);
  
  // Update milestone progress
  store.updateMilestoneProgress();
  
  console.log('🎯 Assessment completion processed with gamification rewards');
};

/**
 * Process career recommendation generation and award rewards
 */
export const processRecommendationGeneration = (recommendationCount: number) => {
  const store = useUserStore.getState();
  
  // Award XP for generating recommendations
  store.awardExperience(75, 'Generated career recommendations');
  
  // Check for recommendation-related achievements
  store.checkAndAwardAchievements('recommendations_generated', { count: recommendationCount });
  
  // Update milestone progress
  store.updateMilestoneProgress();
  
  console.log('🗺️ Career recommendations processed with gamification rewards');
};

/**
 * Process learning activity completion
 */
export const processLearningActivity = (
  title: string,
  type: 'course' | 'certification' | 'project' | 'book' | 'video' | 'practice',
  timeSpent: number = 60,
  skillsGained: string[] = []
) => {
  const store = useUserStore.getState();
  
  const activity: CompletedActivity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    resourceId: `resource_${type}_${Date.now()}`,
    title,
    type,
    completedAt: new Date(),
    timeSpent,
    skillsGained
  };
  
  // Process the activity through the gamification system
  store.processActivityCompletion(activity);
  
  console.log(`📚 Learning activity "${title}" processed with gamification rewards`);
};

/**
 * Process resume optimization and award rewards
 */
export const processResumeOptimization = (atsScoreImprovement?: number) => {
  const store = useUserStore.getState();
  
  // Award XP for resume optimization
  store.awardExperience(XP_VALUES.RESUME_OPTIMIZATION, 'Optimized resume');
  
  // Check for resume-related achievements
  if (atsScoreImprovement && atsScoreImprovement >= 20) {
    store.checkAndAwardAchievements('ats_improvement', { improvement: atsScoreImprovement });
  }
  
  // Update milestone progress
  store.updateMilestoneProgress();
  
  console.log('📄 Resume optimization processed with gamification rewards');
};

/**
 * Process chat interaction and award rewards
 */
export const processChatInteraction = (conversationId: string) => {
  const store = useUserStore.getState();
  const conversations = store.conversations;
  
  // Award XP for chat interaction
  store.awardExperience(XP_VALUES.CHAT_INTERACTION, 'AI mentor interaction');
  
  // Check if user has reached chat milestones
  const conversationCount = conversations.length;
  if (conversationCount >= 10) {
    store.checkAndAwardAchievements('chat_milestone', { conversationCount });
  }
  
  console.log('💬 Chat interaction processed with gamification rewards');
};

/**
 * Process profile update and award rewards
 */
export const processProfileUpdate = () => {
  const store = useUserStore.getState();
  
  // Award XP for profile update
  store.awardExperience(XP_VALUES.PROFILE_UPDATE, 'Updated profile');
  
  // Check for profile-related achievements
  store.checkAndAwardAchievements('profile_updated');
  
  // Update milestone progress
  store.updateMilestoneProgress();
  
  console.log('👤 Profile update processed with gamification rewards');
};

/**
 * Initialize gamification for a new or existing user
 */
export const initializeUserGamification = () => {
  const store = useUserStore.getState();
  
  // Initialize gamification system
  store.initializeGamification();
  
  console.log('🎮 Gamification system initialized for user');
};

/**
 * Get current gamification summary for display
 */
export const getGamificationSummary = () => {
  const store = useUserStore.getState();
  const profile = store.enhancedProfile;
  
  if (!profile) return null;
  
  const levelInfo = store.getLevelInfo();
  const status = GamificationService.getGamificationStatus(profile);
  
  return {
    level: levelInfo?.currentLevel || 1,
    xp: profile.experiencePoints || 0,
    streak: profile.streaks?.currentStreak || 0,
    achievements: profile.achievements?.length || 0,
    nextMilestone: status?.nextMilestone,
    progressToNextLevel: status?.progressToNextLevel || 0
  };
};

/**
 * Check if user should see gamification onboarding
 */
export const shouldShowGamificationOnboarding = (): boolean => {
  const store = useUserStore.getState();
  const profile = store.enhancedProfile;
  
  if (!profile) return true;
  
  return (
    profile.achievements.length === 0 &&
    profile.progressData.learningActivities.length === 0 &&
    profile.experiencePoints === 0
  );
};

/**
 * Trigger celebration for major achievements
 */
export const triggerAchievementCelebration = (achievementId: string) => {
  const store = useUserStore.getState();
  const profile = store.enhancedProfile;
  
  if (!profile) return;
  
  const achievement = profile.achievements.find(a => a.id === achievementId);
  if (!achievement) return;
  
  // This could trigger confetti, sound effects, or other celebration UI
  console.log(`🎉 Celebrating achievement: ${achievement.title}!`);
  
  // You could dispatch a custom event here for UI components to listen to
  window.dispatchEvent(new CustomEvent('gamification:achievement', {
    detail: { achievement }
  }));
};

/**
 * Trigger celebration for level up
 */
export const triggerLevelUpCelebration = (newLevel: number) => {
  const levelInfo = GamificationService.calculateLevel(0); // This will be recalculated with actual XP
  
  console.log(`🚀 Level up! Reached level ${newLevel}: ${levelInfo.levelTitle}`);
  
  // Dispatch custom event for UI components
  window.dispatchEvent(new CustomEvent('gamification:levelup', {
    detail: { level: newLevel, title: levelInfo.levelTitle }
  }));
};