import React from 'react'
import { LearningResource } from '../lib/types'
import PlatformLinkCard from '../components/PlatformLinkCard'

const PlatformLinksDemo: React.FC = () => {
  // Sample learning resources to demonstrate platform links
  const sampleResources: LearningResource[] = [
    {
      id: 'js-fundamentals',
      title: 'JavaScript Fundamentals for Beginners',
      description: 'Learn the core concepts of JavaScript programming from scratch. Perfect for beginners who want to start their web development journey.',
      type: 'course',
      provider: 'Multiple Platforms',
      duration: '4 weeks',
      cost: 50,
      difficulty: 'beginner',
      skills: ['JavaScript', 'Programming Basics', 'Web Development', 'ES6']
    },
    {
      id: 'react-advanced',
      title: 'Advanced React Development',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and testing.',
      type: 'course',
      provider: 'Multiple Platforms',
      duration: '6 weeks',
      cost: 80,
      difficulty: 'advanced',
      skills: ['React', 'JavaScript', 'Frontend Development', 'Testing', 'Performance']
    },
    {
      id: 'data-science-cert',
      title: 'Data Science Professional Certificate',
      description: 'Comprehensive certification program covering statistics, machine learning, and data visualization.',
      type: 'certification',
      provider: 'Multiple Platforms',
      duration: '12 weeks',
      cost: 200,
      difficulty: 'intermediate',
      skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'Pandas']
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design Masterclass',
      description: 'Learn user interface and user experience design principles, tools, and best practices.',
      type: 'course',
      provider: 'Multiple Platforms',
      duration: '8 weeks',
      cost: 120,
      difficulty: 'intermediate',
      skills: ['UI Design', 'UX Design', 'Figma', 'User Research', 'Prototyping']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Links Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how our learning recommendations now include direct links to popular learning platforms 
            like Udemy, Coursera, LinkedIn Learning, and freeCodeCamp.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-3">🎓</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Multiple Platforms
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Access courses from Udemy, Coursera, LinkedIn Learning, and freeCodeCamp all in one place.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-3">🔗</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Direct Links
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Click and go directly to relevant courses without searching manually.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-3">⭐</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Smart Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI-powered platform matching based on course type and your learning preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Learning Resources */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Sample Learning Resources with Platform Links
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sampleResources.map((resource) => (
              <PlatformLinkCard
                key={resource.id}
                resource={resource}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
            How it works:
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Each learning resource now shows clickable links to multiple platforms
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Links are intelligently generated based on course content and keywords
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Recommended platforms are highlighted based on course type and difficulty
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              All links open in new tabs to preserve your learning roadmap progress
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PlatformLinksDemo