import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  LearningPath, 
  LearningPhase, 
  LearningResource, 
  SkillGapAnalysis,
  SkillGap 
} from '../types';
import { config } from '../config';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface RoadmapGenerationOptions {
  timeframe: 'aggressive' | 'moderate' | 'relaxed'; // 3-6 months | 6-12 months | 12+ months
  budget: 'free' | 'low' | 'medium' | 'high'; // $0 | $0-500 | $500-2000 | $2000+
  learningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
  timeCommitment: number; // hours per week
  focusAreas: string[]; // specific skills to prioritize
}

export interface GeneratedRoadmap {
  id: string;
  title: string;
  description: string;
  targetCareer: string;
  skillGapsAddressed: string[];
  learningPath: LearningPath;
  estimatedCompletion: string;
  totalCost: number;
  weeklyTimeCommitment: number;
  milestones: RoadmapMilestone[];
  generatedAt: Date;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  targetWeek: number;
  skillsToAchieve: string[];
  completionCriteria: string[];
  reward?: string;
}

export class LearningRoadmapService {
  /**
   * Generate a comprehensive learning roadmap based on skill gap analysis
   */
  static async generateLearningRoadmap(
    skillGapAnalysis: SkillGapAnalysis,
    options: RoadmapGenerationOptions
  ): Promise<GeneratedRoadmap> {
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback roadmap generation');
      return this.getFallbackRoadmap(skillGapAnalysis, options);
    }

    try {
      const prompt = this.buildRoadmapPrompt(skillGapAnalysis, options);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const roadmapData = JSON.parse(jsonMatch[0]);
      
      return {
        id: `roadmap_${Date.now()}`,
        title: roadmapData.title,
        description: roadmapData.description,
        targetCareer: skillGapAnalysis.targetCareer,
        skillGapsAddressed: skillGapAnalysis.skillGaps
          .filter(gap => gap.gapSize !== 'none')
          .map(gap => gap.skillName),
        learningPath: roadmapData.learningPath,
        estimatedCompletion: roadmapData.estimatedCompletion,
        totalCost: roadmapData.totalCost,
        weeklyTimeCommitment: options.timeCommitment,
        milestones: roadmapData.milestones,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating learning roadmap:', error);
      return this.getFallbackRoadmap(skillGapAnalysis, options);
    }
  }

  /**
   * Generate course and certification recommendations for specific skills
   */
  static async generateSkillRecommendations(
    skillName: string,
    currentLevel: string,
    targetLevel: string,
    budget: 'free' | 'low' | 'medium' | 'high'
  ): Promise<LearningResource[]> {
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback recommendations');
      return this.getFallbackRecommendations(skillName, currentLevel, targetLevel);
    }

    try {
      const prompt = `
        You are a learning resource recommendation AI. Generate specific course and certification recommendations for skill development.
        
        Skill: ${skillName}
        Current Level: ${currentLevel}
        Target Level: ${targetLevel}
        Budget: ${budget}
        
        Please provide recommendations in the following JSON format:
        {
          "resources": [
            {
              "id": "unique_resource_id",
              "title": "Course/Certification Title",
              "description": "Detailed description of what the course covers",
              "type": "course|certification|project|book|video|practice",
              "provider": "Provider Name (Coursera, Udemy, etc.)",
              "url": "https://example.com/course",
              "duration": "4 weeks",
              "cost": 49.99,
              "rating": 4.5,
              "difficulty": "beginner|intermediate|advanced",
              "skills": ["skill1", "skill2", "skill3"]
            }
          ]
        }
        
        Guidelines:
        - Provide 5-8 high-quality resources
        - Include a mix of courses, certifications, projects, and practice resources
        - Consider the budget constraint (free: $0, low: $0-100, medium: $100-500, high: $500+)
        - Ensure resources are appropriate for the skill level progression
        - Include reputable providers and realistic ratings
        - Focus on practical, hands-on learning when possible
        - Include both foundational and advanced resources as appropriate
        
        Return only valid JSON, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const resourceData = JSON.parse(jsonMatch[0]);
      return resourceData.resources as LearningResource[];
    } catch (error) {
      console.error('Error generating skill recommendations:', error);
      return this.getFallbackRecommendations(skillName, currentLevel, targetLevel);
    }
  }

  /**
   * Create a prioritized learning sequence based on skill dependencies
   */
  static createLearningSequence(skillGaps: SkillGap[]): SkillGap[] {
    // Sort by priority and gap size
    const priorityWeight = { critical: 3, important: 2, 'nice-to-have': 1 };
    const gapWeight = { large: 4, medium: 3, small: 2, none: 1 };

    return skillGaps
      .filter(gap => gap.gapSize !== 'none')
      .sort((a, b) => {
        const aScore = priorityWeight[a.priority] * gapWeight[a.gapSize];
        const bScore = priorityWeight[b.priority] * gapWeight[b.gapSize];
        return bScore - aScore; // Descending order
      });
  }

  /**
   * Estimate timeline and duration for learning roadmap
   */
  static estimateRoadmapTimeline(
    learningPath: LearningPath,
    weeklyHours: number
  ): { totalWeeks: number; phaseTimelines: { phaseId: string; startWeek: number; endWeek: number }[] } {
    let currentWeek = 1;
    const phaseTimelines: { phaseId: string; startWeek: number; endWeek: number }[] = [];

    learningPath.phases.forEach(phase => {
      const totalHours = phase.resources.reduce((sum, resource) => {
        const hours = this.parseDurationToHours(resource.duration);
        return sum + hours;
      }, 0);

      const phaseWeeks = Math.ceil(totalHours / weeklyHours);
      const startWeek = currentWeek;
      const endWeek = currentWeek + phaseWeeks - 1;

      phaseTimelines.push({
        phaseId: phase.id,
        startWeek,
        endWeek
      });

      currentWeek = endWeek + 1;
    });

    return {
      totalWeeks: currentWeek - 1,
      phaseTimelines
    };
  }

  /**
   * Generate milestone checkpoints for the learning roadmap
   */
  static generateMilestones(
    learningPath: LearningPath,
    phaseTimelines: { phaseId: string; startWeek: number; endWeek: number }[]
  ): RoadmapMilestone[] {
    const milestones: RoadmapMilestone[] = [];

    learningPath.phases.forEach((phase, index) => {
      const timeline = phaseTimelines.find(t => t.phaseId === phase.id);
      if (!timeline) return;

      milestones.push({
        id: `milestone_${phase.id}`,
        title: `Complete ${phase.title}`,
        description: `Successfully complete all learning activities in ${phase.title}`,
        targetWeek: timeline.endWeek,
        skillsToAchieve: phase.skills,
        completionCriteria: [
          'Complete all courses and resources',
          'Pass any required assessments',
          'Build practical project demonstrating skills'
        ],
        reward: index === learningPath.phases.length - 1 
          ? 'Career Readiness Achievement' 
          : `${phase.title} Mastery Badge`
      });
    });

    return milestones;
  }

  /**
   * Update roadmap progress based on completed activities
   */
  static updateRoadmapProgress(
    roadmap: GeneratedRoadmap,
    completedResourceId: string
  ): GeneratedRoadmap {
    const updatedPhases = roadmap.learningPath.phases.map(phase => ({
      ...phase,
      resources: phase.resources.map(resource => 
        resource.id === completedResourceId 
          ? { ...resource, completed: true } 
          : resource
      )
    }));

    return {
      ...roadmap,
      learningPath: {
        ...roadmap.learningPath,
        phases: updatedPhases
      }
    };
  }

  // Private helper methods

  private static buildRoadmapPrompt(
    skillGapAnalysis: SkillGapAnalysis,
    options: RoadmapGenerationOptions
  ): string {
    const criticalGaps = skillGapAnalysis.skillGaps.filter(gap => 
      gap.priority === 'critical' && gap.gapSize !== 'none'
    );
    const importantGaps = skillGapAnalysis.skillGaps.filter(gap => 
      gap.priority === 'important' && gap.gapSize !== 'none'
    );

    return `
      You are a learning roadmap generation AI. Create a comprehensive, personalized learning roadmap based on the skill gap analysis.
      
      Target Career: ${skillGapAnalysis.targetCareer}
      Current Readiness: ${skillGapAnalysis.overallReadiness}%
      
      Critical Skill Gaps:
      ${criticalGaps.map(gap => `- ${gap.skillName}: ${gap.currentLevel} → ${gap.requiredLevel} (${gap.gapSize} gap)`).join('\n')}
      
      Important Skill Gaps:
      ${importantGaps.map(gap => `- ${gap.skillName}: ${gap.currentLevel} → ${gap.requiredLevel} (${gap.gapSize} gap)`).join('\n')}
      
      Learning Preferences:
      - Timeframe: ${options.timeframe}
      - Budget: ${options.budget}
      - Learning Style: ${options.learningStyle}
      - Weekly Time Commitment: ${options.timeCommitment} hours
      - Focus Areas: ${options.focusAreas.join(', ')}
      
      Please generate a learning roadmap in the following JSON format:
      {
        "title": "Personalized Learning Roadmap Title",
        "description": "Comprehensive description of the learning journey",
        "learningPath": {
          "id": "learning_path_id",
          "title": "Learning Path Title",
          "description": "Learning path description",
          "totalDuration": "6-12 months",
          "phases": [
            {
              "id": "phase_1",
              "title": "Foundation Phase",
              "description": "Build fundamental skills",
              "duration": "4-6 weeks",
              "priority": "critical",
              "resources": [
                {
                  "id": "resource_1",
                  "title": "Course Title",
                  "description": "Course description",
                  "type": "course",
                  "provider": "Provider Name",
                  "url": "https://example.com",
                  "duration": "4 weeks",
                  "cost": 49.99,
                  "rating": 4.5,
                  "difficulty": "beginner",
                  "skills": ["skill1", "skill2"]
                }
              ],
              "skills": ["skill1", "skill2"],
              "order": 1
            }
          ],
          "estimatedCost": 500,
          "difficulty": "intermediate",
          "prerequisites": [],
          "outcomes": ["outcome1", "outcome2"]
        },
        "estimatedCompletion": "8-12 months",
        "totalCost": 750,
        "milestones": [
          {
            "id": "milestone_1",
            "title": "Foundation Complete",
            "description": "Completed all foundation courses",
            "targetWeek": 6,
            "skillsToAchieve": ["skill1", "skill2"],
            "completionCriteria": ["Complete courses", "Pass assessments"],
            "reward": "Foundation Badge"
          }
        ]
      }
      
      Guidelines:
      - Create 3-5 learning phases that build upon each other
      - Prioritize critical skills first, then important skills
      - Include a variety of resource types (courses, projects, certifications)
      - Respect budget constraints (free: $0, low: $0-200, medium: $200-1000, high: $1000+)
      - Consider the timeframe (aggressive: 3-6 months, moderate: 6-12 months, relaxed: 12+ months)
      - Include realistic durations and costs
      - Provide 3-6 resources per phase
      - Create meaningful milestones every 4-8 weeks
      - Focus on practical, hands-on learning
      - Include both learning and practice/project resources
      
      Return only valid JSON, no additional text.
    `;
  }

  private static parseDurationToHours(duration: string): number {
    const match = duration.match(/(\d+)\s*(hour|week|month|day)/i);
    if (!match) return 10; // Default fallback

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'hour': return value;
      case 'day': return value * 8;
      case 'week': return value * 40;
      case 'month': return value * 160;
      default: return 10;
    }
  }

  // Fallback methods

  private static getFallbackRoadmap(
    skillGapAnalysis: SkillGapAnalysis,
    options: RoadmapGenerationOptions
  ): GeneratedRoadmap {
    const criticalSkills = skillGapAnalysis.skillGaps
      .filter(gap => gap.priority === 'critical' && gap.gapSize !== 'none')
      .slice(0, 3);

    const fallbackPhases: LearningPhase[] = criticalSkills.map((skill, index) => ({
      id: `phase_${index + 1}`,
      title: `${skill.skillName} Development`,
      description: `Build proficiency in ${skill.skillName}`,
      duration: skill.estimatedLearningTime,
      priority: skill.priority,
      resources: this.getFallbackRecommendations(skill.skillName, skill.currentLevel, skill.requiredLevel),
      skills: [skill.skillName],
      order: index + 1
    }));

    const totalCost = fallbackPhases.reduce((sum, phase) => 
      sum + phase.resources.reduce((phaseSum, resource) => phaseSum + resource.cost, 0), 0
    );

    return {
      id: `fallback_roadmap_${Date.now()}`,
      title: `${skillGapAnalysis.targetCareer} Learning Roadmap`,
      description: `Personalized learning path to become job-ready for ${skillGapAnalysis.targetCareer}`,
      targetCareer: skillGapAnalysis.targetCareer,
      skillGapsAddressed: criticalSkills.map(skill => skill.skillName),
      learningPath: {
        id: 'fallback_path',
        title: `${skillGapAnalysis.targetCareer} Learning Path`,
        description: 'Comprehensive learning path for career readiness',
        totalDuration: '6-12 months',
        phases: fallbackPhases,
        estimatedCost: totalCost,
        difficulty: 'intermediate',
        prerequisites: [],
        outcomes: criticalSkills.map(skill => `Proficiency in ${skill.skillName}`)
      },
      estimatedCompletion: '6-12 months',
      totalCost,
      weeklyTimeCommitment: options.timeCommitment,
      milestones: this.generateFallbackMilestones(fallbackPhases),
      generatedAt: new Date()
    };
  }

  private static getFallbackRecommendations(
    skillName: string,
    currentLevel: string,
    targetLevel: string
  ): LearningResource[] {
    return [
      {
        id: `${skillName.toLowerCase()}_course_1`,
        title: `${skillName} Fundamentals`,
        description: `Learn the basics of ${skillName}`,
        type: 'course',
        provider: 'Online Learning Platform',
        duration: '4 weeks',
        cost: 49.99,
        difficulty: 'beginner',
        skills: [skillName]
      },
      {
        id: `${skillName.toLowerCase()}_project_1`,
        title: `${skillName} Practice Project`,
        description: `Hands-on project to practice ${skillName}`,
        type: 'project',
        provider: 'Self-guided',
        duration: '2 weeks',
        cost: 0,
        difficulty: 'intermediate',
        skills: [skillName]
      }
    ];
  }

  private static generateFallbackMilestones(phases: LearningPhase[]): RoadmapMilestone[] {
    return phases.map((phase, index) => ({
      id: `milestone_${phase.id}`,
      title: `Complete ${phase.title}`,
      description: `Successfully complete ${phase.title}`,
      targetWeek: (index + 1) * 6,
      skillsToAchieve: phase.skills,
      completionCriteria: ['Complete all resources', 'Build practice project'],
      reward: `${phase.title} Badge`
    }));
  }
}