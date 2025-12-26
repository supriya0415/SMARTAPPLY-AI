// User Profile Types
export interface UserProfile {
  name: string;
  age: number;
  educationLevel: EducationLevel;
  skills: string[];
  careerInterest: string;
  location?: string;
  resume?: ResumeData;
  selectedCareer?: {
    title: string;
    description: string;
    department?: string;
    subdepartment?: string;
    averageSalary?: string;
    keySkills?: string[];
  };
}

// Enhanced User Profile for Career Mentor
export interface EnhancedUserProfile extends UserProfile {
  // Career Discovery
  careerAssessment?: CareerAssessmentData;
  careerRecommendations: CareerRecommendation[];
  selectedCareerPath?: string;
  
  // Skill Analysis and Learning
  skillGapAnalysis?: any; // Will be defined by SkillAnalysisService
  learningRoadmap?: LearningPath;
  
  // Resume Analysis
  resumeVersions?: ResumeVersion[];
  
  // Progress Tracking
  progressData: ProgressData;
  achievements: Achievement[];
  currentMilestones: Milestone[];
  
  // Gamification
  level: number;
  experiencePoints: number;
  badges: Badge[];
  streaks: StreakData;
  
  // Profile metadata
  createdAt: Date;
  updatedAt: Date;
}

// Career Assessment Types
export interface CareerAssessmentData {
  interests: string[];
  values: string[];
  workStyle: string[];
  personalityTraits: string[];
  careerGoals: string[];
  timeframe: string;
  preferredIndustries: string[];
  workEnvironmentPreferences: string[];
  completedAt: Date;
  version: string; // for assessment versioning
}

export interface AssessmentQuestion {
  id: string;
  category: 'interests' | 'values' | 'workStyle' | 'personality' | 'goals';
  question: string;
  type: 'multiple-choice' | 'rating' | 'ranking' | 'text';
  options?: string[];
  required: boolean;
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | string[] | number;
  timestamp: Date;
}

// Learning Path Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  phases: LearningPhase[];
  estimatedCost: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  outcomes: string[];
}

export interface LearningPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: 'critical' | 'important' | 'nice-to-have';
  resources: LearningResource[];
  skills: string[];
  order: number;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'certification' | 'project' | 'book' | 'video' | 'practice';
  provider: string;
  url?: string;
  duration: string;
  cost: number;
  rating?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  platformLinks?: PlatformLink[];
}

// Platform Link Types
export interface PlatformLink {
  platform: string;
  displayName: string;
  url: string;
  logo?: string;
  isRecommended?: boolean;
}

export interface LearningPlatform {
  id: string;
  name: string;
  displayName: string;
  logo: string;
  baseUrl: string;
  searchTemplate: string;
  strengths: string[];
}

// Progress Tracking Types
export interface ProgressData {
  overallProgress: number; // 0-100
  skillProgress: Record<string, SkillProgress>;
  milestoneProgress: Record<string, boolean>;
  learningActivities: CompletedActivity[];
  lastUpdated: Date;
}

export interface SkillProgress {
  skillId: string;
  skillName: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number; // 0-100
  activitiesCompleted: number;
  totalActivities: number;
  lastPracticed: Date;
}

export interface CompletedActivity {
  id: string;
  resourceId: string;
  title: string;
  type: 'course' | 'certification' | 'project' | 'book' | 'video' | 'practice';
  completedAt: Date;
  timeSpent: number; // minutes
  skillsGained: string[];
  rating?: number;
  notes?: string;
}

// Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'learning' | 'progress' | 'consistency' | 'milestone' | 'social';
  earnedAt: Date;
  experiencePoints: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date;
  level?: number; // for badges that can be leveled up
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'assessment' | 'learning' | 'skill' | 'career' | 'progress';
  isCompleted: boolean;
  completedAt?: Date;
  requirements: string[];
  reward: Achievement;
  order: number;
  estimatedTimeToComplete?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakType: 'daily' | 'weekly';
  streakGoal: number;
}

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPRequired: number;
  levelTitle: string;
}

// Chatbot Types
export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
  isTyping?: boolean;
}

export interface MessageMetadata {
  messageType: 'text' | 'recommendation' | 'resource' | 'action';
  relatedResources?: LearningResource[];
  suggestedActions?: string[];
  confidence?: number;
}

export interface ConversationContext {
  userProfile: EnhancedUserProfile;
  currentTopic: string;
  recentActions: string[];
  relevantData: Record<string, any>;
  conversationGoals: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  category: 'career' | 'skills' | 'learning' | 'progress';
  prompt: string;
  icon: string;
}

// Enhanced Resume Types
export interface ATSScore {
  overallScore: number; // 0-100
  breakdown: ATSScoreBreakdown;
  recommendations: ATSRecommendation[];
  keywordMatches: KeywordMatch[];
  generatedAt: Date;
}

export interface ATSScoreBreakdown {
  keywordOptimization: number;
  formatting: number;
  structure: number;
  relevance: number;
  completeness: number;
}

export interface ATSRecommendation {
  id: string;
  category: 'keywords' | 'formatting' | 'structure' | 'content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // potential score improvement
  effort: 'low' | 'medium' | 'high';
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  frequency: number;
  importance: 'critical' | 'important' | 'nice-to-have';
  suggestions?: string[];
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  keywords: string[];
  analyzedAt: Date;
}

export interface ResumeVersion {
  id: string;
  name: string;
  description: string;
  resumeData: ResumeData;
  atsScore?: ATSScore;
  targetJob?: JobDescription;
  createdAt: Date;
  isActive: boolean;
}

// Resume Types
export interface ResumeData {
  file: File;
  extractedText: string;
  extractedInfo: ExtractedResumeInfo;
}

export interface ExtractedResumeInfo {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: WorkExperience[];
  education: EducationInfo[];
  summary?: string;
  languages?: string[];
  certifications?: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  skills?: string[];
}

export interface EducationInfo {
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export type EducationLevel = 
  | 'high-school'
  | 'associates'
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'other';

// Career Path Types
export interface CareerNode {
  id: string;
  type: 'course' | 'internship' | 'job' | 'company' | 'skill';
  title: string;
  description: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  salary?: string;
  requirements?: string[];
  position: { x: number; y: number };
}

export interface CareerEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'default' | 'straight' | 'step' | 'smoothstep';
  animated?: boolean;
}

export interface CareerPath {
  nodes: CareerNode[];
  edges: CareerEdge[];
}

// Alternative Career Types
export interface AlternativeCareer {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  salary: string;
  requirements: string[];
  growth: 'very high' | 'high' | 'medium' | 'low';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'internship';
}

// Career Service Response Types
export interface CareerRecommendation {
  id: string;
  title: string;
  description: string;
  fitScore: number; // 0-100
  salaryRange: SalaryRange;
  growthProspects: 'high' | 'medium' | 'low';
  requiredSkills: Skill[];
  recommendedPath: LearningPath;
  jobMarketData: JobMarketInfo;
  primaryCareer: string;
  relatedRoles: string[];
  careerPath: CareerPath;
  alternatives: AlternativeCareer[];
  summary: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isRequired: boolean;
  priority: 'critical' | 'important' | 'nice-to-have';
}

export interface JobMarketInfo {
  demand: 'high' | 'medium' | 'low';
  competitiveness: 'high' | 'medium' | 'low';
  locations: string[];
  industryGrowth: number; // percentage
  averageSalary: number;
}

// Form Types
export interface UserDetailsForm {
  name: string;
  age: number;
  educationLevel: EducationLevel;
  skills: string[];
  careerInterest: string;
  location?: string;
}

// Store Types
export interface UserStore {
  profile: UserProfile | null;
  enhancedProfile: EnhancedUserProfile | null;
  results: CareerRecommendation | null;
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  resumeVersions: ResumeVersion[];
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  setEnhancedProfile: (profile: EnhancedUserProfile) => void;
  setResults: (results: CareerRecommendation) => void;
  updateProgress: (progress: Partial<ProgressData>) => void;
  addAchievement: (achievement: Achievement) => void;
  updateStreak: (streakData: StreakData) => void;
  
  // Gamification actions
  processActivityCompletion: (activity: CompletedActivity) => void;
  awardExperience: (xp: number, reason: string) => void;
  checkAndAwardAchievements: (activityType: string, activityData?: any) => Achievement[];
  updateMilestoneProgress: () => void;
  initializeGamification: () => void;
  getLevelInfo: () => LevelInfo | null;
  
  // Chatbot actions
  setCurrentConversation: (conversation: ChatConversation | null) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  createConversation: (title: string) => ChatConversation;
  
  // Resume actions
  addResumeVersion: (version: ResumeVersion) => void;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => void;
  setActiveResumeVersion: (id: string) => void;
  
  // Utility actions
  clearData: () => void;
  logout: () => Promise<boolean>;
  exportData: () => string;
  importData: (data: string) => void;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Career Mentor Configuration
export interface CareerMentorConfig {
  assessmentVersion: string;
  gamificationEnabled: boolean;
  chatbotEnabled: boolean;
  resumeOptimizationEnabled: boolean;
  maxConversations: number;
  maxResumeVersions: number;
  xpMultiplier: number;
}
// Resume Analysis Types
export interface ResumeFeedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}

// Extended ResumeVersion for AI analysis
export interface EnhancedResumeVersion extends ResumeVersion {
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  resumeUrl?: string;
  imageUrl?: string;
  feedback?: ResumeFeedback;
  status?: 'uploading' | 'analyzing' | 'completed' | 'error';
}

export interface ResumeUploadData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

// Skill Gap Analysis Types (for existing components)
export interface SkillGap {
  skillName: string;
  currentLevel: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  requiredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  gapSize: 'none' | 'small' | 'medium' | 'large';
  priority: 'critical' | 'important' | 'nice-to-have';
  estimatedLearningTime: string;
  recommendedActions: string[];
}

export interface SkillGapAnalysis {
  targetCareer: string;
  overallReadiness: number;
  skillGaps: SkillGap[];
  strengthAreas: string[];
  improvementAreas: string[];
  analysisDate: Date;
}