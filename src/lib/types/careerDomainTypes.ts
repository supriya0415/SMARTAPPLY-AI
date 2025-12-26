// Career Domain Types for Enhanced Career Platform

export type ExperienceLevel = 'internship' | 'entry' | 'mid' | 'senior' | 'executive';

export interface CareerDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subfields: CareerSubfield[];
  careerExamples: CareerExample[];
  internshipOpportunities: InternshipOpportunity[];
  experienceLevels: ExperienceLevelInfo[];
  keywords: string[];
  industryTrends: {
    demand: 'high' | 'medium' | 'low';
    growth: number; // percentage
    competitiveness: 'high' | 'medium' | 'low';
    emergingRoles: string[];
  };
  relatedDomains: string[]; // IDs of related domains
}

export interface CareerSubfield {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  averageSalary: SalaryRange;
  jobRoles: string[];
  keywords: string[];
}

export interface CareerExample {
  id: string;
  title: string;
  description: string;
  subfieldId: string;
  experienceLevel: ExperienceLevel;
  salaryRange: SalaryRange;
  requiredSkills: string[];
  preferredSkills: string[];
  workEnvironment: WorkEnvironment;
  careerPath: string[];
  keywords: string[];
}

export interface InternshipOpportunity {
  id: string;
  title: string;
  description: string;
  subfieldId: string;
  duration: string;
  stipend?: SalaryRange;
  requiredSkills: string[];
  learningOutcomes: string[];
  typicalCompanies: string[];
  applicationPeriod: string;
  keywords: string[];
}

export interface ExperienceLevelInfo {
  level: ExperienceLevel;
  title: string;
  description: string;
  yearsOfExperience: string;
  typicalRoles: string[];
  salaryRange: SalaryRange;
  keyResponsibilities: string[];
  requiredSkills: string[];
  careerProgression: string[];
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
  location?: string;
}

export interface WorkEnvironment {
  remote: boolean;
  hybrid: boolean;
  onsite: boolean;
  teamSize: string;
  workStyle: string[];
  travelRequirement: 'none' | 'minimal' | 'moderate' | 'frequent';
}

// Search and Filter Types
export interface DomainSearchFilters {
  query?: string;
  domainIds?: string[];
  subfieldIds?: string[];
  experienceLevels?: ExperienceLevel[];
  salaryRange?: {
    min?: number;
    max?: number;
  };
  workEnvironment?: {
    remote?: boolean;
    hybrid?: boolean;
    onsite?: boolean;
  };
  skills?: string[];
  keywords?: string[];
}

export interface SearchResult {
  type: 'domain' | 'subfield' | 'career' | 'internship';
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  matchedKeywords: string[];
  parentDomain?: string;
  parentSubfield?: string;
}

export interface DomainSearchResponse {
  results: SearchResult[];
  totalCount: number;
  filters: DomainSearchFilters;
  suggestions: string[];
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Domain Selection Types
export interface DomainSelection {
  domainId: string;
  subfieldId?: string;
  careerExampleId?: string;
  experienceLevel: ExperienceLevel;
  selectedSkills: string[];
  careerGoals: string[];
}

export interface DomainRecommendation {
  domain: CareerDomain;
  matchScore: number;
  matchReasons: string[];
  recommendedSubfields: CareerSubfield[];
  recommendedCareers: CareerExample[];
  learningPath: string[];
}