import { 
  LearningProgress, 
  ProgressMilestone, 
  ProgressAchievement,
  LearningSession,
  ResourceCompletionRequest
} from '../types/learningResourceTypes';
import { UserProfile, EnhancedUserProfile } from '../types';
import { cacheService } from './cacheService';
import { loadingService } from './loadingService';

export interface ProgressUpdate {
  resourceId: string;
  skillsGained: string[];
  timeSpent: number;
  completed: boolean;
  milestoneReached?: string;
}

export interface ProgressStats {
  totalResourcesCompleted: number;
  totalTimeSpent: number; // minutes
  skillsAcquired: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionTime: number;
  completionRate: number; // percentage
  weeklyProgress: number; // resources completed this week
  monthlyProgress: number; // resources completed this month
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: 'skill' | 'resource' | 'project' | 'milestone';
  priority: 'critical' | 'important' | 'nice-to-have';
  estimatedTime?: string;
  dependencies?: string[]; // IDs of other checklist items
  completed: boolean;
  completedAt?: Date;
  progress: number; // 0-100
  notes?: string;
  relatedResourceIds?: string[];
}

export interface LearningChecklist {
  id: string;
  title: string;
  description: string;
  domain: string;
  subfield?: string;
  targetRole: string;
  items: ChecklistItem[];
  overallProgress: number; // 0-100
  estimatedCompletion: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProgressTrackingService {
  private static readonly STORAGE_KEY = 'learning_progress';
  private static readonly SESSIONS_KEY = 'learning_sessions';
  private static readonly CHECKLISTS_KEY = 'learning_checklists';
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly STATS_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  /**
   * Get user's learning progress for a specific domain with caching (Requirements 10.1, 10.2)
   */
  static async getUserProgress(userId: string, domain?: string, subfield?: string): Promise<LearningProgress> {
    const cacheKey = `progress_${userId}_${domain || 'all'}_${subfield || 'all'}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get<LearningProgress>(cacheKey);
      if (cached) {
        return cached;
      }

      const storedProgress = this.getStoredProgress(userId);
      let progress: LearningProgress;
      
      if (!storedProgress) {
        progress = this.createInitialProgress(userId, domain, subfield);
      } else {
        // Filter progress by domain/subfield if specified
        if (domain && storedProgress.domain !== domain) {
          progress = this.createInitialProgress(userId, domain, subfield);
        } else if (subfield && storedProgress.subfield !== subfield) {
          progress = this.createInitialProgress(userId, domain, subfield);
        } else {
          progress = storedProgress;
        }
      }

      // Cache the result
      await cacheService.set(cacheKey, progress, this.CACHE_TTL);
      
      return progress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return this.createInitialProgress(userId, domain, subfield);
    }
  }

  /**
   * Update progress when a resource is completed or updated
   */
  static async updateProgress(userId: string, update: ProgressUpdate): Promise<LearningProgress> {
    try {
      let progress = await this.getUserProgress(userId);

      // Update completed resources
      if (update.completed && !progress.completedResources.includes(update.resourceId)) {
        progress.completedResources.push(update.resourceId);
        
        // Remove from in-progress if it was there
        progress.inProgressResources = progress.inProgressResources.filter(id => id !== update.resourceId);
      } else if (!update.completed && !progress.inProgressResources.includes(update.resourceId)) {
        progress.inProgressResources.push(update.resourceId);
      }

      // Update skills acquired
      update.skillsGained.forEach(skill => {
        if (!progress.skillsAcquired.includes(skill)) {
          progress.skillsAcquired.push(skill);
        }
      });

      // Update time spent
      progress.timeSpent += update.timeSpent;

      // Update study streak
      progress = this.updateStudyStreak(progress);

      // Update overall progress
      progress.overallProgress = this.calculateOverallProgress(progress);

      // Check for milestone completions
      progress.milestones = this.checkMilestoneCompletions(progress);

      // Check for new achievements
      const newAchievements = this.checkAchievements(progress, update);
      progress.achievements.push(...newAchievements);

      // Update timestamps
      progress.lastActivityDate = new Date();
      progress.updatedAt = new Date();

      // Save progress
      this.saveProgress(userId, progress);

      return progress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw new Error('Failed to update progress');
    }
  }

  /**
   * Get progress statistics for dashboard display with caching (Requirements 10.1, 10.2)
   */
  static async getProgressStats(userId: string, domain?: string): Promise<ProgressStats> {
    const cacheKey = `progress_stats_${userId}_${domain || 'all'}`;
    
    try {
      // Check cache first
      const cached = await cacheService.get<ProgressStats>(cacheKey);
      if (cached) {
        return cached;
      }

      const [progress, sessions] = await Promise.all([
        this.getUserProgress(userId, domain),
        Promise.resolve(this.getLearningSessionsForUser(userId))
      ]);

      const totalResourcesCompleted = progress.completedResources.length;
      const totalTimeSpent = progress.timeSpent;
      const skillsAcquired = progress.skillsAcquired.length;
      
      // Calculate session-based stats
      const averageSessionTime = sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
        : 0;

      // Calculate weekly/monthly progress
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weeklyProgress = sessions.filter(s => s.createdAt >= oneWeekAgo && s.completed).length;
      const monthlyProgress = sessions.filter(s => s.createdAt >= oneMonthAgo && s.completed).length;

      // Calculate completion rate (completed vs total attempted)
      const totalAttempted = progress.completedResources.length + progress.inProgressResources.length;
      const completionRate = totalAttempted > 0 ? (totalResourcesCompleted / totalAttempted) * 100 : 0;

      const stats: ProgressStats = {
        totalResourcesCompleted,
        totalTimeSpent,
        skillsAcquired,
        currentStreak: progress.studyStreak,
        longestStreak: this.getLongestStreak(userId),
        averageSessionTime,
        completionRate,
        weeklyProgress,
        monthlyProgress
      };

      // Cache the stats
      await cacheService.set(cacheKey, stats, this.STATS_CACHE_TTL);
      
      return stats;
    } catch (error) {
      console.error('Error getting progress stats:', error);
      throw new Error('Failed to get progress statistics');
    }
  }

  /**
   * Create and manage learning checklists
   */
  static createLearningChecklist(
    domain: string, 
    subfield: string, 
    targetRole: string,
    customItems?: ChecklistItem[]
  ): LearningChecklist {
    const checklistId = `checklist_${domain}_${subfield}_${Date.now()}`;
    
    // Generate default checklist items based on domain and role
    const defaultItems = this.generateDefaultChecklistItems(domain, subfield, targetRole);
    const items = customItems || defaultItems;

    const checklist: LearningChecklist = {
      id: checklistId,
      title: `${targetRole} Learning Checklist`,
      description: `Comprehensive checklist for becoming a ${targetRole} in ${subfield}`,
      domain,
      subfield,
      targetRole,
      items,
      overallProgress: 0,
      estimatedCompletion: this.calculateEstimatedCompletion(items),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveChecklist(checklist);
    return checklist;
  }

  /**
   * Update checklist item completion
   */
  static updateChecklistItem(
    checklistId: string, 
    itemId: string, 
    updates: Partial<ChecklistItem>
  ): LearningChecklist {
    const checklist = this.getStoredChecklist(checklistId);
    if (!checklist) {
      throw new Error('Checklist not found');
    }

    const itemIndex = checklist.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Checklist item not found');
    }

    // Update the item
    checklist.items[itemIndex] = {
      ...checklist.items[itemIndex],
      ...updates,
      completedAt: updates.completed ? new Date() : checklist.items[itemIndex].completedAt
    };

    // Recalculate overall progress
    checklist.overallProgress = this.calculateChecklistProgress(checklist.items);
    checklist.updatedAt = new Date();

    this.saveChecklist(checklist);
    return checklist;
  }

  /**
   * Get user's learning checklists
   */
  static getUserChecklists(userId: string, domain?: string): LearningChecklist[] {
    const allChecklists = this.getAllStoredChecklists();
    
    let userChecklists = allChecklists.filter(checklist => 
      checklist.id.includes(userId) || true // In real app, filter by userId
    );

    if (domain) {
      userChecklists = userChecklists.filter(checklist => checklist.domain === domain);
    }

    return userChecklists;
  }

  /**
   * Record a learning session
   */
  static recordLearningSession(session: Omit<LearningSession, 'id' | 'createdAt'>): LearningSession {
    const fullSession: LearningSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    this.saveLearningSession(fullSession);
    return fullSession;
  }

  // Private helper methods

  private static createInitialProgress(userId: string, domain?: string, subfield?: string): LearningProgress {
    return {
      userId,
      domain: domain || 'all',
      subfield,
      overallProgress: 0,
      completedResources: [],
      inProgressResources: [],
      skillsAcquired: [],
      timeSpent: 0,
      studyStreak: 0,
      lastActivityDate: new Date(),
      milestones: this.generateInitialMilestones(domain, subfield),
      achievements: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static updateStudyStreak(progress: LearningProgress): LearningProgress {
    const today = new Date();
    const lastActivity = new Date(progress.lastActivityDate);
    
    // Check if last activity was yesterday or today
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, maintain streak
      return progress;
    } else if (daysDiff === 1) {
      // Yesterday, increment streak
      progress.studyStreak += 1;
    } else {
      // More than 1 day, reset streak
      progress.studyStreak = 1;
    }

    return progress;
  }

  private static calculateOverallProgress(progress: LearningProgress): number {
    const totalResources = progress.completedResources.length + progress.inProgressResources.length;
    if (totalResources === 0) return 0;
    
    return Math.round((progress.completedResources.length / totalResources) * 100);
  }

  private static checkMilestoneCompletions(progress: LearningProgress): ProgressMilestone[] {
    return progress.milestones.map(milestone => {
      if (milestone.completed) return milestone;

      let currentValue = 0;
      
      switch (milestone.type) {
        case 'resource-completion':
          currentValue = progress.completedResources.length;
          break;
        case 'skill-mastery':
          currentValue = progress.skillsAcquired.length;
          break;
        case 'time-based':
          currentValue = Math.floor(progress.timeSpent / 60); // Convert to hours
          break;
      }

      milestone.currentValue = currentValue;
      
      if (currentValue >= milestone.targetValue && !milestone.completed) {
        milestone.completed = true;
        milestone.completedAt = new Date();
      }

      return milestone;
    });
  }

  private static checkAchievements(progress: LearningProgress, update: ProgressUpdate): ProgressAchievement[] {
    const achievements: ProgressAchievement[] = [];

    // First completion achievement
    if (progress.completedResources.length === 1) {
      achievements.push({
        id: 'first_completion',
        title: 'First Steps',
        description: 'Completed your first learning resource',
        badgeIcon: '🎯',
        category: 'completion',
        earnedAt: new Date(),
        experiencePoints: 50
      });
    }

    // Streak achievements
    if (progress.studyStreak === 7) {
      achievements.push({
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        badgeIcon: '🔥',
        category: 'consistency',
        earnedAt: new Date(),
        experiencePoints: 100
      });
    }

    // Skill mastery achievements
    if (update.skillsGained.length > 0 && progress.skillsAcquired.length % 5 === 0) {
      achievements.push({
        id: `skills_${progress.skillsAcquired.length}`,
        title: 'Skill Collector',
        description: `Acquired ${progress.skillsAcquired.length} skills`,
        badgeIcon: '🏆',
        category: 'skill',
        earnedAt: new Date(),
        experiencePoints: progress.skillsAcquired.length * 10
      });
    }

    return achievements;
  }

  private static generateInitialMilestones(domain?: string, subfield?: string): ProgressMilestone[] {
    return [
      {
        id: 'first_resource',
        title: 'Getting Started',
        description: 'Complete your first learning resource',
        type: 'resource-completion',
        targetValue: 1,
        currentValue: 0,
        completed: false
      },
      {
        id: 'five_resources',
        title: 'Building Momentum',
        description: 'Complete 5 learning resources',
        type: 'resource-completion',
        targetValue: 5,
        currentValue: 0,
        completed: false,
        reward: 'Learning Enthusiast Badge'
      },
      {
        id: 'ten_skills',
        title: 'Skill Builder',
        description: 'Acquire 10 different skills',
        type: 'skill-mastery',
        targetValue: 10,
        currentValue: 0,
        completed: false,
        reward: 'Skill Master Badge'
      },
      {
        id: 'hundred_hours',
        title: 'Dedicated Learner',
        description: 'Spend 100 hours learning',
        type: 'time-based',
        targetValue: 100,
        currentValue: 0,
        completed: false,
        reward: 'Time Investment Badge'
      }
    ];
  }

  private static generateDefaultChecklistItems(domain: string, subfield: string, targetRole: string): ChecklistItem[] {
    // Generate domain-specific checklist items
    const items: ChecklistItem[] = [];

    if (domain === 'technology-computer-science') {
      items.push(
        {
          id: 'programming_fundamentals',
          title: 'Master Programming Fundamentals',
          description: 'Learn core programming concepts and at least one programming language',
          category: 'skill',
          priority: 'critical',
          estimatedTime: '2-3 months',
          completed: false,
          progress: 0,
          relatedResourceIds: ['js-fundamentals-course']
        },
        {
          id: 'build_portfolio',
          title: 'Build a Professional Portfolio',
          description: 'Create a portfolio website showcasing your projects',
          category: 'project',
          priority: 'critical',
          estimatedTime: '2-4 weeks',
          dependencies: ['programming_fundamentals'],
          completed: false,
          progress: 0,
          relatedResourceIds: ['portfolio-website-project']
        },
        {
          id: 'complete_projects',
          title: 'Complete 3 Real Projects',
          description: 'Build and deploy 3 substantial projects',
          category: 'project',
          priority: 'important',
          estimatedTime: '3-6 months',
          dependencies: ['programming_fundamentals'],
          completed: false,
          progress: 0
        }
      );
    }

    return items;
  }

  private static calculateEstimatedCompletion(items: ChecklistItem[]): string {
    // Simple estimation based on item count and priorities
    const criticalItems = items.filter(item => item.priority === 'critical').length;
    const importantItems = items.filter(item => item.priority === 'important').length;
    const niceToHaveItems = items.filter(item => item.priority === 'nice-to-have').length;

    const estimatedWeeks = (criticalItems * 4) + (importantItems * 2) + (niceToHaveItems * 1);
    
    if (estimatedWeeks <= 12) {
      return `${estimatedWeeks} weeks`;
    } else {
      return `${Math.ceil(estimatedWeeks / 4)} months`;
    }
  }

  private static calculateChecklistProgress(items: ChecklistItem[]): number {
    if (items.length === 0) return 0;
    
    const totalProgress = items.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / items.length);
  }

  // Storage methods (in a real app, these would interact with a backend API)

  private static getStoredProgress(userId: string): LearningProgress | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private static saveProgress(userId: string, progress: LearningProgress): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  private static getLearningSessionsForUser(userId: string): LearningSession[] {
    try {
      const stored = localStorage.getItem(`${this.SESSIONS_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveLearningSession(session: LearningSession): void {
    try {
      const sessions = this.getLearningSessionsForUser(session.userId);
      sessions.push(session);
      localStorage.setItem(`${this.SESSIONS_KEY}_${session.userId}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving learning session:', error);
    }
  }

  private static getStoredChecklist(checklistId: string): LearningChecklist | null {
    try {
      const stored = localStorage.getItem(`${this.CHECKLISTS_KEY}_${checklistId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private static saveChecklist(checklist: LearningChecklist): void {
    try {
      localStorage.setItem(`${this.CHECKLISTS_KEY}_${checklist.id}`, JSON.stringify(checklist));
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  }

  private static getAllStoredChecklists(): LearningChecklist[] {
    const checklists: LearningChecklist[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.CHECKLISTS_KEY)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            checklists.push(JSON.parse(stored));
          }
        }
      }
    } catch (error) {
      console.error('Error getting stored checklists:', error);
    }
    
    return checklists;
  }

  private static getLongestStreak(userId: string): number {
    // In a real app, this would be stored and tracked
    // For now, return a placeholder
    return 0;
  }
}