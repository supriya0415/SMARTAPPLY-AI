// import { 
//   LearningResource, 
//   LearningProgress, 
//   ResourceCompletionRequest,
//   ResourceFilterOptions,
//   ResourceSearchOptions,
//   LearningResourcesResponse,
//   ResourceRecommendation,
//   LearningSession,
//   StudyGuide,
//   PreparationMaterial,
//   LearningResourceCategory
// } from '../types/learningResourceTypes';
// import { 
//   LEARNING_RESOURCES, 
//   STUDY_GUIDES, 
//   PREPARATION_MATERIALS,
//   LEARNING_RESOURCE_CATEGORIES,
//   getResourcesByDomain,
//   getResourcesBySubfield,
//   getResourcesByDifficulty,
//   getFreeResources,
//   searchResources
// } from '../data/learningResourcesData';
// import { UserProfile } from '../types';
// import { cacheService } from './cacheService';
// import { loadingService } from './loadingService';

// export class LearningResourcesService {
//   private static readonly API_BASE = '/api';
//   private static readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes for resources
//   private static readonly PROGRESS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes for progress

//   /**
//    * Get learning resources with filtering and pagination (Requirements 10.1, 10.2, 10.3)
//    */
//   static async getResources(options: ResourceSearchOptions = {}): Promise<LearningResourcesResponse> {
//     const operationId = 'get-learning-resources';
//     const cacheKey = `learning_resources_${JSON.stringify(options)}`;

//     try {
//       // Check cache first
//       const cached = await cacheService.get<LearningResourcesResponse>(cacheKey);
//       if (cached) {
//         return cached;
//       }

//       loadingService.setLoading(operationId, true, {
//         message: 'Loading learning resources...',
//         progress: 10
//       });
//       let filteredResources = [...LEARNING_RESOURCES];

//       loadingService.updateProgress(operationId, 30, 'Applying filters...', 'filtering');

//       // Apply filters efficiently with progressive loading
//       filteredResources = await this.applyFiltersProgressively(filteredResources, options, operationId);

//       loadingService.updateProgress(operationId, 60, 'Processing search query...', 'searching');

//       // Apply search query
//       if (options.query) {
//         const searchResults = searchResources(options.query);
//         filteredResources = filteredResources.filter(r => 
//           searchResults.some(sr => sr.id === r.id)
//         );
//       }

//       // Apply sorting
//       if (options.sortBy) {
//         filteredResources.sort((a, b) => {
//           let comparison = 0;
          
//           switch (options.sortBy) {
//             case 'rating':
//               comparison = (b.rating || 0) - (a.rating || 0);
//               break;
//             case 'duration':
//               comparison = this.parseDurationToMinutes(a.duration) - this.parseDurationToMinutes(b.duration);
//               break;
//             case 'cost':
//               comparison = a.cost - b.cost;
//               break;
//             case 'difficulty':
//               const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
//               comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
//               break;
//             case 'recent':
//               comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
//               break;
//             default:
//               comparison = a.title.localeCompare(b.title);
//           }

//           return options.sortOrder === 'desc' ? -comparison : comparison;
//         });
//       }

//       // Apply pagination
//       const page = options.page || 1;
//       const pageSize = options.pageSize || 20;
//       const startIndex = (page - 1) * pageSize;
//       const endIndex = startIndex + pageSize;
//       const paginatedResources = filteredResources.slice(startIndex, endIndex);

//       loadingService.updateProgress(operationId, 80, 'Loading related data...', 'related-data');

//       // Get related data in parallel for better performance
//       const [categories, studyGuides, preparationMaterials, progress] = await Promise.all([
//         this.getFilteredCategories(options),
//         this.getFilteredStudyGuides(options),
//         this.getFilteredPreparationMaterials(options),
//         this.getUserProgress(options.domain, options.subfield)
//       ]);

//       const result: LearningResourcesResponse = {
//         resources: paginatedResources,
//         categories,
//         studyGuides,
//         preparationMaterials,
//         progress,
//         recommendations: [], // Will be populated by recommendation service
//         total: filteredResources.length,
//         page,
//         pageSize,
//         hasMore: endIndex < filteredResources.length
//       };

//       // Cache the result
//       await cacheService.set(cacheKey, result, this.CACHE_TTL);

//       loadingService.setLoading(operationId, false, {
//         progress: 100,
//         message: 'Learning resources loaded successfully'
//       });

//       return result;
//     } catch (error) {
//       console.error('Error getting resources:', error);
//       loadingService.setError(operationId, (error as Error).message);
//       throw new Error('Failed to fetch learning resources');
//     }
//   }

//   /**
//    * Get personalized resource recommendations
//    */
//   static async getRecommendations(
//     userProfile: UserProfile,
//     domain?: string,
//     limit: number = 10
//   ): Promise<ResourceRecommendation[]> {
//     try {
//       let candidateResources = [...LEARNING_RESOURCES];

//       // Filter by domain if specified
//       if (domain) {
//         candidateResources = candidateResources.filter(r => r.domain === domain);
//       }

//       // Filter out completed resources
//       candidateResources = candidateResources.filter(r => !r.completed);

//       // Score resources based on user profile
//       const recommendations: ResourceRecommendation[] = candidateResources.map(resource => {
//         const score = this.calculateRecommendationScore(resource, userProfile);
//         const reasons = this.generateRecommendationReasons(resource, userProfile);
//         const matchedSkills = this.getMatchedSkills(resource, userProfile);
//         const difficulty = this.assessDifficulty(resource, userProfile);
//         const estimatedBenefit = this.estimateBenefit(resource, userProfile);

//         return {
//           resource,
//           score,
//           reasons,
//           matchedSkills,
//           difficulty,
//           estimatedBenefit
//         };
//       });

//       // Sort by score and return top recommendations
//       return recommendations
//         .sort((a, b) => b.score - a.score)
//         .slice(0, limit);
//     } catch (error) {
//       console.error('Error getting recommendations:', error);
//       return [];
//     }
//   }

//   /**
//    * Mark a resource as completed or update progress
//    */
//   static async updateResourceProgress(request: ResourceCompletionRequest): Promise<LearningResource> {
//     try {
//       // In a real app, this would make an API call
//       // For now, we'll update the local data
//       const resource = LEARNING_RESOURCES.find(r => r.id === request.resourceId);
//       if (!resource) {
//         throw new Error('Resource not found');
//       }

//       // Update resource progress
//       resource.completed = request.completed;
//       resource.progress = request.progress || (request.completed ? 100 : resource.progress);
//       resource.updatedAt = new Date();

//       if (request.completed && !resource.completedAt) {
//         resource.completedAt = new Date();
//       }

//       if (request.timeSpent) {
//         resource.timeSpent = (resource.timeSpent || 0) + request.timeSpent;
//       }

//       if (request.rating) {
//         resource.userRating = request.rating;
//       }

//       if (request.notes) {
//         resource.userNotes = request.notes;
//       }

//       // Create learning session record
//       if (request.timeSpent && request.timeSpent > 0) {
//         await this.createLearningSession({
//           resourceId: request.resourceId,
//           duration: request.timeSpent,
//           progress: resource.progress,
//           completed: request.completed,
//           notes: request.notes,
//           rating: request.rating,
//           skillsPracticed: request.skillsPracticed || resource.skills
//         });
//       }

//       // Update user progress
//       await this.updateUserProgress(resource, request);

//       return resource;
//     } catch (error) {
//       console.error('Error updating resource progress:', error);
//       throw new Error('Failed to update resource progress');
//     }
//   }

//   /**
//    * Get study guides for a specific domain/role
//    */
//   static getStudyGuides(domain?: string, subfield?: string, targetRole?: string): StudyGuide[] {
//     let guides = [...STUDY_GUIDES];

//     if (domain) {
//       guides = guides.filter(g => g.domain === domain);
//     }

//     if (subfield) {
//       guides = guides.filter(g => g.subfield === subfield);
//     }

//     if (targetRole) {
//       guides = guides.filter(g => g.targetRole.toLowerCase().includes(targetRole.toLowerCase()));
//     }

//     return guides;
//   }

//   /**
//    * Get preparation materials for a specific domain/role
//    */
//   static getPreparationMaterials(domain?: string, subfield?: string, targetRole?: string): PreparationMaterial[] {
//     let materials = [...PREPARATION_MATERIALS];

//     if (domain) {
//       materials = materials.filter(m => m.domain === domain);
//     }

//     if (subfield) {
//       materials = materials.filter(m => m.subfield === subfield);
//     }

//     if (targetRole) {
//       materials = materials.filter(m => m.targetRole.toLowerCase().includes(targetRole.toLowerCase()));
//     }

//     return materials;
//   }

//   /**
//    * Get learning progress for a user
//    */
//   static async getUserProgress(domain?: string, subfield?: string): Promise<LearningProgress> {
//     try {
//       // In a real app, this would fetch from the backend
//       // For now, we'll calculate from local data
//       const relevantResources = LEARNING_RESOURCES.filter(r => {
//         if (domain && r.domain !== domain) return false;
//         if (subfield && r.subfield !== subfield) return false;
//         return true;
//       });

//       const completedResources = relevantResources.filter(r => r.completed);
//       const inProgressResources = relevantResources.filter(r => r.progress > 0 && !r.completed);
      
//       const overallProgress = relevantResources.length > 0 
//         ? Math.round((completedResources.length / relevantResources.length) * 100)
//         : 0;

//       const skillsAcquired = [...new Set(
//         completedResources.flatMap(r => r.skills)
//       )];

//       const timeSpent = relevantResources.reduce((total, r) => total + (r.timeSpent || 0), 0);

//       return {
//         userId: 'current-user', // Would come from auth context
//         domain: domain || 'all',
//         subfield,
//         overallProgress,
//         completedResources: completedResources.map(r => r.id),
//         inProgressResources: inProgressResources.map(r => r.id),
//         skillsAcquired,
//         timeSpent,
//         studyStreak: 0, // Would be calculated from learning sessions
//         lastActivityDate: new Date(),
//         milestones: [],
//         achievements: [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };
//     } catch (error) {
//       console.error('Error getting user progress:', error);
//       throw new Error('Failed to fetch user progress');
//     }
//   }

//   /**
//    * Create a learning session record
//    */
//   private static async createLearningSession(sessionData: Partial<LearningSession>): Promise<LearningSession> {
//     const session: LearningSession = {
//       id: `session_${Date.now()}`,
//       userId: 'current-user', // Would come from auth context
//       resourceId: sessionData.resourceId!,
//       startTime: new Date(),
//       endTime: new Date(),
//       duration: sessionData.duration || 0,
//       progress: sessionData.progress || 0,
//       completed: sessionData.completed || false,
//       notes: sessionData.notes,
//       rating: sessionData.rating,
//       skillsPracticed: sessionData.skillsPracticed || [],
//       createdAt: new Date()
//     };

//     // In a real app, this would save to the backend
//     console.log('Learning session created:', session);
//     return session;
//   }

//   /**
//    * Update user progress based on resource completion
//    */
//   private static async updateUserProgress(resource: LearningResource, request: ResourceCompletionRequest): Promise<void> {
//     try {
//       // In a real app, this would update the backend
//       // For now, we'll just log the progress update
//       console.log('Updating user progress:', {
//         resourceId: resource.id,
//         completed: request.completed,
//         skillsGained: request.skillsPracticed || resource.skills,
//         timeSpent: request.timeSpent
//       });

//       // Here you would typically:
//       // 1. Update user's overall progress
//       // 2. Add skills to user's acquired skills
//       // 3. Update learning streaks
//       // 4. Check for milestone completions
//       // 5. Award achievements if applicable
//     } catch (error) {
//       console.error('Error updating user progress:', error);
//     }
//   }

//   /**
//    * Apply filters progressively for better performance (Requirements 10.3, 10.4)
//    */
//   private static async applyFiltersProgressively(
//     resources: LearningResource[], 
//     options: ResourceSearchOptions,
//     operationId: string
//   ): Promise<LearningResource[]> {
//     let filteredResources = [...resources];
//     const filters = [
//       { name: 'domain', condition: (r: LearningResource) => !options.domain || r.domain === options.domain },
//       { name: 'subfield', condition: (r: LearningResource) => !options.subfield || r.subfield === options.subfield },
//       { name: 'type', condition: (r: LearningResource) => !options.type?.length || options.type.includes(r.type) },
//       { name: 'difficulty', condition: (r: LearningResource) => !options.difficulty?.length || options.difficulty.includes(r.difficulty) },
//       { name: 'cost', condition: (r: LearningResource) => {
//         if (!options.cost) return true;
//         if (options.cost === 'free') return r.cost === 0;
//         if (options.cost === 'paid') return r.cost > 0;
//         return true;
//       }},
//       { name: 'rating', condition: (r: LearningResource) => !options.rating || (r.rating || 0) >= options.rating },
//       { name: 'completed', condition: (r: LearningResource) => options.completed === undefined || r.completed === options.completed },
//       { name: 'tags', condition: (r: LearningResource) => !options.tags?.length || options.tags.some(tag => r.tags.includes(tag)) },
//       { name: 'provider', condition: (r: LearningResource) => !options.provider?.length || options.provider.includes(r.provider) }
//     ];

//     // Apply filters in batches for better performance
//     for (let i = 0; i < filters.length; i++) {
//       const filter = filters[i];
//       filteredResources = filteredResources.filter(filter.condition);
      
//       // Update progress
//       const progress = 30 + Math.round((i / filters.length) * 30);
//       loadingService.updateProgress(operationId, progress, `Applying ${filter.name} filter...`, 'filtering');
      
//       // Small delay to prevent blocking
//       if (filteredResources.length > 1000) {
//         await new Promise(resolve => setTimeout(resolve, 10));
//       }
//     }

//     return filteredResources;
//   }

//   /**
//    * Batch preload resources for better performance (Requirements 10.1, 10.3)
//    */
//   static async preloadResources(
//     domains: string[],
//     options: { priority?: 'high' | 'medium' | 'low' } = {}
//   ): Promise<void> {
//     const operationId = 'preload-resources';
    
//     try {
//       loadingService.setLoading(operationId, true, {
//         message: 'Preloading learning resources...',
//         progress: 0
//       });

//       const preloadPromises = domains.map(async (domain, index) => {
//         const cacheKey = `learning_resources_${JSON.stringify({ domain })}`;
//         const cached = await cacheService.get(cacheKey);
        
//         if (!cached) {
//           const resources = await this.getResources({ domain });
//           const progress = Math.round(((index + 1) / domains.length) * 100);
//           loadingService.updateProgress(operationId, progress, `Preloaded ${domain} resources`);
//         }
//       });

//       await Promise.all(preloadPromises);

//       loadingService.setLoading(operationId, false, {
//         progress: 100,
//         message: 'Resources preloaded successfully'
//       });

//     } catch (error) {
//       loadingService.setError(operationId, (error as Error).message);
//       throw error;
//     }
//   }

//   /**
//    * Get user progress with caching (Requirements 10.1, 10.2)
//    */
//   static async getUserProgress(domain?: string, subfield?: string): Promise<LearningProgress> {
//     const cacheKey = `user_progress_${domain || 'all'}_${subfield || 'all'}`;
    
//     try {
//       // Check cache first
//       const cached = await cacheService.get<LearningProgress>(cacheKey);
//       if (cached) {
//         return cached;
//       }

//       // Calculate progress (existing logic)
//       const progress = await this.calculateUserProgress(domain, subfield);
      
//       // Cache the result
//       await cacheService.set(cacheKey, progress, this.PROGRESS_CACHE_TTL);
      
//       return progress;
//     } catch (error) {
//       console.error('Error getting user progress:', error);
//       throw new Error('Failed to fetch user progress');
//     }
//   }

//   /**
//    * Calculate user progress (extracted from original getUserProgress)
//    */
//   private static async calculateUserProgress(domain?: string, subfield?: string): Promise<LearningProgress> {
//     // In a real app, this would fetch from the backend
//     // For now, we'll calculate from local data
//     const relevantResources = LEARNING_RESOURCES.filter(r => {
//       if (domain && r.domain !== domain) return false;
//       if (subfield && r.subfield !== subfield) return false;
//       return true;
//     });

//     const completedResources = relevantResources.filter(r => r.completed);
//     const inProgressResources = relevantResources.filter(r => r.progress > 0 && !r.completed);
    
//     const overallProgress = relevantResources.length > 0 
//       ? Math.round((completedResources.length / relevantResources.length) * 100)
//       : 0;

//     const skillsAcquired = [...new Set(
//       completedResources.flatMap(r => r.skills)
//     )];

//     const timeSpent = relevantResources.reduce((total, r) => total + (r.timeSpent || 0), 0);

//     return {
//       userId: 'current-user', // Would come from auth context
//       domain: domain || 'all',
//       subfield,
//       overallProgress,
//       completedResources: completedResources.map(r => r.id),
//       inProgressResources: inProgressResources.map(r => r.id),
//       skillsAcquired,
//       timeSpent,
//       studyStreak: 0, // Would be calculated from learning sessions
//       lastActivityDate: new Date(),
//       milestones: [],
//       achievements: [],
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
//   }

//   // Helper methods

//   private static async getFilteredCategories(options: ResourceSearchOptions): Promise<LearningResourceCategory[]> {
//     let categories = [...LEARNING_RESOURCE_CATEGORIES];

//     if (options.domain) {
//       categories = categories.filter(c => c.domain === options.domain);
//     }

//     if (options.subfield) {
//       categories = categories.filter(c => c.subfield === options.subfield);
//     }

//     if (options.skillLevel) {
//       categories = categories.filter(c => c.skillLevel === options.skillLevel);
//     }

//     return categories;
//   }

//   private static async getFilteredStudyGuides(options: ResourceSearchOptions): Promise<StudyGuide[]> {
//     return this.getStudyGuides(options.domain, options.subfield);
//   }

//   private static async getFilteredPreparationMaterials(options: ResourceSearchOptions): Promise<PreparationMaterial[]> {
//     return this.getPreparationMaterials(options.domain, options.subfield);
//   }

//   private static calculateRecommendationScore(resource: LearningResource, userProfile: UserProfile): number {
//     let score = 50; // Base score

//     // Skill match bonus
//     const userSkills = userProfile.skills || [];
//     const matchedSkills = resource.skills.filter(skill => 
//       userSkills.some(userSkill => 
//         userSkill.toLowerCase().includes(skill.toLowerCase()) ||
//         skill.toLowerCase().includes(userSkill.toLowerCase())
//       )
//     );
//     score += matchedSkills.length * 10;

//     // Career interest match
//     if (userProfile.careerInterest && 
//         (resource.domain.includes(userProfile.careerInterest.toLowerCase()) ||
//          resource.skills.some(skill => skill.toLowerCase().includes(userProfile.careerInterest.toLowerCase())))) {
//       score += 20;
//     }

//     // Rating bonus
//     if (resource.rating) {
//       score += (resource.rating - 3) * 5; // Bonus for ratings above 3
//     }

//     // Free resource bonus
//     if (resource.cost === 0) {
//       score += 5;
//     }

//     // Difficulty appropriateness
//     const userLevel = this.estimateUserLevel(userProfile);
//     if (resource.difficulty === userLevel) {
//       score += 15;
//     } else if (
//       (resource.difficulty === 'intermediate' && userLevel === 'beginner') ||
//       (resource.difficulty === 'advanced' && userLevel === 'intermediate')
//     ) {
//       score += 5; // Slight bonus for next level up
//     }

//     return Math.min(100, Math.max(0, score));
//   }

//   private static generateRecommendationReasons(resource: LearningResource, userProfile: UserProfile): string[] {
//     const reasons: string[] = [];

//     // Skill matches
//     const userSkills = userProfile.skills || [];
//     const matchedSkills = resource.skills.filter(skill => 
//       userSkills.some(userSkill => 
//         userSkill.toLowerCase().includes(skill.toLowerCase()) ||
//         skill.toLowerCase().includes(userSkill.toLowerCase())
//       )
//     );

//     if (matchedSkills.length > 0) {
//       reasons.push(`Builds on your existing ${matchedSkills.join(', ')} skills`);
//     }

//     // Career interest match
//     if (userProfile.careerInterest && 
//         resource.domain.includes(userProfile.careerInterest.toLowerCase())) {
//       reasons.push(`Aligns with your career interest in ${userProfile.careerInterest}`);
//     }

//     // High rating
//     if (resource.rating && resource.rating >= 4.5) {
//       reasons.push(`Highly rated course (${resource.rating}/5.0)`);
//     }

//     // Free resource
//     if (resource.cost === 0) {
//       reasons.push('Free to access');
//     }

//     // Appropriate difficulty
//     const userLevel = this.estimateUserLevel(userProfile);
//     if (resource.difficulty === userLevel) {
//       reasons.push(`Perfect for your ${userLevel} level`);
//     }

//     return reasons;
//   }

//   private static getMatchedSkills(resource: LearningResource, userProfile: UserProfile): string[] {
//     const userSkills = userProfile.skills || [];
//     return resource.skills.filter(skill => 
//       userSkills.some(userSkill => 
//         userSkill.toLowerCase().includes(skill.toLowerCase()) ||
//         skill.toLowerCase().includes(userSkill.toLowerCase())
//       )
//     );
//   }

//   private static assessDifficulty(resource: LearningResource, userProfile: UserProfile): 'perfect-match' | 'slightly-challenging' | 'very-challenging' {
//     const userLevel = this.estimateUserLevel(userProfile);
    
//     if (resource.difficulty === userLevel) {
//       return 'perfect-match';
//     } else if (
//       (resource.difficulty === 'intermediate' && userLevel === 'beginner') ||
//       (resource.difficulty === 'advanced' && userLevel === 'intermediate')
//     ) {
//       return 'slightly-challenging';
//     } else {
//       return 'very-challenging';
//     }
//   }

//   private static estimateBenefit(resource: LearningResource, userProfile: UserProfile): 'high' | 'medium' | 'low' {
//     const matchedSkills = this.getMatchedSkills(resource, userProfile);
//     const careerMatch = userProfile.careerInterest && 
//       resource.domain.includes(userProfile.careerInterest.toLowerCase());

//     if (matchedSkills.length >= 2 || careerMatch) {
//       return 'high';
//     } else if (matchedSkills.length === 1) {
//       return 'medium';
//     } else {
//       return 'low';
//     }
//   }

//   private static estimateUserLevel(userProfile: UserProfile): 'beginner' | 'intermediate' | 'advanced' {
//     const skillCount = userProfile.skills?.length || 0;
    
//     if (skillCount >= 8) {
//       return 'advanced';
//     } else if (skillCount >= 4) {
//       return 'intermediate';
//     } else {
//       return 'beginner';
//     }
//   }

//   private static parseDurationToMinutes(duration: string): number {
//     const match = duration.match(/(\d+)\s*(hour|minute|day|week|month)/i);
//     if (!match) return 0;

//     const value = parseInt(match[1]);
//     const unit = match[2].toLowerCase();

//     switch (unit) {
//       case 'minute': return value;
//       case 'hour': return value * 60;
//       case 'day': return value * 8 * 60; // 8 hours per day
//       case 'week': return value * 40 * 60; // 40 hours per week
//       case 'month': return value * 160 * 60; // 160 hours per month
//       default: return 0;
//     }
//   }
// }


import { cacheService } from './cacheService';

/* =========================
   Types & Interfaces
========================= */

export interface LearningResource {
  id: string;
  title: string;
  domain: string;
  subfield?: string;
  skills: string[];
  progress: number; // 0–100
  completed: boolean;
  timeSpent?: number; // in minutes
}

export interface LearningProgress {
  userId: string;
  domain: string;
  subfield?: string;
  overallProgress: number;
  completedResources: string[];
  inProgressResources: string[];
  skillsAcquired: string[];
  timeSpent: number;
  studyStreak: number;
  lastActivityDate: Date;
  milestones: string[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   Mock Data (can be replaced with API)
========================= */

const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'Intro to Web Development',
    domain: 'Computer Science',
    subfield: 'Web',
    skills: ['HTML', 'CSS'],
    progress: 100,
    completed: true,
    timeSpent: 180
  },
  {
    id: '2',
    title: 'JavaScript Basics',
    domain: 'Computer Science',
    subfield: 'Web',
    skills: ['JavaScript'],
    progress: 60,
    completed: false,
    timeSpent: 120
  }
];

/* =========================
   Service
========================= */

export class LearningResourcesService {
  private static readonly PROGRESS_CACHE_TTL = 60 * 5; // 5 minutes

  /* ---------------------------------
     PUBLIC METHOD (with caching)
  ---------------------------------- */

  /**
   * Get user learning progress (cached)
   */
  static async getUserProgress(
    domain?: string,
    subfield?: string
  ): Promise<LearningProgress> {
    const cacheKey = `user_progress_${domain || 'all'}_${subfield || 'all'}`;

    const cached =
      await cacheService.get<LearningProgress>(cacheKey);

    if (cached) {
      return cached;
    }

    const progress =
      await this.calculateUserProgress(domain, subfield);

    await cacheService.set(
      cacheKey,
      progress,
      this.PROGRESS_CACHE_TTL
    );

    return progress;
  }

  /* ---------------------------------
     PRIVATE CALCULATION LOGIC
  ---------------------------------- */

  /**
   * Core progress calculation logic
   */
  private static async calculateUserProgress(
    domain?: string,
    subfield?: string
  ): Promise<LearningProgress> {
    try {
      const relevantResources = LEARNING_RESOURCES.filter(r => {
        if (domain && r.domain !== domain) return false;
        if (subfield && r.subfield !== subfield) return false;
        return true;
      });

      const completedResources =
        relevantResources.filter(r => r.completed);

      const inProgressResources =
        relevantResources.filter(
          r => r.progress > 0 && !r.completed
        );

      const overallProgress =
        relevantResources.length > 0
          ? Math.round(
              (completedResources.length /
                relevantResources.length) * 100
            )
          : 0;

      const skillsAcquired = [
        ...new Set(
          completedResources.flatMap(r => r.skills)
        )
      ];

      const timeSpent =
        relevantResources.reduce(
          (total, r) => total + (r.timeSpent || 0),
          0
        );

      return {
        userId: 'current-user',
        domain: domain || 'all',
        subfield,
        overallProgress,
        completedResources:
          completedResources.map(r => r.id),
        inProgressResources:
          inProgressResources.map(r => r.id),
        skillsAcquired,
        timeSpent,
        studyStreak: 0,
        lastActivityDate: new Date(),
        milestones: [],
        achievements: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error calculating user progress:', error);
      throw new Error('Failed to calculate user progress');
    }
  }
}
