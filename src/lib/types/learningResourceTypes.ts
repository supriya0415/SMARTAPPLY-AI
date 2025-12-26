// Learning Resources System Types
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'certification' | 'project' | 'book' | 'video' | 'practice' | 'article' | 'tutorial';
  provider: string;
  url?: string;
  duration: string;
  cost: number;
  rating?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  domain: string;
  subfield?: string;
  prerequisites: string[];
  learningOutcomes: string[];
  tags: string[];
  platformLinks?: PlatformLink[];
  completed: boolean;
  completedAt?: Date;
  progress: number; // 0-100
  timeSpent?: number; // minutes
  userRating?: number;
  userNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformLink {
  platform: string;
  displayName: string;
  url: string;
  logo?: string;
  isRecommended?: boolean;
}

export interface LearningResourceCategory {
  id: string;
  name: string;
  description: string;
  domain: string;
  subfield?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  resources: LearningResource[];
  estimatedDuration: string;
  totalCost: number;
  completionRate: number; // 0-100
}

export interface StudyGuide {
  id: string;
  title: string;
  description: string;
  domain: string;
  subfield?: string;
  targetRole: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  sections: StudyGuideSection[];
  resources: LearningResource[];
  prerequisites: string[];
  learningObjectives: string[];
  assessmentCriteria: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyGuideSection {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: string;
  topics: string[];
  resources: string[]; // Resource IDs
  completed: boolean;
  completedAt?: Date;
}

export interface PreparationMaterial {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'template' | 'guide' | 'practice-test' | 'interview-prep';
  domain: string;
  subfield?: string;
  targetRole: string;
  content: PreparationContent;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreparationContent {
  sections: PreparationSection[];
  resources: string[]; // Resource IDs
  tips: string[];
  commonMistakes: string[];
  successCriteria: string[];
}

export interface PreparationSection {
  id: string;
  title: string;
  description: string;
  order: number;
  items: PreparationItem[];
  completed: boolean;
}

export interface PreparationItem {
  id: string;
  title: string;
  description?: string;
  type: 'task' | 'skill' | 'knowledge' | 'practice';
  priority: 'critical' | 'important' | 'nice-to-have';
  estimatedTime?: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface LearningProgress {
  userId: string;
  domain: string;
  subfield?: string;
  overallProgress: number; // 0-100
  completedResources: string[]; // Resource IDs
  inProgressResources: string[]; // Resource IDs
  skillsAcquired: string[];
  timeSpent: number; // minutes
  studyStreak: number; // days
  lastActivityDate: Date;
  milestones: ProgressMilestone[];
  achievements: ProgressAchievement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  type: 'resource-completion' | 'skill-mastery' | 'time-based' | 'project-completion';
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
}

export interface ProgressAchievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'learning' | 'consistency' | 'skill' | 'completion';
  earnedAt: Date;
  experiencePoints: number;
}

export interface LearningSession {
  id: string;
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  progress: number; // 0-100
  completed: boolean;
  notes?: string;
  rating?: number;
  skillsPracticed: string[];
  createdAt: Date;
}

export interface ResourceRecommendation {
  resource: LearningResource;
  score: number; // 0-100
  reasons: string[];
  matchedSkills: string[];
  difficulty: 'perfect-match' | 'slightly-challenging' | 'very-challenging';
  estimatedBenefit: 'high' | 'medium' | 'low';
}

// API Response Types
export interface LearningResourcesResponse {
  resources: LearningResource[];
  categories: LearningResourceCategory[];
  studyGuides: StudyGuide[];
  preparationMaterials: PreparationMaterial[];
  progress: LearningProgress;
  recommendations: ResourceRecommendation[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ResourceCompletionRequest {
  resourceId: string;
  completed: boolean;
  progress?: number;
  timeSpent?: number;
  rating?: number;
  notes?: string;
  skillsPracticed?: string[];
}

export interface ResourceFilterOptions {
  domain?: string;
  subfield?: string;
  type?: string[];
  difficulty?: string[];
  cost?: 'free' | 'paid' | 'all';
  duration?: 'short' | 'medium' | 'long' | 'all'; // <2h, 2-10h, >10h
  rating?: number; // minimum rating
  completed?: boolean;
  inProgress?: boolean;
  tags?: string[];
  provider?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ResourceSearchOptions extends ResourceFilterOptions {
  query?: string;
  sortBy?: 'relevance' | 'rating' | 'duration' | 'cost' | 'difficulty' | 'recent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}