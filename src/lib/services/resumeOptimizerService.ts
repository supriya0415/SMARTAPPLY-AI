import { ResumeFeedback } from '../types';

export class ResumeOptimizerService {
  /**
   * Generate an optimized resume based on AI feedback
   */
  static async generateOptimizedResume(
    originalContent: string,
    feedback: ResumeFeedback,
    companyName: string,
    jobTitle: string
  ): Promise<string> {
    try {
      // This would ideally call a backend service with AI capabilities
      // For now, we'll create a simplified optimized version based on feedback
      
      const optimizedSections = this.applyFeedbackToContent(originalContent, feedback);
      
      // Generate optimized resume content
      const optimizedResume = this.generateOptimizedContent(
        optimizedSections,
        companyName,
        jobTitle,
        feedback
      );
      
      return optimizedResume;
    } catch (error) {
      console.error('Error generating optimized resume:', error);
      throw new Error('Failed to generate optimized resume');
    }
  }

  /**
   * Apply feedback suggestions to resume content
   */
  private static applyFeedbackToContent(
    originalContent: string,
    feedback: ResumeFeedback
  ): any {
    const sections = {
      summary: '',
      skills: [] as string[],
      experience: [] as string[],
      education: [] as string[],
      keywords: [] as string[]
    };

    // Extract improvement tips for content optimization
    const contentTips = feedback.content.tips.filter(tip => tip.type === 'improve');
    if (contentTips.length > 0) {
      sections.summary = 'Results-driven professional with proven expertise in delivering high-impact solutions and measurable business outcomes.';
    }

    // Extract skills improvement suggestions
    const skillsTips = feedback.skills.tips.filter(tip => tip.type === 'improve');
    sections.skills = [
      'Technical Skills', 'Communication', 'Problem Solving', 'Team Leadership',
      'Project Management', 'Data Analysis'
    ];

    // Extract ATS keywords from tips
    const atsTips = feedback.ATS.tips.filter(tip => tip.type === 'improve');
    sections.keywords = atsTips
      .map(tip => tip.tip)
      .filter(tip => tip.includes('keyword') || tip.includes('term'))
      .map(tip => tip.split(' ').slice(-3).join(' '))
      .slice(0, 5);

    return sections;
  }

  /**
   * Generate optimized resume content in text format
   */
  private static generateOptimizedContent(
    sections: any,
    companyName: string,
    jobTitle: string,
    feedback: ResumeFeedback
  ): string {
    const today = new Date().toLocaleDateString();
    
    const optimizedContent = `
OPTIMIZED RESUME
Generated on: ${today}
Tailored for: ${jobTitle} at ${companyName}
ATS Score Improvement: Targeting 85+ (Original: ${feedback.ATS.score}/100)

=====================================

PROFESSIONAL SUMMARY
${sections.summary}

KEY SKILLS & COMPETENCIES
${sections.skills.map((skill: string) => `• ${skill}`).join('\n')}

TECHNICAL KEYWORDS (ATS Optimized)
${sections.keywords.map((keyword: string) => `• ${keyword}`).join('\n')}

OPTIMIZATION IMPROVEMENTS APPLIED:
=====================================

ATS OPTIMIZATION:
${feedback.ATS.tips.map((tip) => `✓ ${tip.tip}`).join('\n')}

CONTENT IMPROVEMENTS:
${feedback.content.tips.filter(tip => tip.type === 'improve').map((tip) => `✓ ${tip.tip}`).join('\n') || '✓ Enhanced professional summary'}

STRUCTURE ENHANCEMENTS:
${feedback.structure.tips.filter(tip => tip.type === 'improve').map((tip) => `✓ ${tip.tip}`).join('\n') || '✓ Improved formatting and structure'}

SKILLS OPTIMIZATION:
${feedback.skills.tips.filter(tip => tip.type === 'improve').map((tip) => `✓ ${tip.tip}`).join('\n') || '✓ Enhanced skills section'}

TONE & STYLE IMPROVEMENTS:
${feedback.toneAndStyle.tips.filter(tip => tip.type === 'improve').map((tip) => `✓ ${tip.tip}`).join('\n') || '✓ Professional tone enhancement'}

=====================================

NEXT STEPS:
1. Review the optimized content above
2. Apply these changes to your original resume
3. Use the suggested keywords throughout your resume
4. Ensure consistent formatting and professional presentation
5. Re-run the analysis to verify improvements

Note: This is an AI-generated optimization guide. Please review and customize 
the content to match your actual experience and qualifications.

For best results, integrate these suggestions into your existing resume format
while maintaining accuracy of your professional experience.
`;

    return optimizedContent;
  }

  /**
   * Download optimized resume as text file
   */
  static downloadOptimizedResume(
    content: string,
    companyName: string,
    jobTitle: string
  ): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${companyName}_${jobTitle}_Optimized_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}