const { Schema } = require('mongoose');
const { mongoose } = require('../db');

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  accessLevel: { type: String, required: true, default: 'User' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  lastLoginDate: { type: Date, default: Date.now },
  
  // Enhanced Profile Data
  enhancedProfile: {
    // Basic profile info
    name: String,
    email: String,
    location: String,
    phone: String,
    bio: String,
    age: Number,
    educationLevel: String,
    skills: [String],
    interests: [String],
    careerInterest: String,
    
    // Career Assessment Data
    careerAssessment: {
      responses: Schema.Types.Mixed,
      completedAt: Date,
      assessmentType: String
    },
    
    // Career Recommendations
    careerRecommendations: [{
      id: String,
      title: String,
      description: String,
      fitScore: Number,
      salaryRange: {
        min: Number,
        max: Number,
        currency: String,
        period: String
      },
      growthProspects: String,
      requiredSkills: Schema.Types.Mixed, // Changed from [String] to Mixed to accept both strings and skill objects
      recommendedPath: Schema.Types.Mixed,
      jobMarketData: Schema.Types.Mixed,
      primaryCareer: String,
      relatedRoles: [String],
      careerPath: Schema.Types.Mixed,
      alternatives: [Schema.Types.Mixed],
      summary: String
    }],
    
    selectedCareerPath: String,
    
    // Skill Analysis and Learning
    skillGapAnalysis: Schema.Types.Mixed,
    learningRoadmap: Schema.Types.Mixed,
    
    // Resume Analysis
    resumeVersions: [Schema.Types.Mixed],
    resumeAnalysisHistory: [Schema.Types.Mixed],
    
    // Progress Tracking
    progressData: {
      overallProgress: { type: Number, default: 0 },
      skillProgress: Schema.Types.Mixed,
      milestoneProgress: Schema.Types.Mixed,
      learningActivities: [Schema.Types.Mixed],
      lastUpdated: { type: Date, default: Date.now }
    },
    
    // Gamification
    achievements: [Schema.Types.Mixed],
    currentMilestones: [Schema.Types.Mixed],
    level: { type: Number, default: 1 },
    experiencePoints: { type: Number, default: 0 },
    badges: [Schema.Types.Mixed],
    streaks: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActivityDate: { type: Date, default: Date.now },
      streakType: { type: String, default: 'daily' },
      streakGoal: { type: Number, default: 7 }
    },
    
    // Learning Resources System
    learningProgress: {
      userId: String,
      domain: String,
      subfield: String,
      overallProgress: { type: Number, default: 0 },
      completedResources: [String],
      inProgressResources: [String],
      skillsAcquired: [String],
      timeSpent: { type: Number, default: 0 },
      studyStreak: { type: Number, default: 0 },
      lastActivityDate: { type: Date, default: Date.now },
      milestones: [Schema.Types.Mixed],
      achievements: [Schema.Types.Mixed],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    
    learningChecklists: [Schema.Types.Mixed],
    learningResourcesCompleted: [String],
    
    // Dashboard State for persistence (Requirement 9.1, 9.3)
    dashboardState: {
      selectedDomain: String,
      selectedJobRole: String,
      currentView: { type: String, enum: ['roadmap', 'resources', 'progress', 'similar-jobs'] },
      scrollPosition: Number,
      expandedSections: [String],
      lastVisited: { type: Date, default: Date.now }
    },
    
    // Session Progress for maintenance (Requirement 9.4)
    sessionProgress: [{
      sessionId: String,
      startTime: { type: Date, default: Date.now },
      lastActivity: { type: Date, default: Date.now },
      activitiesCompleted: [String],
      timeSpent: { type: Number, default: 0 },
      currentResource: String,
      progressSnapshot: Schema.Types.Mixed
    }],
    
    // Profile metadata
    profileCreatedAt: { type: Date, default: Date.now },
    profileUpdatedAt: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
