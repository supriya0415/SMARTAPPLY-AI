import { CareerDomainService } from '../careerDomainService';
import { CareerDomainValidator } from '../../utils/careerDomainValidation';
import { CAREER_DOMAINS } from '../../data/careerDomainsData';

describe('Career Domain System Demo', () => {
  test('should demonstrate comprehensive domain structure with 15+ categories', () => {
    // Verify we have 15+ domains
    expect(CAREER_DOMAINS.length).toBeGreaterThanOrEqual(15);
    
    // Verify each domain has required structure
    CAREER_DOMAINS.forEach(domain => {
      expect(domain.id).toBeDefined();
      expect(domain.name).toBeDefined();
      expect(domain.description).toBeDefined();
      expect(domain.subfields).toBeDefined();
      expect(domain.keywords).toBeDefined();
      expect(domain.industryTrends).toBeDefined();
      expect(Array.isArray(domain.subfields)).toBe(true);
      expect(Array.isArray(domain.keywords)).toBe(true);
    });

    console.log(`✅ Successfully loaded ${CAREER_DOMAINS.length} career domains`);
  });

  test('should demonstrate search functionality', () => {
    // Search for technology-related careers
    const techResults = CareerDomainService.searchDomains({ query: 'technology' });
    expect(techResults.results.length).toBeGreaterThan(0);
    
    // Search for specific job roles
    const developerRoles = CareerDomainService.searchJobRoles('developer');
    expect(developerRoles.length).toBeGreaterThan(0);
    
    // Search by experience level
    const entryLevelResults = CareerDomainService.searchDomains({ 
      experienceLevels: ['entry'] 
    });
    expect(entryLevelResults.results.length).toBeGreaterThan(0);

    console.log(`✅ Search functionality working: ${techResults.results.length} tech results, ${developerRoles.length} developer roles`);
  });

  test('should demonstrate domain recommendations', () => {
    const skills = ['JavaScript', 'Problem Solving', 'Communication'];
    const interests = ['technology', 'programming', 'web development'];
    const experienceLevel = 'entry';

    const recommendations = CareerDomainService.getDomainRecommendations(
      skills, 
      interests, 
      experienceLevel
    );

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].matchScore).toBeGreaterThan(0);
    expect(recommendations[0].domain).toBeDefined();
    expect(recommendations[0].matchReasons.length).toBeGreaterThan(0);

    console.log(`✅ Generated ${recommendations.length} domain recommendations with scores: ${recommendations.map(r => r.matchScore.toFixed(2)).join(', ')}`);
  });

  test('should demonstrate validation functionality', () => {
    // Valid selection
    const validSelection = {
      domainId: 'technology-computer-science',
      experienceLevel: 'entry' as const,
      selectedSkills: ['JavaScript', 'Problem Solving'],
      careerGoals: ['Become a software developer']
    };

    const validResult = CareerDomainValidator.validateDomainSelection(validSelection);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors.length).toBe(0);

    // Invalid selection
    const invalidSelection = {
      domainId: 'nonexistent-domain',
      experienceLevel: 'entry' as const,
      selectedSkills: [],
      careerGoals: []
    };

    const invalidResult = CareerDomainValidator.validateDomainSelection(invalidSelection);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);

    console.log(`✅ Validation working: Valid selection passed, invalid selection caught ${invalidResult.errors.length} errors`);
  });

  test('should demonstrate assessment form validation', () => {
    const validForm = {
      fullName: 'John Doe',
      age: 25,
      educationLevel: 'bachelors',
      domain: 'technology-computer-science',
      jobRole: 'Software Developer',
      experienceLevel: 'entry' as const,
      skills: ['JavaScript', 'HTML', 'CSS']
    };

    const result = CareerDomainValidator.validateAssessmentForm(validForm);
    expect(result.isValid).toBe(true);

    console.log(`✅ Assessment form validation working: ${result.errors.length} errors, ${result.warnings.length} warnings`);
  });

  test('should demonstrate filtering and categorization', () => {
    // Get all job roles
    const allRoles = CareerDomainService.getAllJobRoles();
    expect(allRoles.length).toBeGreaterThan(0);

    // Get roles by domain
    const techRoles = CareerDomainService.getJobRolesByDomain('technology-computer-science');
    expect(techRoles.length).toBeGreaterThan(0);

    // Get roles by experience level
    const entryRoles = CareerDomainService.getJobRolesByDomain(undefined, 'entry');
    expect(entryRoles.length).toBeGreaterThan(0);

    console.log(`✅ Filtering working: ${allRoles.length} total roles, ${techRoles.length} tech roles, ${entryRoles.length} entry-level roles`);
  });

  test('should verify all 15+ domain categories are present', () => {
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

    const domainNames = CAREER_DOMAINS.map(d => d.name);
    
    expectedDomains.forEach(expectedDomain => {
      expect(domainNames).toContain(expectedDomain);
    });

    console.log(`✅ All ${expectedDomains.length} expected domain categories are present`);
  });
});