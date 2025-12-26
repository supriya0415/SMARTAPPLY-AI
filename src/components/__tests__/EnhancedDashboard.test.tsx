/**
 * Dashboard Component Tests
 * Tests requirements 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3, 8.4
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedDashboard } from '../dashboard/EnhancedDashboard';
import { useUserStore } from '@/lib/stores/userStore';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/lib/stores/userStore');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockEnhancedProfile = {
  id: 'user-123',
  name: 'John Doe',
  age: 25,
  educationLevel: 'bachelors',
  selectedDomain: 'Technology & Computer Science',
  selectedJobRole: 'Software Developer',
  experienceLevel: 'junior',
  skills: ['JavaScript', 'React', 'Node.js'],
  assessmentDate: new Date(),
  lastLoginDate: new Date(),
  careerRecommendations: [
    {
      id: 'rec-1',
      title: 'Software Developer',
      description: 'Develop software applications',
      fitScore: 85,
      salaryRange: { min: 70000, max: 100000, currency: 'USD', period: 'yearly' },
      growthProspects: 'high' as const,
      requiredSkills: [
        { id: 'skill-1', name: 'JavaScript', category: 'technical', isRequired: true, priority: 'critical' },
      ],
      recommendedPath: {
        id: 'path-1',
        title: 'Software Developer Path',
        description: 'Learn software development',
        totalDuration: '6 months',
        phases: [],
        estimatedCost: 1000,
        difficulty: 'intermediate',
        prerequisites: [],
        outcomes: [],
      },
      jobMarketData: {
        demand: 'high',
        competitiveness: 'medium',
        locations: ['Remote', 'San Francisco'],
        industryGrowth: 15,
        averageSalary: 85000,
      },
      primaryCareer: 'Software Developer',
      relatedRoles: ['Frontend Developer', 'Backend Developer'],
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
        ],
        edges: [],
      },
      alternatives: [],
      summary: 'Great fit for your skills',
    },
  ],
  progressData: {
    overallProgress: 45,
    learningActivities: [
      {
        id: 'activity-1',
        resourceId: 'resource-1',
        title: 'JavaScript Course',
        type: 'course' as const,
        completedAt: new Date(),
        timeSpent: 120,
        skillsGained: ['JavaScript'],
      },
    ],
    skillsAcquired: ['JavaScript'],
    milestonesReached: ['First Course Completed'],
    lastUpdated: new Date(),
  },
  achievements: [
    {
      id: 'achievement-1',
      title: 'First Steps',
      description: 'Completed first learning activity',
      icon: '🎯',
      unlockedAt: new Date(),
      category: 'learning',
      points: 100,
    },
  ],
  badges: [
    {
      id: 'badge-1',
      name: 'JavaScript Learner',
      description: 'Started learning JavaScript',
      icon: '📚',
      earnedAt: new Date(),
      category: 'skill',
    },
  ],
  level: 2,
  experience: 250,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Enhanced Dashboard Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserStore as jest.Mock).mockReturnValue({
      setEnhancedProfile: jest.fn(),
      awardExperience: jest.fn(),
    });
  });

  describe('Clean Dashboard Layout (Requirements 6.1)', () => {
    test('should display clean, organized interface', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      // Check for main dashboard sections
      expect(screen.getByText('Career Roadmap')).toBeInTheDocument();
      expect(screen.getByText('Learning Resources')).toBeInTheDocument();
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
      expect(screen.getByText('Similar Jobs')).toBeInTheDocument();
    });

    test('should display user profile information in header', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Developer')).toBeInTheDocument();
    });

    test('should show quick stats footer', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText('Career Matches')).toBeInTheDocument();
      expect(screen.getByText('Completed Activities')).toBeInTheDocument();
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      expect(screen.getByText('Current Level')).toBeInTheDocument();
    });
  });

  describe('Career Roadmap Display (Requirements 6.2)', () => {
    test('should display personalized career roadmap', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText('Software Developer')).toBeInTheDocument();
      expect(screen.getByText('Great fit for your skills')).toBeInTheDocument();
    });

    test('should handle missing roadmap gracefully', () => {
      const profileWithoutRoadmap = {
        ...mockEnhancedProfile,
        careerRecommendations: [],
      };

      renderWithRouter(<EnhancedDashboard profile={profileWithoutRoadmap} />);

      expect(screen.getByText(/complete your career assessment/i)).toBeInTheDocument();
    });

    test('should allow viewing full roadmap', () => {
      const mockNavigate = jest.fn();
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const viewRoadmapButton = screen.getByText(/view full roadmap/i);
      fireEvent.click(viewRoadmapButton);

      expect(mockNavigate).toHaveBeenCalledWith('/learning-roadmap');
    });

    test('should allow updating roadmap', () => {
      const mockNavigate = jest.fn();
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const updateButton = screen.getByText(/update roadmap/i);
      fireEvent.click(updateButton);

      expect(mockNavigate).toHaveBeenCalledWith('/assessment');
    });
  });

  describe('Learning Resources Section (Requirements 6.3)', () => {
    test('should display domain-specific learning materials', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText(/learning resources/i)).toBeInTheDocument();
      expect(screen.getByText(/technology/i)).toBeInTheDocument();
    });

    test('should handle resource completion', async () => {
      const mockSetEnhancedProfile = jest.fn();
      const mockAwardExperience = jest.fn();
      
      (useUserStore as jest.Mock).mockReturnValue({
        setEnhancedProfile: mockSetEnhancedProfile,
        awardExperience: mockAwardExperience,
      });

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const completeButton = screen.getByText(/mark complete/i);
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(mockAwardExperience).toHaveBeenCalledWith(50, expect.any(String));
        expect(mockSetEnhancedProfile).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Resource marked as completed! +50 XP');
      });
    });

    test('should allow viewing all resources', () => {
      const mockNavigate = jest.fn();
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const viewAllButton = screen.getByText(/view all resources/i);
      fireEvent.click(viewAllButton);

      expect(mockNavigate).toHaveBeenCalledWith('/learning-resources');
    });
  });

  describe('Progress Tracking (Requirements 6.4)', () => {
    test('should show progress tracking visualization', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText(/progress/i)).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument(); // Overall progress
    });

    test('should display completed activities count', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText('1')).toBeInTheDocument(); // Completed activities count
    });

    test('should allow viewing detailed progress', () => {
      const mockNavigate = jest.fn();
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const detailedProgressButton = screen.getByText(/view detailed progress/i);
      fireEvent.click(detailedProgressButton);

      expect(mockNavigate).toHaveBeenCalledWith('/achievements');
    });
  });

  describe('Similar Jobs Recommendation (Requirements 8.1, 8.2, 8.3, 8.4)', () => {
    test('should display similar job roles from same domain', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText(/similar jobs/i)).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    });

    test('should handle job details viewing', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const jobButton = screen.getByText('Frontend Developer');
      fireEvent.click(jobButton);

      expect(toast.info).toHaveBeenCalledWith(expect.stringContaining('Viewing details'));
    });

    test('should handle job saving', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const saveButton = screen.getByText(/save job/i);
      fireEvent.click(saveButton);

      expect(toast.success).toHaveBeenCalledWith('Job saved to your bookmarks');
    });

    test('should allow viewing all jobs', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const viewAllJobsButton = screen.getByText(/view all jobs/i);
      fireEvent.click(viewAllJobsButton);

      expect(toast.info).toHaveBeenCalledWith('Opening job search...');
    });
  });

  describe('Responsive Design (Requirements 6.5)', () => {
    test('should render properly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      // Should still display all main sections
      expect(screen.getByText('Career Roadmap')).toBeInTheDocument();
      expect(screen.getByText('Learning Resources')).toBeInTheDocument();
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
      expect(screen.getByText('Similar Jobs')).toBeInTheDocument();
    });

    test('should render properly on desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      // Should display grid layout properly
      expect(screen.getByText('Career Roadmap')).toBeInTheDocument();
      expect(screen.getByText('Learning Resources')).toBeInTheDocument();
    });
  });

  describe('Logout Functionality (Requirements 2.1, 2.2)', () => {
    test('should show simple logout confirmation', () => {
      window.confirm = jest.fn().mockReturnValue(true);
      
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const logoutButton = screen.getByText(/logout/i);
      fireEvent.click(logoutButton);

      expect(window.confirm).toHaveBeenCalledWith('Do you want to log out?');
    });

    test('should handle logout confirmation', () => {
      window.confirm = jest.fn().mockReturnValue(true);
      const mockNavigate = jest.fn();
      
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const logoutButton = screen.getByText(/logout/i);
      fireEvent.click(logoutButton);

      expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    test('should cancel logout when user declines', () => {
      window.confirm = jest.fn().mockReturnValue(false);
      const mockNavigate = jest.fn();

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const logoutButton = screen.getByText(/logout/i);
      fireEvent.click(logoutButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing profile data gracefully', () => {
      const incompleteProfile = {
        ...mockEnhancedProfile,
        careerRecommendations: undefined,
        progressData: undefined,
        achievements: undefined,
      };

      renderWithRouter(<EnhancedDashboard profile={incompleteProfile} />);

      // Should still render without crashing
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Should show 0 for missing data
    });

    test('should handle empty arrays gracefully', () => {
      const emptyProfile = {
        ...mockEnhancedProfile,
        careerRecommendations: [],
        progressData: {
          ...mockEnhancedProfile.progressData,
          learningActivities: [],
        },
        achievements: [],
      };

      renderWithRouter(<EnhancedDashboard profile={emptyProfile} />);

      expect(screen.getByText('0')).toBeInTheDocument(); // Career matches
      expect(screen.getByText('0')).toBeInTheDocument(); // Completed activities
    });
  });

  describe('User Experience', () => {
    test('should provide clear navigation options', () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      expect(screen.getByText(/view full roadmap/i)).toBeInTheDocument();
      expect(screen.getByText(/view all resources/i)).toBeInTheDocument();
      expect(screen.getByText(/view detailed progress/i)).toBeInTheDocument();
      expect(screen.getByText(/view all jobs/i)).toBeInTheDocument();
    });

    test('should show appropriate feedback messages', async () => {
      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const completeButton = screen.getByText(/mark complete/i);
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('Resource marked as completed')
        );
      });
    });

    test('should update profile state correctly', async () => {
      const mockSetEnhancedProfile = jest.fn();
      
      (useUserStore as jest.Mock).mockReturnValue({
        setEnhancedProfile: mockSetEnhancedProfile,
        awardExperience: jest.fn(),
      });

      renderWithRouter(<EnhancedDashboard profile={mockEnhancedProfile} />);

      const completeButton = screen.getByText(/mark complete/i);
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(mockSetEnhancedProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            progressData: expect.objectContaining({
              overallProgress: expect.any(Number),
              lastUpdated: expect.any(Date),
            }),
          })
        );
      });
    });
  });
});