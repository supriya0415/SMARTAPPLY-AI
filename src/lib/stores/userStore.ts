import { create } from 'zustand';
import { 
  UserProfile, 
  CareerRecommendation, 
  UserStore, 
  EnhancedUserProfile,
  ProgressData,
  Achievement,
  StreakData,
  ChatConversation,
  ChatMessage,
  ResumeVersion,
  CompletedActivity,
  LevelInfo
} from '../types';
import { GamificationService } from '../services/gamificationService';
import { debugLogger } from '../utils/debugLogger';
import { cacheService } from '../services/cacheService';
import { performanceMonitor } from '../services/performanceMonitorService';

// Helper functions for localStorage persistence with performance monitoring
const getStoredData = () => {
  return performanceMonitor.measureSync('user_store_read', () => {
    try {
      const stored = localStorage.getItem('career-mentor-store');
      const parsed = stored ? JSON.parse(stored) : {};
      
      // Convert date strings back to Date objects
      if (parsed.enhancedProfile) {
      const profile = parsed.enhancedProfile;
      
      // Convert profile dates
      if (profile.createdAt) profile.createdAt = new Date(profile.createdAt);
      if (profile.updatedAt) profile.updatedAt = new Date(profile.updatedAt);
      
      // Convert assessment date
      if (profile.careerAssessment?.completedAt) {
        profile.careerAssessment.completedAt = new Date(profile.careerAssessment.completedAt);
      }
      
      // Convert achievement dates
      if (profile.achievements) {
        profile.achievements.forEach((achievement: any) => {
          if (achievement.earnedAt) achievement.earnedAt = new Date(achievement.earnedAt);
        });
      }
      
      // Convert milestone dates
      if (profile.currentMilestones) {
        profile.currentMilestones.forEach((milestone: any) => {
          if (milestone.completedAt) milestone.completedAt = new Date(milestone.completedAt);
        });
      }
      
      // Convert progress data dates
      if (profile.progressData) {
        if (profile.progressData.lastUpdated) {
          profile.progressData.lastUpdated = new Date(profile.progressData.lastUpdated);
        }
        
        // Convert learning activity dates
        if (profile.progressData.learningActivities) {
          profile.progressData.learningActivities.forEach((activity: any) => {
            if (activity.completedAt) activity.completedAt = new Date(activity.completedAt);
            if (activity.lastPracticed) activity.lastPracticed = new Date(activity.lastPracticed);
          });
        }
        
        // Convert skill progress dates
        if (profile.progressData.skillProgress) {
          Object.values(profile.progressData.skillProgress).forEach((skill: any) => {
            if (skill.lastPracticed) skill.lastPracticed = new Date(skill.lastPracticed);
          });
        }
      }
      
      // Convert streak dates
      if (profile.streaks?.lastActivityDate) {
        profile.streaks.lastActivityDate = new Date(profile.streaks.lastActivityDate);
      }
    }
    
    // Convert conversation dates
    if (parsed.conversations) {
      parsed.conversations.forEach((conv: any) => {
        if (conv.createdAt) conv.createdAt = new Date(conv.createdAt);
        if (conv.updatedAt) conv.updatedAt = new Date(conv.updatedAt);
        if (conv.messages) {
          conv.messages.forEach((msg: any) => {
            if (msg.timestamp) msg.timestamp = new Date(msg.timestamp);
          });
        }
      });
    }
    
    // Convert resume version dates
    if (parsed.resumeVersions) {
      parsed.resumeVersions.forEach((version: any) => {
        if (version.createdAt) version.createdAt = new Date(version.createdAt);
        if (version.atsScore?.generatedAt) {
          version.atsScore.generatedAt = new Date(version.atsScore.generatedAt);
        }
        if (version.targetJob?.analyzedAt) {
          version.targetJob.analyzedAt = new Date(version.targetJob.analyzedAt);
        }
      });
    }
    
      debugLogger.logStorageOperation('read', 'career-mentor-store', true);
      return parsed;
    } catch (error) {
      debugLogger.logStorageOperation('read', 'career-mentor-store', false);
      return {};
    }
  }, 'memory');
};

const setStoredData = (data: any) => {
  performanceMonitor.measureSync('user_store_write', () => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem('career-mentor-store', serialized);
      debugLogger.logStorageOperation('write', 'career-mentor-store', true);
      
      // Also cache in the cache service for faster access
      cacheService.set('user_store_data', data, 60 * 60 * 1000); // 1 hour TTL
    } catch (error) {
      debugLogger.logStorageOperation('write', 'career-mentor-store', false);
    }
  }, 'memory');
};

const initialData = getStoredData();

export const useUserStore = create<UserStore>((set, get) => ({
      // Basic profile data
      profile: initialData.profile || null,
      enhancedProfile: initialData.enhancedProfile || null,
      results: initialData.results || null,
      
      // Chat data
      currentConversation: null,
      conversations: initialData.conversations || [],
      
      // Resume versions
      resumeVersions: initialData.resumeVersions || [],
      
      // Basic actions
      setProfile: (profile: UserProfile) => {
        set({ profile });
        const currentState = get();
        setStoredData({ ...currentState, profile });
      },
      
      setEnhancedProfile: (profile: EnhancedUserProfile) => {
        debugLogger.logProfileSave(profile);
        set({ enhancedProfile: profile });
        const currentState = get();
        setStoredData({ ...currentState, enhancedProfile: profile });
        debugLogger.logProfileSaveComplete();
        
        // Auto-sync to database in the background (don't await to avoid blocking UI)
        const syncToDatabase = async () => {
          try {
            const { EnhancedProfileService } = await import('../services/enhancedProfileService');
            // Use saveEnhancedProfile instead of updateEnhancedProfile
            // This ensures the profile is created if it doesn't exist (POST instead of PATCH)
            await EnhancedProfileService.saveEnhancedProfile(profile);
            console.log('Enhanced profile auto-synced to database');
          } catch (error) {
            console.warn('Failed to auto-sync enhanced profile to database:', error);
            // Don't throw error to avoid breaking the UI
          }
        };
        
        // Only sync if we have authentication token
        const token = localStorage.getItem('jwt');
        if (token) {
          syncToDatabase();
        }
      },
      
      setResults: (results: CareerRecommendation) => {
        set({ results });
        const currentState = get();
        setStoredData({ ...currentState, results });
      },
      
      // Progress tracking actions
      updateProgress: (progress: Partial<ProgressData>) => {
        const { enhancedProfile } = get();
        if (enhancedProfile) {
          set({
            enhancedProfile: {
              ...enhancedProfile,
              progressData: {
                ...enhancedProfile.progressData,
                ...progress,
                lastUpdated: new Date()
              },
              updatedAt: new Date()
            }
          });
        }
      },
      
      addAchievement: (achievement: Achievement) => {
        const { enhancedProfile } = get();
        if (enhancedProfile) {
          set({
            enhancedProfile: {
              ...enhancedProfile,
              achievements: [...enhancedProfile.achievements, achievement],
              experiencePoints: enhancedProfile.experiencePoints + achievement.experiencePoints,
              updatedAt: new Date()
            }
          });
        }
      },
      
      updateStreak: (streakData: StreakData) => {
        const { enhancedProfile } = get();
        if (enhancedProfile) {
          const updatedProfile = {
            ...enhancedProfile,
            streaks: streakData,
            updatedAt: new Date()
          };
          set({ enhancedProfile: updatedProfile });
          const currentState = get();
          setStoredData({ ...currentState, enhancedProfile: updatedProfile });
        }
      },

      // Gamification actions
      processActivityCompletion: (activity: CompletedActivity) => {
        const { enhancedProfile } = get();
        if (!enhancedProfile) return;

        const result = GamificationService.processActivityCompletion(enhancedProfile, activity);
        
        const updatedProfile: EnhancedUserProfile = {
          ...enhancedProfile,
          experiencePoints: enhancedProfile.experiencePoints + result.xpAwarded,
          level: result.newLevel || enhancedProfile.level,
          achievements: [...enhancedProfile.achievements, ...result.achievementsEarned],
          streaks: result.updatedStreak,
          progressData: {
            ...enhancedProfile.progressData,
            learningActivities: [...enhancedProfile.progressData.learningActivities, activity],
            lastUpdated: new Date()
          },
          updatedAt: new Date()
        };

        set({ enhancedProfile: updatedProfile });
        const currentState = get();
        setStoredData({ ...currentState, enhancedProfile: updatedProfile });

        // Check milestone progress after activity completion
        get().updateMilestoneProgress();
      },

      awardExperience: (xp: number, reason: string) => {
        const { enhancedProfile } = get();
        if (!enhancedProfile) return;

        const { newXP, leveledUp, newLevel } = GamificationService.awardExperience(
          enhancedProfile.experiencePoints, 
          xp
        );

        const updatedProfile: EnhancedUserProfile = {
          ...enhancedProfile,
          experiencePoints: newXP,
          level: newLevel || enhancedProfile.level,
          updatedAt: new Date()
        };

        set({ enhancedProfile: updatedProfile });
        const currentState = get();
        setStoredData({ ...currentState, enhancedProfile: updatedProfile });

        console.log(`Awarded ${xp} XP for: ${reason}${leveledUp ? ` - Level up to ${newLevel}!` : ''}`);
      },

      checkAndAwardAchievements: (activityType: string, activityData?: any): Achievement[] => {
        const { enhancedProfile } = get();
        if (!enhancedProfile) return [];

        const newAchievements = GamificationService.checkAchievements(
          enhancedProfile, 
          activityType, 
          activityData
        );

        if (newAchievements.length > 0) {
          const totalXP = newAchievements.reduce((sum, achievement) => sum + achievement.experiencePoints, 0);
          
          const updatedProfile: EnhancedUserProfile = {
            ...enhancedProfile,
            achievements: [...enhancedProfile.achievements, ...newAchievements],
            experiencePoints: enhancedProfile.experiencePoints + totalXP,
            updatedAt: new Date()
          };

          // Check for level up after adding achievement XP
          const levelInfo = GamificationService.calculateLevel(updatedProfile.experiencePoints);
          updatedProfile.level = levelInfo.currentLevel;

          set({ enhancedProfile: updatedProfile });
          const currentState = get();
          setStoredData({ ...currentState, enhancedProfile: updatedProfile });

          console.log(`Earned ${newAchievements.length} new achievements:`, newAchievements.map(a => a.title));
        }

        return newAchievements;
      },

      updateMilestoneProgress: () => {
        const { enhancedProfile } = get();
        if (!enhancedProfile) return;

        const updatedMilestones = enhancedProfile.currentMilestones.map(milestone => {
          if (!milestone.isCompleted) {
            const isCompleted = GamificationService.checkMilestoneCompletion(milestone, enhancedProfile);
            if (isCompleted) {
              // Award milestone achievement
              // const milestoneAchievement: Achievement = {
              //   ...milestone.reward,
              //   earnedAt: new Date()
              // };
              
              return {
                ...milestone,
                isCompleted: true,
                completedAt: new Date()
              };
            }
          }
          return milestone;
        });

        // Check if any milestones were completed
        const newlyCompleted = updatedMilestones.filter((milestone, index) => 
          milestone.isCompleted && !enhancedProfile.currentMilestones[index].isCompleted
        );

        if (newlyCompleted.length > 0) {
          const milestoneAchievements = newlyCompleted.map(m => ({
            ...m.reward,
            earnedAt: new Date()
          }));
          
          const totalMilestoneXP = milestoneAchievements.reduce((sum, achievement) => sum + achievement.experiencePoints, 0);

          const updatedProfile: EnhancedUserProfile = {
            ...enhancedProfile,
            currentMilestones: updatedMilestones,
            achievements: [...enhancedProfile.achievements, ...milestoneAchievements],
            experiencePoints: enhancedProfile.experiencePoints + totalMilestoneXP,
            updatedAt: new Date()
          };

          // Update level after milestone XP
          const levelInfo = GamificationService.calculateLevel(updatedProfile.experiencePoints);
          updatedProfile.level = levelInfo.currentLevel;

          set({ enhancedProfile: updatedProfile });
          const currentState = get();
          setStoredData({ ...currentState, enhancedProfile: updatedProfile });

          console.log(`Completed ${newlyCompleted.length} milestones:`, newlyCompleted.map(m => m.title));
        }
      },

      initializeGamification: () => {
        const { enhancedProfile } = get();
        if (!enhancedProfile) return;

        // Initialize gamification data if not present
        const updates: Partial<EnhancedUserProfile> = {};
        let needsUpdate = false;

        if (!enhancedProfile.currentMilestones || enhancedProfile.currentMilestones.length === 0) {
          updates.currentMilestones = GamificationService.generateDefaultMilestones();
          needsUpdate = true;
        }

        if (!enhancedProfile.streaks) {
          updates.streaks = {
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: new Date(),
            streakType: 'daily',
            streakGoal: 7
          };
          needsUpdate = true;
        }

        if (enhancedProfile.level === undefined || enhancedProfile.level === 0) {
          const levelInfo = GamificationService.calculateLevel(enhancedProfile.experiencePoints || 0);
          updates.level = levelInfo.currentLevel;
          updates.experiencePoints = enhancedProfile.experiencePoints || 0;
          needsUpdate = true;
        }

        if (!enhancedProfile.achievements) {
          updates.achievements = [];
          needsUpdate = true;
        }

        if (needsUpdate) {
          const updatedProfile = {
            ...enhancedProfile,
            ...updates,
            updatedAt: new Date()
          };

          set({ enhancedProfile: updatedProfile });
          const currentState = get();
          setStoredData({ ...currentState, enhancedProfile: updatedProfile });

          console.log('Initialized gamification system for user');
        }
      },

      getLevelInfo: (): LevelInfo | null => {
        const { enhancedProfile } = get();
        if (!enhancedProfile) return null;
        
        return GamificationService.calculateLevel(enhancedProfile.experiencePoints || 0);
      },
      
      // Chatbot actions
      setCurrentConversation: (conversation: ChatConversation | null) =>
        set({ currentConversation: conversation }),
      
      addMessage: (conversationId: string, message: ChatMessage) => {
        const { conversations, currentConversation } = get();
        
        // Update conversations array
        const updatedConversations = conversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date() }
            : conv
        );
        
        // Update current conversation if it matches
        const updatedCurrentConversation = currentConversation?.id === conversationId
          ? { ...currentConversation, messages: [...currentConversation.messages, message], updatedAt: new Date() }
          : currentConversation;
        
        set({ 
          conversations: updatedConversations,
          currentConversation: updatedCurrentConversation
        });
      },
      
      createConversation: (title: string): ChatConversation => {
        const { enhancedProfile } = get();
        const newConversation: ChatConversation = {
          id: `conv_${Date.now()}`,
          title,
          messages: [],
          context: {
            userProfile: enhancedProfile!,
            currentTopic: 'general',
            recentActions: [],
            relevantData: {},
            conversationGoals: []
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
        
        set(state => ({
          conversations: [...state.conversations, newConversation],
          currentConversation: newConversation
        }));
        
        return newConversation;
      },
      
      // Resume actions
      addResumeVersion: (version: ResumeVersion) => {
        set(state => ({
          resumeVersions: [...state.resumeVersions, version]
        }));
      },
      
      updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => {
        set(state => ({
          resumeVersions: state.resumeVersions.map(version =>
            version.id === id ? { ...version, ...updates } : version
          )
        }));
      },
      
      setActiveResumeVersion: (id: string) => {
        set(state => ({
          resumeVersions: state.resumeVersions.map(version => ({
            ...version,
            isActive: version.id === id
          }))
        }));
      },
      
      // Utility actions
      clearData: () => {
        debugLogger.log('Clearing user store data', {
          component: 'UserStore',
          action: 'clear_data_start'
        });
        
        // Log current state before clearing
        const currentState = get();
        debugLogger.log('Current state before clearing', {
          component: 'UserStore',
          action: 'clear_data_before',
          metadata: {
            hasProfile: !!currentState.profile,
            hasEnhancedProfile: !!currentState.enhancedProfile,
            hasResults: !!currentState.results,
            conversationsCount: currentState.conversations?.length || 0,
            resumeVersionsCount: currentState.resumeVersions?.length || 0
          }
        });
        
        const clearedState = { 
          profile: null, 
          enhancedProfile: null,
          results: null,
          currentConversation: null,
          conversations: [],
          resumeVersions: []
        };
        
        // Clear in-memory state
        set(clearedState);
        
        // Clear localStorage
        setStoredData(clearedState);
        
        debugLogger.log('User store data cleared successfully', {
          component: 'UserStore',
          action: 'clear_data_complete'
        });
      },
      
      // Complete logout with state cleanup
      logout: async (): Promise<boolean> => {
        try {
          debugLogger.logLogoutStart();
          
          // Clear store state first
          debugLogger.log('Clearing user store state', {
            component: 'UserStore',
            action: 'logout_clear_state'
          });
          get().clearData();
          
          // Import and use logout service for additional cleanup
          debugLogger.log('Performing additional cleanup', {
            component: 'UserStore',
            action: 'logout_additional_cleanup'
          });
          const { LogoutService } = await import('../services/logoutService');
          await LogoutService.performLogout();
          
          debugLogger.logLogoutComplete(true);
          return true;
        } catch (error) {
          debugLogger.error('User store logout failed', error as Error, {
            component: 'UserStore',
            action: 'logout_error'
          });
          
          // Fallback - at least clear the store state
          try {
            get().clearData();
            debugLogger.warn('Fallback: Store state cleared despite error', {
              component: 'UserStore',
              action: 'logout_fallback'
            });
          } catch (fallbackError) {
            debugLogger.error('Even fallback clearData failed', fallbackError as Error, {
              component: 'UserStore',
              action: 'logout_fallback_error'
            });
          }
          
          debugLogger.logLogoutComplete(false);
          return false;
        }
      },
      
      exportData: (): string => {
        const state = get();
        const exportData = {
          profile: state.profile,
          enhancedProfile: state.enhancedProfile,
          results: state.results,
          conversations: state.conversations,
          resumeVersions: state.resumeVersions,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importData: (data: string): void => {
        try {
          const importedData = JSON.parse(data);
          set({
            profile: importedData.profile || null,
            enhancedProfile: importedData.enhancedProfile || null,
            results: importedData.results || null,
            conversations: importedData.conversations || [],
            resumeVersions: importedData.resumeVersions || [],
            currentConversation: null
          });
        } catch (error) {
          console.error('Error importing data:', error);
          throw new Error('Invalid data format');
        }
      }
    }));
