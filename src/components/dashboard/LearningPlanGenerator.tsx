import React, { useState } from 'react';
import { Calendar, Clock, Target, Sparkles, Download } from 'lucide-react';
import { NBCard } from '../NBCard';
import { NBButton } from '../NBButton';
import { GeminiService } from '../../lib/services/geminiService';
import { toast } from 'sonner';

interface LearningPlanProps {
  careerInterest: string;
  yearsOfExperience: number;
  skills: string[];
}

interface WeeklyPlan {
  week: number;
  title: string;
  goals: string[];
  resources: string[];
  timeEstimate: string;
  milestones: string[];
}

export const LearningPlanGenerator: React.FC<LearningPlanProps> = ({
  careerInterest,
  yearsOfExperience,
  skills
}) => {
  const [learningPlan, setLearningPlan] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number>(4); // weeks

  const generateLearningPlan = async () => {
    setLoading(true);
    toast.loading('Generating your personalized learning plan...', { id: 'learning-plan' });

    try {
      const experienceLevel = yearsOfExperience === 0 ? 'beginner' : 
                            yearsOfExperience < 2 ? 'junior' :
                            yearsOfExperience < 5 ? 'mid-level' : 'senior';

      const prompt = `Create a detailed ${duration}-week learning plan for a ${experienceLevel} professional in ${careerInterest} with these skills: ${skills.slice(0, 5).join(', ')}.

Format as JSON array with structure:
[
  {
    "week": 1,
    "title": "Week title",
    "goals": ["goal 1", "goal 2", "goal 3"],
    "resources": ["resource 1", "resource 2"],
    "timeEstimate": "X hours",
    "milestones": ["milestone 1"]
  }
]

Make it practical, actionable, and progressive. Focus on real-world projects and hands-on learning. Each week should build on the previous. Return ONLY valid JSON.`;

      const geminiResponse = await GeminiService.generateContent(prompt);
      
      // Parse the response
      const jsonMatch = geminiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const plan: WeeklyPlan[] = JSON.parse(jsonMatch[0]);
        setLearningPlan(plan);
        toast.success('Learning plan generated successfully!', { id: 'learning-plan' });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      // Fallback to template-based plan
      const fallbackPlan = generateFallbackPlan(duration, careerInterest, experienceLevel);
      setLearningPlan(fallbackPlan);
      toast.success('Learning plan ready!', { id: 'learning-plan' });
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackPlan = (weeks: number, career: string, level: string): WeeklyPlan[] => {
    const baseGoals = {
      beginner: [
        'Understand core fundamentals',
        'Complete introductory tutorials',
        'Build first practice project'
      ],
      junior: [
        'Deepen technical knowledge',
        'Contribute to real projects',
        'Learn best practices'
      ],
      'mid-level': [
        'Master advanced concepts',
        'Lead small projects',
        'Mentor juniors'
      ],
      senior: [
        'Architect solutions',
        'Drive technical strategy',
        'Build scalable systems'
      ]
    };

    const goals = baseGoals[level as keyof typeof baseGoals] || baseGoals.beginner;

    const plan: WeeklyPlan[] = [];
    for (let i = 1; i <= weeks; i++) {
      plan.push({
        week: i,
        title: `Week ${i}: ${i === 1 ? 'Foundation' : i === weeks ? 'Integration & Practice' : 'Progressive Skills'}`,
        goals: [
          `${goals[0]} relevant to ${career}`,
          `${goals[1]} in ${career}`,
          `${goals[2]} for ${career}`
        ],
        resources: [
          `${career} fundamentals course`,
          `Hands-on ${career} tutorials`,
          `${career} best practices guide`
        ],
        timeEstimate: `${10 + (i * 2)} hours`,
        milestones: [
          i === 1 ? 'Complete foundation learning' :
          i === weeks ? 'Build complete portfolio project' :
          `Complete Week ${i} practical exercises`
        ]
      });
    }
    return plan;
  };

  const exportPlan = () => {
    const content = learningPlan.map(week => 
      `WEEK ${week.week}: ${week.title}\n` +
      `Goals:\n${week.goals.map(g => `- ${g}`).join('\n')}\n` +
      `Resources:\n${week.resources.map(r => `- ${r}`).join('\n')}\n` +
      `Time Estimate: ${week.timeEstimate}\n` +
      `Milestones:\n${week.milestones.map(m => `✓ ${m}`).join('\n')}\n`
    ).join('\n\n');

    const blob = new Blob([`Learning Plan for ${careerInterest}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${careerInterest.replace(/\s+/g, '_')}_Learning_Plan.txt`;
    a.click();
    toast.success('Learning plan exported!');
  };

  return (
    <NBCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-3 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Weekly Learning Plan</h3>
            <p className="text-gray-600">AI-powered personalized study schedule</p>
          </div>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Plan Duration</label>
        <div className="flex space-x-2">
          {[2, 4, 8, 12].map(weeks => (
            <button
              key={weeks}
              onClick={() => setDuration(weeks)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                duration === weeks
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {weeks} Weeks
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {learningPlan.length === 0 && (
        <NBButton
          onClick={generateLearningPlan}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Plan...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate My Learning Plan</span>
            </div>
          )}
        </NBButton>
      )}

      {/* Learning Plan Display */}
      {learningPlan.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Your {duration}-Week Plan</h4>
            <div className="flex space-x-2">
              <NBButton
                onClick={exportPlan}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </NBButton>
              <NBButton
                onClick={generateLearningPlan}
                variant="ghost"
              >
                Regenerate
              </NBButton>
            </div>
          </div>

          {learningPlan.map((week) => (
            <NBCard key={week.week} className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-cyan-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                  {week.week}
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-gray-900 mb-2">{week.title}</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1 flex items-center">
                        <Target className="w-4 h-4 mr-1" /> Goals:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {week.goals.map((goal, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-cyan-600 mr-2">•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">📚 Resources:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {week.resources.map((resource, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">{week.timeEstimate}</span>
                    </div>
                    {week.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <span>✓</span>
                        <span className="font-medium">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </NBCard>
          ))}
        </div>
      )}
    </NBCard>
  );
};

