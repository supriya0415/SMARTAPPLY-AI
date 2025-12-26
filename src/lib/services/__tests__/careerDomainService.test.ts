import { CareerDomainService } from '../careerDomainService';
import { DomainSearchFilters, ExperienceLevel } from '../../types/careerDomainTypes';

describe('CareerDomainService', () => {
  describe('searchDomains', () => {
    it('should return all domains when no filters are applied', () => {
      const filters: DomainSearchFilters = {};
      const result = CareerDomainService.searchDomains(filters);
      
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.totalCount).toBe(result.results.length);
    });

    it('should filter domains by query', () => {
      const filters: DomainSearchFilters = { query: 'technology' };
      const result = CareerDomainService.searchDomains(filters);
      
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.some(r => r.title.toLowerCase().includes('technology'))).toBe(true);
    });

    it('should filter by experience level', () => {
      const filters: DomainSearchFilters = { experienceLevels: ['entry'] };
      const result = CareerDomainService.searchDomains(filters);
      
      // Should return career examples that match the experience level
      const careerResults = result.results.filter(r => r.type === 'career');
      expect(careerResults.length).toBeGreaterThan(0);
    });

    it('should return suggestions when no results found', () => {
      const filters: DomainSearchFilters = { query: 'nonexistentcareer' };
      const result = CareerDomainService.searchDomains(filters);
      
      expect(result.results.length).toBe(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('getAllJobRoles', () => {
    it('should return a list of job roles', () => {
      const jobRoles = CareerDomainService.getAllJobRoles();
      
      expect(Array.isArray(jobRoles)).toBe(true);
      expect(jobRoles.length).toBeGreaterThan(0);
      expect(jobRoles).toContain('Software Developer');
    });
  });

  describe('getJobRolesByDomain', () => {
    it('should return job roles for a specific domain', () => {
      const jobRoles = CareerDomainService.getJobRolesByDomain('technology-computer-science');
      
      expect(Array.isArray(jobRoles)).toBe(true);
      expect(jobRoles.length).toBeGreaterThan(0);
      expect(jobRoles.some(role => role.includes('Developer') || role.includes('Engineer'))).toBe(true);
    });

    it('should filter job roles by experience level', () => {
      const jobRoles = CareerDomainService.getJobRolesByDomain('technology-computer-science', 'entry');
      
      expect(Array.isArray(jobRoles)).toBe(true);
      expect(jobRoles.length).toBeGreaterThan(0);
    });
  });

  describe('searchJobRoles', () => {
    it('should search job roles by query', () => {
      const results = CareerDomainService.searchJobRoles('developer');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(role => role.toLowerCase().includes('developer'))).toBe(true);
    });

    it('should limit results to 10', () => {
      const results = CareerDomainService.searchJobRoles('a'); // Very broad search
      
      expect(results.length).toBeLessThanOrEqual(10);
    });
  });

  describe('getDomainRecommendations', () => {
    it('should return recommendations based on skills and interests', () => {
      const skills = ['JavaScript', 'Problem Solving'];
      const interests = ['technology', 'programming'];
      const experienceLevel: ExperienceLevel = 'entry';
      
      const recommendations = CareerDomainService.getDomainRecommendations(skills, interests, experienceLevel);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].matchScore).toBeGreaterThan(0);
      expect(recommendations[0].domain).toBeDefined();
    });

    it('should sort recommendations by match score', () => {
      const skills = ['Python', 'Data Analysis'];
      const interests = ['data science', 'analytics'];
      const experienceLevel: ExperienceLevel = 'mid';
      
      const recommendations = CareerDomainService.getDomainRecommendations(skills, interests, experienceLevel);
      
      if (recommendations.length > 1) {
        expect(recommendations[0].matchScore).toBeGreaterThanOrEqual(recommendations[1].matchScore);
      }
    });
  });

  describe('validateDomainSelection', () => {
    it('should validate a correct domain selection', () => {
      const selection = {
        domainId: 'technology-computer-science',
        experienceLevel: 'entry' as ExperienceLevel,
        selectedSkills: ['JavaScript', 'Problem Solving'],
        careerGoals: ['Become a software developer']
      };
      
      const result = CareerDomainService.validateDomainSelection(selection);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should return errors for invalid domain selection', () => {
      const selection = {
        domainId: 'nonexistent-domain',
        experienceLevel: 'entry' as ExperienceLevel,
        selectedSkills: ['JavaScript'],
        careerGoals: []
      };
      
      const result = CareerDomainService.validateDomainSelection(selection);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('DOMAIN_NOT_FOUND');
    });

    it('should return warnings for misaligned skills', () => {
      const selection = {
        domainId: 'technology-computer-science',
        experienceLevel: 'entry' as ExperienceLevel,
        selectedSkills: ['Cooking', 'Dancing'], // Unrelated skills
        careerGoals: ['Work in tech']
      };
      
      const result = CareerDomainService.validateDomainSelection(selection);
      
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});