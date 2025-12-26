import { Achievement, CompletedActivity, EnhancedUserProfile } from '../types';
import { GamificationService, XP_VALUES } from '../services/gamificationService';

/**
 * Utility functions for common gamification operations
 */

/**
 * Create a completed activity object
 */
export const createCompletedActivity = (
  resourceId: string,
  title: string,
  type: 'course' | 'certification' | 'project' | 'book' | 'video' | 'practice',
  timeSpent: number = 60,
  skillsGained: string[] = [],
  rating?: number,
  notes?: string
): CompletedActivity => {
  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    resourceId,
    title,
    type,
    completedAt: new Date(),
    timeSpent,
    skillsGained,
    rating,
    notes
  };
};

/**
 * Calculate XP for different activity types
 */
export const calculateActivityXP = (
  type: 'course' | 'certification' | 'project' | 'book' | 'video' | 'practice',
  timeSpent?: number,
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): number => {
  let baseXP = 0;
  
  switch (type) {
    case 'course':
      baseXP = XP_VALUES.COMPLETE_COURSE;
      break;
    case 'certification':
      baseXP = XP_VALUES.COMPLETE_CERTIFICATION;
      break;
    case 'project':
      baseXP = XP_VALUES.COMPLETE_PROJECT;
      break;
    case 'book':
      baseXP = 40;
      break;
    case 'video':
      baseXP = 20;
      break;
    case 'practice':
      baseXP = 30;
      break;
    default:
      baseXP = XP_VALUES.COMPLETE_COURSE;
  }

  // Difficulty multiplier
  let difficultyMultiplier = 1;
  if (difficulty === 'intermediate') difficultyMultiplier = 1.25;
  if (difficulty === 'advanced') difficultyMultiplier = 1.5;

  // Time bonus (for activities over 2 hours)
  let timeBonus = 0;
  if (timeSpent && timeSpent > 120) {
    timeBonus = Math.floor((timeSpent - 120) / 60) * 5; // 5 XP per extra hour
  }

  return Math.floor(baseXP * difficultyMultiplier) + timeBonus;
};

/**
 * Get achievement rarity color classes
 */
export const getAchievementRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-700',
        glow: 'shadow-gray-200'
      };
    case 'uncommon':
      return {
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-700',
        glow: 'shadow-green-200'
      };
    case 'rare':
      return {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        glow: 'shadow-blue-200'
      };
    case 'epic':
      return {
        bg: 'bg-purple-100',
        border: 'border-purple-300',
        text: 'text-purple-700',
        glow: 'shadow-purple-200'
      };
    case 'legendary':
      return {
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        glow: 'shadow-yellow-200'
      };
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-700',
        glow: 'shadow-gray-200'
      };
  }
};

/**
 * Format XP numbers with appropriate suffixes
 */
export const formatXP = (xp: number): string => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};

/**
 * Get level progress percentage
 */
export const getLevelProgress = (currentXP: number): number => {
  const levelInfo = GamificationService.calculateLevel(currentXP);
  if (levelInfo.xpToNextLevel === 0) return 100; // Max level
  
  // const currentLevelXP = levelInfo.totalXPRequired - levelInfo.xpToNextLevel;
  const nextLevelXP = levelInfo.totalXPRequired;
  const progressInLevel = currentXP - (nextLevelXP - levelInfo.xpToNextLevel);
  const levelXPRange = levelInfo.xpToNextLevel;
  
  return (progressInLevel / levelXPRange) * 100;
};

/**
 * Get streak status and motivation message
 */
export const getStreakStatus = (streakDays: number) => {
  if (streakDays === 0) {
    return {
      status: 'inactive',
      message: 'Start your learning streak today!',
      color: 'text-gray-500',
      icon: '📅'
    };
  }
  
  if (streakDays < 3) {
    return {
      status: 'starting',
      message: 'Great start! Keep building momentum.',
      color: 'text-orange-500',
      icon: '🌱'
    };
  }
  
  if (streakDays < 7) {
    return {
      status: 'building',
      message: 'You\'re building great habits!',
      color: 'text-yellow-500',
      icon: '🔥'
    };
  }
  
  if (streakDays < 30) {
    return {
      status: 'strong',
      message: 'Amazing consistency! You\'re on fire!',
      color: 'text-red-500',
      icon: '🚀'
    };
  }
  
  return {
    status: 'legendary',
    message: 'Legendary dedication! You\'re unstoppable!',
    color: 'text-purple-500',
    icon: '👑'
  };
};

/**
 * Calculate overall career readiness score
 */
export const calculateCareerReadiness = (profile: EnhancedUserProfile): number => {
  let score = 0;
  const maxScore = 100;
  
  // Assessment completion (20 points)
  if (profile.careerAssessment) score += 20;
  
  // Career path selection (15 points)
  if (profile.selectedCareerPath) score += 15;
  
  // Skills progress (25 points)
  const skillsCount = Object.keys(profile.progressData.skillProgress).length;
  score += Math.min(25, skillsCount * 5);
  
  // Learning activities (20 points)
  const activitiesCount = profile.progressData.learningActivities.length;
  score += Math.min(20, activitiesCount * 2);
  
  // Resume optimization (10 points)
  if (profile.resume) score += 10;
  
  // Achievements (10 points)
  const achievementScore = Math.min(10, profile.achievements.length);
  score += achievementScore;
  
  return Math.min(score, maxScore);
};

/**
 * Get next recommended action based on profile
 */
export const getNextRecommendedAction = (profile: EnhancedUserProfile): {
  action: string;
  description: string;
  xpReward: number;
  priority: 'high' | 'medium' | 'low';
} => {
  // Check what's missing and recommend next steps
  if (!profile.careerAssessment) {
    return {
      action: 'Complete Career Assessment',
      description: 'Take our comprehensive assessment to discover your ideal career path',
      xpReward: XP_VALUES.COMPLETE_ASSESSMENT,
      priority: 'high'
    };
  }
  
  if (profile.careerRecommendations.length === 0) {
    return {
      action: 'Generate Career Recommendations',
      description: 'Get personalized career suggestions based on your assessment',
      xpReward: 75,
      priority: 'high'
    };
  }
  
  if (!profile.selectedCareerPath) {
    return {
      action: 'Select Your Career Path',
      description: 'Choose your target career to create a personalized learning roadmap',
      xpReward: 50,
      priority: 'high'
    };
  }
  
  if (profile.progressData.learningActivities.length === 0) {
    return {
      action: 'Start Learning',
      description: 'Begin your first learning activity to build essential skills',
      xpReward: XP_VALUES.COMPLETE_COURSE,
      priority: 'high'
    };
  }
  
  if (!profile.resume) {
    return {
      action: 'Upload Resume',
      description: 'Upload your resume for personalized optimization suggestions',
      xpReward: XP_VALUES.RESUME_OPTIMIZATION,
      priority: 'medium'
    };
  }
  
  if (profile.streaks.currentStreak === 0) {
    return {
      action: 'Start Learning Streak',
      description: 'Complete a learning activity to start your daily streak',
      xpReward: XP_VALUES.DAILY_STREAK,
      priority: 'medium'
    };
  }
  
  // Default recommendation for active users
  return {
    action: 'Continue Learning',
    description: 'Keep building your skills with more learning activities',
    xpReward: XP_VALUES.COMPLETE_COURSE,
    priority: 'low'
  };
};

/**
 * Check if user should see onboarding gamification tutorial
 */
export const shouldShowGamificationTutorial = (profile: EnhancedUserProfile): boolean => {
  return (
    profile.achievements.length === 0 &&
    profile.progressData.learningActivities.length === 0 &&
    profile.experiencePoints === 0
  );
};

/**
 * Generate motivational message based on recent activity
 */
export const getMotivationalMessage = (profile: EnhancedUserProfile): string => {
  const recentActivities = profile.progressData.learningActivities.filter(
    activity => {
      const daysSince = (Date.now() - activity.completedAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }
  );
  
  const streak = profile.streaks.currentStreak;
  const level = profile.level;
  
  if (recentActivities.length === 0) {
    return "Ready to continue your career journey? Every step forward counts! 🚀";
  }
  
  if (streak >= 7) {
    return `${streak} days strong! Your consistency is paying off. Keep the momentum going! 🔥`;
  }
  
  if (level >= 10) {
    return `Level ${level} achieved! You're becoming a true career development expert! 👑`;
  }
  
  if (recentActivities.length >= 3) {
    return "You've been busy this week! Your dedication to growth is inspiring! ⭐";
  }
  
  return "Great progress! Every skill you build brings you closer to your career goals! 💪";
};