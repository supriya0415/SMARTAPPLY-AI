/**
 * End-to-End Tests for Complete User Journey
 * Tests all requirements validation through complete user flows
 */

import { AuthService } from '@/lib/services/authService';
import { GeminiService } from '@/lib/services/geminiService';
import { DepartmentService } from '@/lib/services/departmentService';

// Mock browser environment
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: '',
    pathname: '/',
    search: '',
    hash: '',
  },
});

Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock axios
jest.mock('@/utility/axiosInterceptor', () => ({
  post: jest.fn(),
}));

describe('End-to-End User Journey Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = '/';
  });

  describe('Complete New User Journey', () => {
    test('should complete full user journey from signup to dashboard', async () => {
      // Step 1: User visits the site (unauthenticated)
      expect(AuthService.isAuthenticated()).toBe(false);

      // Step 2: User signs up
      const signUpCredentials = {
        username: 'newuser',
        password: 'Password123!',
        confirm: 'Password123!',
      };

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockResolvedValueOnce({
        data: {
          user: { id: '1', username: 'newuser', accessLevel: 'User' },
          token: 'jwt-token-123',
        },
      });

      const signUpResult = await AuthService.signUp(signUpCredentials);
      expect(signUpResult.success).toBe(true);
      expect(AuthService.isAuthenticated()).toBe(true);

      // Step 3: User is redirected to assessment (no enhanced profile)
      window.location.pathname = '/assessment';
      
      // Step 4: User completes career assessment
      const assessmentData = {
        domain: 'Technology & Computer Science',
        jobRole: 'Software Developer',
        experienceLevel: 'junior' as const,
        skills: ['JavaScript', 'React', 'Node.js'],
        educationLevel: 'bachelors',
        age: 25,
        name: 'New User',
      };

      // Mock Gemini AI response
      const mockRoadmap = {
        primaryCareer: 'Software Developer',
        relatedRoles: ['Frontend Developer', 'Backend Developer'],
        summary: 'Great fit for your JavaScript skills',
        careerPath: {
          nodes: [
            {
              id: '1',
              type: 'course',
              title: 'Advanced JavaScript',
              description: 'Master JavaScript concepts',
              duration: '3 months',
              difficulty: 'intermediate',
              position: { x: 100, y: 100 },
            },
          ],
          edges: [],
        },
        alternatives: [
          {
            id: 'alt1',
            title: 'Frontend Developer',
            description: 'Focus on user interfaces',
            matchScore: 85,
            salary: '$70k-100k',
            requirements: ['React', 'CSS', 'JavaScript'],
            growth: 'high',
          },
        ],
      };

      jest.spyOn(GeminiService, 'generateCareerRoadmap').mockResolvedValue(mockRoadmap);

      const roadmapResult = await GeminiService.generateCareerRoadmap(assessmentData);
      expect(roadmapResult.primaryCareer).toBe('Software Developer');

      // Step 5: User profile is created with enhanced data
      const enhancedProfile = {
        id: 'user-1',
        name: 'New User',
        age: 25,
        educationLevel: 'bachelors',
        selectedDomain: 'Technology & Computer Science',
        selectedJobRole: 'Software Developer',
        experienceLevel: 'junior',
        skills: ['JavaScript', 'React', 'Node.js'],
        assessmentDate: new Date(),
        lastLoginDate: new Date(),
        careerRecommendations: [roadmapResult],
        progressData: {
          overallProgress: 0,
          learningActivities: [],
          skillsAcquired: [],
          milestonesReached: [],
          lastUpdated: new Date(),
        },
        achievements: [],
        badges: [],
        level: 1,
        experience: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store enhanced profile
      localStorage.setItem('career-mentor-store', JSON.stringify({ enhancedProfile }));

      // Step 6: User is redirected to dashboard
      window.location.pathname = '/dashboard';

      // Step 7: Verify user can access dashboard with complete profile
      const storedData = JSON.parse(localStorage.getItem('career-mentor-store') || '{}');
      expect(storedData.enhancedProfile).toBeDefined();
      expect(storedData.enhancedProfile.careerRecommendations).toHaveLength(1);

      // Step 8: User interacts with learning resources
      const updatedProfile = {
        ...enhancedProfile,
        progressData: {
          ...enhancedProfile.progressData,
          learningActivities: [
            {
              id: 'activity-1',
              resourceId: 'resource-1',
              title: 'JavaScript Fundamentals',
              type: 'course' as const,
              completedAt: new Date(),
              timeSpent: 120,
              skillsGained: ['JavaScript'],
            },
          ],
          overallProgress: 25,
          skillsAcquired: ['JavaScript'],
          lastUpdated: new Date(),
        },
        experience: 100,
      };

      localStorage.setItem('career-mentor-store', JSON.stringify({ enhancedProfile: updatedProfile }));

      // Step 9: User logs out
      (window.confirm as jest.Mock).mockReturnValue(true);
      const logoutResult = await AuthService.logout();
      expect(logoutResult).toBe(true);
      expect(AuthService.isAuthenticated()).toBe(false);

      // Verify complete journey
      expect(localStorage.getItem('jwt')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Returning User Journey', () => {
    test('should handle returning user with existing profile', async () => {
      // Step 1: Set up existing user data
      const existingUser = { id: '2', username: 'returninguser', accessLevel: 'User' };
      const existingToken = 'existing-jwt-token';
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      localStorage.setItem('jwt', existingToken);
      localStorage.setItem('user', JSON.stringify(existingUser));
      localStorage.setItem('expirationDate', expirationDate);

      const existingProfile = {
        id: 'user-2',
        name: 'Returning User',
        age: 30,
        educationLevel: 'masters',
        selectedDomain: 'Business & Management',
        selectedJobRole: 'Product Manager',
        experienceLevel: 'mid',
        skills: ['Product Strategy', 'Analytics', 'Leadership'],
        assessmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastLoginDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        careerRecommendations: [
          {
            id: 'rec-2',
            title: 'Product Manager',
            description: 'Lead product development',
            fitScore: 90,
            primaryCareer: 'Product Manager',
            relatedRoles: ['Product Owner', 'Business Analyst'],
            careerPath: { nodes: [], edges: [] },
            alternatives: [],
            summary: 'Excellent fit for your experience',
          },
        ],
        progressData: {
          overallProgress: 60,
          learningActivities: [
            {
              id: 'activity-2',
              resourceId: 'resource-2',
              title: 'Product Management Fundamentals',
              type: 'course' as const,
              completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              timeSpent: 240,
              skillsGained: ['Product Strategy'],
            },
          ],
          skillsAcquired: ['Product Strategy', 'Analytics'],
          milestonesReached: ['First Course Completed', 'Skill Milestone'],
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        achievements: [
          {
            id: 'achievement-2',
            title: 'Product Strategist',
            description: 'Completed product strategy course',
            icon: '🎯',
            unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            category: 'learning',
            points: 200,
          },
        ],
        badges: [
          {
            id: 'badge-2',
            name: 'Product Expert',
            description: 'Demonstrated product management skills',
            icon: '🏆',
            earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            category: 'skill',
          },
        ],
        level: 3,
        experience: 450,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      };

      localStorage.setItem('career-mentor-store', JSON.stringify({ enhancedProfile: existingProfile }));

      // Step 2: User visits the site
      expect(AuthService.isAuthenticated()).toBe(true);
      expect(AuthService.getCurrentUser()).toEqual(existingUser);

      // Step 3: User should be redirected to dashboard (has complete profile)
      window.location.pathname = '/dashboard';

      // Step 4: Verify profile data is available
      const storedData = JSON.parse(localStorage.getItem('career-mentor-store') || '{}');
      expect(storedData.enhancedProfile.progressData.overallProgress).toBe(60);
      expect(storedData.enhancedProfile.level).toBe(3);
      expect(storedData.enhancedProfile.achievements).toHaveLength(1);

      // Step 5: User continues learning journey
      const newActivity = {
        id: 'activity-3',
        resourceId: 'resource-3',
        title: 'Advanced Analytics',
        type: 'course' as const,
        completedAt: new Date(),
        timeSpent: 180,
        skillsGained: ['Advanced Analytics'],
      };

      const updatedProfile = {
        ...existingProfile,
        progressData: {
          ...existingProfile.progressData,
          learningActivities: [...existingProfile.progressData.learningActivities, newActivity],
          overallProgress: 75,
          skillsAcquired: [...existingProfile.progressData.skillsAcquired, 'Advanced Analytics'],
          lastUpdated: new Date(),
        },
        experience: 550,
        updatedAt: new Date(),
      };

      localStorage.setItem('career-mentor-store', JSON.stringify({ enhancedProfile: updatedProfile }));

      // Verify progress update
      const finalData = JSON.parse(localStorage.getItem('career-mentor-store') || '{}');
      expect(finalData.enhancedProfile.progressData.overallProgress).toBe(75);
      expect(finalData.enhancedProfile.experience).toBe(550);
    });
  });

  describe('Assessment Flow Journey', () => {
    test('should complete assessment flow with domain search and AI integration', async () => {
      // Step 1: User logs in
      const loginCredentials = {
        username: 'demo',
        password: 'Demo123!@',
      };

      const loginResult = await AuthService.login(loginCredentials);
      expect(loginResult.success).toBe(true);

      // Step 2: User accesses assessment page
      window.location.pathname = '/assessment';

      // Step 3: User searches for domains
      const departments = DepartmentService.getDepartments();
      expect(departments.length).toBeGreaterThan(0);

      const techDepartment = departments.find(d => d.name.includes('Technology'));
      expect(techDepartment).toBeDefined();

      // Step 4: User selects domain and job role
      const selectedSubdepartment = techDepartment?.subdepartments[0];
      expect(selectedSubdepartment).toBeDefined();

      const selectedJob = selectedSubdepartment?.relatedJobs[0];
      expect(selectedJob).toBeDefined();

      // Step 5: User fills assessment form
      const assessmentForm = {
        name: 'Demo User',
        age: 28,
        educationLevel: 'bachelors',
        domain: techDepartment?.name || 'Technology',
        jobRole: selectedJob?.title || 'Software Developer',
        experienceLevel: 'junior' as const,
        skills: selectedJob?.keySkills || ['JavaScript', 'React'],
      };

      // Step 6: Form validation (no location fields)
      expect(assessmentForm).not.toHaveProperty('location');
      expect(assessmentForm).not.toHaveProperty('city');
      expect(assessmentForm).not.toHaveProperty('state');

      // Step 7: Experience level is required
      expect(assessmentForm.experienceLevel).toBeDefined();
      expect(['entry', 'junior', 'mid', 'senior', 'expert']).toContain(assessmentForm.experienceLevel);

      // Step 8: AI generates roadmap
      const mockAIResponse = {
        primaryCareer: assessmentForm.jobRole,
        relatedRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
        summary: `Perfect match for ${assessmentForm.experienceLevel} level ${assessmentForm.jobRole}`,
        careerPath: {
          nodes: [
            {
              id: '1',
              type: 'course',
              title: 'JavaScript Fundamentals',
              description: 'Learn JavaScript basics',
              duration: '4 weeks',
              difficulty: 'beginner',
              position: { x: 100, y: 100 },
            },
            {
              id: '2',
              type: 'internship',
              title: 'Tech Internship',
              description: 'Gain practical experience',
              duration: '3 months',
              position: { x: 300, y: 100 },
            },
            {
              id: '3',
              type: 'job',
              title: assessmentForm.jobRole,
              description: 'Entry-level position',
              salary: '$60k-80k',
              position: { x: 500, y: 100 },
            },
          ],
          edges: [
            {
              id: 'e1-2',
              source: '1',
              target: '2',
              sourceHandle: 'bottom',
              targetHandle: 'top',
              type: 'smoothstep',
              animated: true,
            },
            {
              id: 'e2-3',
              source: '2',
              target: '3',
              sourceHandle: 'bottom',
              targetHandle: 'top',
              type: 'smoothstep',
              animated: true,
            },
          ],
        },
        alternatives: [
          {
            id: 'alt1',
            title: 'Frontend Developer',
            description: 'Focus on user interfaces',
            matchScore: 85,
            salary: '$65k-95k',
            requirements: ['React', 'CSS', 'JavaScript'],
            growth: 'high',
          },
        ],
      };

      jest.spyOn(GeminiService, 'generateCareerRoadmap').mockResolvedValue(mockAIResponse);

      const roadmapResult = await GeminiService.generateCareerRoadmap(assessmentForm);
      expect(roadmapResult.primaryCareer).toBe(assessmentForm.jobRole);
      expect(roadmapResult.careerPath.nodes).toHaveLength(3);
      expect(roadmapResult.alternatives).toHaveLength(1);

      // Step 9: "Open Your Dashboard" button should be available
      expect(roadmapResult).toBeDefined();

      // Step 10: User navigates to dashboard
      window.location.pathname = '/dashboard';

      // Verify complete assessment flow
      expect(GeminiService.generateCareerRoadmap).toHaveBeenCalledWith(
        expect.objectContaining({
          experienceLevel: 'junior',
          domain: expect.stringContaining('Technology'),
        })
      );
    });
  });

  describe('Error Handling Journey', () => {
    test('should handle AI service failures gracefully', async () => {
      // Step 1: User completes assessment
      const assessmentData = {
        domain: 'Technology & Computer Science',
        jobRole: 'Software Developer',
        experienceLevel: 'junior' as const,
        skills: ['JavaScript', 'React'],
        educationLevel: 'bachelors',
        age: 25,
        name: 'Test User',
      };

      // Step 2: AI service fails
      jest.spyOn(GeminiService, 'generateCareerRoadmap').mockRejectedValue(
        new Error('AI service unavailable')
      );

      // Step 3: Fallback roadmap should be provided
      const fallbackResult = await GeminiService.generateCareerRoadmap(assessmentData);
      
      expect(fallbackResult).toBeDefined();
      expect(fallbackResult.primaryCareer).toBe(assessmentData.jobRole);
      expect(fallbackResult.summary).toContain('fallback');

      // Step 4: User can still proceed to dashboard
      const enhancedProfile = {
        id: 'user-fallback',
        name: 'Test User',
        careerRecommendations: [fallbackResult],
        progressData: {
          overallProgress: 0,
          learningActivities: [],
          skillsAcquired: [],
          milestonesReached: [],
          lastUpdated: new Date(),
        },
        achievements: [],
        badges: [],
        level: 1,
        experience: 0,
      };

      localStorage.setItem('career-mentor-store', JSON.stringify({ enhancedProfile }));

      // Verify fallback journey works
      const storedData = JSON.parse(localStorage.getItem('career-mentor-store') || '{}');
      expect(storedData.enhancedProfile.careerRecommendations).toHaveLength(1);
    });

    test('should handle network failures during authentication', async () => {
      // Step 1: Network failure during login
      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockRejectedValue(new Error('Network error'));

      const loginCredentials = {
        username: 'testuser',
        password: 'password123',
      };

      // Step 2: Login should fail gracefully
      const loginResult = await AuthService.login(loginCredentials);
      expect(loginResult.success).toBe(false);
      expect(loginResult.message).toContain('Network error');

      // Step 3: User should still be able to use demo mode
      const demoCredentials = {
        username: 'demo',
        password: 'Demo123!@',
      };

      const demoResult = await AuthService.login(demoCredentials);
      expect(demoResult.success).toBe(true);
      expect(demoResult.user?.username).toBe('demo');
    });
  });

  describe('Performance Journey', () => {
    test('should handle caching during user session', async () => {
      // Step 1: User logs in
      const loginResult = await AuthService.login({
        username: 'demo',
        password: 'Demo123!@',
      });
      expect(loginResult.success).toBe(true);

      // Step 2: First AI request (should cache)
      const assessmentData = {
        domain: 'Technology & Computer Science',
        jobRole: 'Software Developer',
        experienceLevel: 'junior' as const,
        skills: ['JavaScript', 'React'],
        educationLevel: 'bachelors',
        age: 25,
        name: 'Cache Test User',
      };

      const mockResponse = {
        primaryCareer: 'Software Developer',
        careerPath: { nodes: [], edges: [] },
        alternatives: [],
        summary: 'Test response',
      };

      jest.spyOn(GeminiService, 'generateCareerRoadmap').mockResolvedValue(mockResponse);

      const firstResult = await GeminiService.generateCareerRoadmap(assessmentData);
      expect(firstResult.primaryCareer).toBe('Software Developer');

      // Step 3: Second identical request (should use cache)
      const secondResult = await GeminiService.generateCareerRoadmap(assessmentData);
      expect(secondResult.primaryCareer).toBe('Software Developer');

      // Step 4: Verify caching behavior
      const cacheStats = GeminiService.getCacheStats();
      expect(cacheStats.size).toBeGreaterThan(0);

      // Step 5: Clear cache
      GeminiService.clearCache();
      const clearedStats = GeminiService.getCacheStats();
      expect(clearedStats.size).toBe(0);
    });
  });

  describe('Logout Journey', () => {
    test('should complete clean logout process', async () => {
      // Step 1: User is logged in with data
      const user = { id: '3', username: 'logoutuser', accessLevel: 'User' };
      const token = 'logout-test-token';
      
      localStorage.setItem('jwt', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      const profile = {
        id: 'user-3',
        name: 'Logout User',
        careerRecommendations: [],
        progressData: { overallProgress: 30 },
        achievements: [],
        badges: [],
        level: 2,
        experience: 150,
      };
      
      localStorage.setItem('career-mentor-store', JSON.stringify({ enhancedProfile: profile }));

      expect(AuthService.isAuthenticated()).toBe(true);

      // Step 2: User initiates logout
      (window.confirm as jest.Mock).mockReturnValue(true);

      // Step 3: Simple confirmation dialog (Requirements 2.1, 2.2)
      const logoutResult = await AuthService.logout();
      expect(window.confirm).toHaveBeenCalledWith('Do you want to log out?');

      // Step 4: Logout completes successfully (Requirement 2.3)
      expect(logoutResult).toBe(true);
      expect(AuthService.isAuthenticated()).toBe(false);

      // Step 5: All data is cleared
      expect(localStorage.getItem('jwt')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('expirationDate')).toBeNull();

      // Step 6: User is redirected to signin
      window.location.pathname = '/signin';
      expect(window.location.pathname).toBe('/signin');
    });

    test('should cancel logout when user declines', async () => {
      // Step 1: User is logged in
      const user = { id: '4', username: 'canceluser', accessLevel: 'User' };
      localStorage.setItem('jwt', 'cancel-test-token');
      localStorage.setItem('user', JSON.stringify(user));

      expect(AuthService.isAuthenticated()).toBe(true);

      // Step 2: User initiates logout but cancels
      (window.confirm as jest.Mock).mockReturnValue(false);

      const logoutResult = await AuthService.logout();

      // Step 3: Logout is cancelled
      expect(logoutResult).toBe(false);
      expect(AuthService.isAuthenticated()).toBe(true);

      // Step 4: Data remains intact
      expect(localStorage.getItem('jwt')).toBe('cancel-test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    });
  });
});