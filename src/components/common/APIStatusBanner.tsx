import React from 'react';
import { CareerRecommendationService } from '../../lib/services/careerRecommendationService';

interface APIStatusBannerProps {
  className?: string;
}

export const APIStatusBanner: React.FC<APIStatusBannerProps> = ({ className }) => {
  const apiStatus = CareerRecommendationService.getAPIStatus();

  // Don't show banner if API is configured
  if (apiStatus.configured) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 ${className || ''}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Development Mode
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            {apiStatus.message} All features are working with curated recommendations.
          </p>
          <details className="mt-2">
            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
              Setup AI features (optional)
            </summary>
            <div className="mt-2 text-xs text-blue-600 space-y-1">
              <p>To enable AI-powered recommendations:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Get a Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                <li>Create a <code className="bg-blue-100 px-1 rounded">.env</code> file in the project root</li>
                <li>Add: <code className="bg-blue-100 px-1 rounded">VITE_GEMINI_API_KEY=your_api_key</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </details>
        </div>
        <button 
          className="flex-shrink-0 text-blue-400 hover:text-blue-600"
          onClick={(e) => {
            e.currentTarget.closest('.bg-blue-50')?.remove();
          }}
          title="Dismiss"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};