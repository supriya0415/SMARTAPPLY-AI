import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { NBCard } from '../NBCard';
import { GeminiService } from '../../lib/services/geminiService';

interface PersonalizedGreetingProps {
  userName: string;
  careerInterest: string;
  yearsOfExperience: number;
  completedResources?: number;
  overallProgress?: number;
}

export const PersonalizedGreeting: React.FC<PersonalizedGreetingProps> = ({
  userName,
  careerInterest,
  yearsOfExperience,
  completedResources = 0,
  overallProgress = 0
}) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePersonalizedInsight();
  }, [careerInterest, yearsOfExperience]);

  const generatePersonalizedInsight = async () => {
    setLoading(true);
    try {
      // Try to generate insight using Gemini AI
      const prompt = `Generate a single, motivating, and actionable one-liner insight (max 25 words) for a professional named ${userName} who is interested in ${careerInterest} with ${yearsOfExperience} years of experience. Focus on their next actionable step. Be specific, encouraging, and professional. Return ONLY the insight text, no quotes or extra formatting.`;
      
      const geminiInsight = await GeminiService.generateContent(prompt);
      const cleanInsight = geminiInsight.replace(/['"]/g, '').trim();
      setInsight(cleanInsight);
    } catch (error) {
      // Fallback to template-based insights
      const fallbackInsight = getFallbackInsight(careerInterest, yearsOfExperience);
      setInsight(fallbackInsight);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackInsight = (career: string, years: number): string => {
    const insights: Record<string, string[]> = {
      'entry': [
        `Start strong in ${career} by mastering core fundamentals and building your first real-world project.`,
        `Your ${career} journey begins with hands-on practice - dive into a practical project this week.`,
        `Focus on building a solid foundation in ${career} essentials - consistency beats intensity.`,
      ],
      'junior': [
        `Level up your ${career} skills by contributing to open-source or taking on stretch assignments.`,
        `Time to deepen your ${career} expertise - specialize in one area that excites you most.`,
        `Expand your ${career} network by connecting with senior professionals and seeking mentorship.`,
      ],
      'mid': [
        `As a mid-level ${career} professional, focus on leadership skills and mentoring junior team members.`,
        `Expand your ${career} impact by leading complex projects and sharing your expertise through content.`,
        `Time to specialize further in ${career} - consider advanced certifications or thought leadership.`,
      ],
      'senior': [
        `As a senior ${career} expert, your next step is strategic influence - mentor, architect, and innovate.`,
        `Leverage your ${career} expertise to drive organizational change and build high-performing teams.`,
        `Focus on thought leadership in ${career} - speak at conferences, publish insights, and shape the field.`,
      ]
    };

    const level = years === 0 ? 'entry' : years < 2 ? 'junior' : years < 5 ? 'mid' : 'senior';
    const levelInsights = insights[level] || insights['entry'];
    return levelInsights[Math.floor(Math.random() * levelInsights.length)];
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalIcon = () => {
    const icons = [Sparkles, TrendingUp, Target, Zap];
    const Icon = icons[Math.floor(Math.random() * icons.length)];
    return <Icon className="w-6 h-6" />;
  };

  return (
    <NBCard className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-3 rounded-full shadow-lg">
          {getMotivationalIcon()}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreetingTime()}, {userName}! 👋
          </h2>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 italic">Generating your personalized insight...</p>
            </div>
          ) : (
            <p className="text-lg text-gray-700 leading-relaxed">
              {insight}
            </p>
          )}
          
          {/* Quick Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <span className="font-semibold text-purple-600">{careerInterest}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} exp.</span>
            </div>
            {completedResources > 0 && (
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-green-600 font-semibold">{completedResources}</span>
                <span className="text-gray-600">resources completed</span>
              </div>
            )}
            {overallProgress > 0 && (
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-blue-600 font-semibold">{overallProgress}%</span>
                <span className="text-gray-600">progress</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </NBCard>
  );
};

