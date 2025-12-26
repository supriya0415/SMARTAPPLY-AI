/**
 * Integration Tests for Career Assessment Flow
 * Tests requirements 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.4
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CareerAssessmentForm } from '../CareerAssessmentForm';
import { DepartmentService } from '@/lib/services/departmentService';
import { GeminiService } from '@/lib/services/geminiService';

// Mock dependencies
jest.mock('@/lib/services/departmentService');
jest.mock('@/lib/services/geminiService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockDepartments = [
  {
    id: '1',
    name: 'Technology & Computer Science',
    description: 'Software development and IT careers',
    icon: '💻',
    subdepartments: [
      {
        id: '1-1',
        name: 'Software Development',
        description: 'Building applications and systems',
        relatedJobs: [
          {
            id: 'job-1',
            title: 'Software Developer',
            description: 'Develop software applications',
            averageSalary: '$75,000 - $120,000',
            keySkills: ['JavaScript', 'React', 'Node.js'],
            educationLevel: 'Bachelor\'s Degree',
            experienceLevel: 'Entry to Mid-level',
            growthOutlook: 'Excellent',
          },
        ],
      },
    ],
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Career Assessment Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (DepartmentService.getDepartments as jest.Mock).mockReturnValue(mockDepartments);
  });

  describe('Assessment Form Requirements (3.1, 3.2, 3.3, 3.4)', () => {
    test('should not display location fields (Requirement 3.1)', () => {
      renderWithRouter(<CareerAssessmentForm />);

      // Should not find location-related fields
      expect(screen.queryByLabelText(/location/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/city/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/state/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/country/i)).not.toBeInTheDocument();
    });

    test('should require experience level field (Requirement 3.2)', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      // Try to submit without selecting experience level
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/experience level is required/i)).toBeInTheDocument();
      });
    });

    test('should show validation error for missing experience level (Requirement 3.3)', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      // Fill other fields but leave experience level empty
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/experience level/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    test('should proceed when form is valid (Requirement 3.4)', async () => {
      const mockGenerateRoadmap = jest.fn().mockResolvedValue({
        primaryCareer: 'Software Developer',
        careerPath: { nodes: [], edges: [] },
        alternatives: [],
      });
      (GeminiService.generateCareerRoadmap as jest.Mock) = mockGenerateRoadmap;

      renderWithRouter(<CareerAssessmentForm />);

      // Fill all required fields
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'junior' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockGenerateRoadmap).toHaveBeenCalled();
      });
    });
  });

  describe('Domain Search Requirements (4.1, 4.2, 4.3, 4.4)', () => {
    test('should display search function for domains (Requirement 4.1)', () => {
      renderWithRouter(<CareerAssessmentForm />);

      const searchInput = screen.getByPlaceholderText(/search domains/i);
      expect(searchInput).toBeInTheDocument();
    });

    test('should filter domains in real-time (Requirement 4.2)', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      const searchInput = screen.getByPlaceholderText(/search domains/i);
      fireEvent.change(searchInput, { target: { value: 'technology' } });

      await waitFor(() => {
        expect(screen.getByText('Technology & Computer Science')).toBeInTheDocument();
      });

      // Clear search and verify all domains are shown again
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Technology & Computer Science')).toBeInTheDocument();
      });
    });

    test('should show relevant job roles when domain is selected (Requirement 4.3)', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      // Select a domain
      const domainButton = screen.getByText('Technology & Computer Science');
      fireEvent.click(domainButton);

      await waitFor(() => {
        expect(screen.getByText('Software Development')).toBeInTheDocument();
      });
    });

    test('should populate form when job role is selected (Requirement 4.4)', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      // Navigate through domain selection
      const domainButton = screen.getByText('Technology & Computer Science');
      fireEvent.click(domainButton);

      await waitFor(() => {
        const subdepartmentButton = screen.getByText('Software Development');
        fireEvent.click(subdepartmentButton);
      });

      await waitFor(() => {
        const jobButton = screen.getByText('Software Developer');
        fireEvent.click(jobButton);
      });

      // Verify form is populated
      await waitFor(() => {
        expect(screen.getByDisplayValue('Software Developer')).toBeInTheDocument();
      });
    });
  });

  describe('Gemini AI Integration (Requirement 5.4)', () => {
    test('should generate roadmap after successful assessment', async () => {
      const mockRoadmap = {
        primaryCareer: 'Software Developer',
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
      };

      (GeminiService.generateCareerRoadmap as jest.Mock).mockResolvedValue(mockRoadmap);

      renderWithRouter(<CareerAssessmentForm />);

      // Fill and submit form
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'junior' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(GeminiService.generateCareerRoadmap).toHaveBeenCalledWith(
          expect.objectContaining({
            experienceLevel: 'junior',
          })
        );
      });
    });

    test('should show "Open Your Dashboard" button after roadmap generation', async () => {
      const mockRoadmap = {
        primaryCareer: 'Software Developer',
        careerPath: { nodes: [], edges: [] },
        alternatives: [],
      };

      (GeminiService.generateCareerRoadmap as jest.Mock).mockResolvedValue(mockRoadmap);

      renderWithRouter(<CareerAssessmentForm />);

      // Complete assessment
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'junior' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/open your dashboard/i)).toBeInTheDocument();
      });
    });

    test('should handle AI generation errors gracefully', async () => {
      (GeminiService.generateCareerRoadmap as jest.Mock).mockRejectedValue(
        new Error('AI service unavailable')
      );

      renderWithRouter(<CareerAssessmentForm />);

      // Complete assessment
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'junior' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error generating roadmap/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    test('should validate all required fields', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Should show validation errors for required fields
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/experience level is required/i)).toBeInTheDocument();
      });
    });

    test('should validate experience level selection', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      // Try to submit without experience level
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/experience level is required/i)).toBeInTheDocument();
      });
    });

    test('should clear validation errors when fields are filled', async () => {
      renderWithRouter(<CareerAssessmentForm />);

      // Submit empty form to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });

      // Fill the name field
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('User Experience', () => {
    test('should show loading state during roadmap generation', async () => {
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (GeminiService.generateCareerRoadmap as jest.Mock).mockReturnValue(mockPromise);

      renderWithRouter(<CareerAssessmentForm />);

      // Fill and submit form
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'junior' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/generating/i)).toBeInTheDocument();
      });

      // Resolve the promise
      resolvePromise!({
        primaryCareer: 'Software Developer',
        careerPath: { nodes: [], edges: [] },
        alternatives: [],
      });

      await waitFor(() => {
        expect(screen.queryByText(/generating/i)).not.toBeInTheDocument();
      });
    });

    test('should disable submit button during processing', async () => {
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (GeminiService.generateCareerRoadmap as jest.Mock).mockReturnValue(mockPromise);

      renderWithRouter(<CareerAssessmentForm />);

      // Fill form
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const experienceSelect = screen.getByLabelText(/experience level/i);
      fireEvent.change(experienceSelect, { target: { value: 'junior' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Button should be disabled during processing
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Resolve the promise
      resolvePromise!({
        primaryCareer: 'Software Developer',
        careerPath: { nodes: [], edges: [] },
        alternatives: [],
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});