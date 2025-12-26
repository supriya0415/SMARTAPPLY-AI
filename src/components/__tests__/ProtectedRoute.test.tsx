/**
 * Protected Route Component Tests
 * Tests requirements 1.1, 1.2, 4.3, 4.5
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../ProtectedRoute';
import { AuthService } from '@/lib/services/authService';
import { useUserStore } from '@/lib/stores/userStore';

// Mock dependencies
jest.mock('@/lib/services/authService');
jest.mock('@/lib/stores/userStore');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate-to">{to}</div>,
}));

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

const mockEnhancedProfile = {
  id: 'user-123',
  name: 'John Doe',
  achievements: [],
  badges: [],
  level: 2,
  careerRecommendations: [
    {
      id: 'rec-1',
      title: 'Software Developer',
      description: 'Test recommendation',
    },
  ],
  progressData: {
    overallProgress: 50,
    learningActivities: [],
    skillsAcquired: [],
    milestonesReached: [],
    lastUpdated: new Date(),
  },
};

describe('ProtectedRoute Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock default store state
    (useUserStore as jest.Mock).mockReturnValue({
      enhancedProfile: null,
    });
  });

  describe('Authentication Requirements (1.1, 1.2)', () => {
    test('should redirect unauthenticated users to signin', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/signin');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should allow authenticated users to access protected routes', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: mockEnhancedProfile,
      });

      render(
        <MemoryRouter initialEntries={['/profile']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
    });
  });

  describe('Enhanced Profile Requirements (4.3, 4.5)', () => {
    test('should redirect to assessment when dashboard requires enhanced profile but user has none', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should redirect to dashboard when user tries to access assessment but has completed it', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: mockEnhancedProfile,
      });

      render(
        <MemoryRouter initialEntries={['/assessment']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/dashboard');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should allow access to dashboard when user has complete enhanced profile', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: mockEnhancedProfile,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
    });

    test('should allow access to assessment when user has no enhanced profile', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      render(
        <MemoryRouter initialEntries={['/assessment']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
    });
  });

  describe('Enhanced Profile Validation', () => {
    test('should identify incomplete enhanced profile correctly', () => {
      const incompleteProfile = {
        id: 'user-123',
        name: 'John Doe',
        // Missing required fields: achievements, badges, level, careerRecommendations, progressData
      };

      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: incompleteProfile,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });

    test('should identify profile without career recommendations as incomplete', () => {
      const profileWithoutRecommendations = {
        ...mockEnhancedProfile,
        careerRecommendations: [],
      };

      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: profileWithoutRecommendations,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });

    test('should check localStorage as fallback when Zustand store is empty', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      // Mock localStorage with complete profile
      const storageData = {
        enhancedProfile: mockEnhancedProfile,
      };
      localStorage.setItem('career-mentor-store', JSON.stringify(storageData));

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('should handle corrupted localStorage gracefully', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      // Mock corrupted localStorage
      localStorage.setItem('career-mentor-store', 'invalid-json');

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });
  });

  describe('Route-Specific Behavior', () => {
    test('should allow access to non-enhanced-profile routes when authenticated', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      render(
        <MemoryRouter initialEntries={['/profile']}>
          <ProtectedRoute requiresEnhancedProfile={false}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
    });

    test('should handle dashboard route specifically', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });

    test('should handle assessment route specifically', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: mockEnhancedProfile,
      });

      render(
        <MemoryRouter initialEntries={['/assessment']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/dashboard');
    });
  });

  describe('AdminRoute Component', () => {
    test('should redirect unauthenticated users to signin', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/signin');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should redirect non-admin users to signin', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/signin');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should allow admin users to access admin routes', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (AuthService.isAdmin as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined enhanced profile', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: undefined,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });

    test('should handle null values in enhanced profile', () => {
      const profileWithNulls = {
        ...mockEnhancedProfile,
        achievements: null,
        badges: null,
        careerRecommendations: null,
      };

      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: profileWithNulls,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });

    test('should handle empty localStorage', () => {
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: null,
      });

      localStorage.clear();

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/assessment');
    });
  });

  describe('Debug Logging', () => {
    test('should log authentication checks', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (useUserStore as jest.Mock).mockReturnValue({
        enhancedProfile: mockEnhancedProfile,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute requiresEnhancedProfile={true}>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      // Should log the route check
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should log navigation decisions', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      // Should log the navigation decision
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});