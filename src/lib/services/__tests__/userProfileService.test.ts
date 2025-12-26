import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { UserProfileService, DashboardState, SessionProgress } from '../userProfileService';
import { AuthService } from '../authService';
import { EnhancedProfileService } from '../enhancedProfileService';
import { ProgressTrackingService } from '../progressTrackingService';

// Mock dependencies
vi.mock('../authService');
vi.mock('../enhancedProfileService');
vi.mock('../progressTrackingService');
vi.mock('@/utility/axiosInterceptor');

const mockAuthService = AuthService as any;
const mockEnhancedProfileService = EnhancedProfileService as any;
const mockProgressTrackingService = ProgressTrackingService as any;

describe('UserProfileService', () => {
  const mockUser = {
    id: 'test-user-123',
    username: 'testuser',
    accessLevel: 'user',
    createdAt: new Date('2024-01-01')
  };

  const mockEnhancedProfile = {
    name: 'Test User',
    age: 25,
    educationLevel: 'bachelors',
    careerAssessment: {
      completedAt: new Date('2024-01-15'),
      responses: {
        domain: 'technology-computer-science',
        jobRole: 'software-developer'
      }
    },
    careerRecommendations: [],
    achievements: [],
    badges: [],
    level: 1,
    experience: 0,
    progressData: {
      overallProgress: 0,
      learningActivities: [],
      lastUpdated: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
 
 beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.getCurrentUser.mockReturnValue(mockUser);
    mockEnhancedProfileService.loadEnhancedProfile.mockResolvedValue(mockEnhancedProfile);
    mockProgressTrackingService.getProgressData.mockResolvedValue({
      overallProgress: 50,
      learningActivities: [],
      lastUpdated: new Date()
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loadUserProfile', () => {
    it('should load user profile successfully', async () => {
      const profile = await UserProfileService.loadUserProfile();
      
      expect(profile).toBeDefined();
      expect(profile.name).toBe('Test User');
      expect(mockEnhancedProfileService.loadEnhancedProfile).toHaveBeenCalled();
    });

    it('should handle missing user', async () => {
      mockAuthService.getCurrentUser.mockReturnValue(null);
      
      const profile = await UserProfileService.loadUserProfile();
      
      expect(profile).toBeNull();
    });
  });

  describe('getDashboardState', () => {
    it('should return dashboard state', async () => {
      const state = await UserProfileService.getDashboardState();
      
      expect(state).toBeDefined();
      expect(state.user).toEqual(mockUser);
      expect(state.enhancedProfile).toEqual(mockEnhancedProfile);
    });
  });

  describe('updateSessionProgress', () => {
    it('should update session progress', async () => {
      const progress: SessionProgress = {
        currentStep: 'assessment',
        completedSteps: ['login'],
        timeSpent: 300,
        lastActivity: new Date()
      };

      await UserProfileService.updateSessionProgress(progress);
      
      expect(mockProgressTrackingService.updateProgress).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          sessionProgress: progress
        })
      );
    });
  });
});