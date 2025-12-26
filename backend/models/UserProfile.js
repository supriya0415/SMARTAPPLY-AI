const { Schema } = require('mongoose');
const { mongoose } = require('../db');

/**
 * User Profile Data Model
 * Implements requirements 9.1, 9.2, 9.3, 9.4 for user profile and progress persistence
 */

// Progress Tracking Schema
const ProgressTrackingSchema = new Schema({
  userId: { type: String, required: true, index: true },
  domain: { type: String, required: true },
  subfield: String,
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  completedResources: [String],
  inProgressResources: [String],
  skillsAcquired: [String],
  timeSpent: { type: Number, default: 0 }, // minutes
  studyStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: Date.now },
  milestones: [{
    id: String,
    title: String,
    description: String,
    type: { type: String, enum: ['resource-completion', 'skill-mastery', 'time-based'] },
    targetValue: Number,
    currentValue: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    reward: String
  }],
  achievements: [{
    id: String,
    title: String,
    description: String,
    badgeIcon: String,
    category: { type: String, enum: ['completion', 'consistency', 'skill', 'milestone'] },
    earnedAt: { type: Date, default: Date.now },
    experiencePoints: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Dashboard State Schema for requirement 9.1, 9.3
const DashboardStateSchema = new Schema({
  userId: { type: String, required: true, index: true },
  selectedDomain: String,
  selectedJobRole: String,
  currentView: { 
    type: String, 
    enum: ['roadmap', 'resources', 'progress', 'similar-jobs'],
    default: 'roadmap'
  },
  scrollPosition: { type: Number, default: 0 },
  expandedSections: [String],
  lastVisited: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    notifications: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Session Progress Schema for requirement 9.4
const SessionProgressSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  lastActivity: { type: Date, default: Date.now },
  activitiesCompleted: [String],
  timeSpent: { type: Number, default: 0 }, // minutes
  currentResource: String,
  progressSnapshot: Schema.Types.Mixed,
  sessionType: { 
    type: String, 
    enum: ['learning', 'assessment', 'dashboard', 'general'],
    default: 'learning'
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Learning Checklist Schema
const LearningChecklistSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  domain: { type: String, required: true },
  subfield: String,
  targetRole: String,
  items: [{
    id: String,
    title: String,
    description: String,
    category: { type: String, enum: ['skill', 'resource', 'project', 'milestone'] },
    priority: { type: String, enum: ['critical', 'important', 'nice-to-have'] },
    estimatedTime: String,
    dependencies: [String],
    completed: { type: Boolean, default: false },
    completedAt: Date,
    progress: { type: Number, default: 0, min: 0, max: 100 },
    notes: String,
    relatedResourceIds: [String]
  }],
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  estimatedCompletion: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Profile Metadata Schema
const UserProfileMetadataSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },
  lastProfileUpdate: { type: Date, default: Date.now },
  assessmentCompleted: { type: Boolean, default: false },
  assessmentCompletedAt: Date,
  onboardingCompleted: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    learningReminders: { type: Boolean, default: true }
  },
  statistics: {
    totalLoginDays: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // minutes
    resourcesCompleted: { type: Number, default: 0 },
    achievementsEarned: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const ProgressTracking = mongoose.models.ProgressTracking || mongoose.model('ProgressTracking', ProgressTrackingSchema);
const DashboardState = mongoose.models.DashboardState || mongoose.model('DashboardState', DashboardStateSchema);
const SessionProgress = mongoose.models.SessionProgress || mongoose.model('SessionProgress', SessionProgressSchema);
const LearningChecklist = mongoose.models.LearningChecklist || mongoose.model('LearningChecklist', LearningChecklistSchema);
const UserProfileMetadata = mongoose.models.UserProfileMetadata || mongoose.model('UserProfileMetadata', UserProfileMetadataSchema);

module.exports = {
  ProgressTracking,
  DashboardState,
  SessionProgress,
  LearningChecklist,
  UserProfileMetadata
};