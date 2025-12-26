import { CareerAssessmentData, AssessmentResponse } from '../types';

export class AssessmentService {
  private static readonly STORAGE_KEY = 'career_assessment_data';
  private static readonly RESPONSES_KEY = 'assessment_responses';

  /**
   * Save assessment data to local storage
   */
  static saveAssessmentData(assessmentData: CareerAssessmentData): void {
    try {
      const dataToStore = {
        ...assessmentData,
        completedAt: assessmentData.completedAt.toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving assessment data:', error);
      throw new Error('Failed to save assessment data');
    }
  }

  /**
   * Retrieve assessment data from local storage
   */
  static getAssessmentData(): CareerAssessmentData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        completedAt: new Date(parsed.completedAt)
      };
    } catch (error) {
      console.error('Error retrieving assessment data:', error);
      return null;
    }
  }

  /**
   * Save individual assessment responses
   */
  static saveAssessmentResponses(responses: AssessmentResponse[]): void {
    try {
      const dataToStore = responses.map(response => ({
        ...response,
        timestamp: response.timestamp.toISOString()
      }));
      localStorage.setItem(this.RESPONSES_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving assessment responses:', error);
      throw new Error('Failed to save assessment responses');
    }
  }

  /**
   * Retrieve assessment responses from local storage
   */
  static getAssessmentResponses(): AssessmentResponse[] {
    try {
      const stored = localStorage.getItem(this.RESPONSES_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((response: any) => ({
        ...response,
        timestamp: new Date(response.timestamp)
      }));
    } catch (error) {
      console.error('Error retrieving assessment responses:', error);
      return [];
    }
  }

  /**
   * Check if user has completed assessment
   */
  static hasCompletedAssessment(): boolean {
    const assessmentData = this.getAssessmentData();
    return assessmentData !== null && assessmentData.completedAt !== undefined;
  }

  /**
   * Clear all assessment data
   */
  static clearAssessmentData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.RESPONSES_KEY);
    } catch (error) {
      console.error('Error clearing assessment data:', error);
    }
  }

  /**
   * Validate assessment data completeness
   */
  static validateAssessmentData(assessmentData: CareerAssessmentData): boolean {
    const requiredFields = ['interests', 'values', 'workStyle', 'personalityTraits', 'careerGoals'];
    
    return requiredFields.every(field => {
      const value = assessmentData[field as keyof CareerAssessmentData];
      return Array.isArray(value) && value.length > 0;
    }) && assessmentData.timeframe !== '';
  }

  /**
   * Get assessment completion percentage
   */
  static getAssessmentProgress(assessmentData: Partial<CareerAssessmentData>): number {
    const totalFields = 6; // interests, values, workStyle, personality, goals, timeframe
    let completedFields = 0;

    if (assessmentData.interests && assessmentData.interests.length > 0) completedFields++;
    if (assessmentData.values && assessmentData.values.length > 0) completedFields++;
    if (assessmentData.workStyle && assessmentData.workStyle.length > 0) completedFields++;
    if (assessmentData.personalityTraits && assessmentData.personalityTraits.length > 0) completedFields++;
    if (assessmentData.careerGoals && assessmentData.careerGoals.length > 0) completedFields++;
    if (assessmentData.timeframe && assessmentData.timeframe !== '') completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  /**
   * Generate assessment summary for display
   */
  static generateAssessmentSummary(assessmentData: CareerAssessmentData): string {
    const interests = assessmentData.interests.slice(0, 3).join(', ');
    const values = assessmentData.values.slice(0, 2).join(', ');
    const goals = assessmentData.careerGoals.slice(0, 2).join(', ');

    return `Based on your assessment, you're interested in ${interests}, value ${values}, and aim to ${goals}. Your preferred timeframe is ${assessmentData.timeframe}.`;
  }

  /**
   * Export assessment data for backup or sharing
   */
  static exportAssessmentData(): string {
    const assessmentData = this.getAssessmentData();
    const responses = this.getAssessmentResponses();

    const exportData = {
      assessmentData,
      responses,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import assessment data from backup
   */
  static importAssessmentData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.assessmentData) {
        this.saveAssessmentData({
          ...importData.assessmentData,
          completedAt: new Date(importData.assessmentData.completedAt)
        });
      }

      if (importData.responses) {
        const responses = importData.responses.map((response: any) => ({
          ...response,
          timestamp: new Date(response.timestamp)
        }));
        this.saveAssessmentResponses(responses);
      }

      return true;
    } catch (error) {
      console.error('Error importing assessment data:', error);
      return false;
    }
  }

  /**
   * Update assessment data partially
   */
  static updateAssessmentData(updates: Partial<CareerAssessmentData>): void {
    const existing = this.getAssessmentData();
    if (!existing) {
      throw new Error('No existing assessment data to update');
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.saveAssessmentData(updated);
  }

  /**
   * Get assessment insights for analytics
   */
  static getAssessmentInsights(assessmentData: CareerAssessmentData): Record<string, any> {
    return {
      topInterests: assessmentData.interests.slice(0, 3),
      primaryValues: assessmentData.values.slice(0, 2),
      workStylePreferences: assessmentData.workStyle,
      personalityType: assessmentData.personalityTraits[0] || 'Not specified',
      careerDirection: assessmentData.careerGoals[0] || 'Not specified',
      urgency: assessmentData.timeframe,
      completionDate: assessmentData.completedAt,
      assessmentVersion: assessmentData.version
    };
  }
}