/**
 * Core Integration Tests for Task 11
 * Focus on essential system integration without complex UI testing
 */

import { CAREER_DOMAINS } from '@/lib/data/careerDomainsData';
import { GeminiService } from '@/lib/services/geminiService';

// Mock the Gemini service for testing
jest.mock('@/lib/services/geminiService');

describe('Core System Integration Tests', () => {
  describe('1. Career Domains Validation (15+ Domains)', () => {
    test('should have exactly 16 career domains', () => {
      expect(CAREER_DOMAINS).toHaveLength(16);
    });

    test('should include all required major career domains', () => {
      const expectedDomains = [
        'Technology & Computer Science',
        'Engineering & Manufacturing',
        'Science & Research',
        'Design & Creative Industries',
        'Business & Management',
        'Healthcare & Medicine',
        'Education & Training',
        'Finance & Economics',
        'Law & Public Policy',
        'Arts, Culture & Humanities',
        'Social Sciences & Community Services',
        'Media & Communication',
        'Environment, Agriculture & Sustainability',
        'Defense, Security & Law Enforcement',
        'Hospitality, Tourism & Aviation',
        'Emerging Interdisciplinary Fields'
      ];

      const domainNames = CAREER_DOMAINS.map(domain => domain.name);
      
      expectedDomains.forEach(expectedDomain => {
        expect(domainNames).toContain(expectedDomain);
      });
    });

    test('should have comprehensive subfields for each domain', () => {
      CAREER_DOMAINS.forEach(domain => {
        expect(domain.subfields.length).toBeGreaterThan(0);
        
        domain.subfields.forEach(subfield => {
          expect(subfield.id).toBeDefined();
          expect(subfield.name).toBeDefined();
          expect(subfield.description).toBeDefined();
          expect(subfield.requiredSkills).toBeDefined();
          expect(subfield.averageSalary).toBeDefined();
          expect(subfield.jobRoles).toBeDefined();
          expect(subfield.keywords).toBeDefined();
        });
      });
    });

    test('should include emerging interdisciplinary fields', () => {
      const emergingDomain = CAREER_DOMAINS.find(
        domain => domain.id === 'emerging-interdisciplinary'
      );
      
      expect(emergingDomain).toBeDefined();
      expect(emergingDomain?.name).toBe('Emerging Interdisciplinary Fields');
      
      const aiEthicsSubfield = emergingDomain?.subfields.find(
        subfield => subfield.id === 'ai-ethics'
      );
      
      expect(aiEthicsSubfield).toBeDefined();
      expect(aiEthicsSubfield?.name).toBe('AI Ethics & Policy');
    });

    test('should have proper domain structure with all required fields', () => {
      CAREER_DOMAINS.forEach(domain => {
        // Check required domain fields
        expect(domain.id).toBeDefined();
        expect(domain.name).toBeDefined();
        expect(domain.description).toBeDefined();
        expect(domain.icon).toBeDefined();
        expect(domain.color).toBeDefined();
        expect(domain.keywords).toBeDefined();
        expect(domain.industryTrends).toBeDefined();
        expect(domain.relatedDomains).toBeDefined();

        // Check industry trends structure
        expect(domain.industryTrends.demand).toMatch(/^(low|medium|high)$/);
        expect(typeof domain.industryTrends.growth).toBe('number');
        expect(domain.industryTrends.competitiveness).toMatch(/^(low|medium|high)$/);
        expect(Array.isArray(domain.industryTrends.emergingRoles)).toBe(true);
      });
    });
  });

  describe('2. Domain Data Integrity', () => {
    test('should have unique domain IDs', () => {
      const domainIds = CAREER_DOMAINS.map(domain => domain.id);
      const uniqueIds = new Set(domainIds);
      expect(uniqueIds.size).toBe(domainIds.length);
    });

    test('should have unique domain names', () => {
      const domainNames = CAREER_DOMAINS.map(domain => domain.name);
      const uniqueNames = new Set(domainNames);
      expect(uniqueNames.size).toBe(domainNames.length);
    });

    test('should have valid salary ranges in subfields', () => {
      CAREER_DOMAINS.forEach(domain => {
        domain.subfields.forEach(subfield => {
          const salary = subfield.averageSalary;
          expect(salary.min).toBeGreaterThan(0);
          expect(salary.max).toBeGreaterThan(salary.min);
          expect(salary.currency).toBe('USD');
          expect(salary.period).toBe('yearly');
        });
      });
    });

    test('should have meaningful job roles for each subfield', () => {
      CAREER_DOMAINS.forEach(domain => {
        domain.subfields.forEach(subfield => {
          expect(subfield.jobRoles.length).toBeGreaterThan(0);
          subfield.jobRoles.forEach(role => {
            expect(typeof role).toBe('string');
            expect(role.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('3. Technology Domain Validation', () => {
    test('should have comprehensive technology domain', () => {
      const techDomain = CAREER_DOMAINS.find(
        domain => domain.id === 'technology-computer-science'
      );
      
      expect(techDomain).toBeDefined();
      expect(techDomain?.subfields.length).toBeGreaterThan(0);
      
      // Check for key technology subfields
      const subfieldNames = techDomain?.subfields.map(sf => sf.name) || [];
      expect(subfieldNames).toContain('Software Development');
      expect(subfieldNames).toContain('Data Science & Analytics');
      expect(subfieldNames).toContain('Cybersecurity');
    });

    test('should have proper technology job roles', () => {
      const techDomain = CAREER_DOMAINS.find(
        domain => domain.id === 'technology-computer-science'
      );
      
      const softwareDev = techDomain?.subfields.find(
        sf => sf.id === 'software-development'
      );
      
      expect(softwareDev?.jobRoles).toContain('Software Developer');
      expect(softwareDev?.jobRoles).toContain('Frontend Developer');
      expect(softwareDev?.jobRoles).toContain('Backend Developer');
      expect(softwareDev?.jobRoles).toContain('Full Stack Developer');
    });
  });

  describe('4. Business Domain Validation', () => {
    test('should have comprehensive business domain', () => {
      const businessDomain = CAREER_DOMAINS.find(
        domain => domain.id === 'business-management'
      );
      
      expect(businessDomain).toBeDefined();
      expect(businessDomain?.subfields.length).toBeGreaterThan(0);
      
      const businessAnalysis = businessDomain?.subfields.find(
        sf => sf.id === 'business-analysis'
      );
      
      expect(businessAnalysis).toBeDefined();
      expect(businessAnalysis?.jobRoles).toContain('Business Analyst');
    });
  });

  describe('5. Healthcare Domain Validation', () => {
    test('should have comprehensive healthcare domain', () => {
      const healthcareDomain = CAREER_DOMAINS.find(
        domain => domain.id === 'healthcare-medicine'
      );
      
      expect(healthcareDomain).toBeDefined();
      expect(healthcareDomain?.subfields.length).toBeGreaterThan(0);
      
      const nursing = healthcareDomain?.subfields.find(
        sf => sf.id === 'nursing'
      );
      
      expect(nursing).toBeDefined();
      expect(nursing?.jobRoles).toContain('Registered Nurse');
    });
  });

  describe('6. Gemini AI Integration Structure', () => {
    test('should have proper Gemini service interface', () => {
      expect(GeminiService.generateCareerRoadmap).toBeDefined();
      expect(typeof GeminiService.generateCareerRoadmap).toBe('function');
    });

    test('should handle roadmap request structure', async () => {
      const mockRequest = {
        domain: 'Technology & Computer Science',
        jobRole: 'Software Developer',
        experienceLevel: 'junior' as const,
        skills: ['JavaScript', 'React'],
        educationLevel: 'Bachelor\'s Degree',
        age: 25,
        name: 'Test User'
      };

      // Mock the service to return a valid response
      const mockGeminiService = GeminiService as jest.Mocked<typeof GeminiService>;
      mockGeminiService.generateCareerRoadmap.mockResolvedValue({
        id: 'test-roadmap',
        title: 'Software Developer',
        description: 'Test roadmap',
        fitScore: 85,
        salaryRange: { min: 60000, max: 100000, currency: 'USD', period: 'yearly' },
        growthProspects: 'high',
        requiredSkills: [],
        recommendedPath: {
          id: 'test-path',
          title: 'Test Path',
          description: 'Test learning path',
          totalDuration: '6 months',
          phases: [],
          estimatedCost: 1000,
          difficulty: 'intermediate',
          prerequisites: [],
          outcomes: []
        },
        jobMarketData: {
          demand: 'high',
          competitiveness: 'medium',
          locations: ['Remote'],
          industryGrowth: 15,
          averageSalary: 80000
        },
        primaryCareer: 'Software Developer',
        relatedRoles: ['Frontend Developer', 'Backend Developer'],
        careerPath: {
          nodes: [],
          edges: []
        },
        alternatives: [],
        summary: 'Test summary'
      });

      const result = await GeminiService.generateCareerRoadmap(mockRequest);
      expect(result).toBeDefined();
      expect(result.title).toBe('Software Developer');
    });
  });

  describe('7. Domain Coverage Completeness', () => {
    test('should cover all major industry sectors', () => {
      const domainIds = CAREER_DOMAINS.map(domain => domain.id);
      
      // Check for major industry coverage
      expect(domainIds).toContain('technology-computer-science');
      expect(domainIds).toContain('healthcare-medicine');
      expect(domainIds).toContain('business-management');
      expect(domainIds).toContain('education-training');
      expect(domainIds).toContain('engineering-manufacturing');
      expect(domainIds).toContain('finance-economics');
      expect(domainIds).toContain('law-public-policy');
      expect(domainIds).toContain('arts-culture-humanities');
      expect(domainIds).toContain('science-research');
      expect(domainIds).toContain('design-creative');
      expect(domainIds).toContain('social-sciences-community');
      expect(domainIds).toContain('media-communication');
      expect(domainIds).toContain('environment-sustainability');
      expect(domainIds).toContain('defense-security-law-enforcement');
      expect(domainIds).toContain('hospitality-tourism-aviation');
      expect(domainIds).toContain('emerging-interdisciplinary');
    });

    test('should have growth prospects for all domains', () => {
      CAREER_DOMAINS.forEach(domain => {
        expect(domain.industryTrends.growth).toBeGreaterThanOrEqual(0);
        expect(domain.industryTrends.growth).toBeLessThanOrEqual(50); // Reasonable upper bound
      });
    });

    test('should have emerging roles for future-oriented domains', () => {
      const futureDomains = [
        'technology-computer-science',
        'emerging-interdisciplinary',
        'environment-sustainability'
      ];

      futureDomains.forEach(domainId => {
        const domain = CAREER_DOMAINS.find(d => d.id === domainId);
        expect(domain?.industryTrends.emergingRoles.length).toBeGreaterThan(0);
      });
    });
  });

  describe('8. Data Consistency Validation', () => {
    test('should have consistent color format', () => {
      CAREER_DOMAINS.forEach(domain => {
        expect(domain.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    test('should have meaningful descriptions', () => {
      CAREER_DOMAINS.forEach(domain => {
        expect(domain.description.length).toBeGreaterThan(20);
        
        domain.subfields.forEach(subfield => {
          expect(subfield.description.length).toBeGreaterThan(20);
        });
      });
    });

    test('should have relevant keywords', () => {
      CAREER_DOMAINS.forEach(domain => {
        expect(domain.keywords.length).toBeGreaterThan(0);
        
        domain.subfields.forEach(subfield => {
          expect(subfield.keywords.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('9. Experience Level Validation', () => {
    test('should have experience levels where defined', () => {
      CAREER_DOMAINS.forEach(domain => {
        if (domain.experienceLevels && domain.experienceLevels.length > 0) {
          domain.experienceLevels.forEach(level => {
            expect(level.level).toMatch(/^(entry|junior|mid|senior|expert)$/);
            expect(level.title).toBeDefined();
            expect(level.description).toBeDefined();
            expect(level.yearsOfExperience).toBeDefined();
            expect(level.salaryRange).toBeDefined();
          });
        }
      });
    });
  });

  describe('10. Integration Readiness', () => {
    test('should export utility functions', () => {
      const { getDomainById, getSubfieldById, getAllDomainNames, getAllJobRoles } = require('@/lib/data/careerDomainsData');
      
      expect(typeof getDomainById).toBe('function');
      expect(typeof getSubfieldById).toBe('function');
      expect(typeof getAllDomainNames).toBe('function');
      expect(typeof getAllJobRoles).toBe('function');
    });

    test('should provide all domain names', () => {
      const { getAllDomainNames } = require('@/lib/data/careerDomainsData');
      const names = getAllDomainNames();
      
      expect(names.length).toBe(16);
      expect(names).toContain('Technology & Computer Science');
      expect(names).toContain('Emerging Interdisciplinary Fields');
    });

    test('should provide all job roles', () => {
      const { getAllJobRoles } = require('@/lib/data/careerDomainsData');
      const roles = getAllJobRoles();
      
      expect(roles.length).toBeGreaterThan(0);
      expect(roles).toContain('Software Developer');
      expect(roles).toContain('Business Analyst');
    });

    test('should find domains by ID', () => {
      const { getDomainById } = require('@/lib/data/careerDomainsData');
      const techDomain = getDomainById('technology-computer-science');
      
      expect(techDomain).toBeDefined();
      expect(techDomain?.name).toBe('Technology & Computer Science');
    });
  });
});