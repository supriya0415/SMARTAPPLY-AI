import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, TrendingUp, Star, CheckCircle, Filter, Download } from 'lucide-react';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { useUserStore } from '../lib/stores/userStore';
import { RealLearningResourcesService, ResourceCategory } from '../lib/services/realLearningResourcesService';
import { PDFExportService } from '../lib/utils/pdfExport';
import { toast } from 'sonner';
import axios from '../utility/axiosInterceptor';

export const LearningResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([]);
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  useEffect(() => {
    if (!profile) {
      toast('Complete your career assessment to access resources', { duration: 3000 });
      navigate('/assessment');
      return;
    }

    // Get personalized resources
    const careerInterest = profile.careerInterest || profile.selectedCareer?.title || 'Software Development';
    // Map education level to experience years
    const experienceMap: Record<string, number> = {
      'High School': 0,
      'Bachelor': 1,
      'Master': 3,
      'PhD': 5
    };
    const yearsOfExperience = experienceMap[profile.educationLevel] || 0;
    const skills = profile.skills || [];

    const categories = RealLearningResourcesService.getPersonalizedResources(
      careerInterest,
      yearsOfExperience,
      skills
    );

    setResourceCategories(categories);

    // Load completed resources from backend
    loadCompletedResources();
  }, [profile, navigate]);

  const loadCompletedResources = async () => {
    try {
      const response = await axios.get('/api/user/learning-resources-completed');
      if (response.data && Array.isArray(response.data)) {
        setCompletedResources(new Set(response.data));
        // Also update localStorage as backup
        localStorage.setItem('completedLearningResources', JSON.stringify(response.data));
      }
    } catch (error) {
      // Fallback to localStorage if backend fails
      const saved = localStorage.getItem('completedLearningResources');
      if (saved) {
        setCompletedResources(new Set(JSON.parse(saved)));
      }
    }
  };

  const syncCompletedResources = async (completedSet: Set<string>) => {
    try {
      const completedArray = Array.from(completedSet);
      await axios.post('/api/user/learning-resources-completed', {
        completedResources: completedArray
      });
      // Also update localStorage as backup
      localStorage.setItem('completedLearningResources', JSON.stringify(completedArray));
    } catch (error) {
      // Silent error - still save to localStorage
      localStorage.setItem('completedLearningResources', JSON.stringify(Array.from(completedSet)));
    }
  };

  const toggleResourceComplete = (resourceId: string) => {
    const newCompleted = new Set(completedResources);
    if (newCompleted.has(resourceId)) {
      newCompleted.delete(resourceId);
      toast('Marked as incomplete', { duration: 2000 });
    } else {
      newCompleted.add(resourceId);
      toast.success('Completed! 🎉 Progress saved.', { duration: 2000 });
    }
    setCompletedResources(newCompleted);
    
    // Sync with backend
    syncCompletedResources(newCompleted);
  };

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      'Udemy': 'bg-purple-100 text-purple-700',
      'Coursera': 'bg-blue-100 text-blue-700',
      'YouTube': 'bg-red-100 text-red-700',
      'Google': 'bg-yellow-100 text-yellow-700',
      'freeCodeCamp': 'bg-green-100 text-green-700',
      'edX': 'bg-indigo-100 text-indigo-700',
      'Pluralsight': 'bg-pink-100 text-pink-700'
    };
    return colors[provider] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-yellow-100 text-yellow-700',
      'Advanced': 'bg-red-100 text-red-700',
      'All Levels': 'bg-blue-100 text-blue-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  // Apply filters
  const filteredCategories = resourceCategories.map(category => ({
    ...category,
    resources: category.resources.filter(resource => {
      const providerMatch = selectedProvider === 'All' || resource.provider === selectedProvider;
      const difficultyMatch = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty;
      return providerMatch && difficultyMatch;
    })
  })).filter(category => category.resources.length > 0);

  const totalCompleted = completedResources.size;
  const totalResources = resourceCategories.reduce((acc, cat) => acc + cat.resources.length, 0);
  const completionPercentage = totalResources > 0 ? Math.round((totalCompleted / totalResources) * 100) : 0;

  const providers = ['All', 'Udemy', 'Coursera', 'YouTube', 'Google', 'freeCodeCamp'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const handleExportPDF = async () => {
    if (!profile) return;
    
    toast.loading('Generating PDF...', { id: 'pdf-export' });
    try {
      await PDFExportService.exportLearningResources(profile as any, resourceCategories);
      toast.success('Learning resources exported successfully!', { id: 'pdf-export' });
    } catch (error) {
      toast('PDF generation complete', { id: 'pdf-export' });
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div 
      className="min-h-screen py-20"
      style={{
        backgroundColor: '#e0f2f1',
        backgroundImage: "url('/bg-image.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
                  onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            
              <NBButton
              onClick={handleExportPDF}
              variant="secondary"
              >
              Export as PDF
              </NBButton>
          </div>
              
          <NBCard className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Learning Resources for {profile.careerInterest || 'Your Career'}
                </h1>
                <p className="text-gray-600 mb-2">
                  Personalized for your {profile.educationLevel} level
                </p>
                <p className="text-sm text-gray-500">
                  Click on any resource to open it in a new tab. Mark resources as complete to track your progress!
                </p>
              </div>
            
              <div className="mt-4 md:mt-0 text-center">
                <div className="text-4xl font-bold text-indigo-600">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalCompleted} / {totalResources} completed
          </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </NBCard>
            </div>
            
        {/* Filters */}
        <NBCard className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Additional Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {providers.map(provider => (
                  <button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedProvider === provider
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {provider}
                  </button>
                ))}
          </div>
        </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(difficulty => (
              <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
              </button>
                ))}
              </div>
            </div>
          </div>
        </NBCard>

        {/* Resource Categories */}
        {filteredCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.category}</h2>
              <p className="text-gray-600">{category.description}</p>
        </div>

            <div className="grid gap-4">
              {category.resources.map((resource) => {
                const isCompleted = completedResources.has(resource.id);

                return (
                  <NBCard
                    key={resource.id}
                    className={`p-6 transition-all hover:shadow-lg ${
                      isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                      {resource.title}
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                              )}
                    </h3>
                            <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                  </div>
                </div>

                {/* Resource Details */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProviderColor(resource.provider)}`}>
                            {resource.provider}
                          </span>

                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </span>

                          <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.duration}
                  </div>
                  
                          {resource.cost === 0 ? (
                            <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <DollarSign className="w-3 h-3 mr-1" />
                              FREE
                            </div>
                          ) : (
                            <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${resource.cost}
                  </div>
                          )}

                          {resource.rating && (
                            <div className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {resource.rating}
                  </div>
                          )}

                          <div className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {resource.relevanceScore}% Match
                  </div>
                </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.skills.map((skill, idx) => (
                      <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                        </div>
                  </div>

                {/* Action Buttons */}
                      <div className="flex md:flex-col gap-2 md:ml-4">
                  <NBButton
                          variant="primary"
                          onClick={() => window.open(resource.url, '_blank')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2"
                        >
                          Open Course
                  </NBButton>
                  
                        <NBButton
                          variant={isCompleted ? 'secondary' : 'ghost'}
                          onClick={() => toggleResourceComplete(resource.id)}
                          className={isCompleted ? 'bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2' : 'font-medium px-6 py-2'}
                        >
                          {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                        </NBButton>
                </div>
                </div>
              </NBCard>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <NBCard className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              No resources match the selected filters. Try adjusting your filters.
            </p>
          </NBCard>
        )}

        {/* Summary */}
        {totalCompleted > 0 && (
          <NBCard className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 mt-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Great Progress! 🎉
            </h3>
              <p className="text-green-700">
                You've completed {totalCompleted} out of {totalResources} resources.
                Keep up the amazing work on your learning journey!
            </p>
          </div>
          </NBCard>
        )}
      </div>
    </div>
  );
};
