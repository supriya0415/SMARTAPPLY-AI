import { EnhancedUserProfile } from '@/lib/types'

export function ensureEnhancedProfile(obj: any): EnhancedUserProfile {
    // Provide minimal defaults for required EnhancedUserProfile fields so the store accepts it.
    return {
        id: obj.id || `profile_${Date.now()}`,
        createdAt: obj.createdAt ? new Date(obj.createdAt) : new Date(),
        updatedAt: obj.updatedAt ? new Date(obj.updatedAt) : new Date(),
        resumeVersions: obj.resumeVersions || [],
        careerRecommendations: obj.careerRecommendations || [],
        progressData: obj.progressData || { lastUpdated: new Date(), learningActivities: [], skillProgress: {} },
        achievements: obj.achievements || [],
        currentMilestones: obj.currentMilestones || [],
        experiencePoints: obj.experiencePoints || 0,
        level: obj.level || 1,
        streaks: obj.streaks || { currentStreak: 0, longestStreak: 0, lastActivityDate: new Date(), streakType: 'daily', streakGoal: 7 },
        selectedCareer: obj.selectedCareer || null
    } as unknown as EnhancedUserProfile
}
