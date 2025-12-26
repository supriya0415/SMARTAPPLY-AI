import React, { useState } from 'react';
import { Upload, ArrowLeft, Sparkles, MapPin, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { toast } from 'sonner';
import { ResumeData } from '../lib/types';

export const CareerPathGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, setResults } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    careerInterest: '',
    location: '',
    resumeFile: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }));
    }
  };

  const handleGenerateCareerPath = async () => {
    const profile = {
      name: 'Career Path User', // Default name since we don't have form fields for all profile data
      age: 25, // Default age
      educationLevel: 'bachelors' as any,
      skills: [], // Empty skills array
      careerInterest: formData.careerInterest,
      location: formData.location,
      resume: formData.resumeFile ? { file: formData.resumeFile } as ResumeData : undefined
    };
    
    setProfile(profile);
    setIsLoading(true);
    
    // Generate career recommendation with Gemini API just like the original Generate Career Path
    try {
      const results = await CareerService.generatePath(profile);
      setResults(results);
      toast.success('Career path generated successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Error generating career path:', error);
      toast.error('Failed to generate career path. Using fallback data.');
      // The service will automatically fall back to mock data
      const results = await CareerService.generatePath(profile);
      setResults(results);
      navigate('/results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Generate Career Path</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create a personalized career roadmap based on your interests, skills, and experience. 
              Upload your resume for more accurate recommendations.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form className="space-y-8">
              {/* Career Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Career Interest
                </label>
                <input
                  type="text"
                  placeholder="What career are you interested in? (e.g., Software Development, Data Science, Product Management)"
                  value={formData.careerInterest}
                  onChange={(e) => handleInputChange('careerInterest', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Location (Optional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Resume Upload (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Upload your resume to automatically extract skills, experience, and education details for more personalized recommendations.
                </p>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">Upload your resume</p>
                        <p className="text-gray-500 text-sm">PDF or text files up to 5MB</p>
                      </div>
                      {formData.resumeFile && (
                        <div className="flex items-center space-x-2 mt-3 px-3 py-2 bg-blue-50 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-900">{formData.resumeFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span>We'll extract your skills, experience, and education automatically</span>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              
              <button
                onClick={handleGenerateCareerPath}
                disabled={!formData.careerInterest.trim() || isLoading}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Generating...' : 'Generate Career Path'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered Recommendations</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Our advanced AI analyzes your profile and generates personalized career paths with specific steps, skills, and timeline.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Resume-Based Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Upload your resume to get more accurate recommendations based on your actual experience and skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};