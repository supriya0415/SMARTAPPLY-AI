import { 
  DomainSelection, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  ExperienceLevel,
  CareerDomain 
} from '../types/careerDomainTypes';
import { CAREER_DOMAINS, getDomainById, getSubfieldById } from '../data/careerDomainsData';

/**
 * Career Domain Validation Utilities
 * Provides comprehensive validation for domain selections and user inputs
 */
export class CareerDomainValidator {

  /**
   * Validate a complete domain selection
   */
  static validateDomainSelection(selection: DomainSelection): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate required fields
    this.validateRequiredFields(selection, errors);
    
    // Validate domain existence and consistency
    this.validateDomainConsistency(selection, errors, warnings);
    
    // Validate experience level appropriateness
    this.validateExperienceLevelMatch(selection, warnings);
    
    // Validate skill alignment
    this.validateSkillAlignment(selection, warnings);
    
    // Validate career goals alignment
    this.validateCareerGoalsAlignment(selection, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate individual domain ID
   */
  static validateDomainId(domainId: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (!domainId || domainId.trim() === '') {
      errors.push({
        field: 'domainId',
        message: 'Domain ID is required',
        code: 'DOMAIN_ID_REQUIRED'
      });
    } else if (!getDomainById(domainId)) {
      errors.push({
        field: 'domainId',
        message: 'Invalid domain ID',
        code: 'INVALID_DOMAIN_ID'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validate subfield ID within a domain
   */
  static validateSubfieldId(domainId: string, subfieldId: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (!subfieldId || subfieldId.trim() === '') {
      errors.push({
        field: 'subfieldId',
        message: 'Subfield ID is required',
        code: 'SUBFIELD_ID_REQUIRED'
      });
      return { isValid: false, errors, warnings: [] };
    }

    const domain = getDomainById(domainId);
    if (!domain) {
      errors.push({
        field: 'domainId',
        message: 'Invalid domain ID',
        code: 'INVALID_DOMAIN_ID'
      });
      return { isValid: false, errors, warnings: [] };
    }

    const subfield = getSubfieldById(domainId, subfieldId);
    if (!subfield) {
      errors.push({
        field: 'subfieldId',
        message: 'Invalid subfield ID for the selected domain',
        code: 'INVALID_SUBFIELD_ID'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validate experience level
   */
  static validateExperienceLevel(experienceLevel: ExperienceLevel): ValidationResult {
    const errors: ValidationError[] = [];
    const validLevels: ExperienceLevel[] = ['internship', 'entry', 'mid', 'senior', 'executive'];
    
    if (!experienceLevel) {
      errors.push({
        field: 'experienceLevel',
        message: 'Experience level is required',
        code: 'EXPERIENCE_LEVEL_REQUIRED'
      });
    } else if (!validLevels.includes(experienceLevel)) {
      errors.push({
        field: 'experienceLevel',
        message: `Invalid experience level. Must be one of: ${validLevels.join(', ')}`,
        code: 'INVALID_EXPERIENCE_LEVEL'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validate skills array
   */
  static validateSkills(skills: string[], domainId?: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!Array.isArray(skills)) {
      errors.push({
        field: 'selectedSkills',
        message: 'Skills must be provided as an array',
        code: 'INVALID_SKILLS_FORMAT'
      });
      return { isValid: false, errors, warnings };
    }

    // Check for empty skills
    const emptySkills = skills.filter(skill => !skill || skill.trim() === '');
    if (emptySkills.length > 0) {
      warnings.push({
        field: 'selectedSkills',
        message: 'Some skills are empty or contain only whitespace',
        suggestion: 'Remove empty skill entries'
      });
    }

    // Check for duplicate skills
    const uniqueSkills = [...new Set(skills.map(skill => skill.toLowerCase().trim()))];
    if (uniqueSkills.length < skills.length) {
      warnings.push({
        field: 'selectedSkills',
        message: 'Duplicate skills detected',
        suggestion: 'Remove duplicate skill entries'
      });
    }

    // Validate skill relevance to domain if domain is provided
    if (domainId) {
      const domain = getDomainById(domainId);
      if (domain) {
        const domainSkills = this.getDomainSkills(domain);
        const relevantSkills = skills.filter(skill =>
          domainSkills.some(domainSkill =>
            domainSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(domainSkill.toLowerCase())
          )
        );

        if (relevantSkills.length < skills.length * 0.3) {
          warnings.push({
            field: 'selectedSkills',
            message: 'Many selected skills may not be relevant to the chosen domain',
            suggestion: 'Consider selecting skills more aligned with the career domain'
          });
        }
      }
    }

    // Check minimum skills requirement
    if (skills.length === 0) {
      warnings.push({
        field: 'selectedSkills',
        message: 'No skills selected',
        suggestion: 'Select at least 2-3 relevant skills for better recommendations'
      });
    } else if (skills.length < 2) {
      warnings.push({
        field: 'selectedSkills',
        message: 'Very few skills selected',
        suggestion: 'Consider adding more skills for better career matching'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate career goals array
   */
  static validateCareerGoals(careerGoals: string[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!Array.isArray(careerGoals)) {
      errors.push({
        field: 'careerGoals',
        message: 'Career goals must be provided as an array',
        code: 'INVALID_CAREER_GOALS_FORMAT'
      });
      return { isValid: false, errors, warnings };
    }

    // Check for empty goals
    const emptyGoals = careerGoals.filter(goal => !goal || goal.trim() === '');
    if (emptyGoals.length > 0) {
      warnings.push({
        field: 'careerGoals',
        message: 'Some career goals are empty',
        suggestion: 'Remove empty goal entries or provide meaningful descriptions'
      });
    }

    // Check goal length
    const longGoals = careerGoals.filter(goal => goal.length > 200);
    if (longGoals.length > 0) {
      warnings.push({
        field: 'careerGoals',
        message: 'Some career goals are very long',
        suggestion: 'Keep career goals concise (under 200 characters)'
      });
    }

    // Check for minimum goals
    if (careerGoals.length === 0) {
      warnings.push({
        field: 'careerGoals',
        message: 'No career goals specified',
        suggestion: 'Add 1-3 career goals to get better recommendations'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate complete assessment form data
   */
  static validateAssessmentForm(formData: {
    fullName: string;
    age: number;
    educationLevel: string;
    domain: string;
    jobRole: string;
    experienceLevel: ExperienceLevel;
    skills: string[];
  }): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate full name
    if (!formData.fullName || formData.fullName.trim() === '') {
      errors.push({
        field: 'fullName',
        message: 'Full name is required',
        code: 'FULL_NAME_REQUIRED'
      });
    } else if (formData.fullName.length < 2) {
      errors.push({
        field: 'fullName',
        message: 'Full name must be at least 2 characters long',
        code: 'FULL_NAME_TOO_SHORT'
      });
    }

    // Validate age
    if (!formData.age || formData.age < 16 || formData.age > 100) {
      errors.push({
        field: 'age',
        message: 'Age must be between 16 and 100',
        code: 'INVALID_AGE'
      });
    }

    // Validate education level
    const validEducationLevels = ['high-school', 'associates', 'bachelors', 'masters', 'phd', 'other'];
    if (!formData.educationLevel || !validEducationLevels.includes(formData.educationLevel)) {
      errors.push({
        field: 'educationLevel',
        message: 'Valid education level is required',
        code: 'INVALID_EDUCATION_LEVEL'
      });
    }

    // Validate domain
    const domainValidation = CareerDomainValidator.validateDomainId(formData.domain);
    errors.push(...domainValidation.errors);

    // Validate job role
    if (!formData.jobRole || formData.jobRole.trim() === '') {
      errors.push({
        field: 'jobRole',
        message: 'Job role is required',
        code: 'JOB_ROLE_REQUIRED'
      });
    }

    // Validate experience level (mandatory as per requirements)
    const experienceLevelValidation = CareerDomainValidator.validateExperienceLevel(formData.experienceLevel);
    errors.push(...experienceLevelValidation.errors);

    // Validate skills
    const skillsValidation = CareerDomainValidator.validateSkills(formData.skills, formData.domain);
    errors.push(...skillsValidation.errors);
    warnings.push(...skillsValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Private helper methods

  private static validateRequiredFields(selection: DomainSelection, errors: ValidationError[]): void {
    if (!selection.domainId) {
      errors.push({
        field: 'domainId',
        message: 'Domain selection is required',
        code: 'DOMAIN_REQUIRED'
      });
    }

    if (!selection.experienceLevel) {
      errors.push({
        field: 'experienceLevel',
        message: 'Experience level is required',
        code: 'EXPERIENCE_LEVEL_REQUIRED'
      });
    }

    if (!selection.selectedSkills || selection.selectedSkills.length === 0) {
      errors.push({
        field: 'selectedSkills',
        message: 'At least one skill must be selected',
        code: 'SKILLS_REQUIRED'
      });
    }
  }

  private static validateDomainConsistency(
    selection: DomainSelection, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    const domain = getDomainById(selection.domainId);
    if (!domain) {
      errors.push({
        field: 'domainId',
        message: 'Selected domain does not exist',
        code: 'DOMAIN_NOT_FOUND'
      });
      return;
    }

    // Validate subfield consistency
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

    // Validate career example consistency
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
  }

  private static validateExperienceLevelMatch(selection: DomainSelection, warnings: ValidationWarning[]): void {
    const domain = getDomainById(selection.domainId);
    if (!domain) return;

    // Check if the domain has opportunities at the selected experience level
    const hasMatchingOpportunities = domain.careerExamples.some(career =>
      career.experienceLevel === selection.experienceLevel
    ) || domain.experienceLevels.some(level => level.level === selection.experienceLevel);

    if (!hasMatchingOpportunities) {
      warnings.push({
        field: 'experienceLevel',
        message: `Limited opportunities at ${selection.experienceLevel} level in this domain`,
        suggestion: 'Consider exploring related domains or different experience levels'
      });
    }

    // Provide guidance for internship level
    if (selection.experienceLevel === 'internship') {
      const hasInternships = domain.internshipOpportunities.length > 0;
      if (!hasInternships) {
        warnings.push({
          field: 'experienceLevel',
          message: 'No specific internship programs listed for this domain',
          suggestion: 'Look for general internship opportunities or consider entry-level positions'
        });
      }
    }
  }

  private static validateSkillAlignment(selection: DomainSelection, warnings: ValidationWarning[]): void {
    const domain = getDomainById(selection.domainId);
    if (!domain) return;

    const domainSkills = this.getDomainSkills(domain);
    const alignedSkills = selection.selectedSkills.filter(skill =>
      domainSkills.some(domainSkill =>
        domainSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(domainSkill.toLowerCase())
      )
    );

    const alignmentPercentage = alignedSkills.length / selection.selectedSkills.length;

    if (alignmentPercentage < 0.3) {
      warnings.push({
        field: 'selectedSkills',
        message: 'Most selected skills may not align well with the chosen domain',
        suggestion: 'Review and select skills more relevant to the career domain'
      });
    } else if (alignmentPercentage < 0.5) {
      warnings.push({
        field: 'selectedSkills',
        message: 'Some selected skills may not be directly relevant to the chosen domain',
        suggestion: 'Consider adding more domain-specific skills'
      });
    }

    // Suggest missing critical skills
    const subfield = selection.subfieldId ? getSubfieldById(selection.domainId, selection.subfieldId) : null;
    if (subfield) {
      const missingCriticalSkills = subfield.requiredSkills.filter(reqSkill =>
        !selection.selectedSkills.some(userSkill =>
          userSkill.toLowerCase().includes(reqSkill.toLowerCase())
        )
      );

      if (missingCriticalSkills.length > 0) {
        warnings.push({
          field: 'selectedSkills',
          message: `Consider adding these important skills: ${missingCriticalSkills.slice(0, 3).join(', ')}`,
          suggestion: 'These skills are commonly required in your chosen subfield'
        });
      }
    }
  }

  private static validateCareerGoalsAlignment(selection: DomainSelection, warnings: ValidationWarning[]): void {
    if (!selection.careerGoals || selection.careerGoals.length === 0) {
      warnings.push({
        field: 'careerGoals',
        message: 'No career goals specified',
        suggestion: 'Adding career goals will help provide more targeted recommendations'
      });
      return;
    }

    const domain = getDomainById(selection.domainId);
    if (!domain) return;

    // Check if career goals align with domain keywords
    const goalKeywords = selection.careerGoals.join(' ').toLowerCase();
    const domainKeywords = domain.keywords.join(' ').toLowerCase();

    const hasAlignment = domain.keywords.some(keyword =>
      goalKeywords.includes(keyword.toLowerCase())
    );

    if (!hasAlignment) {
      warnings.push({
        field: 'careerGoals',
        message: 'Career goals may not align well with the selected domain',
        suggestion: 'Consider refining goals to better match the chosen career domain'
      });
    }
  }

  private static getDomainSkills(domain: CareerDomain): string[] {
    const skills: string[] = [];
    
    domain.subfields.forEach(subfield => {
      skills.push(...subfield.requiredSkills);
    });

    domain.careerExamples.forEach(career => {
      skills.push(...career.requiredSkills, ...career.preferredSkills);
    });

    return [...new Set(skills)];
  }
}