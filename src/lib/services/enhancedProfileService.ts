import axios from '@/utility/axiosInterceptor';
import { AxiosError } from 'axios';
import { EnhancedUserProfile } from '../types';

export class EnhancedProfileService {
  /**
   * Save enhanced profile to MongoDB
   */
  static async saveEnhancedProfile(profile: EnhancedUserProfile): Promise<EnhancedUserProfile> {
    try {
      console.log('Saving enhanced profile to database:', profile);
      const response = await axios.post('/user/enhanced-profile', profile);
      console.log('Enhanced profile saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to save enhanced profile:', error);
      throw error;
    }
  }

  /**
   * Load enhanced profile from MongoDB
   */
  static async loadEnhancedProfile(): Promise<EnhancedUserProfile | null> {
    try {
      console.log('Loading enhanced profile from database...');
      

      
      const response = await axios.get('/user/enhanced-profile');
      console.log('Enhanced profile loaded successfully:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.log('No enhanced profile found in database');
        return null;
      }
      console.error('Failed to load enhanced profile:', error);
      throw error;
    }
  }

  /**
   * Get mock enhanced profile for development/demo purposes
   */
  private static getMockEnhancedProfile(username: string): EnhancedUserProfile {
    const now = new Date();
    
    return {
      // Basic profile
      name: 'User',
      age: 25,
      educationLevel: 'bachelors' as const,
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript'],
      careerInterest: 'Software Development',
      location: 'San Francisco, CA',
      
      // Career assessment
      careerAssessment: {
        interests: ['technology', 'problem-solving', 'innovation'],
        values: ['growth', 'impact', 'flexibility'],
        workStyle: ['collaborative', 'analytical', 'creative'],
        personalityTraits: ['curious', 'detail-oriented', 'adaptable'],
        careerGoals: ['technical-leadership', 'product-development'],
        timeframe: '2-3 years',
        preferredIndustries: ['technology', 'fintech', 'healthcare'],
        workEnvironmentPreferences: ['remote', 'hybrid', 'startup'],
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        version: '1.0'
      },
      
      // Career recommendations
      careerRecommendations: [
        {
          id: 'rec-1',
          title: 'Full Stack Developer',
          description: 'Build end-to-end web applications using modern technologies',
          fitScore: 92,
          salaryRange: { min: 80000, max: 120000, currency: 'USD', period: 'yearly' as const },
          growthProspects: 'high' as const,
          requiredSkills: [
            { id: 'js', name: 'JavaScript', category: 'programming', isRequired: true, priority: 'critical' as const },
            { id: 'react', name: 'React', category: 'frontend', isRequired: true, priority: 'critical' as const },
            { id: 'nodejs', name: 'Node.js', category: 'backend', isRequired: true, priority: 'important' as const },
            { id: 'db', name: 'Databases', category: 'backend', isRequired: false, priority: 'important' as const }
          ],
          recommendedPath: {
            id: 'path-1',
            title: 'Full Stack Development Path',
            description: 'Complete learning path for full stack development',
            totalDuration: '6-8 months',
            estimatedCost: 500,
            difficulty: 'intermediate' as const,
            prerequisites: ['Basic programming knowledge'],
            outcomes: ['Build full stack applications', 'Deploy to production'],
            phases: []
          },
          jobMarketData: {
            demand: 'high' as const,
            competitiveness: 'medium' as const,
            locations: ['San Francisco', 'New York', 'Seattle', 'Austin'],
            industryGrowth: 15,
            averageSalary: 100000
          },
          primaryCareer: 'Full Stack Developer',
          relatedRoles: ['Frontend Developer', 'Backend Developer', 'Software Engineer'],
          summary: 'High-demand role combining frontend and backend development skills with excellent growth prospects.',
          careerPath: {
            nodes: [
              {
                id: 'node-1',
                type: 'skill',
                title: 'Master React Fundamentals',
                description: 'Learn React hooks, state management, and component patterns',
                duration: '2-3 months',
                difficulty: 'intermediate',
                position: { x: 0, y: 0 }
              },
              {
                id: 'node-2',
                type: 'course',
                title: 'Backend Development with Node.js',
                description: 'Build RESTful APIs and work with databases',
                duration: '3-4 months',
                difficulty: 'intermediate',
                position: { x: 200, y: 0 }
              }
            ],
            edges: [
              {
                id: 'edge-1',
                source: 'node-1',
                target: 'node-2'
              }
            ]
          },
          alternatives: [
            {
              id: 'alt-1',
              title: 'Frontend Developer',
              description: 'Focus on user interface development',
              matchScore: 88,
              salary: '$70k - $100k',
              requirements: ['React', 'CSS', 'JavaScript'],
              growth: 'high' as const
            },
            {
              id: 'alt-2',
              title: 'Software Engineer Intern',
              description: 'Entry-level position to gain experience',
              matchScore: 95,
              salary: '$20 - $30/hour',
              requirements: ['Basic programming', 'Problem solving'],
              growth: 'very high' as const
            }
          ]
        }
      ],
      
      // Learning roadmap
      learningRoadmap: {
        id: 'roadmap-1',
        title: 'Full Stack Development Path',
        description: 'Complete learning path for full stack development',
        totalDuration: '6-8 months',
        estimatedCost: 500,
        difficulty: 'intermediate' as const,
        prerequisites: ['Basic programming knowledge'],
        outcomes: ['Build full stack applications', 'Deploy to production', 'Work with databases'],
        phases: [
          {
            id: 'phase-1',
            title: 'Frontend Fundamentals',
            description: 'Master frontend technologies',
            duration: '2-3 months',
            priority: 'critical' as const,
            order: 1,
            skills: ['HTML', 'CSS', 'JavaScript', 'React'],
            resources: [
              {
                id: 'resource-1',
                title: 'React Complete Course',
                description: 'Comprehensive React course covering hooks, context, and best practices',
                type: 'course' as const,
                provider: 'Udemy',
                url: 'https://udemy.com/react-course',
                duration: '40 hours',
                cost: 89.99,
                rating: 4.8,
                difficulty: 'intermediate' as const,
                skills: ['React', 'JavaScript', 'JSX']
              },
              {
                id: 'resource-2',
                title: 'JavaScript ES6+ Masterclass',
                description: 'Modern JavaScript features and best practices',
                type: 'course' as const,
                provider: 'Coursera',
                duration: '25 hours',
                cost: 49.99,
                rating: 4.7,
                difficulty: 'intermediate' as const,
                skills: ['JavaScript', 'ES6+', 'Async Programming']
              },
              {
                id: 'resource-3',
                title: 'CSS Grid and Flexbox',
                description: 'Master modern CSS layout techniques',
                type: 'course' as const,
                provider: 'FreeCodeCamp',
                duration: '15 hours',
                cost: 0,
                rating: 4.6,
                difficulty: 'beginner' as const,
                skills: ['CSS', 'Layout', 'Responsive Design']
              }
            ]
          }
        ]
      },
      
      // Progress data
      progressData: {
        overallProgress: 35,
        skillProgress: {
          'javascript': {
            skillId: 'javascript',
            skillName: 'JavaScript',
            currentLevel: 'intermediate' as const,
            progress: 75,
            activitiesCompleted: 8,
            totalActivities: 12,
            lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          'react': {
            skillId: 'react',
            skillName: 'React',
            currentLevel: 'intermediate' as const,
            progress: 60,
            activitiesCompleted: 6,
            totalActivities: 10,
            lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          'nodejs': {
            skillId: 'nodejs',
            skillName: 'Node.js',
            currentLevel: 'beginner' as const,
            progress: 25,
            activitiesCompleted: 2,
            totalActivities: 8,
            lastPracticed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        },
        milestoneProgress: {
          'react-basics': true,
          'javascript-fundamentals': true,
          'first-project': false,
          'backend-basics': false
        },
        learningActivities: [
          {
            id: 'activity-1',
            resourceId: 'resource-1',
            title: 'React Hooks Tutorial',
            type: 'course' as const,
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            timeSpent: 120,
            skillsGained: ['React Hooks', 'State Management'],
            rating: 5
          },
          {
            id: 'activity-2',
            resourceId: 'resource-2',
            title: 'JavaScript Promises and Async/Await',
            type: 'course' as const,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            timeSpent: 90,
            skillsGained: ['Async Programming', 'Promises'],
            rating: 4
          }
        ],
        lastUpdated: now
      },
      
      // Achievements
      achievements: [
        {
          id: 'achievement-1',
          title: 'First Steps',
          description: 'Completed your first learning activity',
          badgeIcon: '🎯',
          category: 'learning' as const,
          earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          experiencePoints: 100,
          rarity: 'common' as const
        },
        {
          id: 'achievement-2',
          title: 'React Rookie',
          description: 'Completed 5 React-related activities',
          badgeIcon: '⚛️',
          category: 'learning' as const,
          earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          experiencePoints: 250,
          rarity: 'uncommon' as const
        },
        {
          id: 'achievement-3',
          title: 'Consistent Learner',
          description: 'Learned for 7 days in a row',
          badgeIcon: '🔥',
          category: 'consistency' as const,
          earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          experiencePoints: 500,
          rarity: 'rare' as const
        }
      ],
      
      // Current milestones
      currentMilestones: [
        {
          id: 'milestone-1',
          title: 'Complete React Fundamentals',
          description: 'Finish the React basics course and build a small project',
          category: 'learning' as const,
          isCompleted: false,
          requirements: ['Complete React course', 'Build todo app', 'Deploy to Netlify'],
          reward: {
            id: 'reward-1',
            title: 'React Master',
            description: 'Mastered React fundamentals',
            badgeIcon: '⚛️',
            category: 'learning' as const,
            earnedAt: now,
            experiencePoints: 1000,
            rarity: 'epic' as const
          },
          order: 1,
          estimatedTimeToComplete: '2-3 weeks'
        }
      ],
      
      // Gamification
      level: 3,
      experiencePoints: 1250,
      badges: [
        {
          id: 'badge-1',
          name: 'Early Adopter',
          description: 'One of the first users of the platform',
          icon: '🌟',
          category: 'special',
          earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'badge-2',
          name: 'JavaScript Enthusiast',
          description: 'Completed multiple JavaScript courses',
          icon: '💛',
          category: 'skill',
          earnedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          level: 2
        }
      ],
      streaks: {
        currentStreak: 5,
        longestStreak: 12,
        lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        streakType: 'daily' as const,
        streakGoal: 30
      },
      
      // Metadata
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: now
    };
  }

  /**
   * Update enhanced profile in MongoDB
   */
  static async updateEnhancedProfile(updates: Partial<EnhancedUserProfile>): Promise<EnhancedUserProfile> {
    try {
      console.log('Updating enhanced profile in database:', updates);
      const response = await axios.patch('/user/enhanced-profile', updates);
      console.log('Enhanced profile updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update enhanced profile:', error);
      throw error;
    }
  }

  /**
   * Delete enhanced profile from MongoDB
   */
  static async deleteEnhancedProfile(): Promise<void> {
    try {
      console.log('Deleting enhanced profile from database...');
      await axios.delete('/user/enhanced-profile');
      console.log('Enhanced profile deleted successfully');
    } catch (error) {
      console.error('Failed to delete enhanced profile:', error);
      throw error;
    }
  }
}