import React from 'react';
import { LearningPath, ProgressData, LearningPhase } from '../lib/types';
import { cn } from '../lib/utils';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  Target,
  ArrowRight,
  Star,
  AlertCircle
} from 'lucide-react';
import PlatformLinkCard from './PlatformLinkCard';

interface ProgressRoadmapVisualizationProps {
  learningRoadmap?: LearningPath;
  progressData?: ProgressData;
  className?: string;
}

export const ProgressRoadmapVisualization: React.FC<ProgressRoadmapVisualizationProps> = ({
  learningRoadmap,
  progressData,
  className
}) => {
  if (!learningRoadmap) {
    return (
      <div className={cn('text-center py-12 text-gray-500', className)}>
        <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">No Learning Roadmap</h3>
        <p className="text-sm">Select a career path to generate your personalized learning roadmap</p>
      </div>
    );
  }

  const getPhaseProgress = (phase: LearningPhase): number => {
    if (!progressData?.skillProgress) return 0;
    
    const phaseSkills = phase.skills;
    const completedSkills = phaseSkills.filter(skill => 
      progressData.skillProgress[skill]?.progress >= 80
    ).length;
    
    return phaseSkills.length > 0 ? (completedSkills / phaseSkills.length) * 100 : 0;
  };

  const getPhaseStatus = (phase: LearningPhase): 'completed' | 'in-progress' | 'not-started' => {
    const progress = getPhaseProgress(phase);
    if (progress >= 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'important': return 'text-orange-600 bg-orange-100';
      case 'nice-to-have': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in-progress': return <Clock className="w-6 h-6 text-yellow-600" />;
      default: return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const sortedPhases = [...learningRoadmap.phases].sort((a, b) => a.order - b.order);
  const overallProgress = sortedPhases.reduce((acc, phase) => acc + getPhaseProgress(phase), 0) / sortedPhases.length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Roadmap Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {learningRoadmap.title}
            </h3>
            <p className="text-gray-600 mb-4">{learningRoadmap.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{learningRoadmap.totalDuration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{learningRoadmap.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{sortedPhases.length} phases</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">${learningRoadmap.estimatedCost}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              {Math.round(overallProgress)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Learning Phases */}
      <div className="space-y-4">
        {sortedPhases.map((phase, index) => {
          const progress = getPhaseProgress(phase);
          const status = getPhaseStatus(phase);
          const isLast = index === sortedPhases.length - 1;

          return (
            <div key={phase.id} className="relative">
              {/* Phase Card */}
              <div className={cn(
                'bg-white rounded-lg border-2 p-6 transition-all duration-200',
                status === 'completed' ? 'border-green-300 bg-green-50' :
                status === 'in-progress' ? 'border-yellow-300 bg-yellow-50' :
                'border-gray-200 hover:border-gray-300'
              )}>
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(status)}
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Phase {phase.order}: {phase.title}
                          </h4>
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            getPriorityColor(phase.priority)
                          )}>
                            {phase.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{phase.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{phase.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{phase.resources.length} resources</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round(progress)}%
                        </div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all duration-500',
                            status === 'completed' ? 'bg-green-500' :
                            status === 'in-progress' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Skills to develop:</div>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill, skillIndex) => {
                          const skillProgress = progressData?.skillProgress[skill];
                          const isSkillCompleted = skillProgress && skillProgress.progress >= 80;
                          
                          return (
                            <span
                              key={skillIndex}
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-medium',
                                isSkillCompleted 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-700'
                              )}
                            >
                              {isSkillCompleted && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Resources Preview */}
                    {phase.resources.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Learning Resources ({phase.resources.length}):
                        </div>
                        <div className="space-y-3">
                          {phase.resources.slice(0, 2).map((resource, resourceIndex) => (
                            <PlatformLinkCard
                              key={resourceIndex}
                              resource={resource}
                              className="text-sm"
                            />
                          ))}

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Connection Arrow */}
              {!isLast && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prerequisites and Outcomes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prerequisites */}
        {learningRoadmap.prerequisites.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Prerequisites
            </h4>
            <ul className="space-y-1">
              {learningRoadmap.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expected Outcomes */}
        {learningRoadmap.outcomes.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Expected Outcomes
            </h4>
            <ul className="space-y-1">
              {learningRoadmap.outcomes.map((outcome, index) => (
                <li key={index} className="text-sm text-green-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};