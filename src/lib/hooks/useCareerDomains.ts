import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  CareerDomain, 
  DomainSearchFilters, 
  DomainSearchResponse, 
  ExperienceLevel,
  DomainSelection,
  ValidationResult,
  DomainRecommendation
} from '../types/careerDomainTypes';
import { CareerDomainService } from '../services/careerDomainService';
import { CareerDomainValidator } from '../utils/careerDomainValidation';
import { CAREER_DOMAINS, getDomainById, getSubfieldById } from '../data/careerDomainsData';

/**
 * Custom hook for career domain functionality
 * Provides search, filtering, validation, and recommendation capabilities
 */
export const useCareerDomains = () => {
  const [searchResults, setSearchResults] = useState<DomainSearchResponse>({
    results: [],
    totalCount: 0,
    filters: {},
    suggestions: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Get all domains
  const allDomains = useMemo(() => CAREER_DOMAINS, []);

  // Get domain by ID
  const getDomain = useCallback((id: string) => {
    return getDomainById(id);
  }, []);

  // Get subfield by ID
  const getSubfield = useCallback((domainId: string, subfieldId: string) => {
    return getSubfieldById(domainId, subfieldId);
  }, []);

  // Search domains with filters
  const searchDomains = useCallback(async (filters: DomainSearchFilters) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      // Simulate async operation for consistency with other services
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const results = CareerDomainService.searchDomains(filters);
      setSearchResults(results);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed');
      setSearchResults({
        results: [],
        totalCount: 0,
        filters,
        suggestions: []
      });
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Get job roles by domain and experience level
  const getJobRoles = useCallback((domainId?: string, experienceLevel?: ExperienceLevel) => {
    return CareerDomainService.getJobRolesByDomain(domainId, experienceLevel);
  }, []);

  // Search job roles
  const searchJobRoles = useCallback((query: string, domainId?: string) => {
    return CareerDomainService.searchJobRoles(query, domainId);
  }, []);

  // Get domain recommendations
  const getDomainRecommendations = useCallback((
    skills: string[], 
    interests: string[], 
    experienceLevel: ExperienceLevel
  ): DomainRecommendation[] => {
    return CareerDomainService.getDomainRecommendations(skills, interests, experienceLevel);
  }, []);

  // Validate domain selection
  const validateDomainSelection = useCallback((selection: DomainSelection): ValidationResult => {
    return CareerDomainValidator.validateDomainSelection(selection);
  }, []);

  // Validate assessment form
  const validateAssessmentForm = useCallback((formData: {
    fullName: string;
    age: number;
    educationLevel: string;
    domain: string;
    jobRole: string;
    experienceLevel: ExperienceLevel;
    skills: string[];
  }): ValidationResult => {
    return CareerDomainValidator.validateAssessmentForm(formData);
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults({
      results: [],
      totalCount: 0,
      filters: {},
      suggestions: []
    });
    setSearchError(null);
  }, []);

  return {
    // Data
    allDomains,
    searchResults,
    isSearching,
    searchError,

    // Methods
    getDomain,
    getSubfield,
    searchDomains,
    getJobRoles,
    searchJobRoles,
    getDomainRecommendations,
    validateDomainSelection,
    validateAssessmentForm,
    clearSearch
  };
};

/**
 * Hook for domain search with debouncing
 */
export const useDomainSearch = (initialFilters: DomainSearchFilters = {}, debounceMs = 300) => {
  const { searchDomains, searchResults, isSearching, searchError, clearSearch } = useCareerDomains();
  const [filters, setFilters] = useState<DomainSearchFilters>(initialFilters);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.query || Object.keys(filters).length > 1) {
        searchDomains(filters);
      } else {
        clearSearch();
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [filters, searchDomains, clearSearch, debounceMs]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DomainSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    searchResults,
    isSearching,
    searchError,
    updateFilters,
    resetFilters,
    clearSearch
  };
};

/**
 * Hook for job role search with debouncing
 */
export const useJobRoleSearch = (domainId?: string, debounceMs = 300) => {
  const { searchJobRoles, getJobRoles } = useCareerDomains();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get all job roles for the domain
  const allJobRoles = useMemo(() => {
    return getJobRoles(domainId);
  }, [getJobRoles, domainId]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      
      if (query.trim()) {
        const searchResults = searchJobRoles(query, domainId);
        setResults(searchResults);
      } else {
        setResults(allJobRoles.slice(0, 10)); // Show first 10 when no query
      }
      
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, searchJobRoles, domainId, allJobRoles, debounceMs]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    allJobRoles
  };
};

/**
 * Hook for domain recommendations
 */
export const useDomainRecommendations = (
  skills: string[], 
  interests: string[], 
  experienceLevel: ExperienceLevel
) => {
  const { getDomainRecommendations } = useCareerDomains();
  
  const recommendations = useMemo(() => {
    if (skills.length === 0 && interests.length === 0) {
      return [];
    }
    return getDomainRecommendations(skills, interests, experienceLevel);
  }, [getDomainRecommendations, skills, interests, experienceLevel]);

  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 5);
  }, [recommendations]);

  const hasRecommendations = recommendations.length > 0;

  return {
    recommendations,
    topRecommendations,
    hasRecommendations
  };
};

/**
 * Hook for form validation with real-time feedback
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  validator: (data: T) => ValidationResult
) => {
  const [data, setData] = useState<T>(initialData);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update data and validate
  const updateData = useCallback((updates: Partial<T>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    
    // Mark updated fields as touched
    Object.keys(updates).forEach(key => {
      setTouched(prev => ({ ...prev, [key]: true }));
    });

    // Validate
    const validationResult = validator(newData);
    setValidation(validationResult);
  }, [data, validator]);

  // Mark field as touched
  const touchField = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Get errors for a specific field
  const getFieldErrors = useCallback((fieldName: string) => {
    return validation.errors.filter(error => error.field === fieldName);
  }, [validation.errors]);

  // Get warnings for a specific field
  const getFieldWarnings = useCallback((fieldName: string) => {
    return validation.warnings.filter(warning => warning.field === fieldName);
  }, [validation.warnings]);

  // Check if field has been touched and has errors
  const hasFieldError = useCallback((fieldName: string) => {
    return touched[fieldName] && getFieldErrors(fieldName).length > 0;
  }, [touched, getFieldErrors]);

  // Reset form
  const resetForm = useCallback(() => {
    setData(initialData);
    setTouched({});
    setValidation({
      isValid: true,
      errors: [],
      warnings: []
    });
  }, [initialData]);

  return {
    data,
    validation,
    touched,
    updateData,
    touchField,
    getFieldErrors,
    getFieldWarnings,
    hasFieldError,
    resetForm
  };
};