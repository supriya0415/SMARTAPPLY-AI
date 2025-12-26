import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { cn } from '../lib/utils';
import { CareerAssessmentData, AssessmentQuestion, AssessmentResponse } from '../lib/types';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

// Assessment questions data
const assessmentQuestions: AssessmentQuestion[] = [
  // Interests Section
  {
    id: 'interests_1',
    category: 'interests',
    question: 'Which activities do you find most engaging?',
    type: 'multiple-choice',
    options: [
      'Problem-solving and analytical thinking',
      'Creative design and visual arts',
      'Working with people and communication',
      'Building and creating things',
      'Research and learning new concepts',
      'Leading teams and projects'
    ],
    required: true
  },
  {
    id: 'interests_2',
    category: 'interests',
    question: 'What type of work environment excites you most?',
    type: 'multiple-choice',
    options: [
      'Fast-paced startup environment',
      'Structured corporate setting',
      'Remote/flexible work arrangement',
      'Collaborative team environment',
      'Independent work with minimal supervision',
      'Client-facing and customer interaction'
    ],
    required: true
  },
  
  // Values Section
  {
    id: 'values_1',
    category: 'values',
    question: 'What matters most to you in your career?',
    type: 'ranking',
    options: [
      'Work-life balance',
      'High salary and financial security',
      'Making a positive impact on society',
      'Continuous learning and growth',
      'Recognition and career advancement',
      'Job security and stability'
    ],
    required: true
  },
  {
    id: 'values_2',
    category: 'values',
    question: 'Which work values resonate with you?',
    type: 'multiple-choice',
    options: [
      'Innovation and creativity',
      'Helping others succeed',
      'Achieving measurable results',
      'Intellectual challenges',
      'Autonomy and independence',
      'Collaboration and teamwork'
    ],
    required: true
  },
  
  // Work Style Section
  {
    id: 'workstyle_1',
    category: 'workStyle',
    question: 'How do you prefer to approach tasks?',
    type: 'multiple-choice',
    options: [
      'Methodical and systematic approach',
      'Creative and flexible approach',
      'Data-driven and analytical approach',
      'Collaborative and team-oriented approach',
      'Quick and decisive approach',
      'Detailed and thorough approach'
    ],
    required: true
  },
  {
    id: 'workstyle_2',
    category: 'workStyle',
    question: 'What energizes you at work?',
    type: 'multiple-choice',
    options: [
      'Solving complex problems',
      'Mentoring and teaching others',
      'Creating something new',
      'Achieving targets and goals',
      'Learning new technologies',
      'Building relationships'
    ],
    required: true
  },
  
  // Personality Section
  {
    id: 'personality_1',
    category: 'personality',
    question: 'How would you describe your communication style?',
    type: 'multiple-choice',
    options: [
      'Direct and straightforward',
      'Diplomatic and considerate',
      'Enthusiastic and expressive',
      'Analytical and detailed',
      'Supportive and encouraging',
      'Confident and assertive'
    ],
    required: true
  },
  
  // Goals Section
  {
    id: 'goals_1',
    category: 'goals',
    question: 'What are your primary career goals?',
    type: 'multiple-choice',
    options: [
      'Become a technical expert in my field',
      'Lead and manage teams',
      'Start my own business',
      'Make a significant impact on society',
      'Achieve financial independence',
      'Maintain work-life balance while growing professionally'
    ],
    required: true
  },
  {
    id: 'goals_2',
    category: 'goals',
    question: 'What timeframe are you considering for your career transition?',
    type: 'multiple-choice',
    options: [
      'Immediate (0-6 months)',
      'Short-term (6-12 months)',
      'Medium-term (1-2 years)',
      'Long-term (2-5 years)',
      'I\'m exploring options',
      'No specific timeline'
    ],
    required: true
  }
];

const assessmentSchema = z.object({
  responses: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.array(z.string()), z.number()]),
    timestamp: z.date()
  }))
});

interface CareerAssessmentFormProps {
  onComplete: (assessmentData: CareerAssessmentData) => void;
  onCancel?: () => void;
  className?: string;
}

export const CareerAssessmentForm: React.FC<CareerAssessmentFormProps> = ({
  onComplete,
  onCancel,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});

  // Form validation (not currently used but kept for future enhancement)
  const { } = useForm({
    resolver: zodResolver(assessmentSchema)
  });

  // Group questions by category for step navigation
  const questionsByCategory = assessmentQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, AssessmentQuestion[]>);

  const categories = Object.keys(questionsByCategory);
  const currentCategory = categories[currentStep];
  const currentQuestions = questionsByCategory[currentCategory] || [];
  const totalSteps = categories.length;

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Update responses array
    const newResponse: AssessmentResponse = {
      questionId,
      answer,
      timestamp: new Date()
    };

    setResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== questionId);
      return [...filtered, newResponse];
    });
  };

  const isStepComplete = () => {
    return currentQuestions.every(question => {
      const answer = selectedAnswers[question.id];
      if (question.required) {
        if (Array.isArray(answer)) {
          return answer.length > 0;
        }
        return answer !== undefined && answer !== '';
      }
      return true;
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('Processing assessment completion...');
    console.log('Current responses:', responses);
    
    // Process responses into CareerAssessmentData format
    const assessmentData: CareerAssessmentData = {
      interests: [],
      values: [],
      workStyle: [],
      personalityTraits: [],
      careerGoals: [],
      timeframe: '',
      preferredIndustries: [],
      workEnvironmentPreferences: [],
      completedAt: new Date(),
      version: '1.0'
    };

    responses.forEach(response => {
      const question = assessmentQuestions.find(q => q.id === response.questionId);
      if (!question) return;

      const answer = Array.isArray(response.answer) ? response.answer : [response.answer as string];

      switch (question.category) {
        case 'interests':
          assessmentData.interests.push(...answer);
          break;
        case 'values':
          assessmentData.values.push(...answer);
          break;
        case 'workStyle':
          assessmentData.workStyle.push(...answer);
          break;
        case 'personality':
          assessmentData.personalityTraits.push(...answer);
          break;
        case 'goals':
          if (question.id === 'goals_2') {
            assessmentData.timeframe = answer[0];
          } else {
            assessmentData.careerGoals.push(...answer);
          }
          break;
      }
    });

    console.log('Processed assessment data:', assessmentData);
    console.log('Calling onComplete callback...');
    onComplete(assessmentData);
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const currentAnswer = selectedAnswers[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 cursor-pointer transition-all duration-200"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-pink-500 focus:ring-pink-400"
                />
                <span className="text-sm font-medium text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'ranking':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Select up to 3 options that matter most to you:
            </p>
            {question.options?.map((option, index) => {
              const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
              const selectedCount = Array.isArray(currentAnswer) ? currentAnswer.length : 0;
              
              return (
                <label
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    isSelected 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:bg-accent/50",
                    !isSelected && selectedCount >= 3 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={isSelected}
                    disabled={!isSelected && selectedCount >= 3}
                    onChange={(e) => {
                      const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                      if (e.target.checked) {
                        if (current.length < 3) {
                          handleAnswerChange(question.id, [...current, option]);
                        }
                      } else {
                        handleAnswerChange(question.id, current.filter(item => item !== option));
                      }
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">{option}</span>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />
                  )}
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      interests: 'Interests & Preferences',
      values: 'Work Values',
      workStyle: 'Work Style',
      personality: 'Communication Style',
      goals: 'Career Goals'
    };
    return titles[category as keyof typeof titles] || category;
  };

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      interests: 'Help us understand what activities and environments you find most engaging.',
      values: 'Tell us what matters most to you in your career and work life.',
      workStyle: 'Share how you prefer to approach work and what energizes you.',
      personality: 'Let us know about your communication and interaction preferences.',
      goals: 'Share your career aspirations and timeline for achieving them.'
    };
    return descriptions[category as keyof typeof descriptions] || '';
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <NBCard className="border-pink-300 bg-gradient-to-br from-white/95 via-pink-50/50 to-purple-50/50 backdrop-blur-sm shadow-xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Career Assessment
            </h2>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-pink-100 rounded-full h-3 mb-6 shadow-inner">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Category Info */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {getCategoryTitle(currentCategory)}
            </h3>
            <p className="text-gray-600">
              {getCategoryDescription(currentCategory)}
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-8">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">
                {index + 1}. {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h4>
              {renderQuestion(question)}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-pink-200">
          <NBButton
            type="button"
            variant="secondary"
            onClick={currentStep === 0 ? onCancel : handlePrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 0 ? 'Cancel' : 'Previous'}</span>
          </NBButton>

          <div className="flex space-x-2">
            {categories.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  index === currentStep 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-md' 
                    : index < currentStep 
                      ? 'bg-pink-400 shadow-sm' 
                      : 'bg-pink-200'
                )}
              />
            ))}
          </div>

          <NBButton
            type="button"
            onClick={currentStep === totalSteps - 1 ? handleComplete : handleNext}
            disabled={!isStepComplete()}
            className="flex items-center space-x-2"
          >
            <span>{currentStep === totalSteps - 1 ? 'Complete Assessment' : 'Next'}</span>
            {currentStep < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
          </NBButton>
        </div>
      </NBCard>
    </div>
  );
};