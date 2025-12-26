import { 
  CareerDomain, 
  DomainSearchFilters, 
  SearchResult, 
  DomainSearchResponse,
  ExperienceLevel,
  DomainSelection,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  DomainRecommendation
} from '../types/careerDomainTypes';
import { CAREER_DOMAINS, getDomainById, getSubfieldById, getAllJobRoles } from '../data/careerDomainsData';

/**
 * Career Domain Service
 * Provides search, filtering, and validation functionality for career domains
 */
export class CareerDomainService {
  
  /**
   * Search domains, subfields, careers, and internships based on filters
   */
  static searchDomains(filters: DomainSearchFilters): DomainSearchResponse {
    const results: SearchResult[] = [];
    const suggestions: string[] = [];

    // Search through all domains
    CAREER_DOMAINS.forEach(domain => {
      // Search domain itself
      if (this.matchesDomainSearch(domain, filters)) {
        results.push({
          type: 'domain',
          id: domain.id,
          title: domain.name,
          description: domain.description,
          relevanceScore: this.calculateRelevanceScore(domain.name, domain.keywords, filters.query || ''),
          matchedKeywords: this.getMatchedKeywords(domain.keywords, filters.query || ''),
          parentDomain: undefined
        });
      }

      // Search subfields
      domain.subfields.forEach(subfield => {
        if (this.matchesSubfieldSearch(subfield, domain, filters)) {
          results.push({
            type: 'subfield',
            id: subfield.id,
            title: subfield.name,
            description: subfield.description,
            relevanceScore: this.calculateRelevanceScore(subfield.name, subfield.keywords, filters.query || ''),
            matchedKeywords: this.getMatchedKeywords(subfield.keywords, filters.query || ''),
            parentDomain: domain.name
          });
        }
      });

      // Search career examples
      domain.careerExamples.forEach(career => {
        if (this.matchesCareerSearch(career, domain, filters)) {
          results.push({
            type: 'career',
            id: career.id,
            title: career.title,
            description: career.description,
            relevanceScore: this.calculateRelevanceScore(career.title, career.keywords, filters.query || ''),
            matchedKeywords: this.getMatchedKeywords(career.keywords, filters.query || ''),
            parentDomain: domain.name,
            parentSubfield: domain.subfields.find(s => s.id === career.subfieldId)?.name
          });
        }
      });

      // Search internship opportunities
      domain.internshipOpportunities.forEach(internship => {
        if (this.matchesInternshipSearch(internship, domain, filters)) {
          results.push({
            type: 'internship',
            id: internship.id,
            title: internship.title,
            description: internship.description,
            relevanceScore: this.calculateRelevanceScore(internship.title, internship.keywords, filters.query || ''),
            matchedKeywords: this.getMatchedKeywords(internship.keywords, filters.query || ''),
            parentDomain: domain.name,
            parentSubfield: domain.subfields.find(s => s.id === internship.subfieldId)?.name
          });
        }
      });
    });

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Generate suggestions based on partial matches
    if (filters.query && results.length < 5) {
      suggestions.push(...this.generateSearchSuggestions(filters.query));
    }

    return {
      results,
      totalCount: results.length,
      filters,
      suggestions: [...new Set(suggestions)].slice(0, 5) // Remove duplicates and limit
    };
  }

  /**
   * Get all available job roles across all domains
   */
  static getAllJobRoles(): string[] {
    return getAllJobRoles();
  }

  /**
   * Get job roles filtered by domain and experience level
   */
  static getJobRolesByDomain(domainId?: string, experienceLevel?: ExperienceLevel): string[] {
    let roles: string[] = [];

    const domainsToSearch = domainId ? [getDomainById(domainId)].filter(Boolean) : CAREER_DOMAINS;

    domainsToSearch.forEach(domain => {
      if (!domain) return;

      // Get roles from subfields
      domain.subfields.forEach(subfield => {
        roles.push(...subfield.jobRoles);
      });

      // Get roles from career examples filtered by experience level
      if (experienceLevel) {
        const filteredCareers = domain.careerExamples.filter(career => 
          career.experienceLevel === experienceLevel
        );
        filteredCareers.forEach(career => {
          roles.push(career.title);
        });
      } else {
        domain.careerExamples.forEach(career => {
          roles.push(career.title);
        });
      }
    });

    return [...new Set(roles)]; // Remove duplicates
  }

  /**
   * Search for specific job roles
   */
  static searchJobRoles(query: string, domainId?: string): string[] {
    const allRoles = this.getJobRolesByDomain(domainId);
    const lowerQuery = query.toLowerCase();

    return allRoles.filter(role => 
      role.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit results
  }

  /**
   * Get domain recommendations based on user preferences
   */
  static getDomainRecommendations(
    skills: string[], 
    interests: string[], 
    experienceLevel: ExperienceLevel
  ): DomainRecommendation[] {
    const recommendations: DomainRecommendation[] = [];

    CAREER_DOMAINS.forEach(domain => {
      const matchScore = this.calculateDomainMatchScore(domain, skills, interests, experienceLevel);
      
      if (matchScore > 0.3) { // Only include domains with reasonable match
        const matchReasons = this.getDomainMatchReasons(domain, skills, interests, experienceLevel);
        const recommendedSubfields = domain.subfields.filter(subfield => 
          this.subfieldMatchesUserProfile(subfield, skills, interests)
        );
        const recommendedCareers = domain.careerExamples.filter(career =>
          career.experienceLevel === experienceLevel || 
          this.careerMatchesUserProfile(career, skills, interests)
        );

        recommendations.push({
          domain,
          matchScore,
          matchReasons,
          recommendedSubfields,
          recommendedCareers,
          learningPath: this.generateLearningPath(domain, skills, experienceLevel)
        });
      }
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Validate domain selection
   */
  static validateDomainSelection(selection: DomainSelection): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate domain exists
    const domain = getDomainById(selection.domainId);
    if (!domain) {
      errors.push({
        field: 'domainId',
        message: 'Selected domain does not exist',
        code: 'DOMAIN_NOT_FOUND'
      });
      return { isValid: false, errors, warnings };
    }

    // Validate subfield if provided
    if (selection.subfieldId) {
      const subfield = getSubfieldById(selection.domainId, selection.subfieldId);
      if (!subfield) {
        errors.push({
          field: 'subfieldId',
          message: 'Selected subfield does not exist in the chosen domain',
          code: 'SUBFIELD_NOT_FOUND'
        });
      }
    }

    // Validate career example if provided
    if (selection.careerExampleId) {
      const careerExample = domain.careerExamples.find(c => c.id === selection.careerExampleId);
      if (!careerExample) {
        errors.push({
          field: 'careerExampleId',
          message: 'Selected career example does not exist in the chosen domain',
          code: 'CAREER_EXAMPLE_NOT_FOUND'
        });
      } else if (selection.subfieldId && careerExample.subfieldId !== selection.subfieldId) {
        warnings.push({
          field: 'careerExampleId',
          message: 'Selected career example belongs to a different subfield',
          suggestion: 'Consider selecting a career example from the chosen subfield'
        });
      }
    }

    // Validate experience level
    const validExperienceLevels: ExperienceLevel[] = ['internship', 'entry', 'mid', 'senior', 'executive'];
    if (!validExperienceLevels.includes(selection.experienceLevel)) {
      errors.push({
        field: 'experienceLevel',
        message: 'Invalid experience level',
        code: 'INVALID_EXPERIENCE_LEVEL'
      });
    }

    // Validate skills alignment
    if (selection.selectedSkills.length === 0) {
      warnings.push({
        field: 'selectedSkills',
        message: 'No skills selected',
        suggestion: 'Consider selecting relevant skills to get better recommendations'
      });
    }

    // Check if skills align with domain
    const domainSkills = this.getDomainSkills(domain);
    const alignedSkills = selection.selectedSkills.filter(skill => 
      domainSkills.some(domainSkill => 
        domainSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(domainSkill.toLowerCase())
      )
    );

    if (alignedSkills.length < selection.selectedSkills.length * 0.5) {
      warnings.push({
        field: 'selectedSkills',
        message: 'Some selected skills may not align well with the chosen domain',
        suggestion: 'Review skill selection to ensure relevance to the career domain'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get all skills associated with a domain
   */
  static getDomainSkills(domain: CareerDomain): string[] {
    const skills: string[] = [];
    
    domain.subfields.forEach(subfield => {
      skills.push(...subfield.requiredSkills);
    });

    domain.careerExamples.forEach(career => {
      skills.push(...career.requiredSkills, ...career.preferredSkills);
    });

    return [...new Set(skills)];
  }

  // Private helper methods

  private static matchesDomainSearch(domain: CareerDomain, filters: DomainSearchFilters): boolean {
    // Check domain ID filter
    if (filters.domainIds && !filters.domainIds.includes(domain.id)) {
      return false;
    }

    // Check query match
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        domain.name,
        domain.description,
        ...domain.keywords
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Check keywords filter
    if (filters.keywords && filters.keywords.length > 0) {
      const hasMatchingKeyword = filters.keywords.some(keyword =>
        domain.keywords.some(domainKeyword =>
          domainKeyword.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      if (!hasMatchingKeyword) {
        return false;
      }
    }

    return true;
  }

  private static matchesSubfieldSearch(subfield: any, domain: CareerDomain, filters: DomainSearchFilters): boolean {
    // Check subfield ID filter
    if (filters.subfieldIds && !filters.subfieldIds.includes(subfield.id)) {
      return false;
    }

    // Check domain filter
    if (filters.domainIds && !filters.domainIds.includes(domain.id)) {
      return false;
    }

    // Check query match
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        subfield.name,
        subfield.description,
        ...subfield.keywords,
        ...subfield.jobRoles
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  }

  private static matchesCareerSearch(career: any, domain: CareerDomain, filters: DomainSearchFilters): boolean {
    // Check experience level filter
    if (filters.experienceLevels && !filters.experienceLevels.includes(career.experienceLevel)) {
      return false;
    }

    // Check salary range filter
    if (filters.salaryRange) {
      if (filters.salaryRange.min && career.salaryRange.min < filters.salaryRange.min) {
        return false;
      }
      if (filters.salaryRange.max && career.salaryRange.max > filters.salaryRange.max) {
        return false;
      }
    }

    // Check work environment filter
    if (filters.workEnvironment) {
      if (filters.workEnvironment.remote && !career.workEnvironment.remote) {
        return false;
      }
      if (filters.workEnvironment.hybrid && !career.workEnvironment.hybrid) {
        return false;
      }
      if (filters.workEnvironment.onsite && !career.workEnvironment.onsite) {
        return false;
      }
    }

    // Check query match
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        career.title,
        career.description,
        ...career.keywords,
        ...career.requiredSkills,
        ...career.preferredSkills
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  }

  private static matchesInternshipSearch(internship: any, domain: CareerDomain, filters: DomainSearchFilters): boolean {
    // Check query match
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        internship.title,
        internship.description,
        ...internship.keywords,
        ...internship.requiredSkills,
        ...internship.learningOutcomes
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  }

  private static calculateRelevanceScore(title: string, keywords: string[], query: string): number {
    if (!query) return 0.5; // Default score when no query

    const lowerQuery = query.toLowerCase();
    const lowerTitle = title.toLowerCase();
    let score = 0;

    // Exact title match gets highest score
    if (lowerTitle === lowerQuery) {
      score += 1.0;
    } else if (lowerTitle.includes(lowerQuery)) {
      score += 0.8;
    } else if (lowerQuery.includes(lowerTitle)) {
      score += 0.6;
    }

    // Keyword matches
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (lowerKeyword === lowerQuery) {
        score += 0.7;
      } else if (lowerKeyword.includes(lowerQuery) || lowerQuery.includes(lowerKeyword)) {
        score += 0.3;
      }
    });

    return Math.min(score, 1.0); // Cap at 1.0
  }

  private static getMatchedKeywords(keywords: string[], query: string): string[] {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    return keywords.filter(keyword =>
      keyword.toLowerCase().includes(lowerQuery) ||
      lowerQuery.includes(keyword.toLowerCase())
    );
  }

  private static generateSearchSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Collect all possible search terms
    const allTerms: string[] = [];
    CAREER_DOMAINS.forEach(domain => {
      allTerms.push(domain.name, ...domain.keywords);
      domain.subfields.forEach(subfield => {
        allTerms.push(subfield.name, ...subfield.keywords, ...subfield.jobRoles);
      });
    });

    // Find partial matches and similar terms
    allTerms.forEach(term => {
      const lowerTerm = term.toLowerCase();
      // Include terms that contain the query or are similar
      if (lowerTerm.includes(lowerQuery) && lowerTerm !== lowerQuery) {
        suggestions.push(term);
      }
    });

    // If no suggestions found, add some popular terms
    if (suggestions.length === 0) {
      suggestions.push('software development', 'data science', 'business analysis', 'design', 'healthcare');
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  private static calculateDomainMatchScore(
    domain: CareerDomain, 
    skills: string[], 
    interests: string[], 
    experienceLevel: ExperienceLevel
  ): number {
    let score = 0;
    let totalFactors = 0;

    // Skills match
    const domainSkills = this.getDomainSkills(domain);
    const skillMatches = skills.filter(skill =>
      domainSkills.some(domainSkill =>
        domainSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(domainSkill.toLowerCase())
      )
    );
    score += (skillMatches.length / Math.max(skills.length, 1)) * 0.4;
    totalFactors += 0.4;

    // Interest/keyword match
    const interestMatches = interests.filter(interest =>
      domain.keywords.some(keyword =>
        keyword.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    score += (interestMatches.length / Math.max(interests.length, 1)) * 0.3;
    totalFactors += 0.3;

    // Experience level availability
    const hasMatchingExperience = domain.careerExamples.some(career =>
      career.experienceLevel === experienceLevel
    ) || domain.experienceLevels.some(level => level.level === experienceLevel);
    
    if (hasMatchingExperience) {
      score += 0.2;
    }
    totalFactors += 0.2;

    // Industry trends (demand and growth)
    if (domain.industryTrends.demand === 'high') {
      score += 0.1;
    } else if (domain.industryTrends.demand === 'medium') {
      score += 0.05;
    }
    totalFactors += 0.1;

    return score / totalFactors;
  }

  private static getDomainMatchReasons(
    domain: CareerDomain,
    skills: string[],
    interests: string[],
    experienceLevel: ExperienceLevel
  ): string[] {
    const reasons: string[] = [];

    // Check skill alignment
    const domainSkills = this.getDomainSkills(domain);
    const skillMatches = skills.filter(skill =>
      domainSkills.some(domainSkill =>
        domainSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (skillMatches.length > 0) {
      reasons.push(`Your skills in ${skillMatches.slice(0, 3).join(', ')} align well with this domain`);
    }

    // Check interest alignment
    const interestMatches = interests.filter(interest =>
      domain.keywords.some(keyword =>
        keyword.toLowerCase().includes(interest.toLowerCase())
      )
    );

    if (interestMatches.length > 0) {
      reasons.push(`Your interests in ${interestMatches.slice(0, 2).join(', ')} match this field`);
    }

    // Check industry trends
    if (domain.industryTrends.demand === 'high') {
      reasons.push('High demand in the job market');
    }

    if (domain.industryTrends.growth > 15) {
      reasons.push(`Strong growth prospects (${domain.industryTrends.growth}% growth)`);
    }

    // Check experience level fit
    const hasMatchingExperience = domain.careerExamples.some(career =>
      career.experienceLevel === experienceLevel
    );

    if (hasMatchingExperience) {
      reasons.push(`Good opportunities at ${experienceLevel} level`);
    }

    return reasons;
  }

  private static subfieldMatchesUserProfile(subfield: any, skills: string[], interests: string[]): boolean {
    const skillMatch = skills.some(skill =>
      subfield.requiredSkills.some((reqSkill: string) =>
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const interestMatch = interests.some(interest =>
      subfield.keywords.some((keyword: string) =>
        keyword.toLowerCase().includes(interest.toLowerCase())
      )
    );

    return skillMatch || interestMatch;
  }

  private static careerMatchesUserProfile(career: any, skills: string[], interests: string[]): boolean {
    const skillMatch = skills.some(skill =>
      [...career.requiredSkills, ...career.preferredSkills].some(careerSkill =>
        careerSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const interestMatch = interests.some(interest =>
      career.keywords.some((keyword: string) =>
        keyword.toLowerCase().includes(interest.toLowerCase())
      )
    );

    return skillMatch || interestMatch;
  }

  private static generateLearningPath(domain: CareerDomain, skills: string[], experienceLevel: ExperienceLevel): string[] {
    const path: string[] = [];

    // Get domain-specific skills that user doesn't have
    const domainSkills = this.getDomainSkills(domain);
    const missingSkills = domainSkills.filter(domainSkill =>
      !skills.some(userSkill =>
        userSkill.toLowerCase().includes(domainSkill.toLowerCase())
      )
    );

    // Prioritize critical skills for the experience level
    const experienceLevelInfo = domain.experienceLevels.find(level => level.level === experienceLevel);
    if (experienceLevelInfo) {
      experienceLevelInfo.requiredSkills.forEach(skill => {
        if (!skills.includes(skill)) {
          path.push(`Learn ${skill}`);
        }
      });
    }

    // Add general recommendations
    if (missingSkills.length > 0) {
      path.push(`Develop skills in ${missingSkills.slice(0, 3).join(', ')}`);
    }

    // Add experience-specific recommendations
    if (experienceLevel === 'internship' || experienceLevel === 'entry') {
      path.push('Build a portfolio of projects');
      path.push('Gain hands-on experience through internships');
    }

    return path.slice(0, 5); // Limit to 5 recommendations
  }
}