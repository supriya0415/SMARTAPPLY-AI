import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  UserProfile, 
  EnhancedUserProfile, 
  Skill, 
  SkillProgress, 
  CareerRecommendation,
  ExtractedResumeInfo 
} from '../types';
import { config } from '../config';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface SkillGapAnalysis {
  targetCareer: string;
  currentSkills: SkillAssessment[];
  requiredSkills: SkillRequirement[];
  skillGaps: SkillGap[];
  overallReadiness: number; // 0-100
  strengthAreas: string[];
  improvementAreas: string[];
  analysisDate: Date;
}

export interface SkillAssessment {
  skillId: string;
  skillName: string;
  category: string;
  currentProficiency: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiencyScore: number; // 0-100
  evidenceSources: string[]; // resume, assessment, etc.
  lastUpdated: Date;
}

export interface SkillRequirement {
  skillId: string;
  skillName: string;
  category: string;
  requiredProficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'critical' | 'important' | 'nice-to-have';
  marketDemand: 'high' | 'medium' | 'low';
  description: string;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  requiredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  gapSize: 'none' | 'small' | 'medium' | 'large';
  priority: 'critical' | 'important' | 'nice-to-have';
  estimatedLearningTime: string;
  recommendedActions: string[];
}

export class SkillAnalysisService {
  /**
   * Extract skills from resume data using AI
   */
  static async extractSkillsFromResume(resumeInfo: ExtractedResumeInfo): Promise<SkillAssessment[]> {
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback skill extraction');
      return this.getFallbackSkillExtraction(resumeInfo);
    }

    try {
      const prompt = `
        You are a skill analysis AI. Extract and assess skills from the following resume information.
        
        Resume Information:
        - Skills Listed: ${resumeInfo.skills.join(', ')}
        - Work Experience: ${JSON.stringify(resumeInfo.experience, null, 2)}
        - Education: ${JSON.stringify(resumeInfo.education, null, 2)}
        - Certifications: ${resumeInfo.certifications?.join(', ') || 'None'}
        - Languages: ${resumeInfo.languages?.join(', ') || 'None'}
        - Summary: ${resumeInfo.summary || 'None'}
        
        Please analyze and return a comprehensive skill assessment in the following JSON format:
        {
          "skills": [
            {
              "skillId": "unique_skill_id",
              "skillName": "Skill Name",
              "category": "technical|soft|language|certification|domain",
              "currentProficiency": "none|beginner|intermediate|advanced|expert",
              "proficiencyScore": 75,
              "evidenceSources": ["resume_skills", "work_experience", "education", "certifications"],
              "lastUpdated": "${new Date().toISOString()}"
            }
          ]
        }
        
        Guidelines:
        - Extract both explicitly mentioned skills and implied skills from job descriptions
        - Categorize skills appropriately (technical, soft, language, certification, domain)
        - Assess proficiency based on years of experience, job responsibilities, and context
        - Include programming languages, frameworks, tools, methodologies, and soft skills
        - Use evidence sources to indicate where the skill was found
        - Proficiency scoring: 0-25 (beginner), 26-50 (intermediate), 51-75 (advanced), 76-100 (expert)
        - Generate unique skill IDs using lowercase with underscores (e.g., "javascript", "project_management")
        - Be comprehensive but avoid duplicates
        
        Return only valid JSON, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const skillData = JSON.parse(jsonMatch[0]);
      return skillData.skills as SkillAssessment[];
    } catch (error) {
      console.error('Error extracting skills from resume:', error);
      return this.getFallbackSkillExtraction(resumeInfo);
    }
  }

  /**
   * Get required skills for a target career using AI
   */
  static async getCareerSkillRequirements(careerTitle: string): Promise<SkillRequirement[]> {
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback skill requirements');
      return this.getFallbackSkillRequirements(careerTitle);
    }

    try {
      const prompt = `
        You are a career analysis AI. Provide comprehensive skill requirements for the career: "${careerTitle}"
        
        Please return the skill requirements in the following JSON format:
        {
          "requirements": [
            {
              "skillId": "unique_skill_id",
              "skillName": "Skill Name",
              "category": "technical|soft|language|certification|domain",
              "requiredProficiency": "beginner|intermediate|advanced|expert",
              "priority": "critical|important|nice-to-have",
              "marketDemand": "high|medium|low",
              "description": "Detailed description of why this skill is needed and how it's used"
            }
          ]
        }
        
        Guidelines:
        - Include 15-25 skills covering all aspects of the career
        - Cover technical skills, soft skills, tools, methodologies, and domain knowledge
        - Prioritize skills based on importance for career success
        - Consider current market trends and demands
        - Include both foundational and advanced skills
        - Use realistic proficiency requirements
        - Generate unique skill IDs using lowercase with underscores
        - Focus on skills that are actually required in the job market
        
        Return only valid JSON, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const requirementData = JSON.parse(jsonMatch[0]);
      return requirementData.requirements as SkillRequirement[];
    } catch (error) {
      console.error('Error getting career skill requirements:', error);
      return this.getFallbackSkillRequirements(careerTitle);
    }
  }

  /**
   * Perform comprehensive skill gap analysis
   */
  static async analyzeSkillGaps(
    userProfile: UserProfile | EnhancedUserProfile,
    targetCareer: string
  ): Promise<SkillGapAnalysis> {
    try {
      // Extract current skills from resume if available
      let currentSkills: SkillAssessment[] = [];
      if (userProfile.resume) {
        currentSkills = await this.extractSkillsFromResume(userProfile.resume.extractedInfo);
      }

      // Add skills from user profile
      const profileSkills = userProfile.skills.map(skill => ({
        skillId: skill.toLowerCase().replace(/\s+/g, '_'),
        skillName: skill,
        category: 'technical' as const,
        currentProficiency: 'intermediate' as const,
        proficiencyScore: 60,
        evidenceSources: ['user_profile'],
        lastUpdated: new Date()
      }));

      // Merge and deduplicate skills
      currentSkills = this.mergeSkillAssessments([...currentSkills, ...profileSkills]);

      // Get required skills for target career
      const requiredSkills = await this.getCareerSkillRequirements(targetCareer);

      // Calculate skill gaps
      const skillGaps = this.calculateSkillGaps(currentSkills, requiredSkills);

      // Calculate overall readiness
      const overallReadiness = this.calculateOverallReadiness(currentSkills, requiredSkills);

      // Identify strength and improvement areas
      const { strengthAreas, improvementAreas } = this.identifyStrengthsAndImprovements(skillGaps);

      return {
        targetCareer,
        currentSkills,
        requiredSkills,
        skillGaps,
        overallReadiness,
        strengthAreas,
        improvementAreas,
        analysisDate: new Date()
      };
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      throw new Error('Failed to analyze skill gaps. Please try again.');
    }
  }

  /**
   * Update skill proficiency based on completed activities
   */
  static updateSkillProficiency(
    currentSkills: SkillAssessment[],
    completedActivity: { skills: string[]; type: string; duration: number }
  ): SkillAssessment[] {
    return currentSkills.map(skill => {
      if (completedActivity.skills.includes(skill.skillName)) {
        // Calculate proficiency increase based on activity type and duration
        let proficiencyIncrease = 0;
        
        switch (completedActivity.type) {
          case 'course':
            proficiencyIncrease = Math.min(10, completedActivity.duration / 60); // Max 10 points
            break;
          case 'certification':
            proficiencyIncrease = 15;
            break;
          case 'project':
            proficiencyIncrease = Math.min(12, completedActivity.duration / 120); // Max 12 points
            break;
          case 'practice':
            proficiencyIncrease = Math.min(5, completedActivity.duration / 30); // Max 5 points
            break;
          default:
            proficiencyIncrease = 3;
        }

        const newScore = Math.min(100, skill.proficiencyScore + proficiencyIncrease);
        const newProficiency = this.scoreToProficiency(newScore);

        return {
          ...skill,
          proficiencyScore: newScore,
          currentProficiency: newProficiency,
          lastUpdated: new Date()
        };
      }
      return skill;
    });
  }

  /**
   * Get skill progress tracking data
   */
  static getSkillProgressTracking(skillAssessments: SkillAssessment[]): Record<string, SkillProgress> {
    const progressData: Record<string, SkillProgress> = {};

    skillAssessments.forEach(skill => {
      progressData[skill.skillId] = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        currentLevel: skill.currentProficiency === 'none' ? 'beginner' : skill.currentProficiency,
        progress: skill.proficiencyScore,
        activitiesCompleted: 0, // This would be tracked separately
        totalActivities: 0, // This would be calculated based on learning path
        lastPracticed: skill.lastUpdated
      };
    });

    return progressData;
  }

  // Private helper methods

  private static mergeSkillAssessments(skills: SkillAssessment[]): SkillAssessment[] {
    const skillMap = new Map<string, SkillAssessment>();

    skills.forEach(skill => {
      const existing = skillMap.get(skill.skillId);
      if (existing) {
        // Merge skills, taking the higher proficiency score
        skillMap.set(skill.skillId, {
          ...existing,
          proficiencyScore: Math.max(existing.proficiencyScore, skill.proficiencyScore),
          currentProficiency: this.scoreToProficiency(
            Math.max(existing.proficiencyScore, skill.proficiencyScore)
          ),
          evidenceSources: [...new Set([...existing.evidenceSources, ...skill.evidenceSources])],
          lastUpdated: new Date()
        });
      } else {
        skillMap.set(skill.skillId, skill);
      }
    });

    return Array.from(skillMap.values());
  }

  private static calculateSkillGaps(
    currentSkills: SkillAssessment[],
    requiredSkills: SkillRequirement[]
  ): SkillGap[] {
    return requiredSkills.map(required => {
      const current = currentSkills.find(skill => 
        skill.skillId === required.skillId || 
        skill.skillName.toLowerCase() === required.skillName.toLowerCase()
      );

      const currentLevel = current?.currentProficiency || 'none';
      const gapSize = this.calculateGapSize(currentLevel, required.requiredProficiency);
      const estimatedLearningTime = this.estimateLearningTime(gapSize, required.requiredProficiency);

      return {
        skillId: required.skillId,
        skillName: required.skillName,
        category: required.category,
        currentLevel,
        requiredLevel: required.requiredProficiency,
        gapSize,
        priority: required.priority,
        estimatedLearningTime,
        recommendedActions: this.getRecommendedActions(gapSize, required.category)
      };
    });
  }

  private static calculateGapSize(
    current: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert',
    required: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): 'none' | 'small' | 'medium' | 'large' {
    const levels = { none: 0, beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const gap = levels[required] - levels[current];

    if (gap <= 0) return 'none';
    if (gap === 1) return 'small';
    if (gap === 2) return 'medium';
    return 'large';
  }

  private static estimateLearningTime(
    gapSize: 'none' | 'small' | 'medium' | 'large',
    targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): string {
    const timeMap = {
      none: '0 weeks',
      small: targetLevel === 'expert' ? '8-12 weeks' : '4-6 weeks',
      medium: targetLevel === 'expert' ? '16-24 weeks' : '8-16 weeks',
      large: targetLevel === 'expert' ? '24-52 weeks' : '16-32 weeks'
    };

    return timeMap[gapSize];
  }

  private static getRecommendedActions(
    gapSize: 'none' | 'small' | 'medium' | 'large',
    category: string
  ): string[] {
    const baseActions = {
      none: ['Continue practicing to maintain proficiency'],
      small: ['Take a focused course', 'Practice with small projects'],
      medium: ['Complete comprehensive course', 'Build portfolio projects', 'Seek mentorship'],
      large: ['Start with fundamentals course', 'Dedicate significant study time', 'Consider bootcamp or formal education']
    };

    const categorySpecific = {
      technical: ['Build hands-on projects', 'Contribute to open source', 'Get certified'],
      soft: ['Practice in real situations', 'Seek feedback', 'Join professional groups'],
      language: ['Take language courses', 'Practice with native speakers', 'Use language learning apps'],
      certification: ['Study for certification exam', 'Take practice tests', 'Join study groups'],
      domain: ['Read industry publications', 'Attend conferences', 'Network with professionals']
    };

    return [
      ...baseActions[gapSize],
      ...(categorySpecific[category as keyof typeof categorySpecific] || [])
    ];
  }

  private static calculateOverallReadiness(
    currentSkills: SkillAssessment[],
    requiredSkills: SkillRequirement[]
  ): number {
    let totalWeight = 0;
    let weightedScore = 0;

    requiredSkills.forEach(required => {
      const weight = required.priority === 'critical' ? 3 : required.priority === 'important' ? 2 : 1;
      const current = currentSkills.find(skill => 
        skill.skillId === required.skillId || 
        skill.skillName.toLowerCase() === required.skillName.toLowerCase()
      );

      const currentScore = current?.proficiencyScore || 0;
      const requiredScore = this.proficiencyToScore(required.requiredProficiency);
      const skillReadiness = Math.min(100, (currentScore / requiredScore) * 100);

      totalWeight += weight;
      weightedScore += skillReadiness * weight;
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  private static identifyStrengthsAndImprovements(skillGaps: SkillGap[]): {
    strengthAreas: string[];
    improvementAreas: string[];
  } {
    const strengthAreas: string[] = [];
    const improvementAreas: string[] = [];

    skillGaps.forEach(gap => {
      if (gap.gapSize === 'none' || gap.gapSize === 'small') {
        strengthAreas.push(gap.skillName);
      } else if (gap.priority === 'critical' || gap.priority === 'important') {
        improvementAreas.push(gap.skillName);
      }
    });

    return {
      strengthAreas: strengthAreas.slice(0, 5), // Top 5 strengths
      improvementAreas: improvementAreas.slice(0, 5) // Top 5 areas for improvement
    };
  }

  private static scoreToProficiency(score: number): 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (score === 0) return 'none';
    if (score <= 25) return 'beginner';
    if (score <= 50) return 'intermediate';
    if (score <= 75) return 'advanced';
    return 'expert';
  }

  private static proficiencyToScore(proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'): number {
    const scoreMap = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    return scoreMap[proficiency];
  }

  // Fallback methods for when API is not available

  private static getFallbackSkillExtraction(resumeInfo: ExtractedResumeInfo): SkillAssessment[] {
    const skills: SkillAssessment[] = [];

    // Add explicitly listed skills
    resumeInfo.skills.forEach(skill => {
      skills.push({
        skillId: skill.toLowerCase().replace(/\s+/g, '_'),
        skillName: skill,
        category: 'technical',
        currentProficiency: 'intermediate',
        proficiencyScore: 60,
        evidenceSources: ['resume_skills'],
        lastUpdated: new Date()
      });
    });

    // Add languages
    resumeInfo.languages?.forEach(language => {
      skills.push({
        skillId: language.toLowerCase().replace(/\s+/g, '_'),
        skillName: language,
        category: 'language',
        currentProficiency: 'intermediate',
        proficiencyScore: 60,
        evidenceSources: ['resume_languages'],
        lastUpdated: new Date()
      });
    });

    return skills;
  }

  private static getFallbackSkillRequirements(careerTitle: string): SkillRequirement[] {
    // Basic fallback requirements for common careers
    const commonRequirements: SkillRequirement[] = [
      {
        skillId: 'communication',
        skillName: 'Communication',
        category: 'soft',
        requiredProficiency: 'advanced',
        priority: 'critical',
        marketDemand: 'high',
        description: 'Ability to communicate effectively with team members and stakeholders'
      },
      {
        skillId: 'problem_solving',
        skillName: 'Problem Solving',
        category: 'soft',
        requiredProficiency: 'advanced',
        priority: 'critical',
        marketDemand: 'high',
        description: 'Analytical thinking and problem-solving capabilities'
      },
      {
        skillId: 'teamwork',
        skillName: 'Teamwork',
        category: 'soft',
        requiredProficiency: 'intermediate',
        priority: 'important',
        marketDemand: 'high',
        description: 'Ability to work effectively in team environments'
      }
    ];

    return commonRequirements;
  }
}