const express = require('express');
const { 
  ProgressTracking, 
  DashboardState, 
  SessionProgress, 
  LearningChecklist, 
  UserProfileMetadata 
} = require('../models/UserProfile');

const router = express.Router();

/**
 * Profile and Progress Persistence API Routes
 * Implements requirements 9.1, 9.2, 9.3, 9.4
 */

// Middleware to ensure user authentication
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Progress Tracking Endpoints

// Get user's progress tracking data
router.get('/progress/:domain?', requireAuth, async (req, res) => {
  try {
    const { domain } = req.params;
    const { subfield } = req.query;
    
    const query = { userId: req.user.id };
    if (domain) query.domain = domain;
    if (subfield) query.subfield = subfield;
    
    let progress = await ProgressTracking.findOne(query).exec();
    
    // Create initial progress if none exists
    if (!progress) {
      progress = new ProgressTracking({
        userId: req.user.id,
        domain: domain || 'all',
        subfield,
        overallProgress: 0,
        completedResources: [],
        inProgressResources: [],
        skillsAcquired: [],
        timeSpent: 0,
        studyStreak: 0,
        lastActivityDate: new Date(),
        milestones: [],
        achievements: []
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress data' });
  }
});

// Update progress tracking data
router.post('/progress', requireAuth, async (req, res) => {
  try {
    const progressData = req.body;
    const { domain, subfield } = progressData;
    
    const query = { userId: req.user.id };
    if (domain) query.domain = domain;
    if (subfield) query.subfield = subfield;
    
    const updatedProgress = await ProgressTracking.findOneAndUpdate(
      query,
      {
        ...progressData,
        userId: req.user.id,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).exec();
    
    res.json(updatedProgress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress data' });
  }
});

// Dashboard State Endpoints (Requirement 9.1, 9.3)

// Get dashboard state for returning users
router.get('/dashboard-state', requireAuth, async (req, res) => {
  try {
    let dashboardState = await DashboardState.findOne({ userId: req.user.id }).exec();
    
    if (!dashboardState) {
      // Create default dashboard state
      dashboardState = new DashboardState({
        userId: req.user.id,
        currentView: 'roadmap',
        scrollPosition: 0,
        expandedSections: [],
        lastVisited: new Date(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      });
      await dashboardState.save();
    }
    
    res.json(dashboardState);
  } catch (error) {
    console.error('Get dashboard state error:', error);
    res.status(500).json({ error: 'Failed to get dashboard state' });
  }
});

// Save dashboard state
router.post('/dashboard-state', requireAuth, async (req, res) => {
  try {
    const stateData = req.body;
    
    const dashboardState = await DashboardState.findOneAndUpdate(
      { userId: req.user.id },
      {
        ...stateData,
        userId: req.user.id,
        lastVisited: new Date(),
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).exec();
    
    res.json(dashboardState);
  } catch (error) {
    console.error('Save dashboard state error:', error);
    res.status(500).json({ error: 'Failed to save dashboard state' });
  }
});

// Session Progress Endpoints (Requirement 9.4)

// Start new learning session
router.post('/session/start', requireAuth, async (req, res) => {
  try {
    const { sessionType = 'learning' } = req.body;
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = new SessionProgress({
      sessionId,
      userId: req.user.id,
      startTime: new Date(),
      lastActivity: new Date(),
      activitiesCompleted: [],
      timeSpent: 0,
      sessionType,
      isActive: true,
      progressSnapshot: {}
    });
    
    await session.save();
    
    res.json(session);
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Update session progress
router.put('/session/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    
    const session = await SessionProgress.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      {
        ...updates,
        lastActivity: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// End learning session
router.post('/session/:sessionId/end', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await SessionProgress.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      {
        endTime: new Date(),
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Calculate total session time
    const totalTime = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
    session.timeSpent = totalTime;
    await session.save();
    
    res.json(session);
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Get active session
router.get('/session/active', requireAuth, async (req, res) => {
  try {
    const activeSession = await SessionProgress.findOne({
      userId: req.user.id,
      isActive: true,
      lastActivity: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } // Within last 2 hours
    }).exec();
    
    if (!activeSession) {
      return res.status(404).json({ error: 'No active session found' });
    }
    
    res.json(activeSession);
  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({ error: 'Failed to get active session' });
  }
});

// Learning Checklist Endpoints

// Get user's learning checklists
router.get('/checklists', requireAuth, async (req, res) => {
  try {
    const { domain } = req.query;
    
    const query = { userId: req.user.id };
    if (domain) query.domain = domain;
    
    const checklists = await LearningChecklist.find(query)
      .sort({ createdAt: -1 })
      .exec();
    
    res.json(checklists);
  } catch (error) {
    console.error('Get checklists error:', error);
    res.status(500).json({ error: 'Failed to get checklists' });
  }
});

// Create new learning checklist
router.post('/checklists', requireAuth, async (req, res) => {
  try {
    const checklistData = req.body;
    
    const checklist = new LearningChecklist({
      ...checklistData,
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await checklist.save();
    
    res.json(checklist);
  } catch (error) {
    console.error('Create checklist error:', error);
    res.status(500).json({ error: 'Failed to create checklist' });
  }
});

// Update checklist item
router.put('/checklists/:checklistId/items/:itemId', requireAuth, async (req, res) => {
  try {
    const { checklistId, itemId } = req.params;
    const updates = req.body;
    
    const checklist = await LearningChecklist.findOne({
      id: checklistId,
      userId: req.user.id
    }).exec();
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    const itemIndex = checklist.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }
    
    // Update the item
    checklist.items[itemIndex] = {
      ...checklist.items[itemIndex],
      ...updates,
      completedAt: updates.completed ? new Date() : checklist.items[itemIndex].completedAt
    };
    
    // Recalculate overall progress
    const totalProgress = checklist.items.reduce((sum, item) => sum + item.progress, 0);
    checklist.overallProgress = Math.round(totalProgress / checklist.items.length);
    checklist.updatedAt = new Date();
    
    await checklist.save();
    
    res.json(checklist);
  } catch (error) {
    console.error('Update checklist item error:', error);
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
});

// User Profile Metadata Endpoints

// Get user profile metadata
router.get('/metadata', requireAuth, async (req, res) => {
  try {
    let metadata = await UserProfileMetadata.findOne({ userId: req.user.id }).exec();
    
    if (!metadata) {
      // Create initial metadata
      metadata = new UserProfileMetadata({
        userId: req.user.id,
        profileCompleteness: 0,
        lastProfileUpdate: new Date(),
        assessmentCompleted: false,
        onboardingCompleted: false,
        onboardingStep: 0,
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true,
          learningReminders: true
        },
        statistics: {
          totalLoginDays: 1,
          totalTimeSpent: 0,
          resourcesCompleted: 0,
          achievementsEarned: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      });
      await metadata.save();
    }
    
    res.json(metadata);
  } catch (error) {
    console.error('Get metadata error:', error);
    res.status(500).json({ error: 'Failed to get profile metadata' });
  }
});

// Update user profile metadata
router.put('/metadata', requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    
    const metadata = await UserProfileMetadata.findOneAndUpdate(
      { userId: req.user.id },
      {
        ...updates,
        userId: req.user.id,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).exec();
    
    res.json(metadata);
  } catch (error) {
    console.error('Update metadata error:', error);
    res.status(500).json({ error: 'Failed to update profile metadata' });
  }
});

// Sync all user data endpoint
router.post('/sync', requireAuth, async (req, res) => {
  try {
    const { progressData, dashboardState, sessionData } = req.body;
    
    const results = {};
    
    // Sync progress data if provided
    if (progressData) {
      const progress = await ProgressTracking.findOneAndUpdate(
        { userId: req.user.id, domain: progressData.domain || 'all' },
        {
          ...progressData,
          userId: req.user.id,
          updatedAt: new Date()
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec();
      results.progress = progress;
    }
    
    // Sync dashboard state if provided
    if (dashboardState) {
      const dashboard = await DashboardState.findOneAndUpdate(
        { userId: req.user.id },
        {
          ...dashboardState,
          userId: req.user.id,
          lastVisited: new Date(),
          updatedAt: new Date()
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec();
      results.dashboardState = dashboard;
    }
    
    // Sync session data if provided
    if (sessionData && sessionData.sessionId) {
      const session = await SessionProgress.findOneAndUpdate(
        { sessionId: sessionData.sessionId, userId: req.user.id },
        {
          ...sessionData,
          userId: req.user.id,
          lastActivity: new Date(),
          updatedAt: new Date()
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec();
      results.session = session;
    }
    
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Sync data error:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

module.exports = router;