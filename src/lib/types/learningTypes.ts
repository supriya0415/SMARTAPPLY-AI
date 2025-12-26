// Learning Assistant Types
export interface DocumentAnalysisResult {
  summary: string[];
  keyPoints: string[];
  glossary: Array<{
    term: string;
    definition: string;
    context: string;
  }>;
  documentLength: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedReadTime: number;
}

export interface NotesData {
  id: string;
  title: string;
  content: string;
  summary: string[];
  keyPoints: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  syncedWithSkills?: string[]; // Skills from roadmap this relates to
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  relatedSkill?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'SHORT_ANSWER' | 'TRUE_FALSE';
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: string | number; // Index for MCQ, text for others
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  relatedSkill?: string;
  tags: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  relatedSkills: string[];
  createdAt: Date;
}

export interface StudySession {
  id: string;
  type: 'FLASHCARDS' | 'QUIZ' | 'NOTES_REVIEW';
  contentId: string;
  score?: number;
  timeSpent: number; // in minutes
  completedAt: Date;
  relatedSkills: string[];
}

export interface LearningProgress {
  skillId: string;
  skillName: string;
  notesCount: number;
  flashcardsCount: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  timeSpent: number; // in minutes
  lastActivity: Date;
  masteryLevel: 'NOVICE' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}