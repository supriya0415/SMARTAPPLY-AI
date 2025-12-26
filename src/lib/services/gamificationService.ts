import { 
  Achievement, 
  Milestone, 
  StreakData, 
  LevelInfo, 
  EnhancedUserProfile,
  CompletedActivity
} from '../types';

// Achievement definitions with categories
export const ACHIEVEMENT_DEFINITIONS = {
  // Learning category
  FIRST_COURSE: {
    id: 'first_course',
    title: 'First Steps',
    description: 'Complete your first learning activity',
    badgeIcon: '🎯',
    category: 'learning' as const,
    experiencePoints: 50,
    rarity: 'common' as const,
    requirements: ['complete_activity']
  },
  COURSE_STREAK_3: {
    id: 'course_streak_3',
    title: 'Learning Momentum',
    description: 'Complete learning activities for 3 consecutive days',
    badgeIcon: '🔥',
    category: 'learning' as const,
    experiencePoints: 100,
    rarity: 'uncommon' as const,
    requirements: ['daily_streak_3']
  },
  COURSE_STREAK_7: {
    id: 'course_streak_7',
    title: 'Week Warrior',
    description: 'Complete learning activities for 7 consecutive days',
    badgeIcon: '⚡',
    category: 'learning' as const,
    experiencePoints: 250,
    rarity: 'rare' as const,
    requirements: ['daily_streak_7']
  },
  SKILL_MASTER: {
    id: 'skill_master',
    title: 'Skill Master',
    description: 'Reach expert level in any skill',
    badgeIcon: '👑',
    category: 'learning' as const,
    experiencePoints: 500,
    rarity: 'epic' as const,
    requirements: ['skill_expert_level']
  },

  // Progress category
  ASSESSMENT_COMPLETE: {
    id: 'assessment_complete',
    title: 'Self-Aware',
    description: 'Complete your career assessment',
    badgeIcon: '🧠',
    category: 'progress' as const,
    experiencePoints: 100,
    rarity: 'common' as const,
    requirements: ['complete_assessment']
  },
  ROADMAP_CREATED: {
    id: 'roadmap_created',
    title: 'Path Finder',
    description: 'Generate your first learning roadmap',
    badgeIcon: '🗺️',
    category: 'progress' as const,
    experiencePoints: 75,
    rarity: 'common' as const,
    requirements: ['create_roadmap']
  },
  HALFWAY_HERO: {
    id: 'halfway_hero',
    title: 'Halfway Hero',
    description: 'Reach 50% completion on your career roadmap',
    badgeIcon: '🏃‍♂️',
    category: 'progress' as const,
    experiencePoints: 300,
    rarity: 'uncommon' as const,
    requirements: ['roadmap_50_percent']
  },
  GOAL_CRUSHER: {
    id: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Complete your entire career roadmap',
    badgeIcon: '🏆',
    category: 'progress' as const,
    experiencePoints: 1000,
    rarity: 'legendary' as const,
    requirements: ['roadmap_100_percent']
  },

  // Consistency category
  EARLY_BIRD: {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete activities before 9 AM for 5 days',
    badgeIcon: '🌅',
    category: 'consistency' as const,
    experiencePoints: 150,
    rarity: 'uncommon' as const,
    requirements: ['early_morning_streak_5']
  },
  NIGHT_OWL: {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete activities after 9 PM for 5 days',
    badgeIcon: '🦉',
    category: 'consistency' as const,
    experiencePoints: 150,
    rarity: 'uncommon' as const,
    requirements: ['late_night_streak_5']
  },
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Stay active on weekends for 4 consecutive weeks',
    badgeIcon: '⚔️',
    category: 'consistency' as const,
    experiencePoints: 200,
    rarity: 'rare' as const,
    requirements: ['weekend_activity_4_weeks']
  },

  // Milestone category
  CAREER_EXPLORER: {
    id: 'career_explorer',
    title: 'Career Explorer',
    description: 'Explore 5 different career recommendations',
    badgeIcon: '🔍',
    category: 'milestone' as const,
    experiencePoints: 125,
    rarity: 'common' as const,
    requirements: ['explore_5_careers']
  },
  RESUME_OPTIMIZER: {
    id: 'resume_optimizer',
    title: 'Resume Optimizer',
    description: 'Improve your ATS score by 20 points',
    badgeIcon: '📄',
    category: 'milestone' as const,
    experiencePoints: 200,
    rarity: 'uncommon' as const,
    requirements: ['ats_score_improvement_20']
  },
  MENTOR_SEEKER: {
    id: 'mentor_seeker',
    title: 'Mentor Seeker',
    description: 'Have 10 conversations with the AI career mentor',
    badgeIcon: '💬',
    category: 'milestone' as const,
    experiencePoints: 175,
    rarity: 'uncommon' as const,
    requirements: ['chat_conversations_10']
  },

  // Social category (for future expansion)
  PROFILE_PERFECTIONIST: {
    id: 'profile_perfectionist',
    title: 'Profile Perfectionist',
    description: 'Complete 100% of your profile information',
    badgeIcon: '✨',
    category: 'social' as const,
    experiencePoints: 100,
    rarity: 'common' as const,
    requirements: ['complete_profile_100']
  },

  // Career Selection Achievements
  CAREER_COMMITTED: {
    id: 'career_committed',
    title: 'Career Committed',
    description: 'Select your target career path',
    badgeIcon: '🎯',
    category: 'milestone' as const,
    experiencePoints: 100,
    rarity: 'common' as const,
    requirements: ['career_selected']
  },
  ROADMAP_READY: {
    id: 'roadmap_ready',
    title: 'Roadmap Ready',
    description: 'Generate your personalized learning roadmap',
    badgeIcon: '🗺️',
    category: 'milestone' as const,
    experiencePoints: 150,
    rarity: 'uncommon' as const,
    requirements: ['roadmap_generated']
  },
  SKILL_ANALYST: {
    id: 'skill_analyst',
    title: 'Skill Analyst',
    description: 'Complete your first skill gap analysis',
    badgeIcon: '📊',
    category: 'milestone' as const,
    experiencePoints: 125,
    rarity: 'uncommon' as const,
    requirements: ['skill_gap_analysis']
  }
};

// Level system configuration
export const LEVEL_SYSTEM = {
  // XP required for each level (cumulative)
  XP_REQUIREMENTS: [
    0,     // Level 1
    100,   // Level 2
    250,   // Level 3
    450,   // Level 4
    700,   // Level 5
    1000,  // Level 6
    1350,  // Level 7
    1750,  // Level 8
    2200,  // Level 9
    2700,  // Level 10
    3250,  // Level 11
    3850,  // Level 12
    4500,  // Level 13
    5200,  // Level 14
    5950,  // Level 15
    6750,  // Level 16
    7600,  // Level 17
    8500,  // Level 18
    9450,  // Level 19
    10450, // Level 20
  ],
  
  // Level titles
  LEVEL_TITLES: [
    'Career Novice',      // Level 1-2
    'Skill Seeker',       // Level 3-4
    'Path Explorer',      // Level 5-6
    'Growth Minded',      // Level 7-8
    'Career Focused',     // Level 9-10
    'Skill Builder',      // Level 11-12
    'Progress Maker',     // Level 13-14
    'Goal Achiever',      // Level 15-16
    'Career Expert',      // Level 17-18
    'Master Professional' // Level 19-20
  ],

  MAX_LEVEL: 20
};

// Experience point values for different activities
export const XP_VALUES = {
  COMPLETE_ASSESSMENT: 100,
  COMPLETE_COURSE: 50,
  COMPLETE_CERTIFICATION: 150,
  COMPLETE_PROJECT: 100,
  SKILL_LEVEL_UP: 75,
  MILESTONE_COMPLETE: 200,
  DAILY_STREAK: 25,
  WEEKLY_STREAK: 100,
  RESUME_OPTIMIZATION: 50,
  CHAT_INTERACTION: 10,
  PROFILE_UPDATE: 25
};

export class GamificationService {
  /**
   * Calculate user's current level and XP progress
   */
  static calculateLevel(totalXP: number): LevelInfo {
    const { XP_REQUIREMENTS, LEVEL_TITLES, MAX_LEVEL } = LEVEL_SYSTEM;
    
    let currentLevel = 1;
    for (let i = XP_REQUIREMENTS.length - 1; i >= 0; i--) {
      if (totalXP >= XP_REQUIREMENTS[i]) {
        currentLevel = i + 1;
        break;
      }
    }
    
    // Ensure we don't exceed max level
    currentLevel = Math.min(currentLevel, MAX_LEVEL);
    
    // const currentLevelXP = XP_REQUIREMENTS[currentLevel - 1] || 0;
    const nextLevelXP = XP_REQUIREMENTS[currentLevel] || XP_REQUIREMENTS[MAX_LEVEL - 1];
    const xpToNextLevel = Math.max(0, nextLevelXP - totalXP);
    
    // Get level title based on level ranges
    const titleIndex = Math.min(Math.floor((currentLevel - 1) / 2), LEVEL_TITLES.length - 1);
    const levelTitle = LEVEL_TITLES[titleIndex];
    
    return {
      currentLevel,
      currentXP: totalXP,
      xpToNextLevel,
      totalXPRequired: nextLevelXP,
      levelTitle
    };
  }

  /**
   * Award experience points and check for level up
   */
  static awardExperience(
    currentXP: number, 
    xpToAward: number
  ): { newXP: number; leveledUp: boolean; newLevel?: number } {
    const oldLevel = this.calculateLevel(currentXP).currentLevel;
    const newXP = currentXP + xpToAward;
    const newLevel = this.calculateLevel(newXP).currentLevel;
    
    return {
      newXP,
      leveledUp: newLevel > oldLevel,
      newLevel: newLevel > oldLevel ? newLevel : undefined
    };
  }

  /**
   * Check if user has earned any new achievements
   */
  static checkAchievements(
    profile: EnhancedUserProfile,
    activityType: string,
    activityData?: any
  ): Achievement[] {
    const earnedAchievements: Achievement[] = [];
    const existingAchievementIds = profile.achievements.map(a => a.id);
    
    // Check each achievement definition
    Object.values(ACHIEVEMENT_DEFINITIONS).forEach(achievementDef => {
      // Skip if already earned
      if (existingAchievementIds.includes(achievementDef.id)) {
        return;
      }
      
      // Check if requirements are met
      if (this.checkAchievementRequirements(achievementDef.requirements, profile, activityType, activityData)) {
        const achievement: Achievement = {
          id: achievementDef.id,
          title: achievementDef.title,
          description: achievementDef.description,
          badgeIcon: achievementDef.badgeIcon,
          category: achievementDef.category,
          earnedAt: new Date(),
          experiencePoints: achievementDef.experiencePoints,
          rarity: achievementDef.rarity
        };
        
        earnedAchievements.push(achievement);
      }
    });
    
    return earnedAchievements;
  }

  /**
   * Check if achievement requirements are met
   */
  private static checkAchievementRequirements(
    requirements: string[],
    profile: EnhancedUserProfile,
    activityType: string,
    activityData?: any
  ): boolean {
    return requirements.every(requirement => {
      switch (requirement) {
        case 'complete_activity':
          return activityType === 'activity_completed';
          
        case 'complete_assessment':
          return profile.careerAssessment !== undefined;
          
        case 'create_roadmap':
          return profile.careerRecommendations.length > 0;
          
        case 'daily_streak_3':
          return profile.streaks.currentStreak >= 3 && profile.streaks.streakType === 'daily';
          
        case 'daily_streak_7':
          return profile.streaks.currentStreak >= 7 && profile.streaks.streakType === 'daily';
          
        case 'skill_expert_level':
          return Object.values(profile.progressData.skillProgress).some(
            skill => skill.currentLevel === 'expert'
          );
          
        case 'roadmap_50_percent':
          return profile.progressData.overallProgress >= 50;
          
        case 'roadmap_100_percent':
          return profile.progressData.overallProgress >= 100;
          
        case 'early_morning_streak_5':
          return this.checkTimeBasedStreak(profile, 'morning', 5);
          
        case 'late_night_streak_5':
          return this.checkTimeBasedStreak(profile, 'night', 5);
          
        case 'weekend_activity_4_weeks':
          return this.checkWeekendActivity(profile, 4);
          
        case 'explore_5_careers':
          return profile.careerRecommendations.length >= 5;
          
        case 'ats_score_improvement_20':
          return activityType === 'ats_improvement' && activityData?.improvement >= 20;
          
        case 'chat_conversations_10':
          return activityType === 'chat_milestone' && activityData?.conversationCount >= 10;
          
        case 'complete_profile_100':
          return this.calculateProfileCompleteness(profile) >= 100;
          
        case 'career_selected':
          return activityType === 'career_selected' && profile.selectedCareerPath;
          
        case 'roadmap_generated':
          return activityType === 'roadmap_generated' && profile.learningRoadmap;
          
        case 'skill_gap_analysis':
          return activityType === 'skill_gap_analysis' && profile.skillGapAnalysis;
          
        default:
          return false;
      }
    });
  }

  /**
   * Update streak data based on activity
   */
  static updateStreak(
    currentStreak: StreakData,
    activityDate: Date = new Date()
  ): StreakData {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = new Date(currentStreak.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);
    
    const activityDay = new Date(activityDate);
    activityDay.setHours(0, 0, 0, 0);
    
    const daysDifference = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreak = currentStreak.currentStreak;
    
    if (daysDifference === 0) {
      // Same day, no change to streak
      return currentStreak;
    } else if (daysDifference === 1) {
      // Consecutive day, increment streak
      newStreak = currentStreak.currentStreak + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }
    
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(currentStreak.longestStreak, newStreak),
      lastActivityDate: activityDate,
      streakType: currentStreak.streakType,
      streakGoal: currentStreak.streakGoal
    };
  }

  /**
   * Create milestone based on progress
   */
  static createMilestone(
    id: string,
    title: string,
    description: string,
    category: 'assessment' | 'learning' | 'skill' | 'career' | 'progress',
    requirements: string[],
    reward: Achievement,
    order: number = 0
  ): Milestone {
    return {
      id,
      title,
      description,
      category,
      isCompleted: false,
      requirements,
      reward,
      order
    };
  }

  /**
   * Check if milestone is completed
   */
  static checkMilestoneCompletion(
    milestone: Milestone,
    profile: EnhancedUserProfile
  ): boolean {
    return milestone.requirements.every(requirement => {
      // Parse requirement format: "type:value" or just "type"
      const [type, value] = requirement.split(':');
      
      switch (type) {
        case 'assessment_complete':
          return profile.careerAssessment !== undefined;
          
        case 'skills_learned':
          const targetSkills = parseInt(value) || 1;
          return Object.keys(profile.progressData.skillProgress).length >= targetSkills;
          
        case 'activities_completed':
          const targetActivities = parseInt(value) || 1;
          return profile.progressData.learningActivities.length >= targetActivities;
          
        case 'progress_percentage':
          const targetProgress = parseInt(value) || 100;
          return profile.progressData.overallProgress >= targetProgress;
          
        case 'streak_days':
          const targetDays = parseInt(value) || 1;
          return profile.streaks.currentStreak >= targetDays;
          
        case 'level_reached':
          const targetLevel = parseInt(value) || 1;
          return profile.level >= targetLevel;
          
        default:
          return false;
      }
    });
  }

  /**
   * Generate default milestones for a user
   */
  static generateDefaultMilestones(): Milestone[] {
    return [
      this.createMilestone(
        'first_assessment',
        'Complete Career Assessment',
        'Take your first career assessment to discover your path',
        'assessment',
        ['assessment_complete'],
        {
          id: 'milestone_first_assessment',
          title: 'Assessment Pioneer',
          description: 'Completed first career assessment',
          badgeIcon: '🎯',
          category: 'milestone',
          earnedAt: new Date(),
          experiencePoints: 100,
          rarity: 'common'
        },
        1
      ),
      this.createMilestone(
        'first_skill',
        'Learn Your First Skill',
        'Complete learning activities for your first skill',
        'learning',
        ['skills_learned:1'],
        {
          id: 'milestone_first_skill',
          title: 'Skill Starter',
          description: 'Started learning your first skill',
          badgeIcon: '📚',
          category: 'milestone',
          earnedAt: new Date(),
          experiencePoints: 75,
          rarity: 'common'
        },
        2
      ),
      this.createMilestone(
        'week_streak',
        'One Week Streak',
        'Maintain learning activity for 7 consecutive days',
        'learning',
        ['streak_days:7'],
        {
          id: 'milestone_week_streak',
          title: 'Week Warrior',
          description: 'Maintained a 7-day learning streak',
          badgeIcon: '🔥',
          category: 'milestone',
          earnedAt: new Date(),
          experiencePoints: 200,
          rarity: 'uncommon'
        },
        3
      ),
      this.createMilestone(
        'halfway_complete',
        'Halfway There',
        'Reach 50% completion on your learning roadmap',
        'progress',
        ['progress_percentage:50'],
        {
          id: 'milestone_halfway',
          title: 'Halfway Hero',
          description: 'Reached 50% completion on roadmap',
          badgeIcon: '🏃‍♂️',
          category: 'milestone',
          earnedAt: new Date(),
          experiencePoints: 300,
          rarity: 'uncommon'
        },
        4
      ),
      this.createMilestone(
        'level_five',
        'Reach Level 5',
        'Advance to level 5 in your career journey',
        'progress',
        ['level_reached:5'],
        {
          id: 'milestone_level_five',
          title: 'Rising Star',
          description: 'Reached level 5 in career development',
          badgeIcon: '⭐',
          category: 'milestone',
          earnedAt: new Date(),
          experiencePoints: 250,
          rarity: 'rare'
        },
        5
      )
    ];
  }

  /**
   * Helper methods for specific achievement checks
   */
  private static checkTimeBasedStreak(profile: EnhancedUserProfile, _timeType: 'morning' | 'night', days: number): boolean {
    // This would require tracking activity times - simplified for now
    // In a real implementation, you'd track when activities were completed
    return profile.progressData.learningActivities.length >= days;
  }

  private static checkWeekendActivity(profile: EnhancedUserProfile, weeks: number): boolean {
    // This would require tracking weekend activities - simplified for now
    return profile.progressData.learningActivities.length >= weeks * 2;
  }

  private static calculateProfileCompleteness(profile: EnhancedUserProfile): number {
    let completeness = 0;
    const maxPoints = 100;
    
    // Basic profile info (30 points)
    if (profile.name) completeness += 10;
    if (profile.age > 0) completeness += 5;
    if (profile.educationLevel) completeness += 5;
    if (profile.location) completeness += 5;
    if (profile.careerInterest) completeness += 5;
    
    // Skills (20 points)
    if (profile.skills.length > 0) completeness += 10;
    if (profile.skills.length >= 5) completeness += 10;
    
    // Career assessment (25 points)
    if (profile.careerAssessment) completeness += 25;
    
    // Resume (15 points)
    if (profile.resume) completeness += 15;
    
    // Career recommendations (10 points)
    if (profile.careerRecommendations.length > 0) completeness += 10;
    
    return Math.min(completeness, maxPoints);
  }

  /**
   * Process activity completion and award appropriate rewards
   */
  static processActivityCompletion(
    profile: EnhancedUserProfile,
    activity: CompletedActivity
  ): {
    xpAwarded: number;
    achievementsEarned: Achievement[];
    leveledUp: boolean;
    newLevel?: number;
    updatedStreak: StreakData;
  } {
    // Award XP based on activity type
    let xpAwarded = 0;
    switch (activity.type) {
      case 'course':
        xpAwarded = XP_VALUES.COMPLETE_COURSE;
        break;
      case 'certification':
        xpAwarded = XP_VALUES.COMPLETE_CERTIFICATION;
        break;
      case 'project':
        xpAwarded = XP_VALUES.COMPLETE_PROJECT;
        break;
      default:
        xpAwarded = XP_VALUES.COMPLETE_COURSE;
    }

    // Calculate level progression
    const { leveledUp, newLevel } = this.awardExperience(profile.experiencePoints, xpAwarded);
    
    // Update streak
    const updatedStreak = this.updateStreak(profile.streaks, activity.completedAt);
    
    // Check for new achievements
    const achievementsEarned = this.checkAchievements(profile, 'activity_completed', activity);
    
    return {
      xpAwarded,
      achievementsEarned,
      leveledUp,
      newLevel,
      updatedStreak
    };
  }

  /**
   * Get user's current gamification status
   */
  static getGamificationStatus(profile: EnhancedUserProfile): {
    level: LevelInfo;
    recentAchievements: Achievement[];
    currentStreak: StreakData;
    nextMilestone?: Milestone;
    progressToNextLevel: number;
  } {
    const level = this.calculateLevel(profile.experiencePoints);
    const recentAchievements = (profile.achievements || [])
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
      .slice(0, 5);
    
    const nextMilestone = (profile.currentMilestones || [])
      .filter(m => !m.isCompleted)
      .sort((a, b) => a.order - b.order)[0];
    
    const progressToNextLevel = level.xpToNextLevel > 0 
      ? ((level.totalXPRequired - level.xpToNextLevel) / level.totalXPRequired) * 100
      : 100;
    
    return {
      level,
      recentAchievements,
      currentStreak: profile.streaks,
      nextMilestone,
      progressToNextLevel
    };
  }
}